import { Router } from 'express';
import authRouter from '../modules/auth/auth.router';
import casesRouter from '../modules/cases/cases.router';
import evidenceRouter from '../modules/evidence/evidence.router';
import { accusationsController } from '../modules/accusations/accusations.controller';
import { notesController } from '../modules/notes/notes.controller';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { submitAccusationSchema } from '../modules/accusations/accusations.validators';
import { sendSuccess } from '../utils/response';

const router = Router();

// 1. Health check
router.get('/health', (req, res) => {
  return sendSuccess(res, {
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'AI Mystery Room API',
  });
});

// 2. Auth routes
router.use('/auth', authRouter);

// 3. Cases routes
router.use('/cases', casesRouter);

// 4. Case-scoped nested routes:
// Evidence
router.use('/cases/:caseId/evidence', evidenceRouter);

// Accusations & Result
router.post(
  '/cases/:caseId/accusation',
  authMiddleware,
  validateRequest({ body: submitAccusationSchema }),
  accusationsController.submit
);
router.get('/cases/:caseId/result', authMiddleware, accusationsController.getResult);

// Player Notes
router.get('/cases/:caseId/notes', authMiddleware, notesController.getNote);
router.put('/cases/:caseId/notes', authMiddleware, notesController.updateNote);

export default router;
