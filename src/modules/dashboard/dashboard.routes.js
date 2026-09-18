import { Router } from 'express';
import * as ctrl from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();




router.use(authenticate);
router.use(requireTeam);


// Module-specific routes

router.get('/admin', authorize('dashboard:read'), ctrl.getAdminDashboard);
router.get('/student', ctrl.getStudentDashboard);
router.get('/guardian', ctrl.getGuardianDashboard);
router.get('/stats', authorize('dashboard:read'), ctrl.getStats);
router.get('/charts/students', authorize('dashboard:read'), ctrl.getStudentCharts);
router.get('/charts/transactions', authorize('dashboard:read'), ctrl.getTransactionCharts);
router.get('/charts/fees', authorize('dashboard:read'), ctrl.getFeeCharts);
router.get('/birthdays', ctrl.getBirthdays);
router.get('/schedule', ctrl.getSchedule);
router.get('/timetable', ctrl.getDashboardTimetable);
router.get('/galleries', ctrl.getDashboardGalleries);
router.get('/forms', ctrl.getDashboardForms);
router.get('/pinned', ctrl.getPinnedItems);



export default router;
