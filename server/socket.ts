import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ChatMessage } from './models/ChatMessage';
import { User } from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

interface JWTPayload {
  userId: string;
  email: string;
}

interface JoinRoomData {
  eventId: string;
  token: string;
}

interface SendMessageData {
  eventId: string;
  message: string;
}

interface TypingData {
  eventId: string;
  isTyping: boolean;
}

interface MarkReadData {
  messageId: string;
}

interface ActiveUser {
  userId: string;
  username: string;
  socketId: string;
}

const activeUsers = new Map<string, Set<{ userId: string; username: string; socketId: string }>>();

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      
      // Get user info
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = decoded.userId;
      socket.username = user.name;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.username} (${socket.userId})`);

    // Join a chat room (event)
    socket.on('join_room', async (data: JoinRoomData) => {
      try {
        const { eventId } = data;
        
        // Join the socket room
        socket.join(eventId);
        
        // Add user to active users for this room
        if (!activeUsers.has(eventId)) {
          activeUsers.set(eventId, new Set());
        }
        activeUsers.get(eventId)!.add({
          userId: socket.userId!,
          username: socket.username!,
          socketId: socket.id,
        });

        // Load last 20 messages
        const messages = await ChatMessage.find({ eventId })
          .sort({ timestamp: -1 })
          .limit(20)
          .lean();

        // Send messages in chronological order
        const chronologicalMessages = messages.reverse().map(msg => ({
          id: String(msg._id),
          eventId: msg.eventId,
          userId: msg.userId,
          username: msg.username,
          message: msg.message,
          timestamp: msg.timestamp,
          readBy: msg.readBy,
        }));

        socket.emit('load_messages', chronologicalMessages);

        // Notify others in room
        const activeUsersList = Array.from(activeUsers.get(eventId)!).map(u => ({
          userId: u.userId,
          username: u.username,
        }));

        io.to(eventId).emit('user_joined', {
          username: socket.username,
          activeUsers: activeUsersList,
        });

        console.log(`👥 ${socket.username} joined room ${eventId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Send a message
    socket.on('send_message', async (data: SendMessageData) => {
      try {
        const { eventId, message } = data;

        if (!message || message.trim().length === 0) {
          return;
        }

        if (message.length > 1000) {
          socket.emit('error', { message: 'Message too long (max 1000 characters)' });
          return;
        }

        // Save message to database
        const chatMessage = new ChatMessage({
          eventId,
          userId: socket.userId,
          username: socket.username,
          message: message.trim(),
          readBy: [socket.userId], // Sender has read their own message
        });

        await chatMessage.save();

        // Broadcast to all users in the room
        const messageData = {
          id: String(chatMessage._id),
          eventId: chatMessage.eventId,
          userId: chatMessage.userId,
          username: chatMessage.username,
          message: chatMessage.message,
          timestamp: chatMessage.timestamp,
          readBy: chatMessage.readBy,
        };

        io.to(eventId).emit('new_message', messageData);

        console.log(`💬 Message from ${socket.username} in room ${eventId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: TypingData) => {
      const { eventId, isTyping } = data;
      // Broadcast to others in the room (not sender)
      socket.to(eventId).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping,
      });
    });

    // Mark message as read
    socket.on('mark_read', async (data: MarkReadData) => {
      try {
        const { messageId } = data;

        const message = await ChatMessage.findById(messageId);
        if (message && !message.readBy.some(id => id.toString() === socket.userId)) {
          message.readBy.push(socket.userId! as any);
          await message.save();

          // Broadcast read receipt to room
          io.to(String(message.eventId)).emit('message_read', {
            messageId,
            userId: socket.userId,
            readBy: message.readBy.map(id => id.toString()),
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Leave room
    socket.on('leave_room', (data: { eventId: string }) => {
      const { eventId } = data;
      socket.leave(eventId);

      // Remove from active users
      if (activeUsers.has(eventId)) {
        const users = activeUsers.get(eventId)!;
        users.forEach(user => {
          if (user.socketId === socket.id) {
            users.delete(user);
          }
        });

        if (users.size === 0) {
          activeUsers.delete(eventId);
        } else {
          const activeUsersList = Array.from(users).map(u => ({
            userId: u.userId,
            username: u.username,
          }));

          io.to(eventId).emit('user_left', {
            username: socket.username,
            activeUsers: activeUsersList,
          });
        }
      }

      console.log(`👋 ${socket.username} left room ${eventId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.username}`);

      // Remove from all rooms
      activeUsers.forEach((users, eventId) => {
        users.forEach(user => {
          if (user.socketId === socket.id) {
            users.delete(user);

            const activeUsersList = Array.from(users).map(u => ({
              userId: u.userId,
              username: u.username,
            }));

            io.to(eventId).emit('user_left', {
              username: socket.username,
              activeUsers: activeUsersList,
            });
          }
        });

        if (users.size === 0) {
          activeUsers.delete(eventId);
        }
      });
    });
  });

  console.log('💬 Socket.IO server initialized');
  return io;
}
