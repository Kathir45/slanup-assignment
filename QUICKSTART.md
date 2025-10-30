# Quick Start Guide

Get the Mini Event Finder up and running in 3 minutes!

## Prerequisites
- Node.js v18+ installed
- npm or yarn

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm run dev
```

This command will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:3001

### 3. Open in Browser
Navigate to http://localhost:5173

That's it! You should see the event finder with sample events.

## What You Can Do

### View Events
- See all upcoming and past events
- View event details by clicking on any event card

### Create Events
1. Click "Create Event" button
2. Fill in the form:
   - Title (required)
   - Description (required)
   - Location (required)
   - Date & Time (required)
   - Max Participants (required)
3. Optionally enable location to add coordinates
4. Click "Create Event"

### Search & Filter
- Use the search bar to find events by title or description
- Use the location filter to filter by location
- Enable location to sort events by distance

### Join/Leave Events
1. Click on an event card to view details
2. Click "Join Event" to register (increments participants)
3. Click "Leave Event" to unregister (decrements participants)

## Testing the API

The backend API is available at http://localhost:3001/api

### Test Endpoints

**Get all events:**
```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:3001/api/events" | Select-Object -ExpandProperty Content

# Bash/Linux/Mac
curl http://localhost:3001/api/events
```

**Create an event:**
```bash
# Windows PowerShell
$body = @{
    title = "My Test Event"
    description = "Testing the API"
    location = "New York, NY"
    date = "2025-12-15T19:00:00Z"
    maxParticipants = 30
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/events" -Method POST -Body $body -ContentType "application/json"

# Bash/Linux/Mac
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Test Event",
    "description": "Testing the API",
    "location": "New York, NY",
    "date": "2025-12-15T19:00:00Z",
    "maxParticipants": 30
  }'
```

## Sample Data

The application comes with 3 sample events:
1. **Tech Meetup 2025** - San Francisco (Nov 15)
2. **Morning Yoga Session** - New York (Nov 5)
3. **Startup Pitch Night** - Austin (Nov 20)

## Troubleshooting

### Port Already in Use
If port 3001 or 5173 is already in use:
1. Stop the other application
2. Or change the port in:
   - Backend: `server/index.ts` (PORT variable)
   - Frontend: `vite.config.ts` (server.port)

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Not Starting
Check if TypeScript is compiling correctly:
```bash
npm run typecheck
```

### Frontend Not Connecting to Backend
1. Check if backend is running on port 3001
2. Check Vite proxy configuration in `vite.config.ts`
3. Check browser console for CORS errors

## Next Steps

- Read the full [README.md](./README.md) for detailed information
- Check [API_TESTING.md](./API_TESTING.md) for API endpoint documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options
- Review [FEATURES.md](./FEATURES.md) for feature checklist

## Development Tips

### Run Frontend Only
```bash
npm run dev:frontend
```

### Run Backend Only
```bash
npm run dev:backend
```

### Build for Production
```bash
npm run build
```

### Check for Linting Issues
```bash
npm run lint
```

### Type Check
```bash
npm run typecheck
```

## Project Structure Quick Reference

```
├── server/              # Backend Express server
├── src/
│   ├── components/      # React components
│   ├── services/        # API service layer
│   ├── types/          # TypeScript types
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
└── package.json        # Dependencies and scripts
```

Happy coding! 🚀
