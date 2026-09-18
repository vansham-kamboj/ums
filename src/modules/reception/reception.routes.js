import { Router } from 'express';
import * as ctrl from './reception.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('reception:read'), ctrl.list);
router.post('/', authorize('reception:create'), ctrl.create);
router.get('/:id', authorize('reception:read'), ctrl.getById);
router.put('/:id', authorize('reception:update'), ctrl.update);
router.delete('/:id', authorize('reception:delete'), ctrl.remove);




// Module-specific routes
router.post('/complaints/:id/assign', authorize('complaint:update'), ctrl.assignComplaint);
router.post('/complaints/:id/log', authorize('complaint:update'), ctrl.addComplaintLog);
router.put('/complaints/:id/resolve', authorize('complaint:update'), ctrl.resolveComplaint);




export default router;
