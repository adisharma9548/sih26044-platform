import mongoose, { Document, Schema } from 'mongoose';

export const APPLICATION_STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Withdrawn'] as const;

export interface IApplication extends Document {
  opportunity: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  status: (typeof APPLICATION_STATUSES)[number];
  coverNote?: string;
  statusHistory: Array<{ status: (typeof APPLICATION_STATUSES)[number]; changedAt: Date }>;
}

const ApplicationSchema = new Schema<IApplication>({
  opportunity: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true, index: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  status: { type: String, enum: APPLICATION_STATUSES, default: 'Applied', required: true },
  coverNote: { type: String, trim: true, maxlength: 2000 },
  statusHistory: [{ status: { type: String, enum: APPLICATION_STATUSES, required: true }, changedAt: { type: Date, required: true } }],
}, { timestamps: true });

ApplicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
