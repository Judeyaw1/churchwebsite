# Hosting.com Deployment Guide

This guide will help you deploy your church website to Hosting.com.

## Prerequisites

1. A Hosting.com account with Node.js support
2. PostgreSQL database (can be from Hosting.com or external provider like Neon, Supabase)
3. Domain name configured with Hosting.com

## Step 1: Prepare Your Application

### Build the Application Locally (Optional but Recommended)

```bash
npm install
npm run build
```

This will create the `dist` folder with the production build.

## Step 2: Upload Files to Hosting.com

Upload all files to your Hosting.com account via:
- **FTP/SFTP**: Use FileZilla or similar
- **cPanel File Manager**: If available
- **Git**: If Hosting.com supports Git deployment

### Files to Upload:
- All source files (client/, server/, shared/, scripts/)
- package.json and package-lock.json
- All configuration files (vite.config.ts, tsconfig.json, etc.)
- .env file (or set environment variables in cPanel)

## Step 3: Configure Environment Variables

In your Hosting.com control panel (cPanel or similar), set these environment variables:

### Required Variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=3000
BASE_URL=https://yourdomain.com
```

### Optional Variables:
```
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
MICROSOFT_CLIENT_ID=your-onedrive-client-id
MICROSOFT_CLIENT_SECRET=your-onedrive-secret
MICROSOFT_TENANT_ID=common
ONEDRIVE_REDIRECT_URI=https://yourdomain.com/onedrive-callback
```

## Step 4: Install Dependencies and Build

### Via SSH (if available):
```bash
cd /path/to/your/application
npm install --production=false
npm run build
```

### Via cPanel Terminal:
If Hosting.com provides terminal access, run the same commands.

## Step 5: Configure Node.js Application

### Option A: Using cPanel Node.js App Manager

1. Go to cPanel → Node.js App Manager
2. Create a new Node.js application
3. Set:
   - **Node.js Version**: 20.x (or latest LTS)
   - **Application Root**: `/home/username/your-app`
   - **Application URL**: Your domain or subdomain
   - **Application Startup File**: `dist/index.js`
   - **Application Mode**: Production

### Option B: Using .htaccess (if Apache)

Create a `.htaccess` file in your root directory:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ dist/index.js [L]
```

### Option C: Using PM2 (if SSH access available)

```bash
npm install -g pm2
pm2 start dist/index.js --name church-website
pm2 save
pm2 startup
```

## Step 6: Database Setup

1. **Create PostgreSQL Database**:
   - In Hosting.com cPanel, create a PostgreSQL database
   - Note the connection details (host, port, database name, username, password)

2. **Run Migrations**:
   ```bash
   # Create blog_posts table
   npx tsx scripts/add-blog-table.ts
   
   # Create event_rsvps table
   npx tsx scripts/add-rsvp-table.ts
   ```

3. **Set DATABASE_URL**:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

## Step 7: Configure File Permissions

Ensure the `uploads` directory is writable:

```bash
chmod 755 uploads
```

## Step 8: Start the Application

### Via cPanel Node.js App Manager:
- Click "Start" on your Node.js application

### Via SSH:
```bash
npm run start
```

Or with PM2:
```bash
pm2 start dist/index.js
```

## Step 9: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check health endpoint: `https://yourdomain.com/api/health`
3. Test admin login: `https://yourdomain.com/admin/login`
4. Verify image uploads work

## Troubleshooting

### Port Issues
- Hosting.com may assign a specific port
- Check your Hosting.com documentation for the correct PORT value
- Update the PORT environment variable accordingly

### Static Files Not Serving
- Ensure the `uploads` directory exists and is writable
- Check that static file serving is configured correctly

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if Hosting.com requires SSL connections
- Ensure database firewall allows your application server

### Build Errors
- Ensure Node.js version is 20.x or compatible
- Check that all dependencies are installed
- Review build logs for specific errors

## Important Notes

1. **File Uploads**: The `uploads` directory must be persistent and writable
2. **Environment Variables**: Never commit `.env` file to Git
3. **Database Backups**: Set up regular database backups
4. **SSL Certificate**: Ensure SSL is configured for your domain
5. **Domain Configuration**: Point your domain's A record or CNAME to Hosting.com's server

## Support

If you encounter issues:
1. Check Hosting.com's documentation for Node.js deployment
2. Review application logs in cPanel or via SSH
3. Contact Hosting.com support for hosting-specific issues

