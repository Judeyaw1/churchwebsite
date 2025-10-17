import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { events, liveStreams, galleryImages, messages, users } from '../shared/schema.js';

async function setupProduction() {
  console.log('🚀 Setting up production database...');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  const db = drizzle(pool);

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');

    // Check if admin user exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
    
    if (existingAdmin.length === 0) {
      console.log('👤 Creating admin user...');
      await db.insert(users).values({
        username: 'admin',
        password: 'admin123', // Change this in production!
        email: 'admin@unitedbethel.org',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Check if we have any events
    const eventCount = await db.select().from(events).limit(1);
    if (eventCount.length === 0) {
      console.log('📅 Adding sample events...');
      await db.insert(events).values([
        {
          title: 'Sunday Worship Service',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next Sunday
          time: '9:00 AM & 11:00 AM',
          location: 'Main Sanctuary',
          description: 'Join us for inspiring worship, biblical teaching, and community fellowship.',
          category: 'Worship Service',
          registrationRequired: false
        },
        {
          title: 'Midweek Bible Study',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // This Wednesday
          time: '7:00 PM',
          location: 'Fellowship Hall',
          description: 'Dive deeper into God\'s word with interactive study and discussion.',
          category: 'Adult Ministry',
          registrationRequired: false
        }
      ]);
      console.log('✅ Sample events added');
    } else {
      console.log('✅ Events already exist');
    }

    console.log('🎉 Production setup complete!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Change the admin password in production');
    console.log('2. Add your actual church events through the admin panel');
    console.log('3. Upload your church images to the gallery');
    console.log('4. Configure live stream links if needed');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

setupProduction().catch(console.error);
