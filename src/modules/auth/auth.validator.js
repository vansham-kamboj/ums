import Joi from 'joi';

export const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  twoFactorCode: Joi.string().allow('', null),
});

export const requestOtp = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyLoginOtp = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
});

export const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassword = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const changePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

export const verifyEmail = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
});

export const unlockScreen = Joi.object({
  pin: Joi.string().required(),
});

export const verify2FA = Joi.object({
  code: Joi.string().length(6).required(),
});
