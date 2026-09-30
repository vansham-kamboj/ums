import { Router } from 'express';
import * as ctrl from './generic.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireTeam } from '../../middleware/teamScope.js';
import { routeModelMap } from './routeModelMap.js';

const router = Router();

// Middleware to inject the correct Prisma model name into the request
const injectModel = (req, res, next) => {
  const endpoints = Object.keys(routeModelMap).sort((a, b) => b.length - a.length);
  
  let matchedModel = null;
  let matchedEndpoint = null;
  for (const ep of endpoints) {
    if (req.path === ep || req.path.startsWith(`${ep}/`)) {
      matchedModel = routeModelMap[ep];
      matchedEndpoint = ep;
      break;
    }
  }

  if (matchedModel) {
    req.modelName = matchedModel;
    req.baseEndpoint = matchedEndpoint;
    next();
  } else {
    // If no match is found, just pass to next middleware (so the custom routes can handle it)
    next();
  }
};

// Generic CRUD endpoints mapped by `injectModel`
router.get('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName && req.baseEndpoint) {
    const baseParts = req.baseEndpoint.split('/').filter(Boolean);
    const reqParts = req.path.split('/').filter(Boolean);
    
    if (req.path === req.baseEndpoint) {
      return ctrl.list(req, res, next);
    } else if (reqParts.length === baseParts.length + 1) {
      req.params.id = reqParts[reqParts.length - 1];
      return ctrl.getById(req, res, next);
    }
  }
  next();
});

router.post('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName && req.baseEndpoint) {
    if (req.path === req.baseEndpoint) {
      return ctrl.create(req, res, next);
    }
  }
  next();
});

router.put('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName && req.baseEndpoint) {
    const baseParts = req.baseEndpoint.split('/').filter(Boolean);
    const reqParts = req.path.split('/').filter(Boolean);
    if (reqParts.length === baseParts.length + 1) {
      req.params.id = reqParts[reqParts.length - 1];
      return ctrl.update(req, res, next);
    }
  }
  next();
});

router.delete('/*', authenticate, requireTeam, injectModel, (req, res, next) => {
  if (req.modelName && req.baseEndpoint) {
    const baseParts = req.baseEndpoint.split('/').filter(Boolean);
    const reqParts = req.path.split('/').filter(Boolean);
    if (reqParts.length === baseParts.length + 1) {
      req.params.id = reqParts[reqParts.length - 1];
      return ctrl.remove(req, res, next);
    }
  }
  next();
});

export default router;
