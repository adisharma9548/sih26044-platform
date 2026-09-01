import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  student: mongoose.Types.ObjectId;
  internship: mongoose.Types.ObjectId;
  status: 'saved' | 'applied' | 'screening' | 'assessment' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
  appliedAt: Date;
  updatedAt: Date;
  resumeUrl?: string;
  answers?: Record<string, any>;
  timeline: {
    status: string;
    date: Date;
    note?: string;
  }[];
}

const ApplicationSchema = new Schema<IApplication>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    internship: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
    status: {
      type: String,
      enum: ['saved', 'applied', 'screening', 'assessment', 'interview', 'offered', 'rejected', 'withdrawn'],
      default: 'applied',
    },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resumeUrl: { type: String },
    answers: { type: Schema.Types.Mixed },
    timeline: [
      {
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);