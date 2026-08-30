import mongoose, { Schema, Document } from 'mongoose';

export const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Data Science',
  'Cloud',
  'DevOps',
  'Soft Skills',
  'Other',
] as const;

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export interface IEducation {
  _id?: string;
  degree: string;
  institution: string;
  year: number;
  score?: string;
}

export interface ISkill {
  _id?: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  verified: boolean;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  link?: string;
}

export interface ICertification {
  _id?: string;
  name: string;
  issuer: string;
  link?: string;
}

export interface IFileMetadata {
  _id?: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface IStudent extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  education: IEducation[];
  skills: ISkill[];
  projects: IProject[];
  certifications: ICertification[];
  resume?: IFileMetadata;
  portfolioDocuments: IFileMetadata[];
}

const StudentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
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
    skills: [
      {
        name: { type: String, required: true },
        category: {
          type: String,
          enum: SKILL_CATEGORIES,
          default: 'Other',
        },
        level: {
          type: String,
          enum: SKILL_LEVELS,
          default: 'Beginner',
        },
        verified: { type: Boolean, default: false },
      },
    ],
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
    resume: {
      publicId: { type: String },
      originalName: { type: String },
      mimeType: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date },
    },
    portfolioDocuments: [
      {
        publicId: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
