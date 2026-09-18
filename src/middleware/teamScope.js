import prisma from '../config/database.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Team Scope Middleware
 * Ensures req.teamId is set (from auth middleware, header, or default team fallback)
 * and injects it into queries for multi-tenant scoping.
 */
export const requireTeam = async (req, res, next) => {
  if (req.teamId) {
    return next();
  }

  try {
    const existingTeam = await prisma.team.findFirst();
    if (existingTeam) {
      req.teamId = existingTeam.id;
      return next();
    }

    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Default Organization', slug: `org-${Date.now()}` }
      });
    }
    const team = await prisma.team.create({
      data: { name: 'Default Institution', organizationId: org.id }
    });
    req.teamId = team.id;
    next();
  } catch (err) {
    return errorResponse(res, 'Team context required. Set X-Team-Id header or ensure user has a default team.', 400);
  }
};
