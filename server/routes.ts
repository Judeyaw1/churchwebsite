import express, { type Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertEventSchema, insertLiveStreamSchema, insertGalleryImageSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Railway
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
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

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // ===== PUBLIC API ROUTES (for website components) =====

  // Events - Public routes
  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch events' });
    }
  });

  app.get('/api/events/upcoming', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const events = await storage.getUpcomingEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch upcoming events' });
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
