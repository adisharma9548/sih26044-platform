import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillEntry {
  _id?: string;
  name: string;
  category: 'programming' | 'design' | 'data-science' | 'cloud' | 'devops' | 'soft-skills' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  evidenceUrl?: string;
}

export interface IEducation {
  _id?: string;
  degree: string;
  institution: string;
  year: number;
  score?: string;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
}

export interface ICertification {
  _id?: string;
  name: string;
  issuer: string;
  link?: string;
  verified?: boolean;
}

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  education: IEducation[];
  skills: ISkillEntry[];
  projects: IProject[];
  certifications: ICertification[];
  resumeUrl?: string;
  portfolioUrl?: string;
  targetRole?: string;
  careerReadiness?: number;
}

const StudentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
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
    skills: [
      {
        name: { type: String, required: true },
        category: {
          type: String,
          enum: ['programming', 'design', 'data-science', 'cloud', 'devops', 'soft-skills', 'other'],
          default: 'other',
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          default: 'beginner',
        },
        verified: { type: Boolean, default: false },
        evidenceUrl: { type: String },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String },
        technologies: [{ type: String }],
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        link: { type: String },
        verified: { type: Boolean, default: false },
      },
    ],
    resumeUrl: { type: String },
    portfolioUrl: { type: String },
    targetRole: { type: String },
    careerReadiness: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);