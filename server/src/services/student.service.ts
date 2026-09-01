import { Student, IStudent } from '../models/Student';
import { ApiError } from '../middlewares/errorHandler';

export class StudentService {
  // ===== Profile =====
  async getProfile(userId: string): Promise<IStudent> {
    const profile = await Student.findOne({ user: userId });
    if (!profile) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');
    return profile;
  }

  async updateProfile(userId: string, data: Partial<IStudent>): Promise<IStudent> {
    const profile = await Student.findOneAndUpdate(
      { user: userId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!profile) throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');
    return profile;
  }

  // ===== Skills =====
  async addSkill(userId: string, skillData: any) {
    const profile = await this.getProfile(userId);
    if (profile.skills.some(s => s.name.toLowerCase() === skillData.name.toLowerCase())) {
      throw new ApiError(409, 'DUPLICATE_SKILL', 'Skill already exists');
    }
    profile.skills.push({ ...skillData, verified: false });
    await profile.save();
    return profile;
  }

  async updateSkill(userId: string, skillId: string, data: any) {
    const profile = await this.getProfile(userId);
    const skill = profile.skills.find(s => String(s._id) === skillId);
    if (!skill) throw new ApiError(404, 'SKILL_NOT_FOUND', 'Skill not found');
    Object.assign(skill, data);
    await profile.save();
    return profile;
  }

  async deleteSkill(userId: string, skillId: string) {
    const profile = await this.getProfile(userId);
    const index = profile.skills.findIndex(s => String(s._id) === skillId);
    if (index === -1) throw new ApiError(404, 'SKILL_NOT_FOUND', 'Skill not found');
    profile.skills.splice(index, 1);
    await profile.save();
    return profile;
  }

  // ===== Education =====
  async addEducation(userId: string, education: any) {
    const profile = await this.getProfile(userId);
    profile.education.push(education);
    await profile.save();
    return profile;
  }

  async updateEducation(userId: string, educationId: string, data: any) {
    const profile = await this.getProfile(userId);
    const edu = profile.education.find(e => String(e._id) === educationId);
    if (!edu) throw new ApiError(404, 'EDUCATION_NOT_FOUND', 'Education entry not found');
    Object.assign(edu, data);
    await profile.save();
    return profile;
  }

  async deleteEducation(userId: string, educationId: string) {
    const profile = await this.getProfile(userId);
    const index = profile.education.findIndex(e => String(e._id) === educationId);
    if (index === -1) throw new ApiError(404, 'EDUCATION_NOT_FOUND', 'Education entry not found');
    profile.education.splice(index, 1);
    await profile.save();
    return profile;
  }

  // ===== Projects =====
  async addProject(userId: string, project: any) {
    const profile = await this.getProfile(userId);
    profile.projects.push(project);
    await profile.save();
    return profile;
  }

  async updateProject(userId: string, projectId: string, data: any) {
    const profile = await this.getProfile(userId);
    const proj = profile.projects.find(p => String(p._id) === projectId);
    if (!proj) throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    Object.assign(proj, data);
    await profile.save();
    return profile;
  }

  async deleteProject(userId: string, projectId: string) {
    const profile = await this.getProfile(userId);
    const index = profile.projects.findIndex(p => String(p._id) === projectId);
    if (index === -1) throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    profile.projects.splice(index, 1);
    await profile.save();
    return profile;
  }

  // ===== Certifications =====
  async addCertification(userId: string, cert: any) {
    const profile = await this.getProfile(userId);
    profile.certifications.push(cert);
    await profile.save();
    return profile;
  }

  async updateCertification(userId: string, certId: string, data: any) {
    const profile = await this.getProfile(userId);
    const cert = profile.certifications.find(c => String(c._id) === certId);
    if (!cert) throw new ApiError(404, 'CERTIFICATION_NOT_FOUND', 'Certification not found');
    Object.assign(cert, data);
    await profile.save();
    return profile;
  }

  async deleteCertification(userId: string, certId: string) {
    const profile = await this.getProfile(userId);
    const index = profile.certifications.findIndex(c => String(c._id) === certId);
    if (index === -1) throw new ApiError(404, 'CERTIFICATION_NOT_FOUND', 'Certification not found');
    profile.certifications.splice(index, 1);
    await profile.save();
    return profile;
  }
}