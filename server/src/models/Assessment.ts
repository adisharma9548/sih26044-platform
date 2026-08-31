import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentQuestion {
  _id?: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface IAssessment extends Document {
  title: string;
  skillName: string;
  description?: string;
  passingScore: number;
  questions: IAssessmentQuestion[];
  createdBy: mongoose.Types.ObjectId;
  isPublished: boolean;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    skillName: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 500 },
    passingScore: { type: Number, default: 60, min: 1, max: 100 },
    questions: [{
      question: { type: String, required: true, trim: true, maxlength: 500 },
      options: [{ type: String, required: true, trim: true, maxlength: 250 }],
      correctOptionIndex: { type: Number, required: true, min: 0 },
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
