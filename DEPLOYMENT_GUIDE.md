# 🚀 Deployment Guide

This guide will walk you through deploying your backend to free hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ Redis Cloud account (already set up)
- ✅ All code committed to GitHub
- ✅ `.env` file configured locally (DO NOT commit this!)

## 🎯 Option 1: Deploy to Render (Recommended)

### Why Render?
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variable management
- ✅ Good for Node.js apps

### Step-by-Step Instructions

#### 1. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Real-time DEX aggregator"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### 2. Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest option)

#### 3. Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your `realtime-dex-aggregator` repo
4. Configure:
   - **Name**: `dex-aggregator` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

#### 4. Add Environment Variables

In Render dashboard:
1. Go to "Environment" tab
2. Add these variables:
   - `REDIS_URL`: `redis://default:YOUR_PASSWORD@redis-17448.c258.us-east-1-4.ec2.cloud.redislabs.com:17448`
   - `NODE_ENV`: `production`

#### 5. Deploy!

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your app will be live at: `https://YOUR_APP_NAME.onrender.com`

#### 6. Test Your Deployment

```bash
# Test REST API
curl https://YOUR_APP_NAME.onrender.com/api/tokens?q=SOL

# Test in browser
https://YOUR_APP_NAME.onrender.com/api/tokens?q=SOL
```

---

## 🎯 Option 2: Deploy to Railway

### Why Railway?
- ✅ Very simple setup
- ✅ Free $5/month credit
- ✅ Built-in Redis option
- ✅ Great developer experience

### Step-by-Step Instructions

#### 1. Create GitHub Repository (Same as Render)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

#### 2. Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

#### 3. Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will auto-detect Node.js

#### 4. Add Environment Variables

1. Click on your service
2. Go to "Variables" tab
3. Add:
   - `REDIS_URL`: Your Redis connection string
   - `PORT`: Railway auto-assigns, but you can set to `3000`

#### 5. Deploy!

1. Railway automatically deploys
2. Click "Settings" → "Generate Domain"
3. Your app will be at: `https://YOUR_APP.up.railway.app`

---

## 🎯 Option 3: Deploy to Fly.io

### Quick Setup

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Set environment variables
fly secrets set REDIS_URL="your-redis-url"

# Deploy
fly deploy
```

---

## 🧪 Post-Deployment Testing

### 1. Test REST API

```bash
# Replace with your actual URL
curl https://YOUR_APP.onrender.com/api/tokens?q=SOL
```

Expected: JSON array of tokens

### 2. Test WebSocket

Open `index.html` and update the connection URL:
```javascript
const socket = io('https://YOUR_APP.onrender.com');
```

### 3. Test Multiple Requests

```bash
# Test 5 rapid requests
for i in {1..5}; do
  curl https://YOUR_APP.onrender.com/api/tokens?q=SOL
  echo "\n---\n"
done
```

### 4. Monitor Logs

**Render:**
- Dashboard → Your Service → "Logs" tab

**Railway:**
- Click your service → "Deployments" → View logs

---

## 📝 Update README with Live URL

After deployment, update your `README.md`:

```markdown
## 🌐 Live Demo

**API Endpoint:** `https://YOUR_APP.onrender.com/api/tokens?q=SOL`

**WebSocket:** Connect to `https://YOUR_APP.onrender.com`
```

---

## 🐛 Troubleshooting

### Issue: "Application failed to start"

**Solution:**
1. Check logs for errors
2. Verify `npm start` runs `node dist/server.js`
3. Ensure `npm run build` creates `dist/` folder

### Issue: "Cannot connect to Redis"

**Solution:**
1. Verify `REDIS_URL` environment variable is set
2. Check Redis Cloud is accessible (not IP-restricted)
3. Test connection locally first

### Issue: "Port already in use"

**Solution:**
- Use `process.env.PORT || 3000` in your code
- Hosting platforms assign ports automatically

### Issue: "WebSocket not connecting"

**Solution:**
1. Ensure CORS is enabled
2. Check WebSocket URL uses `https://` not `http://`
3. Verify Socket.io client version matches server

---

## 🎬 Recording Demo Video

### What to Show (1-2 minutes)

1. **API Call** (20 seconds)
   - Show curl command
   - Display JSON response
   - Highlight response time

2. **WebSocket Demo** (30 seconds)
   - Open 2-3 browser tabs with `index.html`
   - Show real-time updates in all tabs simultaneously

3. **Architecture Explanation** (40 seconds)
   - Show diagram
   - Explain: Client → API → Aggregator → Cache → External APIs

4. **Code Walkthrough** (30 seconds)
   - Show `aggregator.ts` merging logic
   - Explain caching strategy

### Tools for Recording

- **Windows**: OBS Studio (free)
- **Mac**: QuickTime or ScreenFlow
- **Online**: Loom (easiest)

### Upload to YouTube

1. Record video
2. Upload to YouTube (unlisted or public)
3. Add link to README

---

## ✅ Final Checklist

Before submitting:

- [ ] Code pushed to GitHub with clean commits
- [ ] Deployed to free hosting (Render/Railway)
- [ ] Public URL added to README
- [ ] Environment variables configured
- [ ] API tested and working
- [ ] WebSocket tested with multiple tabs
- [ ] Demo video recorded and uploaded
- [ ] Postman collection created
- [ ] Unit tests written (≥10 tests)
- [ ] README documentation complete

---

## 🎉 You're Done!

Your backend is now live and accessible from anywhere in the world! 🌍

**Next Steps:**
1. Share the URL with your interviewer
2. Monitor logs for any issues
3. Consider adding more features (rate limiting, authentication, etc.)
