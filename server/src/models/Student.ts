import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  education: {
    degree: string;
    institution: string;
    year: number;
    score?: string;
  }[];
  skills: string[];
  projects: {
    title: string;
    description: string;
    link?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    link?: string;
  }[];
  resumeUrl?: string;
  portfolioUrl?: string;
}

const StudentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true, // ← CRITICAL
    },
    name: { type: String, required: true },
    enrollmentNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    year: { type: Number, required: true, min: 1, max: 5 },
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: Number, required: true },
        score: { type: String },
      },
    ],
    skills: [{ type: String }],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        link: { type: String },
      },
    ],
    resumeUrl: { type: String },
    portfolioUrl: { type: String },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);