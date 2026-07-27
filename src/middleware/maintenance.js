import env from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Maintenance Mode Middleware
 * Blocks all non-admin requests when maintenance mode is active.
 * Can be bypassed with a maintenance secret header.
 */
export const maintenanceMode = (req, res, next) => {
  if (!env.maintenanceMode) {
    return next();
  }

  // Allow bypass with secret header
  const bypassHeader = req.headers['x-maintenance-bypass'];
  if (bypassHeader === env.maintenanceSecret) {
    return next();
  }

  // Allow admin users through
  if (req.user && req.user.scope === 'ADMIN') {
    return next();
  }

  return errorResponse(res, 'System is under maintenance. Please try again later.', 503);
};
