import 'dotenv/config';
import { Pool } from 'pg';

async function addRsvpTable() {
  console.log('🚀 Adding event_rsvps table...');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Create event_rsvps table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_rsvps (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id VARCHAR NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(event_id, email)
      );
    `);

    // Create index for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON event_rsvps(event_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_event_rsvps_email ON event_rsvps(email);
    `);

    console.log('✅ event_rsvps table created successfully');
  } catch (error) {
    console.error('❌ Failed to create event_rsvps table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addRsvpTable().catch(console.error);

