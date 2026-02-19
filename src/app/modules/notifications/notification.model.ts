import { Schema, model } from "mongoose";

interface INotification {
  recipient: Schema.Types.ObjectId;
  sender?: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system' | 'general';
  relatedId?: Schema.Types.ObjectId; // Related booking, message, etc.
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface INotificationModel {
  recipient: Schema.Types.ObjectId;
  sender?: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system' | 'general';
  relatedId?: Schema.Types.ObjectId;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['booking', 'message', 'system', 'general'],
      default: 'general'
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      refPath: 'type'
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    actionUrl: {
      type: String,
      trim: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes for better performance
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });

export const Notification = model<INotification>("Notification", NotificationSchema);
