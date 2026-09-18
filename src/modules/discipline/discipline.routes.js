import { Router } from 'express';
import * as ctrl from './discipline.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('discipline:read'), ctrl.list);
router.post('/', authorize('discipline:create'), ctrl.create);
router.get('/:id', authorize('discipline:read'), ctrl.getById);
router.put('/:id', authorize('discipline:update'), ctrl.update);
router.delete('/:id', authorize('discipline:delete'), ctrl.remove);




// Module-specific routes
router.post('/:id/link-students', authorize('discipline:update'), ctrl.linkStudents);




export default router;
