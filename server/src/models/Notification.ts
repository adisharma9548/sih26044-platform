import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  category: 'application' | 'opportunity' | 'skill' | 'learning' | 'system';
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['application', 'opportunity', 'skill', 'learning', 'system'],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);