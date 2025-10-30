import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  maxParticipants: number;
  currentParticipants: number;
  latitude?: number | null;
  longitude?: number | null;
  creatorId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: [1, 'Max participants must be at least 1'],
      max: [10000, 'Max participants cannot exceed 10000'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: [0, 'Current participants cannot be negative'],
    },
    latitude: {
      type: Number,
      default: null,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      default: null,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: any) => {
        // Convert _id to id and remove __v
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
EventSchema.index({ title: 'text', description: 'text' });
EventSchema.index({ location: 1 });
EventSchema.index({ date: 1 });
// 2dsphere index for geospatial queries
EventSchema.index({ latitude: 1, longitude: 1 });

// Validation: ensure currentParticipants doesn't exceed maxParticipants
EventSchema.pre('save', function (next) {
  if (this.currentParticipants > this.maxParticipants) {
    next(new Error('Current participants cannot exceed max participants'));
  } else {
    next();
  }
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);
