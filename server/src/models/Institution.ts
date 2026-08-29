import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  address: string;
  departments: string[];
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true, // ← CRITICAL
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    departments: [{ type: String }],
  },
  { timestamps: true }
);

export const Institution = mongoose.model<IInstitution>('Institution', InstitutionSchema);