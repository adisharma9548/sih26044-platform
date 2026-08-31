import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const assessmentController = new AssessmentController();

router.use(authenticate);

router.get('/', authorize('student'), assessmentController.listForStudents.bind(assessmentController));
router.get('/manage/mine', authorize('institution'), assessmentController.listCreatedBy.bind(assessmentController));
router.post('/', authorize('institution'), assessmentController.create.bind(assessmentController));
router.get('/:id', authorize('student'), assessmentController.getForStudent.bind(assessmentController));
router.post('/:id/attempts', authorize('student'), assessmentController.submit.bind(assessmentController));

export default router;
