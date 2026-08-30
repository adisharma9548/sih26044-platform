import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadDocument } from '../middlewares/upload.middleware';

const router = Router();
const studentController = new StudentController();

// All routes require authentication + student role
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

// ✅ Skills – ALL THREE METHODS
router.post('/skills', studentController.addSkill.bind(studentController));
router.put('/skills/:id', studentController.updateSkill.bind(studentController));
router.delete('/skills/:id', studentController.deleteSkill.bind(studentController));

// Private documents: PDF, DOC, and DOCX only; max 5 MB per file
router.post('/resume', uploadDocument.single('document'), studentController.uploadResume.bind(studentController));
router.delete('/resume', studentController.deleteResume.bind(studentController));
router.post('/portfolio-documents', uploadDocument.single('document'), studentController.uploadPortfolioDocument.bind(studentController));
router.delete('/portfolio-documents/:id', studentController.deletePortfolioDocument.bind(studentController));
router.get('/documents/:type/:id?', studentController.getDocumentDownloadUrl.bind(studentController));

export default router;
