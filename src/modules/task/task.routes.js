import { Router } from 'express';
import * as ctrl from './task.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('task:read'), ctrl.list);
router.post('/', authorize('task:create'), ctrl.create);
router.get('/:id', authorize('task:read'), ctrl.getById);
router.put('/:id', authorize('task:update'), ctrl.update);
router.delete('/:id', authorize('task:delete'), ctrl.remove);




// Module-specific routes
router.post('/:id/members', ctrl.addTaskMember);
router.delete('/:id/members/:memberId', ctrl.removeTaskMember);
router.post('/:id/checklists', ctrl.addChecklist);
router.put('/checklists/:checklistId/toggle', ctrl.toggleChecklist);
router.delete('/checklists/:checklistId', ctrl.deleteChecklist);




export default router;
