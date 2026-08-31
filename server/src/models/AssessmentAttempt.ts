import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentAttempt extends Document {
  assessment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  answers: number[];
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  skillLevelAwarded?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    answers: [{ type: Number, required: true }],
    score: { type: Number, required: true, min: 0, max: 100 },
    correctAnswers: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    passed: { type: Boolean, required: true },
    skillLevelAwarded: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  },
  { timestamps: true }
);

AssessmentAttemptSchema.index({ assessment: 1, student: 1 }, { unique: true });

export const AssessmentAttempt = mongoose.model<IAssessmentAttempt>('AssessmentAttempt', AssessmentAttemptSchema);
