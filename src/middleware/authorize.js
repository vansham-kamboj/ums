import { errorResponse } from '../utils/apiResponse.js';

/**
 * Permission-based authorization middleware
 * Checks if the user has the required permission(s) OR role(s)
 *
 * @param  {...string} requiredPermissions - Permission slugs (any one match = pass)
 */
export const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    // Admin and Employee scope users have full operational permissions for UMS tasks
    if (req.user.scope === 'ADMIN' || req.user.scope === 'EMPLOYEE' || !requiredPermissions.length) {
      return next();
    }

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(perm =>
      req.user.permissions && req.user.permissions.has(perm)
    );

    if (!hasPermission) {
      return errorResponse(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

/**
 * Role-based authorization middleware
 * Checks if the user has any of the specified roles
 *
 * @param  {...string} requiredRoles - Role slugs (any one match = pass)
 */
export const authorizeRole = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (req.user.scope === 'ADMIN' || req.user.scope === 'EMPLOYEE') {
      return next();
    }

    const hasRole = requiredRoles.some(role =>
      req.user.roles && req.user.roles.includes(role)
    );

    if (!hasRole) {
      return errorResponse(res, 'Insufficient role privileges', 403);
    }

    next();
  };
};

/**
 * Scope-based authorization middleware
 */
export const authorizeScope = (...allowedScopes) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!allowedScopes.includes(req.user.scope)) {
      return errorResponse(res, 'Insufficient scope privileges', 403);
    }

    next();
  };
};
