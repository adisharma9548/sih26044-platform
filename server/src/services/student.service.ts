import {
  Student,
  IStudent,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SkillCategory,
  SkillLevel,
} from '../models/Student';
import { ApiError } from '../middlewares/errorHandler';
import { assertCloudinaryConfigured, cloudinary } from '../config/cloudinary';
import { CareerIntelligence, CareerIntelligenceService } from './career-intelligence.service';

interface SkillInput {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

type SkillUpdate = Partial<SkillInput>;

export class StudentService {
  private careerIntelligence = new CareerIntelligenceService();

  // ===== PROFILE =====
  async getProfile(userId: string): Promise<IStudent> {
    const profile = await Student.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, data: Partial<IStudent>): Promise<IStudent> {
    const { user, skills, education, projects, certifications, resume, portfolioDocuments, ...allowedUpdates } = data;
    const profile = await Student.findOneAndUpdate(
      { user: userId },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!profile) {
      throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Student profile not found');
    }
    return profile;
  }

  // ===== EDUCATION =====
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

  // ===== PROJECTS =====
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

  // ===== CERTIFICATIONS =====
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

  // ===== SKILLS =====
  async addSkill(userId: string, skillData: SkillInput): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const skill = this.validateSkillInput(skillData);

    if (profile.skills.some((existingSkill) => existingSkill.name.toLowerCase() === skill.name.toLowerCase())) {
      throw new ApiError(409, 'DUPLICATE_SKILL', 'Skill already exists');
    }
    profile.skills.push({
      ...skill,
      verified: false,
    });
    await profile.save();
    return profile;
  }

  async updateSkill(userId: string, skillId: string, data: SkillUpdate): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const skill = profile.skills.find((existingSkill) => String(existingSkill._id) === skillId);
    if (!skill) {
      throw new ApiError(404, 'SKILL_NOT_FOUND', 'Skill not found');
    }

    const updatedSkill = this.validateSkillInput({
      name: data.name ?? skill.name,
      category: data.category ?? skill.category,
      level: data.level ?? skill.level,
    });

    if (updatedSkill.name.toLowerCase() !== skill.name.toLowerCase()) {
      if (profile.skills.some((existingSkill) => existingSkill.name.toLowerCase() === updatedSkill.name.toLowerCase() && String(existingSkill._id) !== skillId)) {
        throw new ApiError(409, 'DUPLICATE_SKILL', 'Another skill with this name already exists');
      }
    }
    Object.assign(skill, updatedSkill);
    await profile.save();
    return profile;
  }

  async deleteSkill(userId: string, skillId: string): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const index = profile.skills.findIndex(s => String(s._id) === skillId);
    if (index === -1) {
      throw new ApiError(404, 'SKILL_NOT_FOUND', 'Skill not found');
    }
    profile.skills.splice(index, 1);
    await profile.save();
    return profile;
  }

  async getCareerIntelligence(userId: string): Promise<CareerIntelligence> {
    return this.careerIntelligence.getStudentIntelligence(await this.getProfile(userId));
  }

  getCareerOptions(): string[] { return this.careerIntelligence.getSupportedRoles(); }

  // ===== DOCUMENTS =====
  async uploadResume(userId: string, file: Express.Multer.File): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const uploadedFile = await this.uploadDocument(file, userId, 'resume');

    if (profile.resume?.publicId) {
      await this.destroyDocument(profile.resume.publicId);
    }

    profile.resume = uploadedFile;
    await profile.save();
    return profile;
  }

  async deleteResume(userId: string): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    if (!profile.resume?.publicId) {
      throw new ApiError(404, 'RESUME_NOT_FOUND', 'No resume has been uploaded');
    }

    await this.destroyDocument(profile.resume.publicId);
    profile.resume = undefined;
    await profile.save();
    return profile;
  }

  async addPortfolioDocument(userId: string, file: Express.Multer.File): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    if (profile.portfolioDocuments.length >= 5) {
      throw new ApiError(400, 'PORTFOLIO_LIMIT_REACHED', 'You can upload up to five portfolio documents');
    }

    profile.portfolioDocuments.push(await this.uploadDocument(file, userId, 'portfolio'));
    await profile.save();
    return profile;
  }

  async deletePortfolioDocument(userId: string, documentId: string): Promise<IStudent> {
    const profile = await this.getProfile(userId);
    const index = profile.portfolioDocuments.findIndex((document) => String(document._id) === documentId);
    if (index === -1) {
      throw new ApiError(404, 'PORTFOLIO_DOCUMENT_NOT_FOUND', 'Portfolio document not found');
    }

    await this.destroyDocument(profile.portfolioDocuments[index].publicId);
    profile.portfolioDocuments.splice(index, 1);
    await profile.save();
    return profile;
  }

  async getDocumentDownloadUrl(userId: string, type: 'resume' | 'portfolio', documentId?: string): Promise<string> {
    const profile = await this.getProfile(userId);
    const document = type === 'resume'
      ? profile.resume
      : profile.portfolioDocuments.find((item) => String(item._id) === documentId);

    if (!document?.publicId) {
      throw new ApiError(404, 'DOCUMENT_NOT_FOUND', 'Document not found');
    }

    assertCloudinaryConfigured();
    return cloudinary.utils.private_download_url(document.publicId, 'raw', {
      resource_type: 'raw',
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + 300,
    });
  }

  private async uploadDocument(file: Express.Multer.File, userId: string, category: 'resume' | 'portfolio') {
    assertCloudinaryConfigured();
    const result = await new Promise<{ public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          type: 'authenticated',
          folder: `sih26044/students/${userId}/${category}`,
          public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          overwrite: false,
        },
        (error, uploadResult) => error || !uploadResult ? reject(error || new Error('File upload failed')) : resolve(uploadResult)
      );
      stream.end(file.buffer);
    });

    return {
      publicId: result.public_id,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };
  }

  private async destroyDocument(publicId: string): Promise<void> {
    assertCloudinaryConfigured();
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw', type: 'authenticated' });
  }

  private validateSkillInput(input: SkillInput): SkillInput {
    const name = input.name?.trim();
    if (!name || name.length > 80) {
      throw new ApiError(400, 'INVALID_SKILL_NAME', 'Skill name must be between 1 and 80 characters');
    }

    if (!SKILL_CATEGORIES.includes(input.category)) {
      throw new ApiError(400, 'INVALID_SKILL_CATEGORY', 'Select a valid skill category');
    }

    if (!SKILL_LEVELS.includes(input.level)) {
      throw new ApiError(400, 'INVALID_SKILL_LEVEL', 'Select a valid skill level');
    }

    return { name, category: input.category, level: input.level };
  }
}
