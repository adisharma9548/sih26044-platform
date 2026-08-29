import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { sendSuccess } from '../utils/response';

const studentService = new StudentService();

export class StudentController {
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
      const id = req.params.id as string; // ✅ Cast to string
      const profile = await studentService.updateEducation(userId, id, req.body);
      res.status(200).json(sendSuccess(profile, 'Education updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string; // ✅ Cast to string
      const profile = await studentService.deleteEducation(userId, id);
      res.status(200).json(sendSuccess(profile, 'Education deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

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
      const id = req.params.id as string; // ✅ Cast to string
      const profile = await studentService.updateProject(userId, id, req.body);
      res.status(200).json(sendSuccess(profile, 'Project updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string; // ✅ Cast to string
      const profile = await studentService.deleteProject(userId, id);
      res.status(200).json(sendSuccess(profile, 'Project deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

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
      const id = req.params.id as string; // ✅ Cast to string
      const profile = await studentService.updateCertification(userId, id, req.body);
      res.status(200).json(sendSuccess(profile, 'Certification updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string; // ✅ Cast to string
      const profile = await studentService.deleteCertification(userId, id);
      res.status(200).json(sendSuccess(profile, 'Certification deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}