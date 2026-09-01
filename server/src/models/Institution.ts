import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  address: string;
  departments: string[];
  studentCount?: number;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    departments: [{ type: String }],
    studentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Institution = mongoose.model<IInstitution>('Institution', InstitutionSchema);