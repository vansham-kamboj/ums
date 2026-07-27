import { Router } from 'express';
import * as ctrl from './activity.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('activity:read'), ctrl.list);
router.post('/', authorize('activity:create'), ctrl.create);
router.get('/:id', authorize('activity:read'), ctrl.getById);
router.put('/:id', authorize('activity:update'), ctrl.update);
router.delete('/:id', authorize('activity:delete'), ctrl.remove);




// Module-specific routes
router.post('/:id/participants', authorize('activity:create'), ctrl.addParticipant);
router.delete('/:id/participants/:participantId', authorize('activity:delete'), ctrl.removeParticipant);




export default router;
