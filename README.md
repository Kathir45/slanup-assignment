# 🎯 Mini Event Finder - Full Stack Event Discovery Platform

> **Slanup Full Stack Development Internship Assignment**

A comprehensive, production-ready event discovery and management application featuring real-time chat, interactive maps, geospatial search, and robust authentication. Built with modern technologies and best practices.

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Features Overview](#-features-overview)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Bonus Features](#-bonus-features-implemented)

---

## ✨ Features Overview

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based authentication system
- **Password Hashing** - bcrypt encryption with 10 salt rounds
- **Protected Routes** - Server-side middleware & client-side route guards
- **Session Management** - Automatic token refresh and validation
- **Secure HTTP-only** - Token storage in localStorage with secure handling
- **User Registration** - Email validation and duplicate prevention
- **Login System** - Email/password authentication with error handling
- **Auto-logout** - Session timeout and manual logout functionality
- **User Profile** - Display current user information

### 🗺️ Interactive Maps & Geolocation
- **Leaflet Integration** - Interactive map visualization with OpenStreetMap
- **Nearby Events Search** - Find events within customizable radius (1-100km)
- **Real-time Geolocation** - Browser GPS integration with fallback
- **Custom Markers** - Red markers for events, blue for user location
- **Interactive Popups** - Rich event details on marker click
- **Distance Calculation** - Haversine formula for accurate geo-distances
- **Radius Visualization** - Dynamic circle overlay showing search area
- **Map/List Toggle** - Switch between map and list views seamlessly
- **Current Location Button** - Quick navigation to user's position
- **Geospatial Indexing** - MongoDB 2dsphere indexes for efficient queries
- **Auto-centering** - Map automatically centers on user location
- **Responsive Map Controls** - Touch-friendly zoom and pan
- **Distance Badges** - Shows distance to each event in km/m

### 💬 Real-time Chat System
- **Socket.IO Integration** - WebSocket-based real-time communication
- **Event-based Chat Rooms** - Separate chat for each event
- **Message Persistence** - Last 20 messages saved in MongoDB
- **Typing Indicators** - See when others are typing in real-time
- **Read Receipts** - Track message read status by users
- **User Presence** - Online/offline status for participants
- **Auto-scrolling** - Automatic scroll to latest messages
- **Message History** - Load previous messages on joining
- **Timestamp Display** - Relative time formatting (just now, 2m ago, etc.)
- **Username Display** - Show sender name with each message
- **Connection Status** - Visual indicators for connection state
- **Reconnection Logic** - Automatic reconnection on disconnect
- **Room Management** - Join/leave rooms automatically
- **Message Validation** - Empty message prevention
- **Chat Tab UI** - Seamless integration with event modal

### 🎯 Event Management
- **Create Events** - Full event creation with rich form validation
- **Event Details Modal** - Comprehensive view with all event information
- **Join/Leave Events** - One-click participation management
- **Capacity Tracking** - Real-time participant count updates
- **Event Filtering** - Multiple filter options (availability, date, location)
- **Search Functionality** - Search by title and description
- **Date Management** - Display relative dates (Today, Tomorrow, in 3 days)
- **Status Badges** - Visual indicators (Registration Open, Event Full, Past Event)
- **Edit Events** - Update event details (for creators)
- **Delete Events** - Remove events (for creators)
- **Participant List** - View all event participants
- **Event Validation** - Client and server-side validation
- **Auto-geocoding** - Convert location names to coordinates
- **Image Support** - Event thumbnail display (if provided)
- **Event Sorting** - Sort by date, participants, or distance

### 🎨 User Interface & Experience
- **Modern Design** - Sleek UI with Tailwind CSS
- **Responsive Layout** - Mobile-first design approach
- **Dark Mode Ready** - Color scheme optimized for accessibility
- **Loading States** - Skeleton loaders and spinners throughout
- **Error Boundaries** - Graceful error handling with recovery options
- **Toast Notifications** - Success/error feedback for user actions
- **Modal System** - Elegant overlays for event details and forms
- **Form Validation** - Real-time input validation with error messages
- **Smooth Animations** - CSS transitions and transforms
- **Icon Library** - Lucide React icons for consistency
- **Card Layouts** - Beautiful event cards with hover effects
- **Button States** - Disabled states and loading indicators
- **Empty States** - Helpful messages when no data available
- **Gradient Backgrounds** - Attractive color gradients
- **Shadow Effects** - Depth and elevation with box shadows

### 🔍 Advanced Search & Filters
- **Multi-criteria Search** - Combine multiple filters simultaneously
- **Location-based Filtering** - Filter by city or region
- **Availability Filter** - Show available/full events
- **Date Range Filter** - Upcoming/past/all events
- **Distance Sorting** - Order by proximity to user
- **Real-time Filter Updates** - Instant results as filters change
- **Clear Filters Button** - Reset all filters at once
- **Filter Persistence** - Maintain filters during session
- **Query Parameters** - Support for URL-based filtering

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.IO
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcrypt
- **Validation:** Built-in Mongoose validators
- **API Design:** RESTful architecture
- **Geospatial:** MongoDB 2dsphere indexes

### Frontend
- **Library:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **State Management:** React Context API (useAuth)
- **HTTP Client:** Fetch API
- **Real-time:** Socket.IO Client
- **Maps:** Leaflet + React-Leaflet v4
- **Icons:** Lucide React
- **Date Formatting:** Native JavaScript Date API

### DevOps & Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Code Style:** Prettier (via ESLint)
- **Git Hooks:** Optional pre-commit hooks
- **Environment:** dotenv for configuration
- **Concurrency:** concurrently for dev servers
- **TypeScript Compiler:** tsx for server, tsc for type checking

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mini-event-finder.git
   cd mini-event-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/event-finder
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=3001
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud database
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Frontend only
   npm run dev:frontend
   
   # Backend only
   npm run dev:backend
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api

### First Time Setup

1. **Register a new account** at http://localhost:5173/register
2. **Login** with your credentials
3. **Create events** or browse existing ones
4. **Explore nearby events** on the map
5. **Join events** and start chatting!

---

### Project Structure

```
mini-event-finder/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── CreateEventModal.tsx  # Event creation form
│   │   ├── EditEventModal.tsx    # Event editing form
│   │   ├── EventCard.tsx         # Event card component
│   │   ├── EventChat.tsx         # Real-time chat UI
│   │   ├── EventModal.tsx        # Event details modal
│   │   ├── LoginForm.tsx         # Login interface
│   │   ├── RegisterForm.tsx      # Registration interface
│   │   ├── MapView.tsx           # Leaflet map component
│   │   ├── NearbyEventsList.tsx  # Events list with distances
│   │   ├── NearbyEventsPage.tsx  # Map/List page container
│   │   └── ErrorBoundary.tsx     # Error handling component
│   ├── contexts/                 # React Context providers
│   │   └── AuthContext.tsx       # Authentication state management
│   ├── hooks/                    # Custom React hooks
│   │   └── useGeolocation.ts     # Geolocation hook
│   ├── services/                 # API service layer
│   │   ├── authService.ts        # Authentication API calls
│   │   ├── eventService.ts       # Event API calls
│   │   └── socketService.ts      # Socket.IO client
│   ├── types/                    # TypeScript type definitions
│   │   └── database.types.ts     # Shared types
│   ├── utils/                    # Utility functions
│   │   ├── geocoding.ts          # Location to coordinates
│   │   └── geolocation.ts        # Distance calculations
│   ├── App.tsx                   # Main dashboard component
│   ├── AppRoutes.tsx             # Route configuration
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
├── server/                       # Backend source code
│   ├── models/                   # Mongoose models
│   │   ├── Event.ts              # Event schema
│   │   ├── User.ts               # User schema
│   │   └── ChatMessage.ts        # Chat message schema
│   ├── middleware/               # Express middleware
│   │   └── auth.ts               # JWT authentication middleware
│   ├── utils/                    # Backend utilities
│   │   └── geolocation.ts        # Server-side distance calc
│   ├── index.ts                  # Express server & REST API
│   ├── socket.ts                 # Socket.IO server
│   └── database.ts               # MongoDB connection
├── public/                       # Static assets
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config (frontend)
├── tsconfig.app.json             # TypeScript app config
├── tsconfig.node.json            # TypeScript node config
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
└── README.md                     # This file
```

### Data Flow

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │ ◄─────► │  React App   │ ◄─────► │  Express API │
│  (Client)   │  HTTP   │  (Frontend)  │  REST   │   (Backend)  │
└─────────────┘         └──────────────┘         └──────────────┘
      │                        │                         │
      │                        │                         │
      │ WebSocket              │ Socket.IO               │
      │ Connection             │ Client                  │
      │                        │                         │
      └────────────────────────┼─────────────────────────┤
                               │                         │
                        ┌──────▼─────────┐       ┌──────▼────────┐
                        │   Socket.IO    │       │   MongoDB     │
                        │     Server     │       │   Database    │
                        │  (Real-time)   │       │ (Persistence) │
                        └────────────────┘       └───────────────┘
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Event Endpoints

#### Create Event
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Beach Volleyball Tournament",
  "description": "Join us for a fun volleyball tournament!",
  "location": "Santa Monica Beach, CA",
  "date": "2025-11-15T14:00:00Z",
  "maxParticipants": 20,
  "latitude": 34.0195,
  "longitude": -118.4912
}

