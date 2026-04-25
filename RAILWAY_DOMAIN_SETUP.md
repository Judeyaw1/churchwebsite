# Railway Custom Domain Setup Guide

This guide will help you configure your new custom domain on Railway.

## Step 1: Add Domain in Railway

1. **Go to your Railway project dashboard**
   - Navigate to your project on Railway
   - Click on your web service (not the database)

2. **Open Domain Settings**
   - Click on the **"Settings"** tab
   - Scroll down to the **"Domains"** section
   - Click **"Add Domain"** or **"Custom Domain"**

3. **Enter Your Domain**
   - Enter your domain name (e.g., `yourchurch.org` or `www.yourchurch.org`)
   - Railway will show you the DNS records you need to configure

## Step 2: Configure DNS Records

Railway will provide you with DNS records to add. Typically you'll need:

### Option A: Root Domain (yourchurch.org)
- **Type**: CNAME or A record
- **Name**: @ (or leave blank)
- **Value**: Railway will provide this (usually something like `xxxxx.railway.app`)

### Option B: Subdomain (www.yourchurch.org)
- **Type**: CNAME
- **Name**: www
- **Value**: Railway will provide this

### Option C: Both Root and WWW
- Add both records as shown above

**Where to add DNS records:**
- Go to your domain registrar (where you bought the domain)
- Find DNS management or DNS settings
- Add the records Railway provided
- Save changes

**DNS Propagation:**
- Changes can take 5 minutes to 48 hours to propagate
- Usually takes 15-30 minutes

## Step 3: Update Environment Variables in Railway

Once your domain is configured, update these environment variables:

### Required: BASE_URL

1. In Railway, go to your **web service** (not database)
2. Click on the **"Variables"** tab
3. Find or add `BASE_URL`
4. Set it to your new domain:
   ```
   BASE_URL=https://yourchurch.org
   ```
   or
   ```
   BASE_URL=https://www.yourchurch.org
   ```
   (Use `https://` and include `www.` if you're using www)

### Optional: Update Email Addresses

If you want to use your new domain for emails:

1. Update `FROM_EMAIL`:
   ```
   FROM_EMAIL=noreply@yourchurch.org
   ```

2. Update `ADMIN_EMAIL`:
   ```
   ADMIN_EMAIL=admin@yourchurch.org
   ```

3. Update `ONEDRIVE_REDIRECT_URI` (if using OneDrive):
   ```
   ONEDRIVE_REDIRECT_URI=https://yourchurch.org/onedrive-callback
   ```

## Step 4: Verify SSL Certificate

Railway automatically provisions SSL certificates via Let's Encrypt:
- This happens automatically when you add a domain
- Wait a few minutes after adding the domain
- Railway will show SSL status in the domain settings

## Step 5: Test Your Domain

1. **Wait for DNS propagation** (15-30 minutes typically)
2. **Visit your domain**: `https://yourchurch.org`
3. **Check health endpoint**: `https://yourchurch.org/api/health`
4. **Test admin login**: `https://yourchurch.org/admin/login`

## Step 6: Verify Everything Works

Test these features to ensure domain is working:

- ✅ Homepage loads correctly
- ✅ All pages work (About, Events, Blog, etc.)
- ✅ Admin panel accessible
- ✅ Image uploads work
- ✅ Email unsubscribe links work (they use BASE_URL)
- ✅ OneDrive integration works (if enabled)

## Troubleshooting

### Domain Not Resolving
- **Check DNS records**: Verify you added the correct records Railway provided
- **Wait longer**: DNS can take up to 48 hours (usually much faster)
- **Check DNS propagation**: Use tools like `whatsmydns.net` to check propagation

### SSL Certificate Issues
- Railway automatically provisions SSL, but it can take a few minutes
- Make sure your DNS is pointing to Railway first
- Check Railway domain settings for SSL status

### BASE_URL Not Working
- Make sure you updated the `BASE_URL` environment variable
- Redeploy your service after changing environment variables
- Check that you're using `https://` not `http://`

### Email Links Broken
- Verify `BASE_URL` is set correctly
- Check that unsubscribe links in emails use the correct domain
- Test by sending a test email

## Important Notes

1. **Always use HTTPS**: Railway provides SSL automatically, always use `https://` in BASE_URL
2. **Redeploy after changes**: After updating environment variables, Railway may need to redeploy
3. **Keep old domain working**: If you had a Railway subdomain, it will continue to work alongside your custom domain
4. **Email domain**: Make sure your email domain (for FROM_EMAIL) matches your website domain for better deliverability

## Quick Checklist

- [ ] Added domain in Railway dashboard
- [ ] Added DNS records at domain registrar
- [ ] Updated `BASE_URL` environment variable
- [ ] Updated email addresses (FROM_EMAIL, ADMIN_EMAIL)
- [ ] Updated ONEDRIVE_REDIRECT_URI (if using OneDrive)
- [ ] Waited for DNS propagation
- [ ] Verified SSL certificate is active
- [ ] Tested website on new domain
- [ ] Verified all features work correctly



