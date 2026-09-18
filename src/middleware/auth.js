import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import env from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * JWT Authentication Middleware
 * Extracts and verifies the JWT token from the Authorization header,
 * attaches the user object to req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        permissions: {
          include: { permission: true },
        },
        teams: {
          include: { team: true },
        },
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    if (user.status !== 'ACTIVE') {
      return errorResponse(res, 'Account is deactivated or banned', 403);
    }

    if (user.screenLockedAt) {
      return errorResponse(res, 'Screen is locked', 423);
    }

    // Build permissions set from roles + direct user permissions
    const rolePermissions = new Set();
    user.roles.forEach(ur => {
      ur.role.permissions.forEach(rp => {
        rolePermissions.add(rp.permission.slug);
      });
    });

    const directPermissions = {};
    user.permissions.forEach(up => {
      directPermissions[up.permission.slug] = up.granted;
    });

    // Merge: user overrides take precedence over role permissions
    const effectivePermissions = new Set(rolePermissions);
    Object.entries(directPermissions).forEach(([slug, granted]) => {
      if (granted) {
        effectivePermissions.add(slug);
      } else {
        effectivePermissions.delete(slug);
      }
    });

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      scope: user.scope,
      status: user.status,
      forcePasswordChange: user.forcePasswordChange,
      twoFactorEnabled: user.twoFactorEnabled,
      teams: user.teams.map(ut => ({
        id: ut.team.id,
        name: ut.team.name,
        isDefault: ut.isDefault,
      })),
      roles: user.roles.map(ur => ur.role.slug),
      permissions: effectivePermissions,
    };

    // Set current team from header or default
    const teamHeader = req.headers['x-team-id'];
    if (teamHeader) {
      const userTeam = user.teams.find(ut => ut.teamId === teamHeader);
      if (userTeam) {
        req.teamId = teamHeader;
      } else {
        return errorResponse(res, 'No access to this team', 403);
      }
    } else {
      const defaultTeam = user.teams.find(ut => ut.isDefault);
      req.teamId = defaultTeam ? defaultTeam.teamId : user.teams[0]?.teamId;
    }

    // Check force password change
    if (user.forcePasswordChange && !req.path.includes('change-password')) {
      return errorResponse(res, 'Password change required', 403, { forcePasswordChange: true });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401, { expired: true });
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * Used for public routes that optionally show user-specific data
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return authenticate(req, res, next);
};
