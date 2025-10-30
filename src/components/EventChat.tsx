import { useState, useEffect, useRef } from 'react';
import { Send, Users, Loader2, MessageCircle } from 'lucide-react';
import { socketService, ChatMessage, ActiveUser } from '../services/socketService';
import { useAuth } from '../contexts/AuthContext';

interface EventChatProps {
  eventId: string;
  eventTitle: string;
}

export function EventChat({ eventId, eventTitle }: EventChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark visible messages as read
  useEffect(() => {
    const markVisibleAsRead = () => {
      if (!messageListRef.current || !user) return;

      const unreadMessages = messages.filter(
        (msg) => msg.userId !== user.id && !msg.readBy.includes(user.id)
      );

      unreadMessages.forEach((msg) => {
        socketService.markMessageAsRead(eventId, msg.id);
      });
    };

    // Mark as read after a short delay
    const timer = setTimeout(markVisibleAsRead, 1000);
    return () => clearTimeout(timer);
  }, [messages, user, eventId]);

  // Connect to socket and join room
  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      try {
        setIsConnecting(true);

        // Connect if not already connected
        if (!socketService.isConnected()) {
          await socketService.connect();
        }

        // Setup event listeners
        socketService.onLoadMessages((msgs) => {
          if (isMounted) {
            setMessages(msgs);
            setIsConnecting(false);
          }
        });

        socketService.onNewMessage((msg) => {
          if (isMounted) {
            setMessages((prev) => [...prev, msg]);
          }
        });

        socketService.onUserJoined((data) => {
          if (isMounted) {
            setActiveUsers(data.activeUsers);
          }
        });

        socketService.onUserLeft((data) => {
          if (isMounted) {
            setActiveUsers(data.activeUsers);
            // Remove from typing users if they were typing
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(data.userId);
              return newSet;
            });
          }
        });

        socketService.onUserTyping((data) => {
          if (isMounted && data.userId !== user?.id) {
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              if (data.isTyping) {
                newSet.add(data.username);
              } else {
                newSet.delete(data.username);
              }
              return newSet;
            });

            // Auto-remove typing indicator after 3 seconds
            setTimeout(() => {
              setTypingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(data.username);
                return newSet;
              });
            }, 3000);
          }
        });

        socketService.onMessageRead((data) => {
          if (isMounted) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.messageId
                  ? { ...msg, readBy: [...msg.readBy, data.userId] }
                  : msg
              )
            );
          }
        });

        // Join the room
        socketService.joinRoom(eventId);
      } catch (error) {
        console.error('Failed to connect to chat:', error);
        setIsConnecting(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
      socketService.leaveRoom(eventId);
      socketService.removeAllListeners();
    };
  }, [eventId, user]);

  // Handle typing indicator
  const handleTyping = () => {
    socketService.setTyping(eventId, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.setTyping(eventId, false);
    }, 1000);
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      socketService.sendMessage(eventId, newMessage.trim());
      setNewMessage('');
      socketService.setTyping(eventId, false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get read count (excluding sender)
  const getReadCount = (message: ChatMessage) => {
    return message.readBy.filter((id) => id !== message.userId).length;
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{eventTitle}</h3>
            <p className="text-sm text-slate-600">Event Chat</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200">
          <Users className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{activeUsers.length}</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ maxHeight: '500px' }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.userId === user?.id;
            const readCount = getReadCount(message);

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {!isOwnMessage && (
                    <p className="text-xs font-medium text-slate-600 mb-1 px-1">
                      {message.username}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{message.message}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <p className={`text-xs ${isOwnMessage ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                    {isOwnMessage && readCount > 0 && (
                      <p className="text-xs text-blue-600">
                        ✓✓ Read by {readCount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.size > 0 && (
        <div className="px-6 py-2 text-sm text-slate-600 italic">
          {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            maxLength={1000}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {newMessage.length}/1000 characters
        </p>
      </form>
    </div>
  );
}
