import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { anyAuth } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', anyAuth, AuthController.getCurrentUser);

export default router;
