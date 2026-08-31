import mongoose, { Document, Schema } from 'mongoose';

export const OPPORTUNITY_TYPES = ['internship', 'job'] as const;
export const WORK_MODES = ['onsite', 'hybrid', 'remote'] as const;

export interface IOpportunitySkill { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; }
export interface IOpportunity extends Document {
  recruiter: mongoose.Types.ObjectId;
  title: string;
  type: (typeof OPPORTUNITY_TYPES)[number];
  description: string;
  requiredSkills: IOpportunitySkill[];
  preferredSkills: IOpportunitySkill[];
  location: string;
  workMode: (typeof WORK_MODES)[number];
  duration?: string;
  stipend?: string;
  eligibility?: string;
  deadline: Date;
  isPublished: boolean;
}

const SkillSchema = new Schema<IOpportunitySkill>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
}, { _id: false });

const OpportunitySchema = new Schema<IOpportunity>({
  recruiter: { type: Schema.Types.ObjectId, ref: 'Recruiter', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 140 },
  type: { type: String, enum: OPPORTUNITY_TYPES, required: true },
  description: { type: String, required: true, trim: true, maxlength: 6000 },
  requiredSkills: { type: [SkillSchema], validate: [(items: IOpportunitySkill[]) => items.length > 0, 'At least one required skill is needed'] },
  preferredSkills: { type: [SkillSchema], default: [] },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  workMode: { type: String, enum: WORK_MODES, required: true },
  duration: { type: String, trim: true, maxlength: 100 },
  stipend: { type: String, trim: true, maxlength: 100 },
  eligibility: { type: String, trim: true, maxlength: 1000 },
  deadline: { type: Date, required: true },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

OpportunitySchema.index({ title: 'text', description: 'text', location: 'text' });

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
