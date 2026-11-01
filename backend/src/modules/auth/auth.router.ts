import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.validators';
import { authLimiter } from '../../middleware/rateLimiter';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.post('/register', authLimiter, validateRequest({ body: registerSchema }), authController.register);
router.post('/login', authLimiter, validateRequest({ body: loginSchema }), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);

export default router;
