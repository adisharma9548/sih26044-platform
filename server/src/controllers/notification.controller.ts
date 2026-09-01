import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

const notificationService = new NotificationService();

export const getUnread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const notifications = await notificationService.getUnread(userId);
    res.status(200).json(sendSuccess(notifications, 'Unread notifications fetched'));
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const notifications = await notificationService.getAll(userId);
    res.status(200).json(sendSuccess(notifications, 'Notifications fetched'));
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string; // ✅ explicit cast
    const notif = await notificationService.markRead(userId, id);
    res.status(200).json(sendSuccess(notif, 'Notification marked read'));
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    await notificationService.markAllRead(userId);
    res.status(200).json(sendSuccess(null, 'All notifications marked read'));
  } catch (error) {
    next(error);
  }
};