import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectDatabase } from './database';
import { Event } from './models/Event';
import { User } from './models/User';
import { authMiddleware, optionalAuth, AuthRequest } from './middleware/auth';
import { setupSocketIO } from './socket';
import { calculateDistance } from './utils/geolocation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Seed database with sample data if empty
async function seedDatabase() {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('📝 Seeding database with sample events across multiple locations...');
      
      // Get first user as creator, or create a default one
      let defaultCreator = await User.findOne();
      if (!defaultCreator) {
        defaultCreator = await User.create({
          name: 'Event Organizer',
          email: 'organizer@example.com',
          password: '$2a$10$1234567890123456789012' // Pre-hashed placeholder
        });
      }

      await Event.insertMany([
        {
          title: 'Tech Meetup 2025',
          description: 'Join us for an evening of networking and tech talks featuring industry leaders and innovators.',
          location: 'San Francisco, CA',
          date: new Date('2025-11-15T18:00:00Z'),
          maxParticipants: 50,
          currentParticipants: 0,
          latitude: 37.7749,
          longitude: -122.4194,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Morning Yoga in the Park',
          description: 'Start your day with a refreshing yoga class in the heart of Central Park. All levels welcome!',
          location: 'Central Park, New York, NY',
          date: new Date('2025-11-05T08:00:00Z'),
          maxParticipants: 20,
          currentParticipants: 0,
          latitude: 40.785091,
          longitude: -73.968285,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Startup Pitch Night',
          description: 'Watch innovative startups pitch their ideas to investors and the tech community.',
          location: 'Austin, TX',
          date: new Date('2025-11-20T19:00:00Z'),
          maxParticipants: 100,
          currentParticipants: 0,
          latitude: 30.2672,
          longitude: -97.7431,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Coffee & Code',
          description: 'Casual coding session with local developers. Bring your laptop and projects!',
          location: 'Seattle, WA',
          date: new Date('2025-11-08T10:00:00Z'),
          maxParticipants: 30,
          currentParticipants: 0,
          latitude: 47.6062,
          longitude: -122.3321,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Beach Volleyball Tournament',
          description: 'Annual beach volleyball tournament. Teams of 4, all skill levels welcome!',
          location: 'Santa Monica Beach, CA',
          date: new Date('2025-11-12T14:00:00Z'),
          maxParticipants: 40,
          currentParticipants: 0,
          latitude: 34.0195,
          longitude: -118.4912,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Photography Walk',
          description: 'Explore the city through your lens with fellow photography enthusiasts.',
          location: 'Boston, MA',
          date: new Date('2025-11-10T09:00:00Z'),
          maxParticipants: 15,
          currentParticipants: 0,
          latitude: 42.3601,
          longitude: -71.0589,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Indie Game Dev Meetup',
          description: 'Monthly gathering for indie game developers to share progress and get feedback.',
          location: 'Portland, OR',
          date: new Date('2025-11-18T18:30:00Z'),
          maxParticipants: 25,
          currentParticipants: 0,
          latitude: 45.5152,
          longitude: -122.6784,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Rock Climbing Beginner Session',
          description: 'Learn the basics of indoor rock climbing with certified instructors.',
          location: 'Denver, CO',
          date: new Date('2025-11-09T16:00:00Z'),
          maxParticipants: 12,
          currentParticipants: 0,
          latitude: 39.7392,
          longitude: -104.9903,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Book Club: Tech & Society',
          description: 'Monthly book club discussing the intersection of technology and society.',
          location: 'Chicago, IL',
          date: new Date('2025-11-14T19:00:00Z'),
          maxParticipants: 20,
          currentParticipants: 0,
          latitude: 41.8781,
          longitude: -87.6298,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Salsa Dancing Night',
          description: 'Learn salsa dancing or practice your moves! No partner required.',
          location: 'Miami, FL',
          date: new Date('2025-11-16T20:00:00Z'),
          maxParticipants: 60,
          currentParticipants: 0,
          latitude: 25.7617,
          longitude: -80.1918,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Farmers Market Meetup',
          description: 'Explore the local farmers market and grab brunch together afterwards.',
          location: 'Nashville, TN',
          date: new Date('2025-11-06T08:30:00Z'),
          maxParticipants: 15,
          currentParticipants: 0,
          latitude: 36.1627,
          longitude: -86.7816,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'AI & Machine Learning Workshop',
          description: 'Hands-on workshop covering the latest in AI and ML technologies.',
          location: 'Palo Alto, CA',
          date: new Date('2025-11-22T13:00:00Z'),
          maxParticipants: 40,
          currentParticipants: 0,
          latitude: 37.4419,
          longitude: -122.1430,
          creatorId: defaultCreator._id,
          participants: [],
        },
        {
          title: 'Hiking Adventure: Mountain Trail',
          description: '5-mile moderate hike through scenic mountain trails. Bring water and snacks!',
          location: 'Boulder, CO',
          date: new Date('2025-11-11T07:00:00Z'),
          maxParticipants: 25,
          currentParticipants: 0,
          latitude: 40.0150,
          longitude: -105.2705,
          creatorId: defaultCreator._id,
          participants: [],
        },
      ]);
      console.log('✅ 13 sample events created across multiple locations');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// API Routes

// ============================================
// Authentication Endpoints
// ============================================

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post(
  '/api/auth/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new user (password will be hashed in pre-save hook)
      const user = new User({
        email,
        password,
        name,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: String(user._id), email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      res.status(201).json({
        token,
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

/**
 * POST /api/auth/login
 * Login with email and password
 */
app.post(
  '/api/auth/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user (include password field)
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: String(user._id), email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      res.json({
        token,
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user (protected route)
 */
app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: String(user._id),
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ============================================
// Event Endpoints
// ============================================

/**
 * GET /api/events
 * Get all events with optional location filter
 */
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const { location, search } = req.query;
    const query: any = {};

    // Filter by location if provided
    if (location && typeof location === 'string') {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by search query if provided (text search)
    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch events and sort by date (upcoming first)
    const events = await Event.find(query).sort({ date: 1 }).lean();

    // Transform to match frontend expectations
    const transformedEvents = events.map((event: any) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.toISOString(),
      maxParticipants: event.maxParticipants,
      currentParticipants: event.currentParticipants,
      latitude: event.latitude,
      longitude: event.longitude,
      creatorId: event.creatorId?.toString() || null,
      participants: event.participants?.map((p: any) => p.toString()) || [],
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));

    res.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

/**
 * GET /api/events/nearby
 * Get events within a specified radius of a location
 * Query params: lat, lng, radius (in km, default 10km)
 * NOTE: This route must come BEFORE /api/events/:id to avoid "nearby" being treated as an ID
 */
app.get('/api/events/nearby', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = '10' } = req.query;

    // Validate required parameters
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Missing required parameters: lat and lng' 
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string);

    // Validate numeric values
    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
      return res.status(400).json({ 
        error: 'Invalid parameters: lat, lng, and radius must be valid numbers' 
      });
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ 
        error: 'Invalid latitude: must be between -90 and 90' 
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        error: 'Invalid longitude: must be between -180 and 180' 
      });
    }

    if (radiusKm < 0 || radiusKm > 500) {
      return res.status(400).json({ 
        error: 'Invalid radius: must be between 0 and 500 km' 
      });
    }

    // Get all events with coordinates
    const events = await Event.find({
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).lean();

    // Calculate distances and filter by radius
    const eventsWithDistance = events
      .map((event) => {
        const distance = calculateDistance(
          { latitude, longitude },
          { latitude: event.latitude!, longitude: event.longitude! }
        );

        return {
          id: event._id.toString(),
          title: event.title,
          description: event.description,
          location: event.location,
          date: event.date.toISOString(),
          maxParticipants: event.maxParticipants,
          currentParticipants: event.currentParticipants,
          latitude: event.latitude,
          longitude: event.longitude,
          creatorId: event.creatorId?.toString() || null,
          participants: (event.participants || []).map((p: any) => p?.toString()).filter(Boolean),
          distance, // Distance in km
          createdAt: event.createdAt.toISOString(),
          updatedAt: event.updatedAt.toISOString(),
        };
      })
      .filter((event) => event.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    res.json({
      location: { latitude, longitude },
      radius: radiusKm,
      count: eventsWithDistance.length,
      events: eventsWithDistance,
    });
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    res.status(500).json({ error: 'Failed to fetch nearby events' });
  }
});

/**
 * GET /api/events/:id
 * Get a specific event by ID
 */
app.get('/api/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).lean();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Transform to match frontend expectations
    const transformedEvent = {
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.toISOString(),
      maxParticipants: event.maxParticipants,
      currentParticipants: event.currentParticipants,
      latitude: event.latitude,
      longitude: event.longitude,
      creatorId: (event as any).creatorId?.toString() || null,
      participants: ((event as any).participants || []).map((p: any) => p.toString()),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };

    res.json(transformedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

/**
 * POST /api/events
 * Create a new event (protected route - requires authentication)
 */
app.post('/api/events', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      date,
      maxParticipants,
      latitude,
      longitude,
    } = req.body;

    // Validation
    if (!title || !description || !location || !date || !maxParticipants) {
      return res.status(400).json({
        error: 'Missing required fields: title, description, location, date, maxParticipants',
      });
    }

    if (maxParticipants <= 0) {
      return res.status(400).json({
        error: 'maxParticipants must be greater than 0',
      });
    }

    // Create new event with creator
    const newEvent = new Event({
      title,
      description,
      location,
      date: new Date(date),
      maxParticipants: Number(maxParticipants),
      currentParticipants: 0,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      creatorId: req.userId,
      participants: [],
    });

    await newEvent.save();

    // Transform to match frontend expectations
    const transformedEvent = {
      id: (newEvent._id as any).toString(),
      title: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      date: newEvent.date.toISOString(),
      maxParticipants: newEvent.maxParticipants,
      currentParticipants: newEvent.currentParticipants,
      latitude: newEvent.latitude,
      longitude: newEvent.longitude,
      creatorId: String(newEvent.creatorId),
      participants: newEvent.participants.map(p => String(p)),
      createdAt: newEvent.createdAt.toISOString(),
      updatedAt: newEvent.updatedAt.toISOString(),
    };

    res.status(201).json(transformedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

/**
 * PATCH /api/events/:id/join
 * Join an event (requires authentication)
 */
app.patch('/api/events/:id/join', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is already a participant
    if (event.participants.some(p => p.toString() === userId)) {
      return res.status(400).json({ error: 'You have already joined this event' });
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ error: 'Event is full' });
    }

    // Add user to participants array
    event.participants.push(new mongoose.Types.ObjectId(userId));
    event.currentParticipants = event.participants.length;
    await event.save();

    // Transform to match frontend expectations
    const transformedEvent = {
      id: (event._id as any).toString(),
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.toISOString(),
      maxParticipants: event.maxParticipants,
      currentParticipants: event.currentParticipants,
      latitude: event.latitude,
      longitude: event.longitude,
      creatorId: String(event.creatorId),
      participants: event.participants.map(p => String(p)),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };

    res.json(transformedEvent);
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ error: 'Failed to join event' });
  }
});

/**
 * PATCH /api/events/:id/leave
 * Leave an event (requires authentication)
 */
app.patch('/api/events/:id/leave', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is a participant
    const participantIndex = event.participants.findIndex(p => p.toString() === userId);
    if (participantIndex === -1) {
      return res.status(400).json({ error: 'You are not a participant of this event' });
    }

    // Remove user from participants array
    event.participants.splice(participantIndex, 1);
    event.currentParticipants = event.participants.length;
    await event.save();

    // Transform to match frontend expectations
    const transformedEvent = {
      id: (event._id as any).toString(),
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.toISOString(),
      maxParticipants: event.maxParticipants,
      currentParticipants: event.currentParticipants,
      latitude: event.latitude,
      longitude: event.longitude,
      creatorId: String(event.creatorId),
      participants: event.participants.map(p => String(p)),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };

    res.json(transformedEvent);
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json({ error: 'Failed to leave event' });
  }
});

