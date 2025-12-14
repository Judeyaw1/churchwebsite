# Migration Guide: Railway to Hosting.com

This guide will help you migrate your church website from Railway to Hosting.com.

## Pre-Migration Checklist

- [ ] Backup your database from Railway
- [ ] Export all environment variables from Railway
- [ ] Note your current domain configuration
- [ ] Document any custom configurations

## Step 1: Backup Your Data

### Backup Database

1. **From Railway Dashboard**:
   - Go to your Railway project
   - Navigate to your PostgreSQL database
   - Use the "Connect" option to get connection details
   - Export your database using pg_dump:

   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Or use Railway CLI**:
   ```bash
   railway connect postgres
   pg_dump > backup.sql
   ```

### Backup Environment Variables

Export all environment variables from Railway:
- DATABASE_URL
- SENDGRID_API_KEY
- BASE_URL
- All other custom variables

## Step 2: Set Up Hosting.com

### Create Hosting.com Account

1. Sign up for Hosting.com account
2. Choose a plan that supports:
   - Node.js applications
   - PostgreSQL database
   - SSH/terminal access (recommended)

### Set Up Database

1. **Option A: Use Hosting.com PostgreSQL**:
   - Create PostgreSQL database in cPanel
   - Note connection details

2. **Option B: Use External Database** (Recommended):
   - Use Neon, Supabase, or similar
   - More reliable and easier to manage
   - Better performance

## Step 3: Deploy Application

### Upload Files

1. **Via Git** (if supported):
   ```bash
   git clone https://github.com/Judeyaw1/churchwebsite.git
   cd churchwebsite
   ```

2. **Via FTP/SFTP**:
   - Upload all files to your Hosting.com account
   - Maintain directory structure

### Install Dependencies

```bash
npm install --production=false
```

### Build Application

```bash
npm run build
```

### Set Environment Variables

In Hosting.com control panel, set all environment variables from Railway.

## Step 4: Restore Database

### Import Database Backup

```bash
# Connect to your new database
psql $NEW_DATABASE_URL < backup.sql
```

### Or Run Migrations

If you prefer to recreate tables:

```bash
# Push schema
npm run db:push

# Run migration scripts
npx tsx scripts/add-rsvp-table.ts
npx tsx scripts/add-blog-table.ts

# Seed data (optional)
npm run db:seed
```

## Step 5: Configure Domain

1. **Update DNS Records**:
   - Point your domain's A record or CNAME to Hosting.com's IP/server
   - Wait for DNS propagation (can take up to 48 hours)

2. **SSL Certificate**:
   - Hosting.com should provide SSL certificate
   - Enable HTTPS in your Hosting.com control panel

## Step 6: Start Application

### Via cPanel Node.js Manager:
- Create Node.js app
- Set startup file: `dist/index.js`
- Set port: Check Hosting.com documentation
- Start the application

### Via SSH (if available):
```bash
npm run start
```

Or with PM2:
```bash
npm install -g pm2
pm2 start dist/index.js --name church-website
pm2 save
```

## Step 7: Verify Migration

1. **Test Website**:
   - Visit your domain
   - Check all pages load correctly
   - Test admin login

2. **Test Functionality**:
   - Create a test event
   - Upload a test image
   - Test blog post creation
   - Verify email subscriptions work

3. **Check Logs**:
   - Review application logs for errors
   - Check database connections
   - Verify file uploads work

## Step 8: Update DNS (Final Step)

Once everything is verified on Hosting.com:

1. Update your domain's DNS to point to Hosting.com
2. Wait for DNS propagation
3. Monitor for any issues
4. Keep Railway running for 24-48 hours as backup

## Step 9: Clean Up Railway

After confirming everything works on Hosting.com:

1. Export final database backup from Railway
2. Document any last-minute changes
3. Cancel Railway subscription (if desired)
4. Keep backups of Railway configuration

## Important Differences

### Port Configuration
- **Railway**: Automatically assigns PORT
- **Hosting.com**: May use specific port (check documentation)

### File Storage
- **Railway**: Ephemeral storage (files may be lost on restart)
- **Hosting.com**: Persistent storage (files persist)

### Database
- **Railway**: Managed PostgreSQL
- **Hosting.com**: May need external database or use their managed service

### Environment Variables
- **Railway**: Set in dashboard
- **Hosting.com**: Set in cPanel or control panel

## Troubleshooting

### Application Won't Start
- Check Node.js version (should be 20.x)
- Verify PORT environment variable
- Check application logs

### Database Connection Fails
- Verify DATABASE_URL is correct
- Check database firewall settings
- Ensure SSL is configured if required

### Static Files Not Loading
- Verify uploads directory exists and is writable
- Check file permissions (chmod 755 uploads)
- Ensure static file serving is configured

### Images Broken
- Run the broken images check script
- Re-upload missing images through admin panel
- Verify uploads directory is accessible

## Support Resources

- Hosting.com Support: Check their documentation
- Application Logs: Review in cPanel or via SSH
- Database Issues: Check connection strings and firewall

## Rollback Plan

If you need to rollback to Railway:

1. Update DNS back to Railway
2. Railway should still have your old deployment
3. Restore from backup if needed

