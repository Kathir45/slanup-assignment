# Event Ownership and Management Features

## Overview
Successfully implemented event ownership, creator management, and participant tracking to prevent duplicate joins.

## Backend Changes

### 1. Updated Event Model (`server/models/Event.ts`)
Added new fields to track ownership and participants:
```typescript
- creatorId: mongoose.Types.ObjectId (ref: 'User', required)
- participants: mongoose.Types.ObjectId[] (ref: 'User', default: [])
```

### 2. Updated Event Endpoints

#### POST /api/events (Protected)
- Now automatically sets `creatorId` to the authenticated user
- Initializes empty `participants` array

#### GET /api/events & GET /api/events/:id
- Returns `creatorId` and `participants` array in response
- Transforms ObjectIds to strings for frontend consumption

#### PATCH /api/events/:id/join (Now Protected)
- Requires authentication
- **Prevents duplicate joins**: Checks if user is already in participants array
- Adds user to participants array
- Updates `currentParticipants` count automatically
- Returns error "You have already joined this event" if already joined

#### PATCH /api/events/:id/leave (Now Protected)
- Requires authentication
- Verifies user is actually a participant before allowing leave
- Removes user from participants array
- Updates `currentParticipants` count automatically
- Returns error "You are not a participant of this event" if not joined

#### PUT /api/events/:id (New - Protected)
**Creator-Only Endpoint**
- Allows event creator to update event details
- Validates creator ownership (403 error if not creator)
- Prevents reducing maxParticipants below current participants count
- Updates: title, description, location, date, maxParticipants, coordinates
- Returns error "You are not authorized to update this event" for non-creators

#### DELETE /api/events/:id (New - Protected)
**Creator-Only Endpoint**
- Allows event creator to delete their event
- Validates creator ownership (403 error if not creator)
- Removes event from database
- Returns error "You are not authorized to delete this event" for non-creators

### 3. Authorization Checks
- Creator verification: `event.creatorId.toString() === userId`
- Participant verification: `event.participants.some(p => p.toString() === userId)`
- Duplicate join prevention: Check before adding to participants array

## Frontend Changes

### 1. Updated Type Definitions (`src/types/database.types.ts`)
```typescript
export interface Event {
  // ... existing fields
  creatorId: string | null;
  participants: string[];
}
```

### 2. Updated Event Service (`src/services/eventService.ts`)
Added new methods:
- `updateEvent(id, data)`: PUT request to update event
- `deleteEvent(id)`: DELETE request to remove event
- Updated `joinEvent()` and `leaveEvent()` to include auth headers

### 3. Enhanced EventCard Component (`src/components/EventCard.tsx`)
**New Props:**
- `currentUserId?: string | null`

**Visual Indicators:**
- 🟡 **Creator Badge**: Shows "Creator" badge with crown icon for event owner
- 🔵 **Joined Badge**: Shows "Joined" badge with checkmark for participants
- Badges appear next to event title

### 4. Enhanced EventModal Component (`src/components/EventModal.tsx`)
**New Props:**
- `currentUserId?: string | null`
- `onEdit?: (event: Event) => void`
- `onDelete?: (eventId: string) => Promise<void>`

**Conditional Rendering:**

**For Creators:**
- Shows "Edit Event" button (blue gradient)
- Shows "Delete Event" button (red border)
- Hides join/leave buttons
- Shows "You Created This Event" badge in header

**For Participants:**
- Shows "Join Event" button
  - Displays "Already Joined" with checkmark if user joined
  - Disabled if already joined, full, or past event
- Shows "Leave Event" button
  - Only enabled if user has joined
- Shows "You Joined This Event" badge in header if joined

**Delete Confirmation:**
- Shows confirmation dialog before deletion
- Message: "Are you sure you want to delete this event? This action cannot be undone."

### 5. New EditEventModal Component (`src/components/EditEventModal.tsx`)
**Features:**
- Pre-populated form with current event data
- All fields editable except currentParticipants
- Auto-geocoding for location changes (800ms debounce)
- Validation: maxParticipants cannot be less than currentParticipants
- Shows current participant count as information
- Save button with loading state
- Cancel button to close without saving

**Editable Fields:**
- Title (max 200 chars)
- Description (max 2000 chars, textarea)
- Location (with auto-geocoding)
- Date & Time (datetime-local input)
- Maximum Participants (min: current participants, max: 10000)
- Coordinates (auto-updated via geocoding)

### 6. Updated App Component (`src/App.tsx`)
**New State:**
- `editingEvent: Event | null` - Tracks event being edited

**New Handlers:**
- `handleUpdateEvent(eventId, data)`: Updates event and refreshes state
- `handleDeleteEvent(eventId)`: Deletes event and removes from list

**Component Updates:**
- Pass `currentUserId={user?.id}` to all EventCard components
- Pass `currentUserId={user?.id}` to EventModal
- Pass `onEdit` and `onDelete` handlers to EventModal
- Render EditEventModal when `editingEvent` is set

## User Experience Flow

