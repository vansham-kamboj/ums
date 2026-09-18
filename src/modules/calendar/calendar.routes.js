import { Router } from 'express';
import * as ctrl from './calendar.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('calendar:read'), ctrl.list);
router.post('/', authorize('calendar:create'), ctrl.create);
router.get('/:id', authorize('calendar:read'), ctrl.getById);
router.put('/:id', authorize('calendar:update'), ctrl.update);
router.delete('/:id', authorize('calendar:delete'), ctrl.remove);




// Module-specific routes
router.post('/events/:id/incharge', authorize('calendar:update'), ctrl.assignEventIncharge);
router.get('/combined', authenticate, ctrl.getCombinedCalendar);




export default router;
