# Railway Deployment Guide

This guide will help you deploy the United Bethel Presbyterian Church website to Railway.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **PostgreSQL Database**: You'll need a PostgreSQL database (Railway provides this)

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `churchwebsite` repository
5. Railway will automatically detect it's a Node.js project

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database for you
4. Copy the connection string (DATABASE_URL) from the database service

## Step 3: Configure Environment Variables

In your Railway project settings, add these environment variables:

### Required Variables:
```
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
NODE_ENV=production
PORT=3000
```

### Optional Variables:
```
ADMIN_TOKEN=your-secure-admin-token
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourchurch.org
ADMIN_EMAIL=admin@yourchurch.org
```

## Step 4: Deploy

1. Railway will automatically deploy when you push to your main branch
2. The build process will:
   - Install dependencies (`npm ci`)
   - Build the frontend (`npm run build`)
   - Start the server (`npm run start`)

## Step 5: Set Up Database Schema

After deployment, you need to set up your database schema:

1. Go to your Railway project dashboard
2. Click on your app service
3. Go to the "Deployments" tab
4. Click on the latest deployment
5. Go to "Logs" tab
6. Run these commands in the Railway console:

```bash
# Push database schema
npm run db:push

# Seed with initial data
npm run db:seed
```

## Step 6: Configure Custom Domain (Optional)

1. In Railway dashboard, go to your app service
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `yourchurch.org`)
4. Configure DNS records as instructed by Railway

## Step 7: Access Your Website

1. Railway will provide a URL like `https://your-app-name.railway.app`
2. Your website will be available at this URL
3. Admin dashboard: `https://your-app-name.railway.app/admin/login`

## Admin Access

- **Login URL**: `https://your-app-name.railway.app/admin/login`
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin123` (change this in production!)

## File Uploads

- Uploaded images are stored in the `/uploads` directory
- In production, consider using a cloud storage service like AWS S3 or Cloudinary
- For now, files are stored on the Railway instance

## Monitoring

- Railway provides built-in monitoring and logs
- Check the "Metrics" tab for performance data
- Use "Logs" tab to debug any issues

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Verify DATABASE_URL is correct
   - Ensure database is running in Railway

2. **Build Failed**
   - Check build logs in Railway dashboard
   - Ensure all dependencies are in package.json

3. **Admin Login Not Working**
   - Verify admin credentials
   - Check server logs for authentication errors

4. **Images Not Loading**
   - Check if uploads directory exists
   - Verify file permissions

## Security Considerations

1. **Change Default Admin Password**: Update admin credentials in production
2. **Use HTTPS**: Railway provides SSL certificates automatically
3. **Environment Variables**: Never commit sensitive data to Git
4. **Database Security**: Use strong passwords and SSL connections

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)

## Next Steps

1. Set up automated deployments from GitHub
2. Configure monitoring and alerts
3. Set up backup strategies for your database
4. Consider implementing CDN for static assets
5. Set up email notifications for contact form submissions
