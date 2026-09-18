import { Router } from 'express';
import * as ctrl from './employee.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('employee:read'), ctrl.list);
router.post('/', authorize('employee:create'), ctrl.create);
router.get('/:id', authorize('employee:read'), ctrl.getById);
router.put('/:id', authorize('employee:update'), ctrl.update);
router.delete('/:id', authorize('employee:delete'), ctrl.remove);




// Module-specific routes
// Departments (under academic module but relevant here)
router.get('/designations', authorize('employee:read'), ctrl.listDesignations);
router.post('/designations', authorize('employee:create'), ctrl.createDesignation);
router.put('/designations/:id', authorize('employee:update'), ctrl.updateDesignation);
router.delete('/designations/:id', authorize('employee:delete'), ctrl.deleteDesignation);

// Employee extended
router.get('/:id/documents', authorize('employee:read'), ctrl.getEmployeeDocuments);
router.post('/:id/documents', authorize('employee:update'), ctrl.addEmployeeDocument);
router.get('/:id/qualifications', authorize('employee:read'), ctrl.getEmployeeQualifications);
router.post('/:id/qualifications', authorize('employee:update'), ctrl.addEmployeeQualification);
router.get('/:id/experience', authorize('employee:read'), ctrl.getEmployeeExperience);
router.post('/:id/experience', authorize('employee:update'), ctrl.addEmployeeExperience);

// Attendance
router.post('/attendance/mark', authorize('attendance:create'), ctrl.markAttendance);
router.get('/attendance/records', authorize('attendance:read'), ctrl.getAttendanceRecords);
router.get('/attendance/summary', authorize('attendance:read'), ctrl.getAttendanceSummary);

// Work shifts & timesheets
router.get('/work-shifts', authorize('employee:read'), ctrl.listWorkShifts);
router.post('/work-shifts', authorize('employee:create'), ctrl.createWorkShift);
router.post('/:id/assign-shift', authorize('employee:update'), ctrl.assignWorkShift);
router.post('/timesheets', authorize('employee:create'), ctrl.createTimesheet);
router.get('/timesheets', authorize('employee:read'), ctrl.listTimesheets);

// Leave management
router.get('/leave-types', authorize('employee:read'), ctrl.listLeaveTypes);
router.post('/leave-types', authorize('employee:create'), ctrl.createLeaveType);
router.post('/leave-allocations', authorize('employee:create'), ctrl.createLeaveAllocation);
router.get('/leave-allocations', authorize('employee:read'), ctrl.listLeaveAllocations);
router.post('/leave-requests', ctrl.createLeaveRequest);
router.get('/leave-requests', authorize('employee:read'), ctrl.listLeaveRequests);
router.put('/leave-requests/:id/approve', authorize('employee:update'), ctrl.approveLeaveRequest);
router.put('/leave-requests/:id/reject', authorize('employee:update'), ctrl.rejectLeaveRequest);

// Payroll
router.get('/pay-heads', authorize('payroll:read'), ctrl.listPayHeads);
router.post('/pay-heads', authorize('payroll:create'), ctrl.createPayHead);
router.get('/salary-templates', authorize('payroll:read'), ctrl.listSalaryTemplates);
router.post('/salary-templates', authorize('payroll:create'), ctrl.createSalaryTemplate);
router.post('/salary-structures', authorize('payroll:create'), ctrl.createSalaryStructure);
router.post('/payroll/process', authorize('payroll:create'), ctrl.processPayroll);
router.post('/payroll/bulk-process', authorize('payroll:create'), ctrl.bulkProcessPayroll);
router.get('/payroll/records', authorize('payroll:read'), ctrl.listPayrollRecords);

// Tickets
router.post('/tickets', ctrl.createEmployeeTicket);
router.get('/tickets', ctrl.listEmployeeTickets);
router.post('/tickets/:id/messages', ctrl.addTicketMessage);

router.post('/bulk-update', authorize('employee:update'), ctrl.bulkUpdate);
router.get('/export', authorize('employee:export'), ctrl.exportEmployees);




export default router;
