import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimit';
import { handleValidationErrors } from '../middleware/validation';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../validators/auth';

const router = Router();

// Public routes
router.post('/register', authLimiter, registerValidation, handleValidationErrors, AuthController.register);
router.post('/login', authLimiter, loginValidation, handleValidationErrors, AuthController.login);
router.get('/verify-email/:token', AuthController.verifyEmail);
router.post('/resend-verification', authLimiter, AuthController.resendVerification);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidation, handleValidationErrors, AuthController.forgotPassword);
router.put('/reset-password/:token', passwordResetLimiter, resetPasswordValidation, handleValidationErrors, AuthController.resetPassword);

// Protected routes
router.use(authenticateToken);

router.get('/profile', AuthController.getProfile);
router.put('/profile', AuthController.updateProfile);
router.put('/change-password', AuthController.changePassword);
router.delete('/account', AuthController.deleteAccount);

export default router;
