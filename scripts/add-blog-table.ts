import 'dotenv/config';
import { Pool } from 'pg';

async function addBlogTable() {
  console.log('🚀 Adding blog_posts table...');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Create blog_posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        image TEXT,
        excerpt TEXT,
        published_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Create index for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
    `);

    console.log('✅ blog_posts table created successfully');
  } catch (error) {
    console.error('❌ Failed to create blog_posts table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addBlogTable().catch(console.error);

