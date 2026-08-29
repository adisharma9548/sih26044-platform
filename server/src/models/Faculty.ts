import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  department: string;
  designation: string;
}

const FacultySchema = new Schema<IFaculty>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
  },
  { timestamps: true }
);

export const Faculty = mongoose.model<IFaculty>('Faculty', FacultySchema);