import { Router } from 'express';
import * as ctrl from './timetable.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize, authorizeScope } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('timetable:read'), ctrl.list);
router.post('/', authorize('timetable:create'), ctrl.create);
router.get('/:id', authorize('timetable:read'), ctrl.getById);
router.put('/:id', authorize('timetable:update'), ctrl.update);
router.delete('/:id', authorize('timetable:delete'), ctrl.remove);




// Module-specific routes
router.get('/my', authorizeScope('STUDENT'), ctrl.getMyTimetable);
router.post('/:id/records', authorize('timetable:create'), ctrl.addTimetableRecord);
router.post('/:id/allocations', authorize('timetable:create'), ctrl.addTimetableAllocation);
router.get('/batch/:batchId', authorize('timetable:read'), ctrl.getBatchTimetable);
router.get('/teacher/:employeeId', authorize('timetable:read'), ctrl.getTeacherTimetable);
router.put('/bulk-update', authorize('timetable:update'), ctrl.bulkUpdatePeriods);




export default router;
