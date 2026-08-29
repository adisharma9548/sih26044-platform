import { Student, IStudent } from '../models/Student';
import { ApiError } from '../middlewares/errorHandler';
import mongoose from 'mongoose';

export class StudentService {
  async getProfile(userId: string): Promise<IStudent> {
    const profile = await Student.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, data: Partial<IStudent>): Promise<IStudent> {
    const profile = await Student.findOneAndUpdate(
      { user: userId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!profile) {
      throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');
    }
    return profile;
  }

  async addEducation(userId: string, education: any): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    profile.education.push(education);
    await profile.save();
    return profile;
  }

  async updateEducation(userId: string, educationId: string, data: any): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const edu = profile.education.find(e => String(e._id) === educationId);
    if (!edu) {
      throw new ApiError(404, 'EDUCATION_NOT_FOUND', 'Education entry not found');
    }
    Object.assign(edu, data);
    await profile.save();
    return profile;
  }

  async deleteEducation(userId: string, educationId: string): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const index = profile.education.findIndex(e => String(e._id) === educationId);
    if (index === -1) {
      throw new ApiError(404, 'EDUCATION_NOT_FOUND', 'Education entry not found');
    }
    profile.education.splice(index, 1);
    await profile.save();
    return profile;
  }

  async addProject(userId: string, project: any): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    profile.projects.push(project);
    await profile.save();
    return profile;
  }

  async updateProject(userId: string, projectId: string, data: any): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const proj = profile.projects.find(p => String(p._id) === projectId);
    if (!proj) {
      throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    }
    Object.assign(proj, data);
    await profile.save();
    return profile;
  }

  async deleteProject(userId: string, projectId: string): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const index = profile.projects.findIndex(p => String(p._id) === projectId);
    if (index === -1) {
      throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    }
    profile.projects.splice(index, 1);
    await profile.save();
    return profile;
  }

  async addCertification(userId: string, cert: any): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    profile.certifications.push(cert);
    await profile.save();
    return profile;
  }

  async updateCertification(userId: string, certId: string, data: any): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const cert = profile.certifications.find(c => String(c._id) === certId);
    if (!cert) {
      throw new ApiError(404, 'CERTIFICATION_NOT_FOUND', 'Certification not found');
    }
    Object.assign(cert, data);
    await profile.save();
    return profile;
  }

  async deleteCertification(userId: string, certId: string): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const index = profile.certifications.findIndex(c => String(c._id) === certId);
    if (index === -1) {
      throw new ApiError(404, 'CERTIFICATION_NOT_FOUND', 'Certification not found');
    }
    profile.certifications.splice(index, 1);
    await profile.save();
    return profile;
  }
}