import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected route – get own profile (any authenticated user)
router.get('/profile', authenticate, authController.getProfile.bind(authController));

// Example role-protected route (only students can access)
router.get(
  '/student-only',
  authenticate,
  authorize('student'),
  (req, res) => {
    res.json({ message: 'Welcome student!' });
  }
);

export default router;