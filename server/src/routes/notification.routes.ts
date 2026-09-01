import { Router } from 'express';
import {
  getUnread,
  getAll,
  markRead,
  markAllRead,
} from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/unread', getUnread);
router.get('/', getAll);
router.put('/:id/read', markRead);
router.put('/mark-all-read', markAllRead);

export default router;