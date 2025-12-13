import express, { type Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertEventSchema, insertLiveStreamSchema, insertGalleryImageSchema, insertMessageSchema, insertRegistrationSchema, insertEventRsvpSchema } from "@shared/schema";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // In-memory OneDrive tokens (for demo; consider persistent storage for production)
  let onedriveTokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // epoch ms
  } | null = null;

  const onedriveClientId = process.env.MICROSOFT_CLIENT_ID || "";
  const onedriveClientSecret = process.env.MICROSOFT_CLIENT_SECRET || "";
  const onedriveRedirectUri = process.env.ONEDRIVE_REDIRECT_URI || `${process.env.BASE_URL || ''}/onedrive-callback`;
  const onedriveFolder = process.env.ONEDRIVE_TARGET_FOLDER || "ChurchGallery";
  const tenantId = process.env.MICROSOFT_TENANT_ID || "common";

  const ensureAccessToken = async () => {
    if (!onedriveTokens) throw new Error("OneDrive not connected");
    const now = Date.now();
    if (now < onedriveTokens.expiresAt - 60_000) return onedriveTokens.accessToken;

    // Refresh token
    const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: onedriveClientId,
        client_secret: onedriveClientSecret,
        grant_type: "refresh_token",
        refresh_token: onedriveTokens.refreshToken,
        redirect_uri: onedriveRedirectUri,
      }),
    });
    if (!tokenRes.ok) throw new Error("Failed to refresh OneDrive token");
    const tokenJson: any = await tokenRes.json();
    onedriveTokens = {
      accessToken: tokenJson.access_token,
      refreshToken: tokenJson.refresh_token || onedriveTokens.refreshToken,
      expiresAt: Date.now() + (tokenJson.expires_in || 3600) * 1000,
    };
    return onedriveTokens.accessToken;
  };

  // Health check endpoint for Railway
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      port: process.env.PORT || '3000'
    });
  });

  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      port: process.env.PORT || '3000'
    });
  });

  // Authentication middleware (simple check for admin routes)
  const requireAuth = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const storage_config = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: storage_config,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // ===== FILE UPLOAD ROUTES =====
  
  // File upload endpoint
  app.post('/api/upload', requireAuth, upload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl, filename: req.file.filename });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  // Serve uploaded files with caching headers
  app.use('/uploads', (req, res, next) => {
    // Set cache headers for images
    res.set({
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    });
    express.static(uploadsDir, {
      maxAge: '1y', // 1 year cache
      etag: true
    })(req, res, next);
  });

  // ===== PUBLIC API ROUTES (for website components) =====

  // Events - Public routes
  app.get('/api/events', async (req, res) => {
    try {
      // Automatically delete past events before fetching
      await storage.deletePastEvents();
      const events = await storage.getEvents();
      
      // For non-registration events, get RSVP counts and update currentAttendees
      const eventsWithRsvpCounts = await Promise.all(events.map(async (event) => {
        if (!event.registrationRequired) {
          const rsvpCount = await storage.getEventRsvpCount(event.id);
          // Update the event's currentAttendees to match RSVP count if different
          if (event.currentAttendees !== rsvpCount) {
            await storage.updateEvent(event.id, { currentAttendees: rsvpCount });
            return { ...event, currentAttendees: rsvpCount };
          }
        }
        return event;
      }));
      
      res.json(eventsWithRsvpCounts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch events' });
    }
  });

  app.get('/api/events/upcoming', async (req, res) => {
    try {
      // Automatically delete past events before fetching
      await storage.deletePastEvents();
      const limit = parseInt(req.query.limit as string) || 3;
      const events = await storage.getUpcomingEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch upcoming events' });
    }
  });

  // Event registration - public
  app.post('/api/events/:id/register', async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await storage.getEvent(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });

      const requestedAttendees = Math.max(1, parseInt(req.body.guests ?? '1') || 1);
      const body = {
        eventId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || null,
        attendees: requestedAttendees,
        guestNames: req.body.guestNames || null,
        message: req.body.message || null,
      };

      const parseResult = insertRegistrationSchema.safeParse(body);
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid registration data', issues: parseResult.error.flatten() });
      }

      // Capacity check
      const max = event.maxAttendees ?? null;
      const current = event.currentAttendees ?? 0;
      const requested = body.attendees;
      if (max !== null && current + requested > max) {
        return res.status(400).json({ message: 'Event is full or not enough seats available' });
      }

      await storage.createRegistration(body);
      await storage.updateEvent(eventId, { currentAttendees: current + requested });

      res.status(201).json({ 
        message: 'Registration successful', 
        attendeesRegistered: requested, 
        remaining: max !== null ? Math.max(0, max - (current + requested)) : null 
      });
    } catch (error) {
      console.error('Registration failed', error);
      res.status(500).json({ message: 'Failed to register for event' });
    }
  });

  // Event RSVP - public (for non-registration events)
  app.post('/api/events/:id/rsvp', async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await storage.getEvent(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });

      // Only allow RSVP for non-registration events
      if (event.registrationRequired) {
        return res.status(400).json({ message: 'This event requires registration. Please use the registration form.' });
      }

      const email = req.body.email;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Valid email address is required' });
      }

      // Check if already RSVP'd
      const existingRsvp = await storage.getEventRsvpByEmail(eventId, email);
      if (existingRsvp) {
        return res.status(400).json({ message: 'You have already indicated you will attend this event' });
      }

      const body = {
        eventId,
        email: email.trim().toLowerCase(),
      };

      const parseResult = insertEventRsvpSchema.safeParse(body);
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid RSVP data', issues: parseResult.error.flatten() });
      }

      await storage.createEventRsvp(body);

      // Update event's currentAttendees count
      const current = event.currentAttendees ?? 0;
      await storage.updateEvent(eventId, { currentAttendees: current + 1 });

      res.status(201).json({ 
        message: 'RSVP successful', 
        rsvpCount: current + 1
      });
    } catch (error) {
      console.error('RSVP failed', error);
      res.status(500).json({ message: 'Failed to RSVP for event' });
    }
  });

  // Live Streams - Public routes
  app.get('/api/live-streams', async (req, res) => {
    try {
      const streams = await storage.getLiveStreams();
      res.json(streams);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch live streams' });
    }
  });

  app.get('/api/live-streams/current', async (req, res) => {
    try {
      const currentStream = await storage.getCurrentLiveStream();
      res.json(currentStream);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch current live stream' });
    }
  });

  // Gallery Images - Public routes
  app.get('/api/gallery', async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch gallery images' });
    }
  });

  // Messages - Public routes
  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // ===== ADMIN API ROUTES (require authentication) =====

  // Events - Admin routes
  app.post('/api/admin/events', requireAuth, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: 'Invalid event data' });
    }
  });

  app.put('/api/admin/events/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(id, validatedData);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: 'Invalid event data' });
    }
  });

  app.delete('/api/admin/events/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteEvent(id);
      if (!success) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete event' });
    }
  });

  // Subscribers - Admin routes
  app.get('/api/admin/subscribers', requireAuth, async (req, res) => {
    try {
      const subs = await storage.getSubscribers();
      res.json(subs);
    } catch (error) {
      console.error('Failed to fetch subscribers', error);
      res.status(500).json({ message: 'Failed to fetch subscribers' });
    }
  });

  // Cleanup past events (Admin only)
  app.post('/api/admin/events/cleanup', requireAuth, async (req, res) => {
    try {
      const deletedCount = await storage.deletePastEvents();
      res.json({ 
        message: 'Cleanup completed successfully',
        deletedCount 
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to cleanup past events' });
    }
  });

  // Event registrations - Admin view
  app.get('/api/admin/events/:id/registrations', requireAuth, async (req, res) => {
    try {
      const regs = await storage.getRegistrationsForEvent(req.params.id);
      res.json(regs);
    } catch (error) {
      console.error('Failed to fetch registrations', error);
      res.status(500).json({ message: 'Failed to fetch registrations' });
    }
  });

  // ===== OneDrive Integration =====
  // Start auth
  app.get('/api/onedrive/auth-start', async (req, res) => {
    if (!onedriveClientId || !onedriveClientSecret || !onedriveRedirectUri) {
      return res.status(500).json({ message: 'OneDrive env vars not set' });
    }
    const scopes = encodeURIComponent('offline_access Files.ReadWrite Files.ReadWrite.AppFolder');
    const redirect = encodeURIComponent(onedriveRedirectUri);
    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${onedriveClientId}&response_type=code&redirect_uri=${redirect}&scope=${scopes}`;
    // If redirect=1, send a 302 directly (useful for window.open without headers)
    if (req.query.redirect === '1') {
      return res.redirect(authUrl);
    }
    res.json({ authUrl });
  });

  // Callback
  app.get('/onedrive-callback', async (req, res) => {
    try {
      const code = req.query.code as string;
      if (!code) return res.status(400).send('Missing code');
      const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: onedriveClientId,
          client_secret: onedriveClientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: onedriveRedirectUri,
        }),
      });
      if (!tokenRes.ok) throw new Error('Failed to exchange code');
      const tokenJson: any = await tokenRes.json();
      onedriveTokens = {
        accessToken: tokenJson.access_token,
        refreshToken: tokenJson.refresh_token,
        expiresAt: Date.now() + (tokenJson.expires_in || 3600) * 1000,
      };
      // Simple callback page to close the popup
      res.send(`<html><body style="font-family: sans-serif; text-align:center; padding:20px;">
        <h2>OneDrive connected</h2>
        <p>You can close this window and return to the admin panel.</p>
        <script>window.close();</script>
      </body></html>`);
    } catch (error) {
      console.error('OneDrive callback error:', error);
      res.status(500).send('OneDrive connection failed');
    }
  });

  // Upload to OneDrive
  app.post('/api/admin/onedrive/upload', requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file provided' });
      const accessToken = await ensureAccessToken();

      const targetPath = `${onedriveFolder}/${req.file.originalname}`;
      const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(targetPath)}:/content`;

      const fileBuffer = fs.readFileSync(req.file.path);
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': req.file.mimetype || 'application/octet-stream'
        },
        body: fileBuffer
      });

      fs.unlinkSync(req.file.path);

      if (!uploadRes.ok) {
        const errTxt = await uploadRes.text();
        console.error('OneDrive upload failed:', errTxt);
        return res.status(500).json({ message: 'OneDrive upload failed' });
      }

      const uploadJson: any = await uploadRes.json();
      const webUrl = uploadJson?.webUrl;
      if (!webUrl) {
        return res.status(500).json({ message: 'No shareable link returned from OneDrive' });
      }

      res.json({ url: webUrl });
    } catch (error) {
      console.error('OneDrive upload error:', error);
      res.status(500).json({ message: 'OneDrive upload failed' });
    }
  });

  // OneDrive status
  app.get('/api/admin/onedrive/status', requireAuth, async (_req, res) => {
    if (!onedriveTokens) {
      return res.json({ connected: false });
    }
    res.json({
      connected: true,
      expiresAt: onedriveTokens.expiresAt
    });
  });

  // List OneDrive files (images) in a folder (default root)
  app.get('/api/admin/onedrive/list', requireAuth, async (req, res) => {
    try {
      const accessToken = await ensureAccessToken();
      const path = (req.query.path as string) || '';
      const listUrl = path
        ? `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(path)}:/children`
        : 'https://graph.microsoft.com/v1.0/me/drive/root/children';

      const listRes = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!listRes.ok) {
        const errTxt = await listRes.text();
        console.error('OneDrive list failed:', errTxt);
        return res.status(500).json({ message: 'Failed to list OneDrive files' });
      }

      const json: any = await listRes.json();
      const items = (json.value || []).filter((item: any) => {
        const mime = item.file?.mimeType || '';
        const name = (item.name || '').toLowerCase();
        return mime.startsWith('image/') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif') || name.endsWith('.webp');
      });

      res.json({
        items: items.map((i: any) => ({
          id: i.id,
          name: i.name,
          size: i.size,
          mimeType: i.file?.mimeType,
          webUrl: i.webUrl
        }))
      });
    } catch (error) {
      console.error('OneDrive list error:', error);
      res.status(500).json({ message: 'Failed to list OneDrive files' });
    }
  });

  // Create a shareable link for a OneDrive item
  app.post('/api/admin/onedrive/share', requireAuth, async (req, res) => {
    try {
      const { itemId } = req.body;
      if (!itemId) return res.status(400).json({ message: 'itemId is required' });

      const accessToken = await ensureAccessToken();
      const shareUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/createLink`;
      const shareRes = await fetch(shareUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'view', scope: 'anonymous' })
      });

      if (!shareRes.ok) {
        const errTxt = await shareRes.text();
        console.error('OneDrive share failed:', errTxt);
        return res.status(500).json({ message: 'Failed to create share link' });
      }

      const shareJson: any = await shareRes.json();
      const link = shareJson?.link?.webUrl;
      if (!link) {
        return res.status(500).json({ message: 'No share link returned' });
      }

      res.json({ url: link });
    } catch (error) {
      console.error('OneDrive share error:', error);
      res.status(500).json({ message: 'Failed to create share link' });
    }
  });

  // Live Streams - Admin routes
  app.post('/api/admin/live-streams', requireAuth, async (req, res) => {
    try {
      const validatedData = insertLiveStreamSchema.parse(req.body);
      const stream = await storage.createLiveStream(validatedData);
      res.json(stream);
    } catch (error) {
      res.status(400).json({ message: 'Invalid live stream data' });
    }
  });

  app.put('/api/admin/live-streams/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertLiveStreamSchema.partial().parse(req.body);
      const stream = await storage.updateLiveStream(id, validatedData);
      if (!stream) {
        return res.status(404).json({ message: 'Live stream not found' });
      }
      res.json(stream);
    } catch (error) {
      res.status(400).json({ message: 'Invalid live stream data' });
    }
  });

  app.delete('/api/admin/live-streams/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteLiveStream(id);
      if (!success) {
        return res.status(404).json({ message: 'Live stream not found' });
      }
      res.json({ message: 'Live stream deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete live stream' });
    }
  });

  // Gallery Images - Admin routes
  app.post('/api/admin/gallery', requireAuth, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.json(image);
    } catch (error) {
      res.status(400).json({ message: 'Invalid gallery image data' });
    }
  });

  app.put('/api/admin/gallery/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(id, validatedData);
      if (!image) {
        return res.status(404).json({ message: 'Gallery image not found' });
      }
      res.json(image);
    } catch (error) {
      res.status(400).json({ message: 'Invalid gallery image data' });
    }
  });

  app.delete('/api/admin/gallery/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGalleryImage(id);
      if (!success) {
        return res.status(404).json({ message: 'Gallery image not found' });
      }
      res.json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete gallery image' });
    }
  });

  // Messages - Admin routes
  app.post('/api/admin/messages', requireAuth, async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: 'Invalid message data' });
    }
  });

  app.put('/api/admin/messages/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertMessageSchema.partial().parse(req.body);
      const message = await storage.updateMessage(id, validatedData);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: 'Invalid message data' });
    }
  });

  app.delete('/api/admin/messages/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteMessage(id);
      if (!success) {
        return res.status(404).json({ message: 'Message not found' });
      }
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete message' });
    }
  });

  // Subscriber routes
  app.post('/api/subscribe', async (req, res) => {
    try {
      const { email, name } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(email);
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return res.status(400).json({ message: 'Email already subscribed' });
        } else {
          // Reactivate subscription
          await storage.updateSubscriber(existingSubscriber.id, { isActive: true });
          return res.json({ message: 'Subscription reactivated successfully' });
        }
      }

      // Create new subscriber
      const subscriber = await storage.createSubscriber({ email, name });
      
      // Send welcome email
      try {
        const { emailService } = await import('./emailService.js');
        await emailService.sendWelcomeEmail(subscriber);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }

      res.json({ message: 'Subscribed successfully' });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ message: 'Failed to subscribe' });
    }
  });

  app.post('/api/unsubscribe', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const success = await storage.unsubscribeSubscriber(email);
      if (success) {
        res.json({ message: 'Unsubscribed successfully' });
      } else {
        res.status(404).json({ message: 'Email not found' });
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({ message: 'Failed to unsubscribe' });
    }
  });

  // Send message to all subscribers (Admin only)
  app.post('/api/admin/send-message', requireAuth, async (req, res) => {
    try {
      const { messageId } = req.body;
      
      if (!messageId) {
        return res.status(400).json({ message: 'Message ID is required' });
      }

      // Get the message
      const message = await storage.getMessage(messageId);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      // Get active subscribers
      const subscribers = await storage.getActiveSubscribers();
      if (subscribers.length === 0) {
        return res.status(400).json({ message: 'No active subscribers found' });
      }

      // Send emails
      const { emailService } = await import('./emailService.js');
      const result = await emailService.sendMessageToSubscribers(message, subscribers);

      res.json({
        message: 'Message sent successfully',
        sent: result.success,
        failed: result.failed,
        totalSubscribers: subscribers.length
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Get subscribers (Admin only)
  app.get('/api/admin/subscribers', requireAuth, async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch subscribers' });
    }
  });

  // Admin authentication route
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple demo authentication - in production, use proper password hashing
      if (username === 'admin' && password === 'church2024') {
        res.json({ 
          success: true, 
          token: 'admin', // In production, use JWT
          user: { username: 'admin' }
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
