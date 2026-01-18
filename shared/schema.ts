import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const eventCategoryEnum = pgEnum("event_category", [
  "Special Event",
  "Worship Service", 
  "Special Service",
  "Membership",
  "Youth",
  "Community Service",
  "Adult Ministry",
  "Children's Ministry"
]);

export const galleryCategoryEnum = pgEnum("gallery_category", [
  "Worship",
  "Fellowship", 
  "Community",
  "Youth",
  "Children",
  "Events"
]);

export const messagePriorityEnum = pgEnum("message_priority", [
  "low",
  "medium", 
  "high"
]);

// Users table (for admin authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: text("date").notNull(), // Store as text for flexibility (e.g., "Dec 15, 2024")
  time: text("time").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  category: eventCategoryEnum("category").notNull().default("Special Event"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  registrationRequired: boolean("registration_required").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Event registrations table
export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  attendees: integer("attendees").notNull().default(1),
  guestNames: text("guest_names"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Event RSVPs table (for non-registration events - simple "planning to attend")
export const eventRsvps = pgTable("event_rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Live streams table
export const liveStreams = pgTable("live_streams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  url: text("url").notNull(),
  schedule: text("schedule").notNull(),
  isLive: boolean("is_live").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Gallery images table
export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  url: text("url").notNull(),
  date: text("date").notNull(),
  category: galleryCategoryEnum("category").notNull().default("Worship"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table (for announcements)
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  priority: messagePriorityEnum("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Email subscribers table
export const subscribers = pgTable("subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").notNull().default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// CPC attendance records
export const cpcAttendance = pgTable("cpc_attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(), // YYYY-MM-DD
  childName: text("child_name").notNull(),
  guardianName: text("guardian_name").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  image: text("image"),
  excerpt: text("excerpt"), // Short summary for preview
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  date: true,
  time: true,
  location: true,
  description: true,
  category: true,
  maxAttendees: true,
  currentAttendees: true,
  registrationRequired: true,
  image: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  eventId: true,
  name: true,
  email: true,
  phone: true,
  attendees: true,
  guestNames: true,
  message: true,
});

export const insertLiveStreamSchema = createInsertSchema(liveStreams).pick({
  title: true,
  url: true,
  schedule: true,
  isLive: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).pick({
  title: true,
  url: true,
  date: true,
  category: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  title: true,
  content: true,
  date: true,
  priority: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
  name: true,
});

export const insertEventRsvpSchema = createInsertSchema(eventRsvps).pick({
  eventId: true,
  email: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  author: true,
  image: true,
  excerpt: true,
  isPublished: true,
});

export const insertCpcAttendanceSchema = createInsertSchema(cpcAttendance).pick({
  date: true,
  childName: true,
  guardianName: true,
  checkIn: true,
  checkOut: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertLiveStream = z.infer<typeof insertLiveStreamSchema>;
export type LiveStream = typeof liveStreams.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

export type InsertEventRsvp = z.infer<typeof insertEventRsvpSchema>;
export type EventRsvp = typeof eventRsvps.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertCpcAttendance = z.infer<typeof insertCpcAttendanceSchema>;
export type CpcAttendance = typeof cpcAttendance.$inferSelect;
