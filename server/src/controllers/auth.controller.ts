import { ApiError } from '../middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role, profileData } = req.body;

      // Basic validation
      if (!email || !password || !role || !profileData) {
        throw new ApiError(400, 'MISSING_FIELDS', 'All fields are required');
      }

      const result = await authService.register({ email, password, role, profileData });
      res.status(201).json(
        sendSuccess(
          { user: { id: result.user._id, email: result.user.email, role: result.user.role }, token: result.token },
          'Registration successful'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'MISSING_FIELDS', 'Email and password are required');
      }

      const result = await authService.login({ email, password });
      res.status(200).json(
        sendSuccess(
          { user: { id: result.user._id, email: result.user.email, role: result.user.role }, token: result.token },
          'Login successful'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role as any;
      if (!userId || !role) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const result = await authService.getProfile(userId, role);
      res.status(200).json(sendSuccess(result, 'Profile fetched successfully'));
    } catch (error) {
      next(error);
    }
  }
}