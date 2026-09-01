import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiter extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  companyWebsite?: string;
  description: string;
  industry: string;
  location: string;
  logoUrl?: string;
}

const RecruiterSchema = new Schema<IRecruiter>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    companyWebsite: { type: String },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

export const Recruiter = mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);