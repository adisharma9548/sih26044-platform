import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const applicationController = new ApplicationController();

router.post('/opportunities/:opportunityId', authenticate, authorize('student'), applicationController.apply.bind(applicationController));
router.get('/mine', authenticate, authorize('student'), applicationController.listMine.bind(applicationController));
router.patch('/:id/withdraw', authenticate, authorize('student'), applicationController.withdraw.bind(applicationController));
router.get('/opportunities/:opportunityId', authenticate, authorize('recruiter'), applicationController.listForOpportunity.bind(applicationController));
router.patch('/:id/status', authenticate, authorize('recruiter'), applicationController.updateStatus.bind(applicationController));

export default router;
