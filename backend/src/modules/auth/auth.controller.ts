import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.register(req.body);
      res.cookie('token', token, COOKIE_OPTIONS);
      return sendSuccess(res, { user, token }, 201);
    } catch (err) {
      return next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.login(req.body);
      res.cookie('token', token, COOKIE_OPTIONS);
      return sendSuccess(res, { user, token }, 200);
    } catch (err) {
      return next(err);
    }
  }

  public async logout(req: Request, res: Response) {
    res.clearCookie('token');
    return sendSuccess(res, { message: 'Logged out successfully.' });
  }

  public async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError(res, 'UNAUTHORIZED', 'Not authenticated', 401);
      }
      const user = await authService.getProfile(req.user.userId);
      return sendSuccess(res, { user });
    } catch (err) {
      return next(err);
    }
  }
}

export const authController = new AuthController();
