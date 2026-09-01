import { User } from '../models/User';
import { Student } from '../models/Student';
import { Internship } from '../models/Internship';
import { Application } from '../models/Application';
import { Skill } from '../models/Skill';

export class AdminService {
  async getStats() {
    const totalUsers = await User.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalInternships = await Internship.countDocuments({ status: 'published' });
    const totalApplications = await Application.countDocuments();
    const totalSkills = await Skill.countDocuments();

    return {
      totalUsers,
      totalStudents,
      totalInternships,
      totalApplications,
      totalSkills,
    };
  }

  async getRecentActivity() {
    // last 5 applications
    const recentApps = await Application.find()
      .populate('student', 'name')
      .populate('internship', 'title')
      .sort({ appliedAt: -1 })
      .limit(5);
    return recentApps;
  }

  async listUsers(filters: any = {}) {
    const query: any = {};
    if (filters.role) query.role = filters.role;
    return User.find(query).select('-password').sort({ createdAt: -1 }).limit(100);
  }
}