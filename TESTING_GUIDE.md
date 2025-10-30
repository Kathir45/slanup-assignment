# Authentication System Testing Guide

## Prerequisites
- Backend server running on http://localhost:3001
- Frontend running on http://localhost:5173
- MongoDB running and connected

## Manual Testing Steps

### 1. Initial Load
1. Open http://localhost:5173 in your browser
2. ✅ You should see the **Login Form** (not the events dashboard)
3. ✅ Form should have email and password fields
4. ✅ Should have a "Sign up" link at the bottom

### 2. Test Registration
1. Click "Sign up" to switch to registration form
2. ✅ Form should show name, email, password, and confirm password fields
3. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Create Account"
5. ✅ After successful registration:
   - You should be automatically logged in
   - Redirected to the events dashboard
   - See your name in the header ("Test User")
   - See a "Logout" button

### 3. Test Logout
1. Click the "Logout" button in the header
2. ✅ You should be redirected back to the login form
3. ✅ You should no longer see the events dashboard

### 4. Test Login
1. On the login form, enter:
   - Email: `test@example.com`
   - Password: `password123`
2. Click "Sign In"
3. ✅ You should be logged in and see the events dashboard
4. ✅ Your name should appear in the header

### 5. Test Token Persistence
1. While logged in, refresh the page (F5 or Ctrl+R)
2. ✅ You should remain logged in
3. ✅ Events dashboard should still be visible
4. ✅ Your name should still appear in the header

### 6. Test Invalid Login
1. Logout
2. Try to login with wrong credentials:
   - Email: `test@example.com`
   - Password: `wrongpassword`
3. Click "Sign In"
4. ✅ Should show error message: "Invalid credentials"
5. ✅ Should NOT be logged in

### 7. Test Duplicate Registration
1. Click "Sign up" to go to registration
2. Try to register with existing email:
   - Name: `Another User`
   - Email: `test@example.com` (already exists)
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Account"
4. ✅ Should show error message: "Email already registered"

### 8. Test Password Validation
1. On registration form, try:
   - Name: `New User`
   - Email: `new@example.com`
   - Password: `123` (too short)
   - Confirm Password: `123`
5. ✅ HTML5 validation should prevent submission (min 6 characters)

### 9. Test Password Mismatch
1. On registration form:
   - Name: `New User`
   - Email: `new@example.com`
   - Password: `password123`
   - Confirm Password: `password456` (different)
2. Click "Create Account"
3. ✅ Should show error: "Passwords do not match"

### 10. Test Protected Event Creation
1. Login with valid credentials
2. Click "Create Event" button
3. Fill in event details:
   - Title: `My Test Event`
   - Description: `Testing authentication`
   - Location: `New York`
   - Date: (future date)
   - Max Participants: `20`
4. Click "Create Event"
5. ✅ Event should be created successfully
6. ✅ New event should appear in the list

### 11. Test Protected API Endpoint
1. Open browser DevTools (F12)
2. Go to Network tab
3. While logged in, click "Create Event"
4. Check the request to `POST /api/events`
5. ✅ Request Headers should include: `Authorization: Bearer <token>`

### 12. Test Unauthorized Access (Advanced)
1. Logout from the app
2. Open browser DevTools Console
3. Try to create an event without authentication:
```javascript
fetch('http://localhost:3001/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Unauthorized Event',
    description: 'Should fail',
    location: 'Test',
    date: new Date().toISOString(),
    maxParticipants: 10
  })
}).then(r => r.json()).then(console.log)
```
4. ✅ Should return error: `{"error": "No token provided"}`
5. ✅ Status code should be 401

## API Testing with cURL/Postman

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "testpass123"
  }'
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "apitest@example.com",
    "name": "API Test User"
  }
}
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "testpass123"
  }'
```

### Get Current User (Protected)
```bash
# Replace <TOKEN> with the token from login/register response
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### Create Event (Protected)
```bash
# Replace <TOKEN> with your JWT token
curl -X POST http://localhost:3001/api/events \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Created Event",
    "description": "Created via API with auth",
    "location": "San Francisco",
    "date": "2025-12-01T18:00:00Z",
    "maxParticipants": 30,
    "latitude": 37.7749,
    "longitude": -122.4194
  }'
```

## Browser DevTools Checks

### Check localStorage for Token
1. Open DevTools (F12)
2. Go to Application/Storage tab
3. Expand "Local Storage"
4. Click on `http://localhost:5173`
5. ✅ You should see `auth_token` key with JWT value

### Check Token Contents (JWT Decoder)
1. Copy the token from localStorage
2. Go to https://jwt.io
3. Paste the token in the "Encoded" section
4. ✅ Payload should show:
   - `userId`: Your user ID
   - `email`: Your email
   - `iat`: Issued at timestamp
   - `exp`: Expiration timestamp

## Expected Results Summary

✅ **Registration**: Creates user, returns token, auto-logs in  
✅ **Login**: Verifies credentials, returns token, shows dashboard  
✅ **Logout**: Clears token, redirects to login  
✅ **Token Persistence**: Token survives page refresh  
✅ **Protected Routes**: Event creation requires authentication  
✅ **Error Handling**: Clear error messages for validation failures  
✅ **Password Security**: Passwords are hashed, never sent in responses  
✅ **Token Authorization**: JWT token included in protected requests  

## Common Issues & Solutions

### Issue: "No token provided" error
**Solution**: Make sure you're logged in and the token is in localStorage

### Issue: "Token expired" error
**Solution**: Login again to get a new token (tokens expire after 7 days)

### Issue: Can't register - "Email already registered"
**Solution**: Use a different email or login with existing credentials

### Issue: Page shows blank/loading forever
**Solution**: Check browser console for errors, ensure backend is running

### Issue: MongoDB connection error
**Solution**: Ensure MongoDB is running on localhost:27017

## Security Verification

✅ **Password Hashing**: 
- Check MongoDB database directly
- Passwords should be bcrypt hashes (starting with `$2b$`)
- Never plain text

✅ **Token Expiration**:
- JWT tokens expire after 7 days (configurable)
- Expired tokens are rejected with 401 error

✅ **Input Validation**:
- Invalid emails are rejected
- Short passwords are rejected
- SQL injection attempts are blocked by Mongoose

## Testing Complete! 🎉

If all tests pass, your authentication system is working correctly and securely!
