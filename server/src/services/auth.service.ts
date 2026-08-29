import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { Student } from '../models/Student';
import { Recruiter } from '../models/Recruiter';
import { Faculty } from '../models/Faculty';
import { Institution } from '../models/Institution';
import { generateToken, TokenPayload } from '../utils/jwt';
import { ApiError } from '../middlewares/errorHandler';
import mongoose from 'mongoose';

type Role = 'student' | 'recruiter' | 'faculty' | 'institution';

interface RegisterData {
  email: string;
  password: string;
  role: Role;
  profileData: any; // role-specific data
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData): Promise<{ user: IUser; token: string }> {
    const { email, password, role, profileData } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'USER_EXISTS', 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a session for transaction (ensures both User and Profile are created)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let profileId: mongoose.Types.ObjectId;
      let profileModel: 'Student' | 'Recruiter' | 'Faculty' | 'Institution';

      // Create role-specific profile
      switch (role) {
        case 'student':
          // user field omitted – will be set after User creation
          const student = new Student({
            ...profileData,
          });
          await student.save({ session });
          profileId = student._id;
          profileModel = 'Student';
          break;

        case 'recruiter':
          const recruiter = new Recruiter({
            ...profileData,
          });
          await recruiter.save({ session });
          profileId = recruiter._id;
          profileModel = 'Recruiter';
          break;

        case 'faculty':
          const faculty = new Faculty({
            ...profileData,
          });
          await faculty.save({ session });
          profileId = faculty._id;
          profileModel = 'Faculty';
          break;

        case 'institution':
          const institution = new Institution({
            ...profileData,
          });
          await institution.save({ session });
          profileId = institution._id;
          profileModel = 'Institution';
          break;

        default:
          throw new ApiError(400, 'INVALID_ROLE', 'Invalid role specified');
      }

      // Create User
      const user = new User({
        email,
        password: hashedPassword,
        role,
        profileId,
        profileModel,
        isActive: true,
      });
      await user.save({ session });

      // Update profile with user reference
      const profileModelRef = mongoose.model(profileModel);
      await profileModelRef.findByIdAndUpdate(
        profileId,
        { user: user._id },
        { session }
      );

      await session.commitTransaction();

      // Generate JWT
      const tokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };
      const token = generateToken(tokenPayload);

      return { user, token };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(data: LoginData): Promise<{ user: IUser; token: string }> {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'ACCOUNT_INACTIVE', 'Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = generateToken(tokenPayload);

    return { user, token };
  }

  async getProfile(userId: string, role: Role): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    const profileModel = mongoose.model(user.profileModel);
    const profile = await profileModel.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Profile not found');
    }

    return { user, profile };
  }
}