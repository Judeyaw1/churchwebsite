# Quick Deployment Steps for Hosting.com

Follow these steps in order to deploy your church website to Hosting.com.

## Step 1: Prepare Your Files

### Option A: Upload via Git (Recommended)
If Hosting.com supports Git:
```bash
# On your local machine, ensure everything is committed
git add .
git commit -m "Prepare for Hosting.com deployment"
git push

# On Hosting.com, clone your repository
git clone https://github.com/Judeyaw1/churchwebsite.git
cd churchwebsite
```

### Option B: Upload via FTP/SFTP
1. Use FileZilla or similar FTP client
2. Connect to your Hosting.com account
3. Upload ALL files and folders to your hosting directory
4. Maintain the exact folder structure

## Step 2: Set Up Database

### Create PostgreSQL Database

**Option A: Use Hosting.com's PostgreSQL**
1. Log into Hosting.com cPanel
2. Find "PostgreSQL Databases" or "Database" section
3. Create a new PostgreSQL database
4. Create a database user
5. Grant user access to the database
6. Note down: host, port, database name, username, password

**Option B: Use External Database (Recommended)**
- Sign up for Neon (neon.tech) or Supabase (supabase.com)
- Create a new PostgreSQL database
- Get the connection string

### Run Database Migrations

Once you have your database connection string, run:

```bash
# Set your database URL
export DATABASE_URL="postgresql://username:password@host:port/database"

# Create required tables
npx tsx scripts/add-rsvp-table.ts
npx tsx scripts/add-blog-table.ts
```

## Step 3: Configure Environment Variables

In Hosting.com control panel, find "Environment Variables" or "App Settings" and add:

```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=3000
BASE_URL=https://yourdomain.com
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

**Important**: Replace all placeholder values with your actual values!

## Step 4: Install Dependencies

Via SSH or Terminal in Hosting.com:

```bash
cd /path/to/your/application
npm install
```

This will install all required packages.

## Step 5: Build the Application

```bash
npm run build
```

This creates the production build in the `dist` folder.

## Step 6: Create Uploads Directory

```bash
mkdir -p uploads
chmod 755 uploads
```

## Step 7: Start the Application

### Method 1: Using Hosting.com Node.js Manager (cPanel)
1. Go to "Node.js App Manager" in cPanel
2. Click "Create Application"
3. Fill in:
   - **Node.js Version**: 20.x (or latest available)
   - **Application Root**: `/home/username/your-app-folder`
   - **Application URL**: Your domain or subdomain
   - **Application Startup File**: `dist/index.js`
   - **Application Mode**: Production
4. Click "Create"
5. Click "Start" to start your application

### Method 2: Using PM2 (if SSH access available)
```bash
npm install -g pm2
pm2 start dist/index.js --name church-website
pm2 save
pm2 startup
```

### Method 3: Direct Start (for testing)
```bash
npm run start
```

## Step 8: Verify Deployment

1. **Check Health Endpoint**:
   Visit: `https://yourdomain.com/api/health`
   Should return: `{"status":"healthy",...}`

2. **Visit Homepage**:
   Visit: `https://yourdomain.com`
   Should show your church website

3. **Test Admin Login**:
   Visit: `https://yourdomain.com/admin/login`
   Login with your admin credentials

4. **Test Image Upload**:
   - Go to Admin → Gallery
   - Try uploading an image
   - Verify it appears correctly

## Step 9: Configure Domain (if not done)

1. Point your domain's DNS to Hosting.com:
   - A Record: Point to Hosting.com's IP
   - Or CNAME: Point to Hosting.com's hostname

2. Enable SSL Certificate:
   - Use Hosting.com's SSL manager
   - Enable Let's Encrypt or their SSL service

## Troubleshooting

### Application won't start
- Check Node.js version: `node --version` (should be 20.x)
- Check PORT environment variable
- Review application logs

### Database connection fails
- Verify DATABASE_URL is correct
- Check database allows connections from your server
- Ensure SSL is configured if required

### Images not loading
- Check uploads directory exists: `ls -la uploads`
- Verify permissions: `chmod 755 uploads`
- Check static file serving is working

### Build fails
- Ensure all dependencies installed: `npm install`
- Check Node.js version compatibility
- Review build error messages

## Need Help?

If you encounter issues:
1. Check application logs in Hosting.com control panel
2. Review error messages carefully
3. Verify all environment variables are set correctly
4. Contact Hosting.com support for hosting-specific issues

