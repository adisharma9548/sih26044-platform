import mongoose, { Schema, Document } from 'mongoose';

export interface IInternship extends Document {
  title: string;
  description: string;
  company: mongoose.Types.ObjectId;
  location: string;
  workMode: 'remote' | 'hybrid' | 'on-site';
  type: 'internship' | 'job' | 'project';
  skills: {
    skillId: mongoose.Types.ObjectId;
    required: boolean;
  }[];
  stipend?: string;
  salary?: string;
  duration?: string;
  eligibility?: string;
  applicationDeadline: Date;
  postedAt: Date;
  status: 'draft' | 'published' | 'closed';
  applicantsCount?: number;
}

const InternshipSchema = new Schema<IInternship>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    location: { type: String, required: true },
    workMode: { type: String, enum: ['remote', 'hybrid', 'on-site'], required: true },
    type: { type: String, enum: ['internship', 'job', 'project'], required: true },
    skills: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
        required: { type: Boolean, default: true },
      },
    ],
    stipend: { type: String },
    salary: { type: String },
    duration: { type: String },
    eligibility: { type: String },
    applicationDeadline: { type: Date, required: true },
    postedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'published', 'closed'], default: 'draft' },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Internship = mongoose.model<IInternship>('Internship', InternshipSchema);