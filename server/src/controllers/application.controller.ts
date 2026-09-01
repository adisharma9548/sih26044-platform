import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';
import { sendSuccess } from '../utils/response';

const applicationService = new ApplicationService();

export const apply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const internshipId = req.params.internshipId as string; // ✅ explicit cast
    const application = await applicationService.apply(userId, internshipId, req.body);
    res.status(201).json(sendSuccess(application, 'Application submitted'));
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const apps = await applicationService.getStudentApplications(userId);
    res.status(200).json(sendSuccess(apps, 'Applications fetched'));
  } catch (error) {
    next(error);
  }
};

export const getInternshipApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const internshipId = req.params.internshipId as string; // ✅ explicit cast
    const apps = await applicationService.getInternshipApplications(internshipId, userId);
    res.status(200).json(sendSuccess(apps, 'Applications fetched'));
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string; // ✅ explicit cast
    const { status, note } = req.body;
    const app = await applicationService.updateStatus(id, status, note);
    res.status(200).json(sendSuccess(app, 'Application status updated'));
  } catch (error) {
    next(error);
  }
};