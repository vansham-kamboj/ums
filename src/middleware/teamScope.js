import { errorResponse } from '../utils/apiResponse.js';

/**
 * Team Scope Middleware
 * Ensures req.teamId is set (from auth middleware or header)
 * and injects it into queries for multi-tenant scoping.
 */
export const requireTeam = (req, res, next) => {
  if (!req.teamId) {
    return errorResponse(res, 'Team context required. Set X-Team-Id header or ensure user has a default team.', 400);
  }
  next();
};