Response: 201 Created
{
  "id": "507f191e810c19729de860ea",
  "title": "Beach Volleyball Tournament",
  ...
}
```

#### Get All Events
```http
GET /api/events?location=San+Francisco&search=tech&availability=available&date=upcoming

Response: 200 OK
[
  {
    "id": "507f191e810c19729de860ea",
    "title": "Tech Meetup",
    "description": "Networking event for tech professionals",
    "location": "San Francisco, CA",
    "date": "2025-11-10T18:00:00Z",
    "maxParticipants": 50,
    "currentParticipants": 23,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "creatorId": "507f1f77bcf86cd799439011",
    "participants": ["507f1f77bcf86cd799439011", ...],
    "createdAt": "2025-10-30T10:00:00Z",
    "updatedAt": "2025-10-30T10:00:00Z"
  },
  ...
]
```

#### Get Event by ID
```http
GET /api/events/507f191e810c19729de860ea

Response: 200 OK
{
  "id": "507f191e810c19729de860ea",
  "title": "Tech Meetup",
  ...
}
```

#### Get Nearby Events
```http
GET /api/events/nearby?lat=37.7749&lng=-122.4194&radius=50

Response: 200 OK
{
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "radius": 50,
  "count": 3,
  "events": [
    {
      "id": "507f191e810c19729de860ea",
      "title": "Tech Meetup",
      "distance": 2.5,
      ...
    },
    ...
  ]
}
```

#### Join Event
```http
PATCH /api/events/507f191e810c19729de860ea/join
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "507f191e810c19729de860ea",
  "currentParticipants": 24,
  ...
}
```

#### Leave Event
```http
PATCH /api/events/507f191e810c19729de860ea/leave
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "507f191e810c19729de860ea",
  "currentParticipants": 23,
  ...
}
```

#### Update Event
```http
PATCH /api/events/507f191e810c19729de860ea
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Tech Meetup",
  "maxParticipants": 60
}

