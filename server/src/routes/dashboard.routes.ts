import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.get('/overview', authenticate, authorize('recruiter', 'faculty', 'institution'), dashboardController.getOverview.bind(dashboardController));

export default router;
