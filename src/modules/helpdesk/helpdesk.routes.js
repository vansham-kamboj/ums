import { Router } from 'express';
import * as ctrl from './helpdesk.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('helpdesk:read'), ctrl.list);
router.post('/', authorize('helpdesk:create'), ctrl.create);
router.get('/:id', authorize('helpdesk:read'), ctrl.getById);
router.put('/:id', authorize('helpdesk:update'), ctrl.update);
router.delete('/:id', authorize('helpdesk:delete'), ctrl.remove);




// Module-specific routes
router.post('/tickets/:id/messages', ctrl.addTicketMessage);
router.put('/tickets/:id/status', authorize('helpdesk:update'), ctrl.updateTicketStatus);
router.put('/tickets/:id/assign', authorize('helpdesk:update'), ctrl.assignTicket);




export default router;
