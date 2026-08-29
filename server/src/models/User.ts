import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'student' | 'recruiter' | 'faculty' | 'institution';
  profileId: mongoose.Types.ObjectId;
  profileModel: 'Student' | 'Recruiter' | 'Faculty' | 'Institution';
  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'recruiter', 'faculty', 'institution'],
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'profileModel',
    },
    profileModel: {
      type: String,
      enum: ['Student', 'Recruiter', 'Faculty', 'Institution'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);