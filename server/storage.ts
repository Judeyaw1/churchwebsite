import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc } from "drizzle-orm";
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
  users,
  events,
  liveStreams,
  galleryImages,
  messages
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

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
}

export const storage = new PostgresStorage();
