import { io, Socket } from 'socket.io-client';
import { authService } from './authService';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  readBy: string[];
}

export interface ActiveUser {
  userId: string;
  username: string;
}

export interface UserJoinedData {
  userId: string;
  username: string;
  activeUsers: ActiveUser[];
}

export interface UserLeftData {
  userId: string;
  username: string;
  activeUsers: ActiveUser[];
}

export interface UserTypingData {
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface MessageReadData {
  messageId: string;
  userId: string;
}

class SocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = authService.getToken();
      
      if (!token) {
        reject(new Error('No authentication token'));
        return;
      }

      this.socket = io(SOCKET_URL, {
        auth: {
          token,
        },
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to WebSocket server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        reject(error);
      });

      this.socket.on('error', (data: { message: string }) => {
        console.error('Socket error:', data.message);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.eventHandlers.clear();
      console.log('❌ Disconnected from WebSocket server');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Join a chat room (event)
  joinRoom(eventId: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    const token = authService.getToken();
    this.socket.emit('join_room', { eventId, token });
    console.log(`👥 Joining room: ${eventId}`);
  }

  // Leave a chat room
  leaveRoom(eventId: string) {
    if (!this.socket) return;
    
    this.socket.emit('leave_room', eventId);
    console.log(`👋 Leaving room: ${eventId}`);
  }

  // Send a message
  sendMessage(eventId: string, message: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('send_message', { eventId, message });
  }

  // Send typing indicator
  setTyping(eventId: string, isTyping: boolean) {
    if (!this.socket) return;
    
    this.socket.emit('typing', { eventId, isTyping });
  }

  // Mark message as read
  markMessageAsRead(eventId: string, messageId: string) {
    if (!this.socket) return;
    
    this.socket.emit('mark_read', { eventId, messageId });
  }

  // Event listeners
  onLoadMessages(callback: (messages: ChatMessage[]) => void) {
    if (!this.socket) return;
    
    this.socket.on('load_messages', callback);
    this.addHandler('load_messages', callback);
  }

  onNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    
    this.socket.on('new_message', callback);
    this.addHandler('new_message', callback);
  }

  onUserJoined(callback: (data: UserJoinedData) => void) {
    if (!this.socket) return;
    
    this.socket.on('user_joined', callback);
    this.addHandler('user_joined', callback);
  }

  onUserLeft(callback: (data: UserLeftData) => void) {
    if (!this.socket) return;
    
    this.socket.on('user_left', callback);
    this.addHandler('user_left', callback);
  }

  onUserTyping(callback: (data: UserTypingData) => void) {
    if (!this.socket) return;
    
    this.socket.on('user_typing', callback);
    this.addHandler('user_typing', callback);
  }

  onMessageRead(callback: (data: MessageReadData) => void) {
    if (!this.socket) return;
    
    this.socket.on('message_read', callback);
    this.addHandler('message_read', callback);
  }

  // Helper to track handlers for cleanup
  private addHandler(event: string, callback: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }

  // Remove all listeners for cleanup
  removeAllListeners() {
    if (!this.socket) return;
    
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.socket!.off(event, handler as any);
      });
    });
    
    this.eventHandlers.clear();
  }
}

export const socketService = new SocketService();