Response: 200 OK
{
  "id": "507f191e810c19729de860ea",
  "title": "Updated Tech Meetup",
  ...
}
```

#### Delete Event
```http
DELETE /api/events/507f191e810c19729de860ea
Authorization: Bearer {token}

Response: 204 No Content
```

### WebSocket Events (Socket.IO)

#### Client → Server

```javascript
// Join event chat room
socket.emit('join_room', { eventId: '507f191e810c19729de860ea' });

// Send chat message
socket.emit('send_message', {
  eventId: '507f191e810c19729de860ea',
  message: 'Hello everyone!'
});

// Typing indicator
socket.emit('typing', {
  eventId: '507f191e810c19729de860ea',
  isTyping: true
});

// Mark messages as read
socket.emit('mark_read', {
  eventId: '507f191e810c19729de860ea',
  messageIds: ['msg1', 'msg2']
});

// Leave room
socket.emit('leave_room', { eventId: '507f191e810c19729de860ea' });
```

#### Server → Client

```javascript
// Receive chat history
socket.on('chat_history', (messages) => {
  // Array of last 20 messages
});

// Receive new message
socket.on('new_message', (message) => {
  // { id, eventId, userId, username, message, timestamp, readBy }
});

// User joined room
socket.on('user_joined', ({ userId, username }) => {
  // Notification that user joined
});

