import { Router } from 'express';
import * as ctrl from './guardian.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('guardian:read'), ctrl.list);
router.post('/', authorize('guardian:create'), ctrl.create);
router.get('/:id', authorize('guardian:read'), ctrl.getById);
router.put('/:id', authorize('guardian:update'), ctrl.update);
router.delete('/:id', authorize('guardian:delete'), ctrl.remove);




// Module-specific routes
router.post('/:id/link-student', authorize('guardian:update'), ctrl.linkStudent);
router.put('/:id/primary', authorize('guardian:update'), ctrl.setPrimary);
router.post('/import', authorize('guardian:create'), ctrl.importGuardians);
router.post('/:id/create-account', authorize('guardian:update'), ctrl.createGuardianAccount);
router.post('/:id/sync', authorize('guardian:update'), ctrl.syncGuardian);
router.get('/export', authorize('guardian:export'), ctrl.exportGuardians);




export default router;
