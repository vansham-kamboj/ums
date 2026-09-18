import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import prisma from '../../config/database.js';
import env from '../../config/env.js';
import { createOtp, verifyOtp } from '../../services/otp.service.js';
import { sendEmail } from '../../services/email.service.js';

/**
 * Generate JWT tokens
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtAccessExpiry });
  const refreshToken = jwt.sign({ userId }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiry });
  return { accessToken, refreshToken };
};

/**
 * Log a login attempt
 */
const logLoginAttempt = async (userId, email, ip, userAgent, success) => {
  await prisma.loginAttempt.create({
    data: { userId, email, ipAddress: ip || 'unknown', userAgent, success },
  });
};

/**
 * Log user access
 */
const logAccess = async (userId, action, ip, userAgent) => {
  await prisma.userAccessLog.create({
    data: { userId, action, ipAddress: ip, userAgent },
  });
};

/**
 * Register a new user
 */
export const register = async (data) => {
  data.email = data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Check if this is the very first user in the database
  const userCount = await prisma.user.count();
  const isFirstUser = userCount === 0;

  let teamId = null;

  if (isFirstUser) {
    const org = await prisma.organization.create({
      data: { name: 'Default Organization' }
    });
    const team = await prisma.team.create({
      data: { organizationId: org.id, name: 'Default Team' }
    });
    teamId = team.id;
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName || null,
      phone: data.phone || null,
      scope: isFirstUser ? 'ADMIN' : 'EMPLOYEE',
      teams: teamId ? {
        create: {
          teamId,
          isDefault: true
        }
      } : undefined
    },
    select: { id: true, email: true, firstName: true, lastName: true, scope: true },
  });

  // Send email verification OTP
  const otp = await createOtp(data.email, 'EMAIL_VERIFY');
  await sendEmail({
    to: data.email,
    subject: 'Verify your email - UMS',
    html: `<p>Your email verification code is: <strong>${otp}</strong></p><p>This code expires in ${env.otpExpiryMinutes} minutes.</p>`,
  });

  return { user };
};

/**
 * Email + Password Login
 */
export const login = async (data, ip, userAgent) => {
  data.email = data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ 
    where: { email: data.email },
    include: { teams: true }
  });

  if (!user) {
    await logLoginAttempt(null, data.email, ip, userAgent, false);
    throw new Error('Invalid credentials');
  }

  if (user.status !== 'ACTIVE') {
    await logLoginAttempt(user.id, data.email, ip, userAgent, false);
    throw new Error('Account is deactivated');
  }

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    await logLoginAttempt(user.id, data.email, ip, userAgent, false);
    throw new Error('Invalid credentials');
  }

  // Check 2FA
  if (user.twoFactorEnabled) {
    if (!data.twoFactorCode) {
      throw new Error('2FA code required');
    }
    const isValid2FA = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: data.twoFactorCode,
      window: 1,
    });
    if (!isValid2FA) throw new Error('Invalid credentials');
  }

  const tokens = generateTokens(user.id);

  // Save refresh token and update login info
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: tokens.refreshToken,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
      screenLockedAt: null,
    },
  });

  await logLoginAttempt(user.id, data.email, ip, userAgent, true);
  await logAccess(user.id, 'LOGIN', ip, userAgent);

  return {
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      scope: user.scope,
      forcePasswordChange: user.forcePasswordChange,
      teams: user.teams,
    },
  };
};

/**
 * Request Login OTP
 */
export const requestLoginOtp = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const otp = await createOtp(email, 'LOGIN');

  await sendEmail({
    to: email,
    subject: 'Login OTP - UMS',
    html: `<p>Your login OTP is: <strong>${otp}</strong></p><p>This code expires in ${env.otpExpiryMinutes} minutes.</p>`,
  });

  return true;
};

/**
 * Verify Login OTP
 */
export const verifyLoginOtp = async (data, ip, userAgent) => {
  const isValid = await verifyOtp(data.email, data.code, 'LOGIN');
  if (!isValid) throw new Error('Invalid or expired OTP');

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error('User not found');

  const tokens = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: tokens.refreshToken,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
      screenLockedAt: null,
    },
  });

  await logLoginAttempt(user.id, data.email, ip, userAgent, true);
  await logAccess(user.id, 'LOGIN_OTP', ip, userAgent);

  return {
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      scope: user.scope,
    },
  };
};

