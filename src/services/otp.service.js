import prisma from '../config/database.js';
import { generateOtp } from '../utils/helpers.js';
import env from '../config/env.js';

/**
 * OTP Generation and Verification Service
 */

/**
 * Generate and store OTP
 * @param {string} email - User email
 * @param {string} type - OTP type (LOGIN, EMAIL_VERIFY, PASSWORD_RESET, TWO_FACTOR)
 * @param {string} phone - Optional phone number
 * @returns {string} Generated OTP code
 */
export const createOtp = async (email, type, phone = null) => {
  // Invalidate existing OTPs
  await prisma.otpToken.updateMany({
    where: { email, type, used: false },
    data: { used: true },
  });

  const code = generateOtp(6);
  const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

  await prisma.otpToken.create({
    data: { email, phone, code, type, expiresAt },
  });

  return code;
};

/**
 * Verify OTP
 * @param {string} email - User email
 * @param {string} code - OTP code
 * @param {string} type - OTP type
 * @returns {boolean} Is valid
 */
export const verifyOtp = async (email, code, type) => {
  const otp = await prisma.otpToken.findFirst({
    where: {
      email,
      code,
      type,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) return false;

  // Mark as used
  await prisma.otpToken.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
};

/**
 * Cleanup expired OTPs (to be called periodically)
 */
export const cleanupExpiredOtps = async () => {
  return prisma.otpToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { used: true, createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
  });
};
