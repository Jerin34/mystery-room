import { Router } from 'express';
import { evidenceController } from './evidence.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', evidenceController.list);
router.get('/:evidenceId', evidenceController.getOne);

export default router;
