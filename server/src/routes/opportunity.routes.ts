import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunity.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const opportunityController = new OpportunityController();

router.get('/', authenticate, authorize('student'), opportunityController.list.bind(opportunityController));
router.get('/mine', authenticate, authorize('recruiter'), opportunityController.listMine.bind(opportunityController));
router.post('/', authenticate, authorize('recruiter'), opportunityController.create.bind(opportunityController));
router.put('/:id', authenticate, authorize('recruiter'), opportunityController.update.bind(opportunityController));
router.delete('/:id', authenticate, authorize('recruiter'), opportunityController.remove.bind(opportunityController));
router.get('/:id', authenticate, authorize('student'), opportunityController.get.bind(opportunityController));

export default router;
