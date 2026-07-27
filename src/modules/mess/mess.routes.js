import { Router } from 'express';
import * as ctrl from './mess.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('mess:read'), ctrl.list);
router.post('/', authorize('mess:create'), ctrl.create);
router.get('/:id', authorize('mess:read'), ctrl.getById);
router.put('/:id', authorize('mess:update'), ctrl.update);
router.delete('/:id', authorize('mess:delete'), ctrl.remove);




// Module-specific routes
router.get('/schedule/today', ctrl.getTodaySchedule);




export default router;