// User left room
socket.on('user_left', ({ userId, username }) => {
  // Notification that user left
});

// Someone is typing
socket.on('user_typing', ({ userId, username, isTyping }) => {
  // Show typing indicator
});

// Message read receipt
socket.on('message_read', ({ messageId, userId }) => {
  // Update read status
});

// Connection errors
socket.on('error', (error) => {
  // Handle error
});
```

---

## 🎨 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Event dashboard with search, filters, and event cards*

### Interactive Map
![Map View](docs/screenshots/map-view.png)
*Nearby events on interactive Leaflet map with radius visualization*

### Real-time Chat
![Chat](docs/screenshots/chat.png)
*Event-based chat with typing indicators and read receipts*

### Event Details
![Event Modal](docs/screenshots/event-modal.png)
*Comprehensive event information and actions*

---

## 🌟 Bonus Features Implemented

### ✅ Core Assignment Requirements
- [x] RESTful API with Express & TypeScript
- [x] MongoDB with Mongoose ODM
- [x] React frontend with TypeScript
- [x] Event CRUD operations
- [x] Join/Leave event functionality
- [x] Search and filter capabilities
- [x] Responsive UI with Tailwind CSS

### ✨ Advanced Bonus Features

#### Authentication & Security
- [x] JWT-based authentication system
- [x] Bcrypt password hashing (10 rounds)
- [x] Protected API routes with middleware
- [x] Client-side route guards with React Router
- [x] Token management and auto-logout
- [x] Session persistence across page reloads
- [x] Secure password validation

#### Real-time Features
- [x] Socket.IO integration for real-time chat
- [x] Event-based chat rooms
- [x] Message persistence in MongoDB
- [x] Typing indicators
- [x] Read receipts
- [x] User presence (online/offline)
- [x] Auto-reconnection logic
- [x] Message history (last 20 messages)

#### Geospatial Features
- [x] Interactive Leaflet maps integration
- [x] Nearby events search with radius
- [x] Haversine distance calculation
- [x] MongoDB 2dsphere geospatial indexes
- [x] Browser geolocation API
- [x] Auto-geocoding from location names
- [x] Custom map markers and popups
- [x] Radius visualization with circles
- [x] Map/List view toggle
- [x] Current location button
- [x] Distance badges in km/m

#### User Experience
- [x] React Router for SPA navigation
- [x] Error boundaries for error handling
- [x] Loading states throughout app
- [x] Smooth animations and transitions
- [x] Modal system for forms and details
- [x] Toast notifications (via browser alerts)
- [x] Empty states with helpful messages
- [x] Responsive mobile-first design
- [x] Accessibility improvements

#### Data Management
- [x] Advanced filtering (availability, date, location)
- [x] Real-time search across title/description
- [x] Sort by distance from user location
- [x] Event capacity tracking
- [x] Participant management
- [x] Event ownership verification
- [x] Duplicate prevention
- [x] Data validation (client & server)

#### Developer Experience
- [x] Full TypeScript implementation
- [x] Modular component architecture
- [x] Custom React hooks
- [x] Context API for state management
- [x] Service layer for API calls
- [x] Environment variable configuration
- [x] ESLint code quality checks
- [x] Concurrent dev server setup

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration with validation
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Protected route access without token
- [ ] Token expiration handling
- [ ] Logout functionality

#### Events
- [ ] Create new event
- [ ] View event details
- [ ] Edit own event
- [ ] Delete own event
- [ ] Join available event
- [ ] Leave joined event
- [ ] Cannot join full event
- [ ] Search events by keyword
- [ ] Filter by location
- [ ] Filter by availability
- [ ] Filter by date range

#### Maps & Geolocation
- [ ] View nearby events on map
- [ ] Click event marker for details
- [ ] Adjust search radius (1-100km)
- [ ] Toggle map/list view
- [ ] Get current location
- [ ] View distance to events
- [ ] Map centering on location

#### Chat
- [ ] Send chat message in event
- [ ] Receive real-time messages
- [ ] View typing indicators
- [ ] See read receipts
- [ ] Chat history on join
- [ ] Multiple users in same chat
- [ ] Reconnection after disconnect

---

## 📖 Learning Outcomes

This project demonstrates proficiency in:

- **Full-stack TypeScript** development
- **RESTful API** design and implementation
- **MongoDB** with Mongoose ODM and geospatial queries
- **JWT authentication** and security best practices
- **Socket.IO** for real-time bidirectional communication
- **React** with hooks and context API
- **React Router** for SPA navigation
- **Leaflet** maps integration
- **Responsive design** with Tailwind CSS
- **Error handling** and user experience optimization
- **Git** version control and best practices

---

## 🤝 Contributing

This is an internship assignment project. For educational purposes, feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is created as part of the Slanup Full Stack Development Internship assignment.

---

## 👨‍💻 Author

**Your Name**  
Full Stack Development Intern - Slanup  
[GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourprofile) | [Email](mailto:your.email@example.com)

---

## 🙏 Acknowledgments

- **Slanup** for the internship opportunity and assignment
- **OpenStreetMap** for map tiles
- **Leaflet** for the amazing mapping library
- **React** & **Express** communities for excellent documentation
- All open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check existing documentation
2. Review the [troubleshooting section](#-troubleshooting)
3. Open an issue on GitHub
4. Contact: your.email@example.com

---

## 🔮 Future Enhancements

Potential features for future iterations:

- [ ] Event categories and tags
- [ ] Image upload for events
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Social media sharing
- [ ] Event reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Payment integration for paid events
- [ ] Event clustering on map
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Export events to PDF/ICS

---

<div align="center">

**⭐ If you found this project helpful, please consider giving it a star!**

Made with ❤️ for Slanup Full Stack Development Internship

</div>

The built frontend files in `dist/` can be served by any static file server or deployed to platforms like Vercel, Netlify, etc.

## API Documentation

### Authentication

The application uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header.

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>

Response:
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "name": "John Doe"
}
```

