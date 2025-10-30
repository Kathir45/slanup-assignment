# Migration from Supabase to REST API

This project was originally built with Supabase as the backend. It has now been converted to use a Node.js + Express backend with in-memory storage to meet the assignment requirements.

## What Changed

### Removed
- ❌ Supabase client (`@supabase/supabase-js`)
- ❌ `src/lib/supabase.ts` - Supabase configuration
- ❌ `supabase/` directory - Database migrations (can be safely deleted)
- ❌ Environment variables for Supabase

### Added
- ✅ Express server (`server/index.ts`)
- ✅ In-memory data storage
- ✅ REST API endpoints
- ✅ TypeScript backend
- ✅ CORS configuration
- ✅ Concurrently for running both servers

### Modified
- 🔄 `src/services/eventService.ts` - Now uses fetch instead of Supabase client
- 🔄 `src/types/database.types.ts` - Simplified types for REST API
- 🔄 `package.json` - Added backend dependencies and scripts
- 🔄 `vite.config.ts` - Added proxy configuration

## API Endpoint Mapping

| Supabase Operation | REST API Endpoint |
|-------------------|-------------------|
| `supabase.from('events').insert()` | `POST /api/events` |
| `supabase.from('events').select()` | `GET /api/events` |
| `supabase.from('events').select().eq('id', id)` | `GET /api/events/:id` |
| `supabase.from('events').update()` | `PATCH /api/events/:id/join` or `/leave` |

## Type Changes

### Before (Supabase)
```typescript
export type Event = Database['public']['Tables']['events']['Row'];
// Fields used snake_case: max_participants, current_participants
```

### After (REST API)
```typescript
export interface Event {
  id: string;
  title: string;
  // ... fields use camelCase: maxParticipants, currentParticipants
}
```

## Data Storage

### Before
- PostgreSQL database hosted by Supabase
- Persistent storage
- Required authentication

### After
- In-memory JavaScript array
- Data resets on server restart
- No authentication required

## Benefits of the Change

1. **Simpler Setup** - No external services or accounts needed
2. **Faster Development** - Everything runs locally
3. **More Control** - Full control over API behavior
4. **Assignment Compliance** - Meets the specific requirements
5. **Learning** - Better understanding of building REST APIs

## Future: Adding a Real Database

When you're ready to add persistent storage:

### Option 1: MongoDB
```bash
npm install mongodb mongoose
```

### Option 2: PostgreSQL
```bash
npm install pg
# or with ORM
npm install prisma @prisma/client
```

### Option 3: SQLite (Simplest)
```bash
npm install better-sqlite3
```

## Cleanup Steps

You can safely remove:
```bash
# Remove Supabase dependency
npm uninstall @supabase/supabase-js

# Remove Supabase folder
rm -rf supabase/

# Remove .env file if it only contained Supabase keys
# But keep it if you want to add other environment variables
```

## Rollback to Supabase (if needed)

If you want to go back to Supabase:
1. Reinstall: `npm install @supabase/supabase-js`
2. Restore `src/lib/supabase.ts`
3. Revert `src/services/eventService.ts` from git history
4. Revert `src/types/database.types.ts` from git history
5. Set up Supabase project and add env variables

## Notes

The in-memory storage is perfect for:
- ✅ Development and testing
- ✅ Prototypes and demos
- ✅ Interview assignments
- ✅ Learning REST APIs

But NOT suitable for:
- ❌ Production applications
- ❌ Data that needs to persist
- ❌ Multiple server instances
- ❌ High traffic scenarios

For production, replace the in-memory array with a proper database solution.
