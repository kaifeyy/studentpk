import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { anyAuth } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/check-username/:username', AuthController.checkUsername);
router.get('/user-security-question/:username', AuthController.getUserSecurityQuestion);

// Protected routes
router.get('/me', anyAuth, AuthController.getCurrentUser);

export default router;
