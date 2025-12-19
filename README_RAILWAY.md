# United Bethel Presbyterian Church Website - Railway Deployment

A modern, responsive church website built with React, TypeScript, and Node.js, designed for deployment on Railway.

## 🚀 Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Judeyaw1/churchwebsite)

## Features

- **Modern Design**: Beautiful, responsive design with dark theme
- **Admin Dashboard**: Complete CMS for managing content
- **Real-time Updates**: Changes in admin panel reflect immediately on website
- **Database Integration**: PostgreSQL with Drizzle ORM
- **File Uploads**: Image uploads for events and gallery
- **Live Streams**: YouTube integration for live streaming
- **Events Management**: Full event calendar with filtering
- **Contact Forms**: Built-in contact and message system

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Railway
- **File Storage**: Local file system (upgradeable to cloud storage)

## Railway Deployment Steps

### 1. Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose this repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Copy the `DATABASE_URL` from the database service

### 3. Configure Environment Variables

Add these environment variables in Railway:

```bash
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
NODE_ENV=production
PORT=3000
```

### 4. Deploy

Railway will automatically:
- Install dependencies
- Build the application
- Start the server

### 5. Set Up Database

After deployment, run these commands in Railway console:

```bash
# Push database schema
npm run db:push

# Set up production data
npm run db:setup
```

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production"
- `PORT` - Server port (Railway sets this automatically)

### Optional
- `ADMIN_TOKEN` - Custom admin authentication token
- `SENDGRID_API_KEY` - For email functionality
- `FROM_EMAIL` - Sender email address
- `ADMIN_EMAIL` - Admin email address

## Admin Access

- **URL**: `https://your-app.railway.app/admin/login`
- **Username**: `admin`
- **Password**: `admin123` (⚠️ Change this in production!)

## File Structure

```
churchwebsite/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── ...
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
├── scripts/              # Database scripts
├── uploads/              # File uploads directory
└── ...
```

## API Endpoints

### Public Endpoints
- `GET /api/events` - Get all events
- `GET /api/live-streams` - Get live streams
- `GET /api/gallery` - Get gallery images
- `POST /api/messages` - Submit contact form

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/events` - Manage events
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- Similar endpoints for live-streams, gallery, messages

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - Admin users
- `events` - Church events
- `liveStreams` - Live streaming links
- `galleryImages` - Image gallery
- `messages` - Contact form submissions

## Customization

### Changing Church Information
1. Edit `client/index.html` for meta tags
2. Update `client/src/components/HeroSection.tsx` for main content
3. Modify `client/src/components/Footer.tsx` for contact info

### Styling
- Uses Tailwind CSS for styling
- Dark theme is the default
- Colors can be customized in `tailwind.config.ts`

### Adding Features
- New API endpoints in `server/routes.ts`
- New components in `client/src/components/`
- Database schema changes in `shared/schema.ts`

## Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: Performance and usage statistics
- **Deployments**: Deployment history and status

### Health Monitoring

The app exposes `GET /api/health`, which now validates API uptime and performs a live database query. To have Railway automatically restart unhealthy instances:

1. In your Railway service, go to **Settings → Health Checks**.
2. Add a new check with:
   - **Path**: `/api/health`
   - **Port**: `3000` (or leave blank to use the service default)
   - **Interval**: 30 seconds
   - **Timeout**: 10 seconds
   - **Expected Status**: `200`
3. Save the configuration—Railway will mark the deployment unhealthy if the endpoint degrades (it returns HTTP 503 when the database is unreachable).

## Security Considerations

1. **Change Default Password**: Update admin credentials
2. **Environment Variables**: Never commit sensitive data
3. **HTTPS**: Railway provides SSL certificates
4. **Database Security**: Use strong passwords and SSL

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Railway build logs
   - Ensure all dependencies are in package.json

2. **Database Connection**
   - Verify DATABASE_URL is correct
   - Check database service is running

3. **Admin Login Issues**
   - Verify admin user exists in database
   - Check server logs for errors

4. **File Uploads Not Working**
   - Check uploads directory permissions
   - Verify file size limits

### Getting Help

- Check Railway logs in the dashboard
- Review application logs for error messages
- Ensure all environment variables are set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue in this repository
- Check Railway documentation
- Review the deployment guide in `RAILWAY_DEPLOYMENT.md`
