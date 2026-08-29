import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const studentController = new StudentController();

// All routes require authentication and student role
router.use(authenticate);
router.use(authorize('student'));

// Profile
router.get('/profile', studentController.getProfile.bind(studentController));
router.put('/profile', studentController.updateProfile.bind(studentController));

// Education
router.post('/education', studentController.addEducation.bind(studentController));
router.put('/education/:id', studentController.updateEducation.bind(studentController));
router.delete('/education/:id', studentController.deleteEducation.bind(studentController));

// Projects
router.post('/projects', studentController.addProject.bind(studentController));
router.put('/projects/:id', studentController.updateProject.bind(studentController));
router.delete('/projects/:id', studentController.deleteProject.bind(studentController));

// Certifications
router.post('/certifications', studentController.addCertification.bind(studentController));
router.put('/certifications/:id', studentController.updateCertification.bind(studentController));
router.delete('/certifications/:id', studentController.deleteCertification.bind(studentController));

export default router;