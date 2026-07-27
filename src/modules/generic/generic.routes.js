import { Router } from 'express';
import * as ctrl from './generic.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireTeam } from '../../middleware/teamScope.js';
import { routeModelMap } from './routeModelMap.js';

const router = Router();

// Middleware to inject the correct Prisma model name into the request
const injectModel = (req, res, next) => {
  // Try to find the longest matching endpoint in routeModelMap
  // We sort by length descending to match more specific routes first
  const endpoints = Object.keys(routeModelMap).sort((a, b) => b.length - a.length);
  
  // Since this router is mounted at /api, req.path might be /academic/courses or /academic/courses/123
  // Let's find the matching base endpoint
  let matchedModel = null;
  for (const ep of endpoints) {
    if (req.path === ep || req.path.startsWith(`${ep}/`)) {
      matchedModel = routeModelMap[ep];
      break;
    }
  }

  if (matchedModel) {
    req.modelName = matchedModel;
    req.baseEndpoint = endpoints.find(ep => matchedModel === routeModelMap[ep] && req.path.startsWith(ep));
    next();
  } else {
    // If no match is found, just pass to next middleware (so the custom routes can handle it)
    next();
  }
};

// Generic CRUD endpoints mapped by `injectModel`
router.get('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName) {
    const parts = req.path.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Distinguish between GET /api/.../entities and GET /api/.../entities/:id
    // If the path exactly matches the base endpoint, it's a list.
    if (req.path === req.baseEndpoint) {
      return ctrl.list(req, res, next);
    } else {
      req.params.id = lastPart;
      return ctrl.getById(req, res, next);
    }
  }
  next();
});

router.post('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName) {
    if (req.path === req.baseEndpoint) {
      return ctrl.create(req, res, next);
    }
  }
  next();
});

router.put('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName) {
    const parts = req.path.split('/');
    req.params.id = parts[parts.length - 1];
    return ctrl.update(req, res, next);
  }
  next();
});

router.delete('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName) {
    const parts = req.path.split('/');
    req.params.id = parts[parts.length - 1];
    return ctrl.remove(req, res, next);
  }
  next();
});

export default router;
