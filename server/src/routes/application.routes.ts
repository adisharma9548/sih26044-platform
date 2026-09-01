import { Router } from 'express';
import {
  apply,
  getMyApplications,
  getInternshipApplications,
  updateStatus,
} from '../controllers/application.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Student routes
router.post('/internship/:internshipId', authorize('student'), apply);
router.get('/my', authorize('student'), getMyApplications);

// Recruiter routes
router.get('/internship/:internshipId', authorize('recruiter'), getInternshipApplications);
router.put('/:id/status', authorize('recruiter'), updateStatus);

export default router;