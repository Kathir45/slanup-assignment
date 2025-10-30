# API Testing Guide

Test the API endpoints using curl, PowerShell, or any API client like Postman or Insomnia.

## PowerShell Commands

### 1. Health Check
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET | Select-Object -ExpandProperty Content
```

### 2. Get All Events
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/events" -Method GET | Select-Object -ExpandProperty Content
```

### 3. Get Events with Filter
```powershell
# Filter by location
Invoke-WebRequest -Uri "http://localhost:3001/api/events?location=San Francisco" -Method GET | Select-Object -ExpandProperty Content

# Search events
Invoke-WebRequest -Uri "http://localhost:3001/api/events?search=tech" -Method GET | Select-Object -ExpandProperty Content
```

### 4. Get Event by ID
```powershell
# Replace {id} with actual event ID from previous request
Invoke-WebRequest -Uri "http://localhost:3001/api/events/{id}" -Method GET | Select-Object -ExpandProperty Content
```

### 5. Create New Event
```powershell
$body = @{
    title = "Test Event"
    description = "This is a test event"
    location = "Test Location"
    date = "2025-12-01T18:00:00Z"
    maxParticipants = 25
    latitude = 40.7128
    longitude = -74.0060
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/events" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 6. Join Event
```powershell
# Replace {id} with actual event ID
Invoke-WebRequest -Uri "http://localhost:3001/api/events/{id}/join" -Method PATCH -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 7. Leave Event
```powershell
# Replace {id} with actual event ID
Invoke-WebRequest -Uri "http://localhost:3001/api/events/{id}/leave" -Method PATCH -ContentType "application/json" | Select-Object -ExpandProperty Content
```

## Bash/curl Commands

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```

### 2. Get All Events
```bash
curl http://localhost:3001/api/events
```

### 3. Get Events with Filter
```bash
# Filter by location
curl "http://localhost:3001/api/events?location=San Francisco"

# Search events
curl "http://localhost:3001/api/events?search=tech"
```

### 4. Get Event by ID
```bash
curl http://localhost:3001/api/events/{id}
```

### 5. Create New Event
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event",
    "location": "Test Location",
    "date": "2025-12-01T18:00:00Z",
    "maxParticipants": 25,
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

### 6. Join Event
```bash
curl -X PATCH http://localhost:3001/api/events/{id}/join \
  -H "Content-Type: application/json"
```

### 7. Leave Event
```bash
curl -X PATCH http://localhost:3001/api/events/{id}/leave \
  -H "Content-Type: application/json"
```

## Expected Responses

### Success Response (Create Event)
```json
{
  "id": "uuid-string",
  "title": "Test Event",
  "description": "This is a test event",
  "location": "Test Location",
  "date": "2025-12-01T18:00:00Z",
  "maxParticipants": 25,
  "currentParticipants": 0,
  "latitude": 40.7128,
  "longitude": -74.006,
  "createdAt": "2025-10-30T...",
  "updatedAt": "2025-10-30T..."
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Testing with Postman

1. Import the following collection or create requests manually
2. Set base URL: `http://localhost:3001/api`
3. Test each endpoint with various inputs
4. Validate error handling with invalid data

## Automated Testing

For automated testing, consider adding:
- Jest for unit tests
- Supertest for API integration tests
- Playwright or Cypress for E2E tests
