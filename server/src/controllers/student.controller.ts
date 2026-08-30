import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../middlewares/errorHandler';

const studentService = new StudentService();

export class StudentController {
  // ===== PROFILE =====
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await studentService.getProfile(userId);
      res.status(200).json(sendSuccess(profile, 'Profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await studentService.updateProfile(userId, req.body);
      res.status(200).json(sendSuccess(profile, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  // ===== EDUCATION =====
  async addEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await studentService.addEducation(userId, req.body);
      res.status(201).json(sendSuccess(profile, 'Education added successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.updateEducation(userId, id, req.body);
      res.status(200).json(sendSuccess(profile, 'Education updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.deleteEducation(userId, id);
      res.status(200).json(sendSuccess(profile, 'Education deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  // ===== PROJECTS =====
  async addProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await studentService.addProject(userId, req.body);
      res.status(201).json(sendSuccess(profile, 'Project added successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.updateProject(userId, id, req.body);
      res.status(200).json(sendSuccess(profile, 'Project updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.deleteProject(userId, id);
      res.status(200).json(sendSuccess(profile, 'Project deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  // ===== CERTIFICATIONS =====
  async addCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await studentService.addCertification(userId, req.body);
      res.status(201).json(sendSuccess(profile, 'Certification added successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.updateCertification(userId, id, req.body);
      res.status(200).json(sendSuccess(profile, 'Certification updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.deleteCertification(userId, id);
      res.status(200).json(sendSuccess(profile, 'Certification deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  // ===== SKILLS =====
  async addSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await studentService.addSkill(userId, req.body);
      res.status(201).json(sendSuccess(profile, 'Skill added successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.updateSkill(userId, id, req.body);
      res.status(200).json(sendSuccess(profile, 'Skill updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const profile = await studentService.deleteSkill(userId, id);
      res.status(200).json(sendSuccess(profile, 'Skill deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  // ===== DOCUMENTS =====
  async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new ApiError(400, 'DOCUMENT_REQUIRED', 'Select a document to upload');
      const profile = await studentService.uploadResume(req.user!.userId, req.file);
      res.status(201).json(sendSuccess(profile, 'Resume uploaded successfully'));
    } catch (error) { next(error); }
  }

  async deleteResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await studentService.deleteResume(req.user!.userId);
      res.status(200).json(sendSuccess(profile, 'Resume deleted successfully'));
    } catch (error) { next(error); }
  }

  async uploadPortfolioDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new ApiError(400, 'DOCUMENT_REQUIRED', 'Select a document to upload');
      const profile = await studentService.addPortfolioDocument(req.user!.userId, req.file);
      res.status(201).json(sendSuccess(profile, 'Portfolio document uploaded successfully'));
    } catch (error) { next(error); }
  }

  async deletePortfolioDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await studentService.deletePortfolioDocument(req.user!.userId, req.params.id as string);
      res.status(200).json(sendSuccess(profile, 'Portfolio document deleted successfully'));
    } catch (error) { next(error); }
  }

  async getDocumentDownloadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.params.type as 'resume' | 'portfolio';
      if (type !== 'resume' && type !== 'portfolio') throw new ApiError(400, 'INVALID_DOCUMENT_TYPE', 'Invalid document type');
      const url = await studentService.getDocumentDownloadUrl(req.user!.userId, type, req.params.id as string | undefined);
      res.status(200).json(sendSuccess({ url }, 'Temporary download URL created'));
    } catch (error) { next(error); }
  }
}