/**
 * PUT /api/events/:id
 * Update an event (creator only)
 */
app.put('/api/events/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const {
      title,
      description,
      location,
      date,
      maxParticipants,
      latitude,
      longitude,
    } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the creator
    if (event.creatorId.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this event' });
    }

    // Update fields if provided
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (location !== undefined) event.location = location;
    if (date !== undefined) event.date = new Date(date);
    if (maxParticipants !== undefined) {
      // Ensure new max is not less than current participants
      if (Number(maxParticipants) < event.currentParticipants) {
        return res.status(400).json({ 
          error: `Cannot set max participants to ${maxParticipants}. Current participants: ${event.currentParticipants}` 
        });
      }
      event.maxParticipants = Number(maxParticipants);
    }
    if (latitude !== undefined) event.latitude = latitude ? Number(latitude) : null;
    if (longitude !== undefined) event.longitude = longitude ? Number(longitude) : null;

    await event.save();

    // Transform to match frontend expectations
    const transformedEvent = {
      id: String(event._id),
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.toISOString(),
      maxParticipants: event.maxParticipants,
      currentParticipants: event.currentParticipants,
      latitude: event.latitude,
      longitude: event.longitude,
      creatorId: String(event.creatorId),
      participants: event.participants.map(p => String(p)),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };

    res.json(transformedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

/**
 * DELETE /api/events/:id
 * Delete an event (creator only)
 */
app.delete('/api/events/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the creator
    if (event.creatorId.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(id);

    res.json({ message: 'Event deleted successfully', id });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Seed database with sample data
    await seedDatabase();
    
    // Setup Socket.IO
    setupSocketIO(httpServer);
    
    // Start HTTP server (with Socket.IO)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📍 API available at http://localhost:${PORT}/api`);
      console.log(`💬 WebSocket available at ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
