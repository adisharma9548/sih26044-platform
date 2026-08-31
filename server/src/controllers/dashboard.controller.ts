import { NextFunction, Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';

const dashboardService = new DashboardService();

export class DashboardController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const overview = await dashboardService.getOverview(req.user!.userId, req.user!.role as 'recruiter' | 'faculty' | 'institution');
      res.status(200).json(sendSuccess(overview, 'Dashboard overview fetched successfully'));
    } catch (error) { next(error); }
  }
}
