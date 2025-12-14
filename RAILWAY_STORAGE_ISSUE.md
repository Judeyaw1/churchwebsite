# Railway Storage Issue - Image Uploads

## Problem

On Railway, the `/uploads` directory is **ephemeral** - files get deleted when the service redeploys. This means:

- Images uploaded through the admin panel are stored in `/uploads`
- When Railway redeploys (automatic on git push), these files are **deleted**
- The database still has references to these images, but the files are gone
- Result: Broken images on your website

## Current Status

- ✅ Error handling added to show placeholders for broken images
- ❌ Uploaded images will be lost on redeploy
- ❌ 8 broken image references in database

## Solutions

### Option 1: Use Railway Volumes (Recommended)

Railway Volumes provide persistent storage that survives redeployments:

1. **Add Volume to Railway**:
   - In Railway dashboard, go to your web service
   - Click "Settings" → "Volumes"
   - Click "Add Volume"
   - Name: `uploads`
   - Mount Path: `/app/uploads`
   - Size: 1GB (or as needed)

2. **Update Code** (if needed):
   - The code already uses `process.cwd() + '/uploads'`
   - With volume mounted at `/app/uploads`, it should work automatically

3. **Redeploy**:
   - Railway will mount the volume
   - Uploaded images will persist across redeployments

### Option 2: Use OneDrive Integration (Already Available)

Your app already has OneDrive integration! Use it for image storage:

1. **Set up OneDrive**:
   - Configure `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET` in Railway
   - Set `ONEDRIVE_TARGET_FOLDER=ChurchGallery`
   - Complete OneDrive OAuth setup

2. **Upload to OneDrive**:
   - Images uploaded through admin will be stored in OneDrive
   - Images persist across redeployments
   - No storage limits (within OneDrive limits)

### Option 3: Use External Storage (S3, Cloudinary, etc.)

For production, consider using:
- **AWS S3** - Reliable, scalable
- **Cloudinary** - Image optimization included
- **Google Cloud Storage** - Similar to S3

This requires code changes to upload directly to these services.

## Immediate Fix: Clean Up Broken Images

To remove broken image references from the database:

1. **Via Admin Panel**:
   - Go to Admin → Gallery
   - Delete images that show as broken
   - Re-upload them if needed

2. **Via Database** (if you have access):
   ```sql
   -- Find broken gallery images
   SELECT id, title, url FROM gallery_images 
   WHERE url LIKE '/uploads/%';
   
   -- Delete broken images (be careful!)
   DELETE FROM gallery_images 
   WHERE url LIKE '/uploads/%' 
   AND url NOT IN (
     SELECT '/uploads/' || filename FROM uploaded_files
   );
   ```

## Recommendation

**For now**: Use Railway Volumes (Option 1) - it's the quickest fix with minimal changes.

**For production**: Consider OneDrive (Option 2) or S3 (Option 3) for better reliability and scalability.

