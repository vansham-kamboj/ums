import * as authService from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, 'Registration successful. Please verify your email.', result, 201);
  } catch (error) {
    if (error.message === 'Email already registered') {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, req.ip, req.headers['user-agent']);
    return successResponse(res, 'Login successful', result);
  } catch (error) {
    if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
      return errorResponse(res, error.message, 401);
    }
    if (error.message === '2FA code required') {
      return errorResponse(res, error.message, 403, { requires2FA: true });
    }
    next(error);
  }
};

export const requestLoginOtp = async (req, res, next) => {
  try {
    await authService.requestLoginOtp(req.body.email);
    return successResponse(res, 'OTP sent to your email');
  } catch (error) {
    if (error.message === 'User not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

export const verifyLoginOtp = async (req, res, next) => {
  try {
    const result = await authService.verifyLoginOtp(req.body, req.ip, req.headers['user-agent']);
    return successResponse(res, 'OTP verified, login successful', result);
  } catch (error) {
    if (error.message === 'Invalid or expired OTP') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    return successResponse(res, 'Password reset OTP sent to your email');
  } catch (error) {
    // Don't reveal if email exists or not
    return successResponse(res, 'If the email is registered, a password reset OTP has been sent');
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    return successResponse(res, 'Password reset successful');
  } catch (error) {
    if (error.message === 'Invalid or expired OTP') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return errorResponse(res, 'Refresh token required', 400);
    const result = await authService.refreshAccessToken(refreshToken);
    return successResponse(res, 'Token refreshed', result);
  } catch (error) {
    return errorResponse(res, 'Invalid refresh token', 401);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body);
    return successResponse(res, 'Email verified successfully');
  } catch (error) {
    if (error.message === 'Invalid or expired OTP') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    return successResponse(res, 'Profile retrieved', profile);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    return successResponse(res, 'Password changed successfully');
  } catch (error) {
    if (error.message === 'Current password is incorrect') {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    return successResponse(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const lockScreen = async (req, res, next) => {
  try {
    await authService.lockScreen(req.user.id, req.body.pin);
    return successResponse(res, 'Screen locked');
  } catch (error) {
    next(error);
  }
};

export const unlockScreen = async (req, res, next) => {
  try {
    await authService.unlockScreen(req.user.id, req.body.pin);
    return successResponse(res, 'Screen unlocked');
  } catch (error) {
    if (error.message === 'Invalid PIN') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

export const enable2FA = async (req, res, next) => {
  try {
    const result = await authService.enable2FA(req.user.id);
    return successResponse(res, '2FA secret generated. Scan QR code and verify.', result);
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req, res, next) => {
  try {
    await authService.verify2FA(req.user.id, req.body.code);
    return successResponse(res, '2FA enabled successfully');
  } catch (error) {
    if (error.message === 'Invalid 2FA code') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

export const disable2FA = async (req, res, next) => {
  try {
    await authService.disable2FA(req.user.id, req.body.code);
    return successResponse(res, '2FA disabled');
  } catch (error) {
    if (error.message === 'Invalid 2FA code') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

export const impersonate = async (req, res, next) => {
  try {
    const result = await authService.impersonate(req.user.id, req.params.userId, req.ip);
    return successResponse(res, 'Impersonation started', result);
  } catch (error) {
    if (error.message === 'Only admins can impersonate') {
      return errorResponse(res, error.message, 403);
    }
    next(error);
  }
};

export const stopImpersonate = async (req, res, next) => {
  try {
    await authService.stopImpersonate(req.user.id);
    return successResponse(res, 'Impersonation ended');
  } catch (error) {
    next(error);
  }
};
