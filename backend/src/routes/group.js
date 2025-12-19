import { Router } from 'express';
import {GroupController} from '../controllers/GroupController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', GroupController.getAll);
router.post('/', authMiddleware, GroupController.create);

export default router;