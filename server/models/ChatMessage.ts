import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  message: string;
  timestamp: Date;
  readBy: mongoose.Types.ObjectId[];
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    readBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: false,
  }
);

// Index for efficient querying of recent messages
ChatMessageSchema.index({ eventId: 1, timestamp: -1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
