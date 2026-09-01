import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response';

const adminService = new AdminService();

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getStats();
    res.status(200).json(sendSuccess(stats, 'Stats fetched'));
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await adminService.getRecentActivity();
    res.status(200).json(sendSuccess(activity, 'Recent activity fetched'));
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.listUsers(req.query);
    res.status(200).json(sendSuccess(users, 'Users fetched'));
  } catch (error) {
    next(error);
  }
};