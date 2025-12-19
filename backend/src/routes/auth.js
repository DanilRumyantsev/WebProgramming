import {Router} from 'express';
import {AuthController} from '../controllers/AuthController.js';
import {authMiddleware} from '../middleware/auth.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/profile', authMiddleware, AuthController.profile);

export default router;