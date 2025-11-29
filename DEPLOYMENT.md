# Deployment Guide

## Local Development (Currently Running)

Your servers should be running on:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

Open your browser and go to: **http://localhost:3000**

**Default Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## Deploy to Get a Live/Public Link

### Option 1: Deploy to Vercel (Recommended - Free)

#### Frontend Deployment:
1. Install Vercel CLI: `npm i -g vercel`
2. Go to frontend directory: `cd frontend`
3. Run: `vercel`
4. Follow the prompts
5. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`

#### Backend Deployment:
1. Use services like:
   - **Railway** (https://railway.app) - Free tier available
   - **Render** (https://render.com) - Free tier available
   - **Heroku** (https://heroku.com) - Paid
   - **DigitalOcean App Platform** - Paid

2. For Railway/Render:
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variable: `JWT_SECRET=your-secret-key`
   - Add environment variable: `PORT=5000`

### Option 2: Deploy to Netlify + Railway (Free)

#### Frontend (Netlify):
1. Go to https://netlify.com
2. Sign up/login
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`
6. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`

#### Backend (Railway):
1. Go to https://railway.app
2. Sign up/login
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables:
   - `JWT_SECRET=your-secret-key`
   - `PORT=5000`
6. Deploy

### Option 3: Quick Deploy with ngrok (Temporary Public Link)

For a quick temporary public link to test:

1. Install ngrok: https://ngrok.com/download
2. Start your backend: `cd backend && npm start`
3. In another terminal: `ngrok http 5000`
4. Copy the ngrok URL (e.g., https://abc123.ngrok.io)
5. Update frontend `.env`: `REACT_APP_API_URL=https://abc123.ngrok.io/api`
6. Start frontend: `cd frontend && npm start`
7. Use ngrok for frontend too: `ngrok http 3000`

**Note:** ngrok URLs change on free tier when you restart.

### Option 4: Deploy to AWS/GCP/Azure

For production deployments, consider:
- **AWS**: EC2, Elastic Beanstalk, or Amplify
- **Google Cloud**: App Engine or Cloud Run
- **Azure**: App Service

---

## Environment Variables

### Backend (.env):
```
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
```

### Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
```
(Change to your deployed backend URL in production)

---

## Database Considerations

The current setup uses SQLite which is file-based. For production:

1. **Keep SQLite** (works for small-medium apps):
   - Database file persists on server
   - No additional setup needed

2. **Upgrade to PostgreSQL/MySQL** (recommended for production):
   - Better for concurrent users
   - More reliable
   - Requires database hosting (Railway, Supabase, etc.)

---

## Quick Start Commands

### Local Development:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Build for Production:
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

---

## Recommended Free Hosting Stack

1. **Frontend**: Vercel or Netlify (Free, easy, fast)
2. **Backend**: Railway or Render (Free tier available)
3. **Database**: Keep SQLite or use Railway's PostgreSQL

This gives you a completely free hosting solution!

