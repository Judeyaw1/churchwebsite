import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc, and } from "drizzle-orm";
import { 
  type User, 
  type InsertUser, 
  type Event, 
  type InsertEvent,
  type LiveStream,
  type InsertLiveStream,
  type GalleryImage,
  type InsertGalleryImage,
  type Message,
  type InsertMessage,
  type Subscriber,
  type InsertSubscriber,
  type InsertRegistration,
  type Registration,
  type InsertEventRsvp,
  type EventRsvp,
  type BlogPost,
  type InsertBlogPost,
  type CpcAttendance,
  type InsertCpcAttendance,
  users,
  events,
  liveStreams,
  galleryImages,
  messages,
  subscribers,
  registrations,
  eventRsvps,
  blogPosts,
  cpcAttendance
} from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is required");
}

// Database connection
const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;
const db = databaseUrl
  ? drizzle(pool)
  : (new Proxy(
      {},
      {
        get() {
          throw new Error("DATABASE_URL environment variable is required");
        },
      },
    ) as ReturnType<typeof drizzle>);

export type DatabaseHealthStatus = {
  status: "healthy" | "unhealthy";
  latencyMs: number;
  error?: string;
};

export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  if (!pool) {
    return {
      status: "unhealthy",
      latencyMs: 0,
      error: "DATABASE_URL environment variable is required",
    };
  }
  const start = process.hrtime.bigint();
  try {
    await pool.query("SELECT 1");
    const latencyMs =
      Number(process.hrtime.bigint() - start) / 1_000_000;
    return {
      status: "healthy",
      latencyMs,
    };
  } catch (error: any) {
    const latencyMs =
      Number(process.hrtime.bigint() - start) / 1_000_000;
    console.error("Database health check failed:", error);
    return {
      status: "unhealthy",
      latencyMs,
      error: error?.message ?? "Unknown database error",
    };
  }
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  deletePastEvents(): Promise<number>; // Returns count of deleted events
  // Registration methods
  createRegistration(reg: InsertRegistration): Promise<void>;
  getRegistrationsForEvent(eventId: string): Promise<Registration[]>;
  
  // RSVP methods (for non-registration events)
  createEventRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp>;
  getEventRsvpCount(eventId: string): Promise<number>;
  getEventRsvpByEmail(eventId: string, email: string): Promise<EventRsvp | undefined>;
  
  // Live Stream methods
  getLiveStreams(): Promise<LiveStream[]>;
  getLiveStream(id: string): Promise<LiveStream | undefined>;
  createLiveStream(stream: InsertLiveStream): Promise<LiveStream>;
  updateLiveStream(id: string, stream: Partial<InsertLiveStream>): Promise<LiveStream | undefined>;
  deleteLiveStream(id: string): Promise<boolean>;
  getCurrentLiveStream(): Promise<LiveStream | undefined>;
  
  // Gallery Image methods
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: string): Promise<boolean>;
  
  // Message methods
  getMessages(): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, message: Partial<InsertMessage>): Promise<Message | undefined>;
  deleteMessage(id: string): Promise<boolean>;
  
  // Subscriber methods
  getSubscribers(): Promise<Subscriber[]>;
  getActiveSubscribers(): Promise<Subscriber[]>;
  getSubscriber(id: string): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: string, subscriber: Partial<InsertSubscriber>): Promise<Subscriber | undefined>;
  deleteSubscriber(id: string): Promise<boolean>;
  unsubscribeSubscriber(email: string): Promise<boolean>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // CPC attendance methods
  getCpcAttendanceByDate(date: string): Promise<CpcAttendance[]>;
  addCpcAttendanceEntries(entries: InsertCpcAttendance[]): Promise<void>;
  hasCpcCheckInForChild(date: string, childName: string): Promise<boolean>;
}

