import { Application, IApplication } from '../models/Application';
import { Internship } from '../models/Internship';
import { Student } from '../models/Student';
import { ApiError } from '../middlewares/errorHandler';

export class ApplicationService {
  async apply(studentId: string, internshipId: string, data: Partial<IApplication>) {
    const internship = await Internship.findById(internshipId);
    if (!internship) throw new ApiError(404, 'INTERNSHIP_NOT_FOUND', 'Internship not found');
    if (internship.status !== 'published') {
      throw new ApiError(400, 'NOT_AVAILABLE', 'This internship is not accepting applications');
    }

    const existing = await Application.findOne({ student: studentId, internship: internshipId });
    if (existing) throw new ApiError(409, 'ALREADY_APPLIED', 'You have already applied for this position');

    const application = new Application({
      student: studentId,
      internship: internshipId,
      ...data,
      timeline: [{ status: 'applied', date: new Date(), note: 'Application submitted' }],
    });
    await application.save();

    internship.applicantsCount = (internship.applicantsCount || 0) + 1;
    await internship.save();

    return application;
  }

  async getStudentApplications(studentId: string) {
    return Application.find({ student: studentId })
      .populate('internship', 'title company location')
      .sort({ appliedAt: -1 });
  }

  async getInternshipApplications(internshipId: string, userId: string) {
    const internship = await Internship.findById(internshipId).populate('company');
    if (!internship) throw new ApiError(404, 'NOT_FOUND', 'Internship not found');
    
    // Check ownership: cast to any to access .user
    const company = internship.company as any;
    if (company.user.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Not authorized to view applications');
    }
    
    return Application.find({ internship: internshipId })
      .populate('student', 'name enrollmentNumber')
      .sort({ appliedAt: -1 });
  }

  async updateStatus(applicationId: string, status: string, note?: string) {
    const application = await Application.findById(applicationId);
    if (!application) throw new ApiError(404, 'NOT_FOUND', 'Application not found');
    
    // Optionally check authorization here (we'll handle in controller)
    application.status = status as any;
    application.updatedAt = new Date();
    if (note) {
      application.timeline.push({ status, date: new Date(), note });
    } else {
      application.timeline.push({ status, date: new Date() });
    }
    await application.save();
    return application;
  }
}