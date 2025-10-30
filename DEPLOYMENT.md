# Deployment Guide

This guide covers deploying both the frontend and backend of the Mini Event Finder application.

## Option 1: Vercel (Recommended for Full-Stack)

Vercel can host both your frontend and serverless backend functions.

### Steps:

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

The `vercel.json` configuration is already set up to handle both frontend and backend routes.

### Configuration:
- Frontend will be available at the root URL
- Backend API will be available at `/api/*`

## Option 2: Separate Deployments

### Frontend Deployment

#### Vercel
1. Build the frontend:
```bash
npm run build:frontend
```

2. Deploy the `dist` folder to Vercel:
```bash
vercel --prod
```

#### Netlify
1. Build the frontend:
```bash
npm run build:frontend
```

2. Deploy using Netlify CLI:
```bash
netlify deploy --prod --dir=dist
```

Or connect your GitHub repository to Netlify and configure:
- Build command: `npm run build:frontend`
- Publish directory: `dist`

### Backend Deployment

#### Render
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install && npm run build:backend`
   - **Start Command**: `node server/dist/index.js`
   - **Environment**: Node

#### Railway
1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-detect Node.js
4. Add start command in railway.json or use: `node server/dist/index.js`

#### Fly.io
1. Install Fly CLI and login
2. Create a `fly.toml` in the root:
```toml
app = "mini-event-finder-api"

[build]
  [build.args]
    NODE_VERSION = "18"

[[services]]
  internal_port = 3001
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

3. Deploy:
```bash
fly deploy
```

## Environment Variables

### Frontend
Update the API base URL in `src/services/eventService.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

Add to `.env` (for local development):
```
VITE_API_URL=http://localhost:3001/api
```

Add to `.env.production`:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend
Add to your hosting platform:
```
PORT=3001
```

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Can view list of events
- [ ] Can create new events
- [ ] Can view event details
- [ ] Search and filter work
- [ ] API endpoints respond correctly
- [ ] CORS is configured properly
- [ ] Error handling works

## Monitoring

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage tracking

## Scaling Considerations

For production use with many users:
1. Replace in-memory storage with a real database (PostgreSQL, MongoDB)
2. Add authentication and authorization
3. Implement rate limiting
4. Add caching layer (Redis)
5. Use a CDN for static assets
6. Enable HTTPS everywhere