export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id: string, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db
      .update(events)
      .set({ ...eventUpdate, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount > 0;
  }

  async getUpcomingEvents(limit: number = 3): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt))
      .limit(limit);
  }

  async deletePastEvents(): Promise<number> {
    try {
      // Get all events
      const allEvents = await db.select().from(events);
      const now = new Date();
      const pastEventIds: string[] = [];

      // Check each event to see if it's in the past
      for (const event of allEvents) {
        try {
          // Parse the event date and time
          const eventDateTime = new Date(`${event.date} ${event.time}`);
          
          // If parsing fails, try alternative format
          if (isNaN(eventDateTime.getTime())) {
            // Try parsing date separately (assuming YYYY-MM-DD format)
            const dateParts = event.date.split('-');
            const timeParts = event.time.split(':');
            if (dateParts.length === 3 && timeParts.length >= 2) {
              const parsedDate = new Date(
                parseInt(dateParts[0]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[2]),
                parseInt(timeParts[0]),
                parseInt(timeParts[1]) || 0
              );
              if (!isNaN(parsedDate.getTime()) && parsedDate < now) {
                pastEventIds.push(event.id);
              }
            }
          } else if (eventDateTime < now) {
            pastEventIds.push(event.id);
          }
        } catch (error) {
          console.error(`Error parsing event date for event ${event.id}:`, error);
          // Skip events with unparseable dates
        }
      }

      // Delete all past events
      if (pastEventIds.length > 0) {
        for (const id of pastEventIds) {
          await db.delete(events).where(eq(events.id, id));
        }
        console.log(`Deleted ${pastEventIds.length} past event(s)`);
      }

      return pastEventIds.length;
    } catch (error) {
      console.error('Error deleting past events:', error);
      return 0;
    }
  }

  // Live Stream methods
  async getLiveStreams(): Promise<LiveStream[]> {
    return await db.select().from(liveStreams).orderBy(desc(liveStreams.createdAt));
  }

  async getLiveStream(id: string): Promise<LiveStream | undefined> {
    const result = await db.select().from(liveStreams).where(eq(liveStreams.id, id)).limit(1);
    return result[0];
  }

  async createLiveStream(stream: InsertLiveStream): Promise<LiveStream> {
    const result = await db.insert(liveStreams).values(stream).returning();
    return result[0];
  }

  async updateLiveStream(id: string, streamUpdate: Partial<InsertLiveStream>): Promise<LiveStream | undefined> {
    const result = await db
      .update(liveStreams)
      .set({ ...streamUpdate, updatedAt: new Date() })
      .where(eq(liveStreams.id, id))
      .returning();
    return result[0];
  }

  async deleteLiveStream(id: string): Promise<boolean> {
    const result = await db.delete(liveStreams).where(eq(liveStreams.id, id));
    return result.rowCount > 0;
  }

  async getCurrentLiveStream(): Promise<LiveStream | undefined> {
    const result = await db
      .select()
      .from(liveStreams)
      .where(eq(liveStreams.isLive, true))
      .limit(1);
    return result[0];
  }

  // Gallery Image methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    const result = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
    return result[0];
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const result = await db.insert(galleryImages).values(image).returning();
    return result[0];
  }

  async updateGalleryImage(id: string, imageUpdate: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const result = await db
      .update(galleryImages)
      .set({ ...imageUpdate, updatedAt: new Date() })
      .where(eq(galleryImages.id, id))
      .returning();
    return result[0];
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    const result = await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return result.rowCount > 0;
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async updateMessage(id: string, messageUpdate: Partial<InsertMessage>): Promise<Message | undefined> {
    const result = await db
      .update(messages)
      .set({ ...messageUpdate, updatedAt: new Date() })
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id));
    return result.rowCount > 0;
  }

  // Subscriber methods
  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).orderBy(desc(subscribers.subscribedAt));
  }

  async getActiveSubscribers(): Promise<Subscriber[]> {
    return await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.isActive, true))
      .orderBy(desc(subscribers.subscribedAt));
  }

  async getSubscriber(id: string): Promise<Subscriber | undefined> {
    const result = await db.select().from(subscribers).where(eq(subscribers.id, id)).limit(1);
    return result[0];
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const result = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    return result[0];
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const result = await db.insert(subscribers).values(subscriber).returning();
    return result[0];
  }

  async updateSubscriber(id: string, subscriberUpdate: Partial<InsertSubscriber>): Promise<Subscriber | undefined> {
    const result = await db
      .update(subscribers)
      .set(subscriberUpdate)
      .where(eq(subscribers.id, id))
      .returning();
    return result[0];
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    const result = await db.delete(subscribers).where(eq(subscribers.id, id));
    return result.rowCount > 0;
  }

  async unsubscribeSubscriber(email: string): Promise<boolean> {
    const result = await db
      .update(subscribers)
      .set({ 
        isActive: false, 
        unsubscribedAt: new Date() 
      })
      .where(eq(subscribers.email, email))
      .returning();
    return result.length > 0;
  }

  // Registration methods
  async createRegistration(reg: InsertRegistration): Promise<void> {
    await db.insert(registrations).values(reg);
  }

  async getRegistrationsForEvent(eventId: string): Promise<Registration[]> {
    return await db
      .select()
      .from(registrations)
      .where(eq(registrations.eventId, eventId))
      .orderBy(desc(registrations.createdAt));
  }

  // RSVP methods (for non-registration events)
  async createEventRsvp(rsvp: InsertEventRsvp): Promise<EventRsvp> {
    const result = await db.insert(eventRsvps).values(rsvp).returning();
    return result[0];
  }

  async getEventRsvpCount(eventId: string): Promise<number> {
    const result = await db
      .select()
      .from(eventRsvps)
      .where(eq(eventRsvps.eventId, eventId));
    return result.length;
  }

  async getEventRsvpByEmail(eventId: string, email: string): Promise<EventRsvp | undefined> {
    const result = await db
      .select()
      .from(eventRsvps)
      .where(and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.email, email)))
      .limit(1);
    return result[0];
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: string, postUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db
      .update(blogPosts)
      .set({ ...postUpdate, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  // CPC attendance methods
  async getCpcAttendanceByDate(date: string): Promise<CpcAttendance[]> {
    return await db
      .select()
      .from(cpcAttendance)
      .where(eq(cpcAttendance.date, date))
      .orderBy(desc(cpcAttendance.createdAt));
  }

  async addCpcAttendanceEntries(
    entries: InsertCpcAttendance[],
  ): Promise<void> {
    if (entries.length === 0) return;
    await db.insert(cpcAttendance).values(entries);
  }

  async hasCpcCheckInForChild(date: string, childName: string): Promise<boolean> {
    const normalizedName = childName.trim().toLowerCase();
    if (!normalizedName) return false;
    const rows = await db
      .select({ childName: cpcAttendance.childName, checkIn: cpcAttendance.checkIn })
      .from(cpcAttendance)
      .where(eq(cpcAttendance.date, date));

    return rows.some(
      (row) =>
        row.childName?.trim().toLowerCase() === normalizedName &&
        Boolean(row.checkIn && row.checkIn.trim().length > 0)
    );
  }
}

export const storage = new PostgresStorage();
