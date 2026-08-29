import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiter extends Document {
  user?: mongoose.Types.ObjectId;
  companyName: string;
  companyWebsite?: string;
  description: string;
  industry: string;
  location: string;
}

const RecruiterSchema = new Schema<IRecruiter>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true, // ← CRITICAL
    },
    companyName: { type: String, required: true },
    companyWebsite: { type: String },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export const Recruiter = mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);