import mongoose from 'mongoose';
import { Assessment } from '../models/Assessment';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { Faculty } from '../models/Faculty';
import { Institution } from '../models/Institution';
import { Recruiter } from '../models/Recruiter';
import { User } from '../models/User';
import { ApiError } from '../middlewares/errorHandler';

type DashboardRole = 'recruiter' | 'faculty' | 'institution';

export class DashboardService {
  async getOverview(userId: string, role: DashboardRole) {
    const user = await User.findById(userId).lean();
    if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    if (user.role !== role) throw new ApiError(403, 'FORBIDDEN', 'This dashboard is not available for your role');

    if (role === 'recruiter') {
      const profile = await Recruiter.findOne({ user: userId }).lean();
      if (!profile) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Recruiter profile not found');
      return { role, profile: this.profile(profile), metrics: [] };
    }
    if (role === 'faculty') {
      const profile = await Faculty.findOne({ user: userId }).lean();
      if (!profile) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Faculty profile not found');
      return { role, profile: this.profile(profile), metrics: [] };
    }

    const profile = await Institution.findOne({ user: userId }).lean();
    if (!profile) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Institution profile not found');
    const assessments = await Assessment.find({ createdBy: new mongoose.Types.ObjectId(userId) }).select('_id').lean();
    const assessmentIds = assessments.map((item) => item._id);
    const attempts = assessmentIds.length ? await AssessmentAttempt.countDocuments({ assessment: { $in: assessmentIds } }) : 0;
    return {
      role,
      profile: this.profile(profile),
      metrics: [
        { label: 'Published assessments', value: assessments.length },
        { label: 'Student attempts', value: attempts },
        { label: 'Departments', value: profile.departments.length },
      ],
    };
  }

  private profile(profile: object) {
    const { _id, user, createdAt, updatedAt, __v, ...safeProfile } = profile as Record<string, unknown>;
    return safeProfile;
  }
}
