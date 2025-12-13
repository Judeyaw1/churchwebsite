import 'dotenv/config';
import { Pool } from 'pg';
import fetch from 'node-fetch';

async function checkBrokenImages() {
  console.log('🔍 Checking for broken image URLs in database...\n');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Check gallery images
    const galleryResult = await pool.query('SELECT id, title, url FROM gallery_images WHERE url IS NOT NULL AND url != \'\'');
    const galleryImages = galleryResult.rows;

    console.log(`Found ${galleryImages.length} gallery images to check\n`);

    const brokenImages: Array<{ table: string; id: string; title: string; url: string }> = [];

    for (const image of galleryImages) {
      try {
        const response = await fetch(image.url, { method: 'HEAD', timeout: 5000 });
        if (!response.ok) {
          brokenImages.push({
            table: 'gallery_images',
            id: image.id,
            title: image.title,
            url: image.url
          });
          console.log(`❌ Broken: ${image.title} - ${image.url} (Status: ${response.status})`);
        } else {
          console.log(`✅ OK: ${image.title}`);
        }
      } catch (error: any) {
        brokenImages.push({
          table: 'gallery_images',
          id: image.id,
          title: image.title,
          url: image.url
        });
        console.log(`❌ Broken: ${image.title} - ${image.url} (Error: ${error.message})`);
      }
    }

    // Check event images
    const eventResult = await pool.query('SELECT id, title, image FROM events WHERE image IS NOT NULL AND image != \'\'');
    const events = eventResult.rows;

    console.log(`\nFound ${events.length} events with images to check\n`);

    for (const event of events) {
      try {
        const response = await fetch(event.image, { method: 'HEAD', timeout: 5000 });
        if (!response.ok) {
          brokenImages.push({
            table: 'events',
            id: event.id,
            title: event.title,
            url: event.image
          });
          console.log(`❌ Broken: ${event.title} - ${event.image} (Status: ${response.status})`);
        } else {
          console.log(`✅ OK: ${event.title}`);
        }
      } catch (error: any) {
        brokenImages.push({
          table: 'events',
          id: event.id,
          title: event.title,
          url: event.image
        });
        console.log(`❌ Broken: ${event.title} - ${event.image} (Error: ${error.message})`);
      }
    }

    // Check blog images
    const blogResult = await pool.query('SELECT id, title, image FROM blog_posts WHERE image IS NOT NULL AND image != \'\'');
    const blogPosts = blogResult.rows;

    console.log(`\nFound ${blogPosts.length} blog posts with images to check\n`);

    for (const post of blogPosts) {
      try {
        const response = await fetch(post.image, { method: 'HEAD', timeout: 5000 });
        if (!response.ok) {
          brokenImages.push({
            table: 'blog_posts',
            id: post.id,
            title: post.title,
            url: post.image
          });
          console.log(`❌ Broken: ${post.title} - ${post.image} (Status: ${response.status})`);
        } else {
          console.log(`✅ OK: ${post.title}`);
        }
      } catch (error: any) {
        brokenImages.push({
          table: 'blog_posts',
          id: post.id,
          title: post.title,
          url: post.image
        });
        console.log(`❌ Broken: ${post.title} - ${post.image} (Error: ${error.message})`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total broken images: ${brokenImages.length}`);
    if (brokenImages.length > 0) {
      console.log(`\n🔧 Broken Image Details:`);
      brokenImages.forEach(img => {
        console.log(`   - ${img.table}: ${img.title}`);
        console.log(`     URL: ${img.url}`);
        console.log(`     ID: ${img.id}\n`);
      });
    } else {
      console.log(`   ✅ All images are accessible!`);
    }

  } catch (error) {
    console.error('❌ Error checking images:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

checkBrokenImages().catch(console.error);

