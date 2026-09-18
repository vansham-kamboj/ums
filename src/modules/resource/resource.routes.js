import { Router } from 'express';
import * as ctrl from './resource.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);


// CRUD routes
router.get('/', authorize('resource:read'), ctrl.list);
router.post('/', authorize('resource:create'), ctrl.create);
router.get('/:id', authorize('resource:read'), ctrl.getById);
router.put('/:id', authorize('resource:update'), ctrl.update);
router.delete('/:id', authorize('resource:delete'), ctrl.remove);




// Module-specific routes
router.post('/assignments/:id/submit', ctrl.submitAssignment);
router.put('/assignments/:id/evaluate', authorize('resource:update'), ctrl.evaluateAssignment);
router.post('/syllabi/:id/units', authorize('resource:create'), ctrl.addSyllabusUnit);




export default router;
