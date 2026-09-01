import { Router } from 'express';
import {
  create,
  list,
  getById,
  getMatches,
  update,
  deleteInternship,
} from '../controllers/internship.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', list);
router.get('/matches', authenticate, authorize('student'), getMatches);
router.get('/:id', getById);

router.post('/', authenticate, authorize('recruiter'), create);
router.put('/:id', authenticate, authorize('recruiter'), update);
router.delete('/:id', authenticate, authorize('recruiter'), deleteInternship);

export default router;