### Event Endpoints

#### Create Event (Protected)
```http
POST /api/events
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Event Title",
  "description": "Event description",
  "location": "Event location",
  "date": "2025-11-15T18:00:00Z",
  "maxParticipants": 50,
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

#### Get All Events
```http
GET /api/events?location=San Francisco&search=tech
```

Query parameters:
- `location` (optional) - Filter by location
- `search` (optional) - Search in title and description

#### Get Event by ID
```http
GET /api/events/:id
```

#### Join Event
```http
PATCH /api/events/:id/join
```

#### Leave Event
```http
PATCH /api/events/:id/leave
```

#### Health Check
```http
GET /api/health
```

## Event Data Model

Each event contains:
- `id` - Unique identifier (UUID)
- `title` - Event title
- `description` - Event description
- `location` - Event location
- `date` - Event date (ISO 8601 format)
- `maxParticipants` - Maximum number of participants
- `currentParticipants` - Current number of participants
- `latitude` - Optional latitude coordinate
- `longitude` - Optional longitude coordinate
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Project Structure

```
├── server/                 # Backend code
│   ├── index.ts           # Express server
│   └── tsconfig.json      # Backend TypeScript config
├── src/                   # Frontend code
│   ├── components/        # React components
│   │   ├── EventCard.tsx
│   │   ├── EventModal.tsx
│   │   └── CreateEventModal.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useGeolocation.ts
│   ├── services/         # API service layer
│   │   └── eventService.ts
│   ├── types/            # TypeScript types
│   │   └── database.types.ts
│   ├── utils/            # Utility functions
│   │   └── geolocation.ts
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── package.json
└── vite.config.ts        # Vite configuration

```

## Deployment Options

### Frontend
- **Vercel** - Recommended for Vite projects
- **Netlify** - Easy static site hosting
- **GitHub Pages** - Free hosting option

### Backend
- **Render** - Easy Node.js hosting
- **Railway** - Simple deployment
- **Fly.io** - Global deployment
- **Heroku** - Traditional PaaS option

## Future Enhancements

- [ ] Persistent database (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Event categories/tags
- [ ] Image uploads
- [ ] Social sharing
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Comments and ratings

## License

MIT
