#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { 
  users, 
  events, 
  liveStreams, 
  galleryImages, 
  messages 
} from "../shared/schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Create admin user
    console.log("👤 Creating admin user...");
    await db.insert(users).values({
      username: 'admin',
      password: 'church2024', // In production, this should be hashed
    }).onConflictDoNothing();

    // Create sample events
    console.log("📅 Creating sample events...");
    await db.insert(events).values([
      {
        title: 'Christmas Concert',
        date: 'Dec 15, 2024',
        time: '7:00 PM',
        location: 'Main Sanctuary',
        description: 'Join us for an evening of beautiful Christmas music featuring our choir, orchestra, and special guest performers. This annual tradition brings the community together to celebrate the joy of the season.',
        category: 'Special Event',
        maxAttendees: 300,
        currentAttendees: 245,
        registrationRequired: false,
        image: '/api/placeholder/400/200'
      },
      {
        title: 'Family Service',
        date: 'Dec 22, 2024',
        time: '10:00 AM',
        location: 'Main Sanctuary',
        description: 'A special service designed for families with children of all ages. Interactive worship, storytelling, and activities that engage both parents and children.',
        category: 'Worship Service',
        registrationRequired: false,
        image: '/api/placeholder/400/200'
      },
      {
        title: 'Christmas Eve Service',
        date: 'Dec 24, 2024',
        time: '7:00 PM',
        location: 'Main Sanctuary',
        description: 'Join us for our traditional Christmas Eve candlelight service celebrating the birth of Christ. Music, scripture, and the lighting of candles.',
        category: 'Worship Service',
        registrationRequired: false,
        image: '/api/placeholder/400/200'
      },
      {
        title: 'Youth Winter Retreat',
        date: 'Jan 15-17, 2025',
        time: '5:00 PM',
        location: 'Camp Retreat Center',
        description: 'A weekend getaway for youth to grow in faith, build relationships, and have fun in a beautiful outdoor setting.',
        category: 'Youth',
        maxAttendees: 50,
        currentAttendees: 32,
        registrationRequired: true,
        image: '/api/placeholder/400/200'
      },
      {
        title: 'Community Food Drive',
        date: 'Jan 20, 2025',
        time: '9:00 AM - 2:00 PM',
        location: 'Church Parking Lot',
        description: 'Help us collect food donations for local families in need. Drop off non-perishable items and join us in serving our community.',
        category: 'Community Service',
        registrationRequired: false,
        image: '/api/placeholder/400/200'
      }
    ]).onConflictDoNothing();

    // Create sample live streams
    console.log("📺 Creating sample live streams...");
    await db.insert(liveStreams).values([
      {
        title: 'Sunday Worship Service',
        url: 'https://youtube.com/watch?v=example',
        schedule: 'Sundays 9:00 AM & 11:00 AM',
        isLive: false
      },
      {
        title: 'Midweek Bible Study',
        url: 'https://youtube.com/watch?v=bible',
        schedule: 'Wednesdays 7:00 PM',
        isLive: false
      }
    ]).onConflictDoNothing();

    // Create sample gallery images
    console.log("🖼️ Creating sample gallery images...");
    await db.insert(galleryImages).values([
      {
        title: 'Community Gathering',
        url: 'https://images.unsplash.com/photo-1517486804500-e215cd059c6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        date: '2024-10-26',
        category: 'Fellowship'
      },
      {
        title: 'Worship Service',
        url: 'https://images.unsplash.com/photo-1523050854805-d91864464e0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        date: '2024-10-20',
        category: 'Worship'
      },
      {
        title: 'Youth Night',
        url: 'https://images.unsplash.com/photo-1501504905252-473c47e072aa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        date: '2024-10-18',
        category: 'Youth'
      },
      {
        title: 'Bible Study',
        url: 'https://images.unsplash.com/photo-1523050854805-d91864464e0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        date: '2024-10-16',
        category: 'Community'
      },
      {
        title: 'Outreach Program',
        url: 'https://images.unsplash.com/photo-1517486804500-e215cd059c6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        date: '2024-10-12',
        category: 'Events'
      },
      {
        title: 'Kids\' Sunday',
        url: 'https://images.unsplash.com/photo-1501504905252-473c47e072aa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        date: '2024-10-06',
        category: 'Children'
      }
    ]).onConflictDoNothing();

    // Create sample messages
    console.log("📢 Creating sample messages...");
    await db.insert(messages).values([
      {
        title: 'Welcome New Members',
        content: 'A warm welcome to all our new members who joined us this month. We\'re excited to have you as part of our church family.',
        date: '2024-11-01',
        priority: 'high'
      },
      {
        title: 'Volunteer Opportunity',
        content: 'We need volunteers for the upcoming food drive. Please contact the church office if you can help.',
        date: '2024-10-28',
        priority: 'medium'
      },
      {
        title: 'Christmas Decorating',
        content: 'Join us this Saturday for our annual Christmas decorating day. All are welcome to help make our church beautiful for the season.',
        date: '2024-11-15',
        priority: 'low'
      }
    ]).onConflictDoNothing();

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📋 Summary:");
    console.log("- Admin user created (username: admin, password: church2024)");
    console.log("- 5 sample events added");
    console.log("- 2 live streams added");
    console.log("- 6 gallery images added");
    console.log("- 3 messages added");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