/**
 * Forgot Password
 */
export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // Silent fail to prevent email enumeration

  const otp = await createOtp(email, 'PASSWORD_RESET');

  await sendEmail({
    to: email,
    subject: 'Password Reset - UMS',
    html: `<p>Your password reset code is: <strong>${otp}</strong></p><p>This code expires in ${env.otpExpiryMinutes} minutes.</p>`,
  });
};

/**
 * Reset Password
 */
export const resetPassword = async (data) => {
  const isValid = await verifyOtp(data.email, data.code, 'PASSWORD_RESET');
  if (!isValid) throw new Error('Invalid or expired OTP');

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await prisma.user.update({
    where: { email: data.email },
    data: {
      password: hashedPassword,
      forcePasswordChange: false,
      refreshToken: null,
    },
  });
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }

  const tokens = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return tokens;
};

/**
 * Verify Email
 */
export const verifyEmail = async (data) => {
  const isValid = await verifyOtp(data.email, data.code, 'EMAIL_VERIFY');
  if (!isValid) throw new Error('Invalid or expired OTP');

  await prisma.user.update({
    where: { email: data.email },
    data: { emailVerified: true, emailVerifiedAt: new Date() },
  });
};

/**
 * Get Profile
 */
export const getProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, username: true, firstName: true, lastName: true,
      phone: true, avatar: true, scope: true, status: true, emailVerified: true,
      twoFactorEnabled: true, lastLoginAt: true, createdAt: true,
      teams: { include: { team: { select: { id: true, name: true, logo: true } } } },
      roles: { include: { role: { select: { id: true, name: true, slug: true } } } },
    },
  });
};

/**
 * Change Password
 */
export const changePassword = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) throw new Error('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      forcePasswordChange: false,
      refreshToken: null,
    },
  });
};

/**
 * Logout
 */
export const logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

/**
 * Lock Screen
 */
export const lockScreen = async (userId, pin) => {
  const hashedPin = pin ? await bcrypt.hash(pin, 10) : null;
  await prisma.user.update({
    where: { id: userId },
    data: { screenLockedAt: new Date(), screenLockPin: hashedPin },
  });
};

/**
 * Unlock Screen
 */
export const unlockScreen = async (userId, pin) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user.screenLockPin) {
    const isValid = await bcrypt.compare(pin, user.screenLockPin);
    if (!isValid) throw new Error('Invalid PIN');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { screenLockedAt: null, screenLockPin: null },
  });
};

/**
 * Enable 2FA — generate secret
 */
export const enable2FA = async (userId) => {
  const secret = speakeasy.generateSecret({
    name: env.twoFaAppName,
    issuer: env.twoFaAppName,
  });

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret.base32 },
  });

  return {
    secret: secret.base32,
    otpAuthUrl: secret.otpauth_url,
  };
};

/**
 * Verify & confirm 2FA
 */
export const verify2FA = async (userId, code) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!isValid) throw new Error('Invalid 2FA code');

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });
};

/**
 * Disable 2FA
 */
export const disable2FA = async (userId, code) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!isValid) throw new Error('Invalid 2FA code');

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });
};

/**
 * Impersonate another user (admin only)
 */
export const impersonate = async (adminUserId, targetUserId, ip) => {
  const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
  if (admin.scope !== 'ADMIN') throw new Error('Only admins can impersonate');

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) throw new Error('Target user not found');

  // Log impersonation
  await prisma.impersonation.create({
    data: { impersonatorId: adminUserId, impersonatedId: targetUserId, ipAddress: ip },
  });

  const tokens = generateTokens(targetUserId);

  return {
    ...tokens,
    user: {
      id: target.id,
      email: target.email,
      firstName: target.firstName,
      lastName: target.lastName,
      scope: target.scope,
    },
    impersonating: true,
  };
};

/**
 * Stop impersonation
 */
export const stopImpersonate = async (userId) => {
  const active = await prisma.impersonation.findFirst({
    where: { impersonatedId: userId, endedAt: null },
    orderBy: { startedAt: 'desc' },
  });

  if (active) {
    await prisma.impersonation.update({
      where: { id: active.id },
      data: { endedAt: new Date() },
    });

    // Return tokens for the original admin user
    const tokens = generateTokens(active.impersonatorId);
    return tokens;
  }
};