### Creating an Event
1. User clicks "Create Event"
2. Fills out event form
3. Event is created with user as creator
4. "Creator" badge appears on their event cards

### Editing an Event (Creator Only)
1. Creator opens their event
2. Sees "Edit Event" and "Delete Event" buttons
3. Clicks "Edit Event"
4. EditEventModal opens with pre-filled data
5. Makes changes and clicks "Save Changes"
6. Event updates across all views

### Deleting an Event (Creator Only)
1. Creator opens their event
2. Clicks "Delete Event"
3. Confirmation dialog appears
4. Confirms deletion
5. Event removed from database and UI

### Joining an Event (First Time)
1. User opens an event they haven't joined
2. Sees "Join Event" button (enabled)
3. Clicks "Join Event"
4. Added to participants list
5. "Joined" badge appears on event card
6. Button changes to "Already Joined" (disabled)

### Attempting to Join Again
1. User opens an event they've already joined
2. Sees "Already Joined" button (disabled)
3. Cannot join again
4. Backend also prevents duplicate joins with error message

### Leaving an Event
1. User opens an event they've joined
2. Sees "Leave Event" button (enabled)
3. Clicks "Leave Event"
4. Removed from participants list
5. "Joined" badge disappears
6. Can join again if space available

## Security Features

### Authorization
✅ **Creator Verification**: Only event creator can edit/delete
✅ **Authentication Required**: All join/leave/edit/delete operations require login
✅ **Token Validation**: JWT token verified for all protected endpoints

### Data Integrity
✅ **Duplicate Prevention**: Cannot join same event twice
✅ **Participant Tracking**: Accurate count based on participants array
✅ **Capacity Enforcement**: Cannot reduce max below current participants
✅ **Ownership Validation**: Server-side creator checks prevent unauthorized modifications

### Error Handling
- ✅ Clear error messages for unauthorized actions
- ✅ Validation on both client and server
- ✅ Confirmation dialogs for destructive actions
- ✅ Loading states during operations

## Database Schema Updates

### Events Collection
```javascript
{
  // ... existing fields
  creatorId: ObjectId (ref: 'User', required)
  participants: [ObjectId] (ref: 'User', default: [])
  currentParticipants: Number (auto-updated from participants.length)
}
```

**Note**: Existing events in database won't have `creatorId` and will need migration or deletion.

## API Response Format

### Event Object (Updated)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Tech Meetup 2025",
  "description": "Join us for networking",
  "location": "San Francisco, CA",
  "date": "2025-11-15T18:00:00.000Z",
  "maxParticipants": 50,
  "currentParticipants": 5,
  "latitude": 37.7749,
  "longitude": -122.4194,
  "creatorId": "507f1f77bcf86cd799439012",
  "participants": [
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439014",
    "507f1f77bcf86cd799439015"
  ],
  "createdAt": "2025-10-30T10:00:00.000Z",
  "updatedAt": "2025-10-30T12:00:00.000Z"
}
```

## Testing Checklist

### Event Creation
- ✅ Create event while logged in
- ✅ Event has correct creatorId
- ✅ Creator badge appears on event card
- ✅ Creator sees edit/delete buttons

### Event Editing
- ✅ Creator can edit their event
- ✅ Non-creator cannot edit (buttons hidden)
- ✅ Changes reflect immediately
- ✅ Cannot reduce max below current participants

### Event Deletion
- ✅ Creator can delete their event
- ✅ Confirmation dialog appears
- ✅ Event removed from all views
- ✅ Non-creator cannot delete

### Joining Events
- ✅ User can join available events
- ✅ "Joined" badge appears after joining
- ✅ Cannot join same event twice (UI prevents)
- ✅ Backend prevents duplicate joins with error
- ✅ Participant count increases correctly

### Leaving Events
- ✅ User can leave joined events
- ✅ "Joined" badge disappears
- ✅ Cannot leave event not joined
- ✅ Participant count decreases correctly
- ✅ Can rejoin after leaving

### Authorization
- ✅ Only creator sees edit/delete options
- ✅ API returns 403 for unauthorized edit/delete
- ✅ Join/leave require authentication (401 without token)

## Known Considerations

### Database Migration
⚠️ **Important**: Existing events in the database don't have `creatorId` field. Options:
1. Delete all existing events and let users create new ones
2. Migrate existing events to a default user account
3. Mark old events with a special "system" creator

For development, clearing old events is recommended:
```javascript
// In MongoDB shell or Compass
db.events.deleteMany({})
```

### Participant Synchronization
- `currentParticipants` is automatically calculated from `participants.length`
- This ensures accuracy but means old manual counts are replaced
- Join/leave operations now update the participants array, not just the count

## Summary

The application now supports full event ownership and management:
- **Creators** can edit and delete their events
- **Participants** can join events only once
- **Everyone** can see who created events via badges
- **Security** enforced at both UI and API levels
- **User experience** clear with visual indicators and confirmation dialogs

All features are production-ready with proper error handling, validation, and user feedback! 🎉
