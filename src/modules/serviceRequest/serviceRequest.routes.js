import { Router } from 'express';
import * as ctrl from './serviceRequest.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('serviceRequest:read'), ctrl.list);
router.post('/', authorize('serviceRequest:create'), ctrl.create);
router.get('/:id', authorize('serviceRequest:read'), ctrl.getById);
router.put('/:id', authorize('serviceRequest:update'), ctrl.update);
router.delete('/:id', authorize('serviceRequest:delete'), ctrl.remove);




// Module-specific routes
router.put('/requests/:id/status', authorize('service:update'), ctrl.updateServiceRequestStatus);
router.put('/edit-requests/:id/review', authorize('service:update'), ctrl.reviewEditRequest);




export default router;
