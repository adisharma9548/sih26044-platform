import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { Student } from '../models/Student';
import { Recruiter } from '../models/Recruiter';
import { Faculty } from '../models/Faculty';
import { Institution } from '../models/Institution';
import { ApiError } from '../middlewares/errorHandler';
import { generateToken, TokenPayload } from '../utils/jwt';
import mongoose from 'mongoose';

type Role = 'student' | 'recruiter' | 'faculty' | 'institution';

interface RegisterData {
  email: string;
  password: string;
  role: Role;
  name: string;
  profileData: any;
}

export class AuthService {
  async register(data: RegisterData) {
    const { email, password, role, name, profileData } = data;
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, 'USER_EXISTS', 'Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let profileId: mongoose.Types.ObjectId;
      let profileModel: 'Student' | 'Recruiter' | 'Faculty' | 'Institution';

      switch (role) {
        case 'student': {
          const student = new Student({ ...profileData, user: null });
          await student.save({ session });
          profileId = student._id;
          profileModel = 'Student';
          break;
        }
        case 'recruiter': {
          const recruiter = new Recruiter({ ...profileData, user: null });
          await recruiter.save({ session });
          profileId = recruiter._id;
          profileModel = 'Recruiter';
          break;
        }
        case 'faculty': {
          const faculty = new Faculty({ ...profileData, user: null });
          await faculty.save({ session });
          profileId = faculty._id;
          profileModel = 'Faculty';
          break;
        }
        case 'institution': {
          const institution = new Institution({ ...profileData, user: null });
          await institution.save({ session });
          profileId = institution._id;
          profileModel = 'Institution';
          break;
        }
        default:
          throw new ApiError(400, 'INVALID_ROLE', 'Invalid role');
      }

      const user = new User({
        email,
        password: hashed,
        role,
        name,
        profileId,
        profileModel,
      });
      await user.save({ session });

      // Update profile with user reference
      const modelRef = mongoose.model(profileModel);
      await modelRef.findByIdAndUpdate(profileId, { user: user._id }, { session });

      await session.commitTransaction();

      const payload: TokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
      const token = generateToken(payload);
      return { user, token };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    if (!user.isActive) throw new ApiError(403, 'ACCOUNT_INACTIVE', 'Account is deactivated');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

    user.lastLogin = new Date();
    await user.save();

    const payload: TokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
    const token = generateToken(payload);
    return { user, token };
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    const profileModel = mongoose.model(user.profileModel);
    const profile = await profileModel.findOne({ user: userId });
    return { user, profile };
  }
}