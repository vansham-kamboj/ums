import crypto from 'crypto';

/**
 * Generate a random alphanumeric string
 */
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

/**
 * Generate a numeric OTP
 */
export const generateOtp = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Generate a sequential number with prefix
 * e.g., generateNumber('ADM', 1, 6) => 'ADM-000001'
 */
export const generateNumber = (prefix, sequence, padLength = 6) => {
  return `${prefix}-${String(sequence).padStart(padLength, '0')}`;
};

/**
 * Clean undefined values from an object (for Prisma updates)
 */
export const cleanUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
};

/**
 * Pick specific keys from an object
 */
export const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Omit specific keys from an object
 */
export const omit = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  );
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob) => {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};
