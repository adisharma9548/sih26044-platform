import { Router } from 'express';
import { getStats, getRecentActivity, listUsers } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/activity', getRecentActivity);
router.get('/users', listUsers);

export default router;