import { Router } from 'express';
import * as ctrl from './attendance.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize, authorizeScope } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);


// CRUD routes
router.get('/', authorize('attendance:read'), ctrl.list);
router.post('/', authorize('attendance:create'), ctrl.create);
router.get('/:id', authorize('attendance:read'), ctrl.getById);
router.put('/:id', authorize('attendance:update'), ctrl.update);
router.delete('/:id', authorize('attendance:delete'), ctrl.remove);




// Module-specific routes
// Module-specific routes
// Student attendance
router.get('/students/my', authorizeScope('STUDENT'), ctrl.getMyAttendance);
router.post('/students/mark', authorize('attendance:create'), ctrl.markStudentAttendance);
router.post('/students/qr', authorize('attendance:create'), ctrl.markAttendanceByQr);
router.post('/students/clock', ctrl.studentClockInOut);
router.get('/students/report', authorize('attendance:read'), ctrl.getStudentAttendanceReport);
router.get('/students/subject-wise', authorize('attendance:read'), ctrl.getSubjectWiseReport);

// Employee attendance
router.post('/employees/mark', authorize('attendance:create'), ctrl.markEmployeeAttendance);
router.get('/employees/summary', authorize('attendance:read'), ctrl.getEmployeeAttendanceSummary);
router.get('/employees/records', authorize('attendance:read'), ctrl.getEmployeeAttendanceRecords);




export default router;
