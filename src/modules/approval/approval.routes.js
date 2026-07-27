import { Router } from 'express';
import * as ctrl from './approval.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('approval:read'), ctrl.list);
router.post('/', authorize('approval:create'), ctrl.create);
router.get('/:id', authorize('approval:read'), ctrl.getById);
router.put('/:id', authorize('approval:update'), ctrl.update);
router.delete('/:id', authorize('approval:delete'), ctrl.remove);




// Module-specific routes
router.post('/types/:id/levels', authorize('approval:create'), ctrl.addApprovalLevel);
router.post('/requests', ctrl.submitApprovalRequest);
router.put('/requests/:id/approve', authorize('approval:update'), ctrl.approveRequest);
router.put('/requests/:id/reject', authorize('approval:update'), ctrl.rejectRequest);




export default router;
