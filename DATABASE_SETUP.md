# Database Setup for Church Website

This church website now uses PostgreSQL as the backend database instead of localStorage. Here's how to set it up:

## 🗄️ Database Configuration

### 1. Environment Variables

Create a `.env` file in the root directory with:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/church_website

# Server Configuration  
PORT=5000
NODE_ENV=development
```

### 2. Database Options

#### Option A: Neon Database (Recommended - Cloud PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string and add it to your `.env` file:
   ```bash
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/church_website?sslmode=require
   ```

#### Option B: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE church_website;
   ```
3. Update your `.env` file:
   ```bash
   DATABASE_URL=postgresql://postgres:password@localhost:5432/church_website
   ```

## 🚀 Setup Commands

### 1. Create Database Schema
```bash
npm run db:push
```
This creates all the tables in your PostgreSQL database.

### 2. Seed with Sample Data
```bash
npm run db:seed
```
This adds sample events, live streams, gallery images, and messages.

### 3. Reset Database (if needed)
```bash
npm run db:reset
```
This recreates the schema and seeds with fresh data.

## 📊 Database Schema

The database includes these tables:

- **users** - Admin authentication
- **events** - Church events and activities
- **live_streams** - Live streaming information
- **gallery_images** - Photo gallery
- **messages** - Announcements and messages

## 🔌 API Endpoints

### Public Endpoints (for website)
- `GET /api/events` - Get all events
- `GET /api/events/upcoming?limit=3` - Get upcoming events
- `GET /api/live-streams` - Get all live streams
- `GET /api/live-streams/current` - Get current live stream
- `GET /api/gallery` - Get all gallery images
- `GET /api/messages` - Get all messages

### Admin Endpoints (require authentication)
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- Similar endpoints for live-streams, gallery, and messages
- `POST /api/admin/login` - Admin authentication

## 🔐 Admin Access

- **Username:** `admin`
- **Password:** `church2024`

## ✨ Benefits of PostgreSQL

1. **Persistent Data** - Changes persist across server restarts
2. **Scalability** - Can handle large amounts of data
3. **Reliability** - ACID compliance and data integrity
4. **Real-time Updates** - Website immediately reflects admin changes
5. **Backup & Recovery** - Professional database management
6. **Multi-user Access** - Multiple admins can work simultaneously

## 🔄 How It Works

1. **Admin Dashboard** → Makes API calls to `/api/admin/*` endpoints
2. **Database** → Stores all data in PostgreSQL
3. **Website Components** → Fetch data from `/api/*` endpoints
4. **Real-time Updates** → Changes in admin immediately appear on website

Now when you edit events, live streams, or gallery in the admin dashboard, those changes will immediately appear on the website!
