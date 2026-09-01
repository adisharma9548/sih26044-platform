import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'programming' | 'design' | 'data-science' | 'cloud' | 'devops' | 'soft-skills' | 'other';
  industryDemand?: 'high' | 'medium' | 'low';
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['programming', 'design', 'data-science', 'cloud', 'devops', 'soft-skills', 'other'],
      default: 'other',
    },
    industryDemand: { type: String, enum: ['high', 'medium', 'low'] },
  },
  { timestamps: true }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);