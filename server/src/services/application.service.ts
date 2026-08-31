import { Application, APPLICATION_STATUSES } from '../models/Application';
import { Opportunity } from '../models/Opportunity';
import { Recruiter } from '../models/Recruiter';
import { Student } from '../models/Student';
import { ApiError } from '../middlewares/errorHandler';

export class ApplicationService {
  async apply(studentUserId: string, opportunityId: string, coverNote?: unknown) {
    const student = await this.studentForUser(studentUserId);
    const opportunity = await Opportunity.findOne({ _id: opportunityId, isPublished: true, deadline: { $gte: new Date() } });
    if (!opportunity) throw new ApiError(404, 'OPPORTUNITY_NOT_FOUND', 'This opportunity is not available');
    const note = typeof coverNote === 'string' ? coverNote.trim() : '';
    if (note.length > 2000) throw new ApiError(400, 'INVALID_COVER_NOTE', 'Cover note must be 2000 characters or fewer');
    try { return await Application.create({ opportunity: opportunity._id, student: student._id, status: 'Applied', coverNote: note || undefined, statusHistory: [{ status: 'Applied', changedAt: new Date() }] }); }
    catch (error: unknown) { if ((error as { code?: number }).code === 11000) throw new ApiError(409, 'ALREADY_APPLIED', 'You have already applied to this opportunity'); throw error; }
  }

  async listForStudent(studentUserId: string) {
    const student = await this.studentForUser(studentUserId);
    return Application.find({ student: student._id }).populate({ path: 'opportunity', populate: { path: 'recruiter', select: 'companyName' } }).sort({ createdAt: -1 }).lean();
  }

  async withdraw(studentUserId: string, applicationId: string) {
    const student = await this.studentForUser(studentUserId);
    const application = await Application.findOne({ _id: applicationId, student: student._id });
    if (!application) throw new ApiError(404, 'APPLICATION_NOT_FOUND', 'Application not found');
    if (['Selected', 'Rejected', 'Withdrawn'].includes(application.status)) throw new ApiError(400, 'APPLICATION_CLOSED', 'This application can no longer be withdrawn');
    application.status = 'Withdrawn'; application.statusHistory.push({ status: 'Withdrawn', changedAt: new Date() }); await application.save(); return application;
  }

  async listForRecruiter(recruiterUserId: string, opportunityId: string) {
    const recruiter = await this.recruiterForUser(recruiterUserId);
    const opportunity = await Opportunity.findOne({ _id: opportunityId, recruiter: recruiter._id });
    if (!opportunity) throw new ApiError(404, 'OPPORTUNITY_NOT_FOUND', 'Opportunity not found');
    return Application.find({ opportunity: opportunity._id }).populate('student', 'name enrollmentNumber department year skills projects certifications resume').sort({ createdAt: -1 }).lean();
  }

  async updateStatus(recruiterUserId: string, applicationId: string, status: unknown) {
    if (typeof status !== 'string' || !APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number]) || status === 'Applied' || status === 'Withdrawn') throw new ApiError(400, 'INVALID_STATUS', 'Select a valid recruiter application status');
    const recruiter = await this.recruiterForUser(recruiterUserId);
    const application = await Application.findById(applicationId).populate('opportunity');
    if (!application || String((application.opportunity as unknown as { recruiter: unknown }).recruiter) !== String(recruiter._id)) throw new ApiError(404, 'APPLICATION_NOT_FOUND', 'Application not found');
    if (application.status === 'Withdrawn') throw new ApiError(400, 'APPLICATION_WITHDRAWN', 'Withdrawn applications cannot be updated');
    application.status = status as (typeof APPLICATION_STATUSES)[number]; application.statusHistory.push({ status: application.status, changedAt: new Date() }); await application.save(); return application;
  }

  private async studentForUser(userId: string) { const student = await Student.findOne({ user: userId }); if (!student) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found'); return student; }
  private async recruiterForUser(userId: string) { const recruiter = await Recruiter.findOne({ user: userId }); if (!recruiter) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Recruiter profile not found'); return recruiter; }
}
