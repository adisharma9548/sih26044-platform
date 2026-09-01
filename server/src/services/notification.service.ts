import { Notification } from '../models/Notification';

export class NotificationService {
  async create(userId: string, category: string, message: string, link?: string) {
    const notif = new Notification({ user: userId, category, message, link });
    await notif.save();
    return notif;
  }

  async getUnread(userId: string) {
    return Notification.find({ user: userId, read: false }).sort({ createdAt: -1 });
  }

  async getAll(userId: string) {
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  async markRead(userId: string, notificationId: string) {
    const notif = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notif) throw new Error('Notification not found');
    notif.read = true;
    await notif.save();
    return notif;
  }

  async markAllRead(userId: string) {
    await Notification.updateMany({ user: userId, read: false }, { read: true });
  }
}