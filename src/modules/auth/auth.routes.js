import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authLimiter, otpLimiter } from '../../middleware/rateLimiter.js';
import { validate } from '../../middleware/validate.js';
import * as authValidator from './auth.validator.js';

const router = Router();

// Public auth routes (with rate limiting)
router.post('/register', authLimiter, validate({ body: authValidator.register }), authController.register);
router.post('/login', authLimiter, validate({ body: authValidator.login }), authController.login);
router.post('/login-otp/request', otpLimiter, validate({ body: authValidator.requestOtp }), authController.requestLoginOtp);
router.post('/login-otp/verify', authLimiter, validate({ body: authValidator.verifyLoginOtp }), authController.verifyLoginOtp);
router.post('/forgot-password', otpLimiter, validate({ body: authValidator.forgotPassword }), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate({ body: authValidator.resetPassword }), authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/verify-email', validate({ body: authValidator.verifyEmail }), authController.verifyEmail);

// Protected auth routes
router.use(authenticate);
router.get('/me', authController.getProfile);
router.put('/change-password', validate({ body: authValidator.changePassword }), authController.changePassword);
router.post('/logout', authController.logout);
router.post('/lock-screen', authController.lockScreen);
router.post('/unlock-screen', validate({ body: authValidator.unlockScreen }), authController.unlockScreen);
router.post('/2fa/enable', authController.enable2FA);
router.post('/2fa/verify', validate({ body: authValidator.verify2FA }), authController.verify2FA);
router.post('/2fa/disable', validate({ body: authValidator.verify2FA }), authController.disable2FA);
router.post('/impersonate/:userId', authController.impersonate);
router.post('/stop-impersonate', authController.stopImpersonate);

export default router;
