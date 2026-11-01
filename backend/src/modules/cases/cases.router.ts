import { Router } from 'express';
import { casesController } from './cases.controller';
import { authMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { createCaseSchema, listCasesQuerySchema } from './cases.validators';
import { caseGenerationLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.use(authMiddleware);

router.post('/', caseGenerationLimiter, validateRequest({ body: createCaseSchema }), casesController.create);
router.get('/', validateRequest({ query: listCasesQuerySchema }), casesController.list);
router.get('/:caseId', casesController.getOne);
router.delete('/:caseId', casesController.remove);

export default router;
