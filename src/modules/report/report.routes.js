import { Router } from 'express';
import * as ctrl from './report.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();




router.use(authenticate);
router.use(requireTeam);


// Module-specific routes

router.get('/students/profile', authorize('report:read'), ctrl.studentProfileReport);
router.get('/students/attendance', authorize('report:read'), ctrl.studentAttendanceReport);
router.get('/students/subject-wise', authorize('report:read'), ctrl.subjectWiseStudentReport);
router.get('/students/siblings', authorize('report:read'), ctrl.siblingReport);
router.get('/exams/marks', authorize('report:read'), ctrl.examMarksReport);
router.get('/finance/day-book', authorize('report:read'), ctrl.dayBookReport);
router.get('/finance/fee-summary', authorize('report:read'), ctrl.feeSummaryReport);
router.get('/finance/head-wise', authorize('report:read'), ctrl.headWiseFeeSummary);
router.get('/finance/concession', authorize('report:read'), ctrl.concessionSummaryReport);
router.get('/finance/gateway', authorize('report:read'), ctrl.gatewayReport);
router.get('/finance/transport', authorize('report:read'), ctrl.transportFinanceReport);
router.get('/employees/attendance', authorize('report:read'), ctrl.employeeAttendanceReport);



export default router;
