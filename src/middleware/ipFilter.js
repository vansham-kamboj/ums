import prisma from '../config/database.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * IP Filter Middleware
 * Checks if the request IP is blacklisted or whitelisted.
 * If whitelist rules exist, only whitelisted IPs are allowed.
 * If blacklist rules exist, blacklisted IPs are denied.
 */
export const ipFilter = async (req, res, next) => {
  try {
    const teamId = req.teamId || req.headers['x-team-id'];
    if (!teamId) return next();

    const clientIp = req.ip || req.connection.remoteAddress;

    // Check whitelist first
    const whitelistRules = await prisma.ipRule.findMany({
      where: { teamId, type: 'WHITELIST' },
    });

    if (whitelistRules.length > 0) {
      const isWhitelisted = whitelistRules.some(rule => rule.ipAddress === clientIp);
      if (!isWhitelisted) {
        return errorResponse(res, 'Access denied: IP not whitelisted', 403);
      }
      return next();
    }

    // Check blacklist
    const blacklistRule = await prisma.ipRule.findFirst({
      where: { teamId, type: 'BLACKLIST', ipAddress: clientIp },
    });

    if (blacklistRule) {
      return errorResponse(res, 'Access denied: IP blacklisted', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
