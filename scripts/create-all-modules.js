/**
 * Bulk Module Generator
 * Creates all remaining UMS module files at once
 * Run: node scripts/create-all-modules.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modulesDir = path.join(__dirname, '..', 'src', 'modules');

// =========================================================
// Module Definitions - ALL 40+ modules
// =========================================================

const moduleConfigs = {
  // Batch 4 - Academic Core
  academic: {
    model: 'academicSession',
    entities: ['AcademicSession', 'ProgramType', 'Department', 'Program', 'Division', 'Course', 'Batch', 'Subject', 'SubjectType', 'ClassTiming', 'EnrollmentSeat', 'BookList'],
    hasTeamId: true,
    extraRoutes: [
      "router.put('/sessions/:id/archive', authorize('academic:update'), ctrl.archiveSession);",
      "router.put('/sessions/:id/unarchive', authorize('academic:update'), ctrl.unarchiveSession);",
      "router.post('/courses/import', authorize('academic:create'), ctrl.importCourses);",
      "router.post('/subjects/:id/incharge', authorize('academic:update'), ctrl.assignSubjectIncharge);",
      "router.post('/subjects/:id/students', authorize('academic:update'), ctrl.mapStudentsToSubject);",
    ],
  },
  student: {
    model: 'student',
    entities: ['Student', 'Enquiry', 'Registration', 'Alumni'],
    hasTeamId: true,
    extraRoutes: [
      "// Enquiry routes",
      "router.get('/enquiries', authorize('enquiry:read'), ctrl.listEnquiries);",
      "router.post('/enquiries', authorize('enquiry:create'), ctrl.createEnquiry);",
      "router.get('/enquiries/:id', authorize('enquiry:read'), ctrl.getEnquiry);",
      "router.put('/enquiries/:id', authorize('enquiry:update'), ctrl.updateEnquiry);",
      "router.delete('/enquiries/:id', authorize('enquiry:delete'), ctrl.deleteEnquiry);",
      "router.post('/enquiries/:id/followup', authorize('enquiry:update'), ctrl.addFollowup);",
      "router.post('/enquiries/:id/convert', authorize('enquiry:update'), ctrl.convertToRegistration);",
      "router.post('/enquiries/import', authorize('enquiry:create'), ctrl.importEnquiries);",
      "",
      "// Registration routes",
      "router.get('/registrations', authorize('registration:read'), ctrl.listRegistrations);",
      "router.post('/registrations', authorize('registration:create'), ctrl.createRegistration);",
      "router.get('/registrations/:id', authorize('registration:read'), ctrl.getRegistration);",
      "router.put('/registrations/:id', authorize('registration:update'), ctrl.updateRegistration);",
      "router.delete('/registrations/:id', authorize('registration:delete'), ctrl.deleteRegistration);",
      "router.post('/registrations/:id/verify', authorize('registration:update'), ctrl.verifyRegistration);",
      "router.post('/registrations/:id/convert', authorize('registration:update'), ctrl.convertToAdmission);",
      "",
      "// Student operations",
      "router.get('/:id/fees', authorize('student:read'), ctrl.getStudentFees);",
      "router.get('/:id/attendance', authorize('student:read'), ctrl.getStudentAttendance);",
      "router.get('/:id/subjects', authorize('student:read'), ctrl.getStudentSubjects);",
      "router.get('/:id/exam-records', authorize('student:read'), ctrl.getStudentExamRecords);",
      "router.get('/:id/documents', authorize('student:read'), ctrl.getStudentDocuments);",
      "router.post('/:id/documents', authorize('student:update'), ctrl.addStudentDocument);",
      "router.get('/:id/qualifications', authorize('student:read'), ctrl.getStudentQualifications);",
      "router.post('/:id/qualifications', authorize('student:update'), ctrl.addStudentQualification);",
      "router.get('/:id/health-records', authorize('student:read'), ctrl.getStudentHealthRecords);",
      "router.post('/:id/health-records', authorize('student:update'), ctrl.addStudentHealthRecord);",
      "router.post('/:id/clock', authorize('student:update'), ctrl.clockInOut);",
      "router.post('/:id/leave-request', ctrl.createLeaveRequest);",
      "router.post('/:id/transfer-request', ctrl.createTransferRequest);",
      "router.put('/:id/mentor', authorize('student:update'), ctrl.assignMentor);",
      "router.post('/bulk-update', authorize('student:update'), ctrl.bulkUpdate);",
      "router.get('/export', authorize('student:export'), ctrl.exportStudents);",
      "router.get('/search', authorize('student:read'), ctrl.searchStudents);",
      "",
      "// Alumni",
      "router.get('/alumni', authorize('alumni:read'), ctrl.listAlumni);",
      "router.post('/alumni', authorize('alumni:create'), ctrl.createAlumni);",
      "router.put('/alumni/:id', authorize('alumni:update'), ctrl.updateAlumni);",
      "router.delete('/alumni/:id', authorize('alumni:delete'), ctrl.deleteAlumni);",
      "",
      "// Public routes (no auth)",
    ],
  },
  guardian: {
    model: 'guardian',
    entities: ['Guardian'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/link-student', authorize('guardian:update'), ctrl.linkStudent);",
      "router.put('/:id/primary', authorize('guardian:update'), ctrl.setPrimary);",
      "router.post('/import', authorize('guardian:create'), ctrl.importGuardians);",
      "router.post('/:id/create-account', authorize('guardian:update'), ctrl.createGuardianAccount);",
      "router.post('/:id/sync', authorize('guardian:update'), ctrl.syncGuardian);",
      "router.get('/export', authorize('guardian:export'), ctrl.exportGuardians);",
    ],
  },

  // Batch 5 - HR & Finance
  employee: {
    model: 'employee',
    entities: ['Employee', 'Designation'],
    hasTeamId: true,
    extraRoutes: [
      "// Departments (under academic module but relevant here)",
      "router.get('/designations', authorize('employee:read'), ctrl.listDesignations);",
      "router.post('/designations', authorize('employee:create'), ctrl.createDesignation);",
      "router.put('/designations/:id', authorize('employee:update'), ctrl.updateDesignation);",
      "router.delete('/designations/:id', authorize('employee:delete'), ctrl.deleteDesignation);",
      "",
      "// Employee extended",
      "router.get('/:id/documents', authorize('employee:read'), ctrl.getEmployeeDocuments);",
      "router.post('/:id/documents', authorize('employee:update'), ctrl.addEmployeeDocument);",
      "router.get('/:id/qualifications', authorize('employee:read'), ctrl.getEmployeeQualifications);",
      "router.post('/:id/qualifications', authorize('employee:update'), ctrl.addEmployeeQualification);",
      "router.get('/:id/experience', authorize('employee:read'), ctrl.getEmployeeExperience);",
      "router.post('/:id/experience', authorize('employee:update'), ctrl.addEmployeeExperience);",
      "",
      "// Attendance",
      "router.post('/attendance/mark', authorize('attendance:create'), ctrl.markAttendance);",
      "router.get('/attendance/records', authorize('attendance:read'), ctrl.getAttendanceRecords);",
      "router.get('/attendance/summary', authorize('attendance:read'), ctrl.getAttendanceSummary);",
      "",
      "// Work shifts & timesheets",
      "router.get('/work-shifts', authorize('employee:read'), ctrl.listWorkShifts);",
      "router.post('/work-shifts', authorize('employee:create'), ctrl.createWorkShift);",
      "router.post('/:id/assign-shift', authorize('employee:update'), ctrl.assignWorkShift);",
      "router.post('/timesheets', authorize('employee:create'), ctrl.createTimesheet);",
      "router.get('/timesheets', authorize('employee:read'), ctrl.listTimesheets);",
      "",
      "// Leave management",
      "router.get('/leave-types', authorize('employee:read'), ctrl.listLeaveTypes);",
      "router.post('/leave-types', authorize('employee:create'), ctrl.createLeaveType);",
      "router.post('/leave-allocations', authorize('employee:create'), ctrl.createLeaveAllocation);",
      "router.get('/leave-allocations', authorize('employee:read'), ctrl.listLeaveAllocations);",
      "router.post('/leave-requests', ctrl.createLeaveRequest);",
      "router.get('/leave-requests', authorize('employee:read'), ctrl.listLeaveRequests);",
      "router.put('/leave-requests/:id/approve', authorize('employee:update'), ctrl.approveLeaveRequest);",
      "router.put('/leave-requests/:id/reject', authorize('employee:update'), ctrl.rejectLeaveRequest);",
      "",
      "// Payroll",
      "router.get('/pay-heads', authorize('payroll:read'), ctrl.listPayHeads);",
      "router.post('/pay-heads', authorize('payroll:create'), ctrl.createPayHead);",
      "router.get('/salary-templates', authorize('payroll:read'), ctrl.listSalaryTemplates);",
      "router.post('/salary-templates', authorize('payroll:create'), ctrl.createSalaryTemplate);",
      "router.post('/salary-structures', authorize('payroll:create'), ctrl.createSalaryStructure);",
      "router.post('/payroll/process', authorize('payroll:create'), ctrl.processPayroll);",
      "router.post('/payroll/bulk-process', authorize('payroll:create'), ctrl.bulkProcessPayroll);",
      "router.get('/payroll/records', authorize('payroll:read'), ctrl.listPayrollRecords);",
      "",
      "// Tickets",
      "router.post('/tickets', ctrl.createEmployeeTicket);",
      "router.get('/tickets', ctrl.listEmployeeTickets);",
      "router.post('/tickets/:id/messages', ctrl.addTicketMessage);",
      "",
      "router.post('/bulk-update', authorize('employee:update'), ctrl.bulkUpdate);",
      "router.get('/export', authorize('employee:export'), ctrl.exportEmployees);",
    ],
  },
  fee: {
    model: 'feeGroup',
    entities: ['FeeGroup', 'FeeHead', 'FeeStructure', 'FeeConcession', 'StudentFee', 'FeePayment'],
    hasTeamId: true,
    extraRoutes: [
      "// Fee structures",
      "router.post('/structures/:id/components', authorize('fee:create'), ctrl.addFeeStructureComponent);",
      "router.post('/structures/:id/installments', authorize('fee:create'), ctrl.addFeeInstallment);",
      "",
      "// Concessions",
      "router.post('/concessions/:id/records', authorize('fee:create'), ctrl.addFeeConcessionRecord);",
      "",
      "// Student fees",
      "router.post('/allocate', authorize('fee:create'), ctrl.allocateStudentFee);",
      "router.post('/payments', authorize('fee:create'), ctrl.processPayment);",
      "router.get('/payments', authorize('fee:read'), ctrl.listPayments);",
      "router.post('/refunds', authorize('fee:create'), ctrl.processRefund);",
      "router.get('/refunds', authorize('fee:read'), ctrl.listRefunds);",
      "router.get('/missing', authorize('fee:read'), ctrl.detectMissingFees);",
      "router.get('/mismatches', authorize('fee:read'), ctrl.detectMismatches);",
      "router.post('/import', authorize('fee:create'), ctrl.importCustomFees);",
      "",
      "// Financial transactions",
      "router.get('/ledger-types', authorize('finance:read'), ctrl.listLedgerTypes);",
      "router.post('/ledger-types', authorize('finance:create'), ctrl.createLedgerType);",
      "router.get('/ledgers', authorize('finance:read'), ctrl.listLedgers);",
      "router.post('/ledgers', authorize('finance:create'), ctrl.createLedger);",
      "router.get('/payment-methods', authorize('finance:read'), ctrl.listPaymentMethods);",
      "router.post('/payment-methods', authorize('finance:create'), ctrl.createPaymentMethod);",
      "router.get('/transactions', authorize('finance:read'), ctrl.listTransactions);",
      "router.post('/transactions', authorize('finance:create'), ctrl.createTransaction);",
      "router.get('/transactions/:id', authorize('finance:read'), ctrl.getTransaction);",
      "router.post('/transactions/import', authorize('finance:create'), ctrl.importTransactions);",
      "",
      "// Day closure",
      "router.post('/day-closure', authorize('finance:create'), ctrl.closeDailyCollection);",
      "router.get('/day-closure', authorize('finance:read'), ctrl.getDayClosure);",
      "",
      "// Reports",
      "router.get('/reports/day-book', authorize('finance:read'), ctrl.getDayBook);",
      "router.get('/reports/fee-summary', authorize('finance:read'), ctrl.getFeeSummary);",
      "router.get('/reports/head-wise', authorize('finance:read'), ctrl.getHeadWiseSummary);",
      "router.get('/reports/concession-summary', authorize('finance:read'), ctrl.getConcessionSummary);",
      "router.get('/reports/export', authorize('finance:export'), ctrl.exportFeeReport);",
    ],
  },

  // Batch 6 - Academic Operations
  exam: {
    model: 'examTerm',
    entities: ['ExamTerm', 'Exam', 'ExamGrade', 'ExamAssessment', 'ExamSchedule'],
    hasTeamId: true,
    extraRoutes: [
      "router.put('/terms/reorder', authorize('exam:update'), ctrl.reorderTerms);",
      "router.put('/reorder', authorize('exam:update'), ctrl.reorderExams);",
      "router.post('/schedules/:id/records', authorize('exam:create'), ctrl.addExamRecords);",
      "router.post('/schedules/:id/lock', authorize('exam:update'), ctrl.lockExamMarks);",
      "router.post('/results/publish', authorize('exam:update'), ctrl.publishResults);",
      "router.get('/reports/subject-wise', authorize('exam:read'), ctrl.getSubjectWiseReport);",
      "router.get('/reports/marks', authorize('exam:read'), ctrl.getMarksReport);",
      "router.post('/competencies', authorize('exam:create'), ctrl.createCompetency);",
      "router.get('/competencies', authorize('exam:read'), ctrl.listCompetencies);",
      "router.post('/observations', authorize('exam:create'), ctrl.createObservation);",
      "router.get('/observations', authorize('exam:read'), ctrl.listObservations);",
    ],
  },
  attendance: {
    model: 'studentAttendance',
    entities: ['AttendanceType'],
    hasTeamId: false,
    extraRoutes: [
      "// Student attendance",
      "router.post('/students/mark', authorize('attendance:create'), ctrl.markStudentAttendance);",
      "router.post('/students/qr', authorize('attendance:create'), ctrl.markAttendanceByQr);",
      "router.post('/students/clock', ctrl.studentClockInOut);",
      "router.get('/students/report', authorize('attendance:read'), ctrl.getStudentAttendanceReport);",
      "router.get('/students/subject-wise', authorize('attendance:read'), ctrl.getSubjectWiseReport);",
      "",
      "// Employee attendance",
      "router.post('/employees/mark', authorize('attendance:create'), ctrl.markEmployeeAttendance);",
      "router.get('/employees/summary', authorize('attendance:read'), ctrl.getEmployeeAttendanceSummary);",
      "router.get('/employees/records', authorize('attendance:read'), ctrl.getEmployeeAttendanceRecords);",
    ],
  },
  timetable: {
    model: 'timetable',
    entities: ['Timetable'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/records', authorize('timetable:create'), ctrl.addTimetableRecord);",
      "router.post('/:id/allocations', authorize('timetable:create'), ctrl.addTimetableAllocation);",
      "router.get('/batch/:batchId', authorize('timetable:read'), ctrl.getBatchTimetable);",
      "router.get('/teacher/:employeeId', authorize('timetable:read'), ctrl.getTeacherTimetable);",
      "router.put('/bulk-update', authorize('timetable:update'), ctrl.bulkUpdatePeriods);",
    ],
  },
  resource: {
    model: 'assignment',
    entities: ['Assignment', 'Diary', 'LessonPlan', 'Syllabus', 'LearningMaterial', 'OnlineClass', 'Download'],
    hasTeamId: false,
    extraRoutes: [
      "router.post('/assignments/:id/submit', ctrl.submitAssignment);",
      "router.put('/assignments/:id/evaluate', authorize('resource:update'), ctrl.evaluateAssignment);",
      "router.post('/syllabi/:id/units', authorize('resource:create'), ctrl.addSyllabusUnit);",
    ],
  },

  // Batch 7 - Facility Modules
  transport: {
    model: 'transportCircle',
    entities: ['TransportCircle', 'TransportStoppage', 'TransportRoute', 'Vehicle'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/routes/:id/stoppages', authorize('transport:create'), ctrl.addRouteStoppage);",
      "router.post('/routes/:id/passengers', authorize('transport:create'), ctrl.addRoutePassenger);",
      "router.post('/routes/:id/fees', authorize('transport:create'), ctrl.addTransportFee);",
      "router.post('/vehicles/:id/documents', authorize('transport:create'), ctrl.addVehicleDocument);",
      "router.post('/vehicles/:id/incharge', authorize('transport:create'), ctrl.assignVehicleIncharge);",
      "router.post('/vehicles/:id/fuel', authorize('transport:create'), ctrl.addFuelRecord);",
      "router.post('/vehicles/:id/service', authorize('transport:create'), ctrl.addServiceRecord);",
      "router.post('/vehicles/:id/trip', authorize('transport:create'), ctrl.addTripRecord);",
      "router.post('/vehicles/:id/case', authorize('transport:create'), ctrl.addCaseRecord);",
      "router.post('/vehicles/:id/expense', authorize('transport:create'), ctrl.addVehicleExpense);",
      "router.post('/stoppages/import', authorize('transport:create'), ctrl.importStoppages);",
      "router.get('/reports', authorize('transport:read'), ctrl.getTransportReports);",
    ],
  },
  library: {
    model: 'book',
    entities: ['Book'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/copies', authorize('library:create'), ctrl.addBookCopy);",
      "router.post('/:id/additions', authorize('library:create'), ctrl.addBookAddition);",
      "router.post('/issue', authorize('library:create'), ctrl.issueBook);",
      "router.post('/return', authorize('library:create'), ctrl.returnBook);",
      "router.get('/overdue', authorize('library:read'), ctrl.getOverdueBooks);",
      "router.get('/reports', authorize('library:read'), ctrl.getLibraryReports);",
    ],
  },
  hostel: {
    model: 'hostelBlock',
    entities: ['HostelBlock', 'HostelFloor', 'HostelRoom'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/rooms/:id/allocate', authorize('hostel:create'), ctrl.allocateRoom);",
      "router.delete('/rooms/:id/deallocate/:allocationId', authorize('hostel:delete'), ctrl.deallocateRoom);",
      "router.get('/availability', authorize('hostel:read'), ctrl.getRoomAvailability);",
    ],
  },
  inventory: {
    model: 'inventory',
    entities: ['Inventory', 'StockCategory', 'StockItem', 'Vendor'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/items/:id/copies', authorize('inventory:create'), ctrl.addStockItemCopy);",
      "router.post('/purchases', authorize('inventory:create'), ctrl.createStockPurchase);",
      "router.post('/requisitions', authorize('inventory:create'), ctrl.createStockRequisition);",
      "router.put('/requisitions/:id/approve', authorize('inventory:update'), ctrl.approveRequisition);",
      "router.post('/transfers', authorize('inventory:create'), ctrl.createStockTransfer);",
      "router.post('/adjustments', authorize('inventory:create'), ctrl.createStockAdjustment);",
      "router.get('/balances', authorize('inventory:read'), ctrl.getStockBalances);",
      "router.post('/import', authorize('inventory:create'), ctrl.importStockItems);",
    ],
  },
  mess: {
    model: 'menuItem',
    entities: ['MenuItem', 'Meal', 'MealLog'],
    hasTeamId: true,
    extraRoutes: [
      "router.get('/schedule/today', ctrl.getTodaySchedule);",
    ],
  },

  // Batch 8 - Communication & Engagement
  reception: {
    model: 'visitorLog',
    entities: ['VisitorLog', 'GatePass', 'CallLog', 'Complaint', 'OnlineQuery', 'PostalCorrespondence'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/complaints/:id/assign', authorize('complaint:update'), ctrl.assignComplaint);",
      "router.post('/complaints/:id/log', authorize('complaint:update'), ctrl.addComplaintLog);",
      "router.put('/complaints/:id/resolve', authorize('complaint:update'), ctrl.resolveComplaint);",
    ],
  },
  communication: {
    model: 'announcement',
    entities: ['Announcement'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/send', authorize('communication:create'), ctrl.sendCommunication);",
      "router.get('/records', authorize('communication:read'), ctrl.listCommunicationRecords);",
      "",
      "// Templates",
      "router.get('/templates/mail', authorize('communication:read'), ctrl.listMailTemplates);",
      "router.post('/templates/mail', authorize('communication:create'), ctrl.createMailTemplate);",
      "router.put('/templates/mail/:id', authorize('communication:update'), ctrl.updateMailTemplate);",
      "router.delete('/templates/mail/:id', authorize('communication:delete'), ctrl.deleteMailTemplate);",
      "router.get('/templates/sms', authorize('communication:read'), ctrl.listSmsTemplates);",
      "router.post('/templates/sms', authorize('communication:create'), ctrl.createSmsTemplate);",
      "router.put('/templates/sms/:id', authorize('communication:update'), ctrl.updateSmsTemplate);",
      "router.delete('/templates/sms/:id', authorize('communication:delete'), ctrl.deleteSmsTemplate);",
      "router.get('/templates/whatsapp', authorize('communication:read'), ctrl.listWhatsappTemplates);",
      "router.post('/templates/whatsapp', authorize('communication:create'), ctrl.createWhatsappTemplate);",
      "router.put('/templates/whatsapp/:id', authorize('communication:update'), ctrl.updateWhatsappTemplate);",
      "router.delete('/templates/whatsapp/:id', authorize('communication:delete'), ctrl.deleteWhatsappTemplate);",
      "router.get('/templates/push', authorize('communication:read'), ctrl.listPushTemplates);",
      "router.post('/templates/push', authorize('communication:create'), ctrl.createPushTemplate);",
      "router.put('/templates/push/:id', authorize('communication:update'), ctrl.updatePushTemplate);",
      "router.delete('/templates/push/:id', authorize('communication:delete'), ctrl.deletePushTemplate);",
    ],
  },
  calendar: {
    model: 'event',
    entities: ['Event', 'Holiday'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/events/:id/incharge', authorize('calendar:update'), ctrl.assignEventIncharge);",
      "router.get('/combined', authenticate, ctrl.getCombinedCalendar);",
    ],
  },
  notification: {
    model: 'notification',
    entities: ['Reminder'],
    hasTeamId: false,
    extraRoutes: [
      "router.get('/', ctrl.listNotifications);",
      "router.put('/:id/read', ctrl.markAsRead);",
      "router.put('/read-all', ctrl.markAllAsRead);",
      "router.get('/unread-count', ctrl.getUnreadCount);",
      "router.post('/push/register-device', ctrl.registerDevice);",
      "",
      "// Reminders",
      "router.get('/reminders', ctrl.listReminders);",
      "router.post('/reminders', ctrl.createReminder);",
      "router.put('/reminders/:id', ctrl.updateReminder);",
      "router.delete('/reminders/:id', ctrl.deleteReminder);",
    ],
  },
  chat: {
    model: 'conversation',
    entities: ['Conversation'],
    hasTeamId: true,
    extraRoutes: [
      "router.get('/:id/messages', ctrl.listMessages);",
      "router.post('/:id/messages', ctrl.sendMessage);",
      "router.put('/messages/:messageId/read', ctrl.markMessageRead);",
      "router.get('/users/search', ctrl.searchChatUsers);",
    ],
  },
  socialWall: {
    model: 'post',
    entities: ['Post'],
    hasTeamId: true,
    extraRoutes: [
      "router.get('/feed', ctrl.getFeed);",
      "router.post('/:id/comments', ctrl.addComment);",
      "router.get('/:id/comments', ctrl.listComments);",
      "router.delete('/comments/:commentId', ctrl.deleteComment);",
    ],
  },

  // Batch 9 - Support & Workflow
  customForm: {
    model: 'customForm',
    entities: ['CustomForm'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/fields', authorize('form:create'), ctrl.addFormField);",
      "router.put('/fields/:fieldId', authorize('form:update'), ctrl.updateFormField);",
      "router.delete('/fields/:fieldId', authorize('form:delete'), ctrl.deleteFormField);",
      "router.post('/:id/submit', ctrl.submitForm);",
      "router.get('/:id/submissions', authorize('form:read'), ctrl.listSubmissions);",
    ],
  },
  approval: {
    model: 'approvalType',
    entities: ['ApprovalType', 'ApprovalRequest'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/types/:id/levels', authorize('approval:create'), ctrl.addApprovalLevel);",
      "router.post('/requests', ctrl.submitApprovalRequest);",
      "router.put('/requests/:id/approve', authorize('approval:update'), ctrl.approveRequest);",
      "router.put('/requests/:id/reject', authorize('approval:update'), ctrl.rejectRequest);",
    ],
  },
  task: {
    model: 'task',
    entities: ['Task'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/members', ctrl.addTaskMember);",
      "router.delete('/:id/members/:memberId', ctrl.removeTaskMember);",
      "router.post('/:id/checklists', ctrl.addChecklist);",
      "router.put('/checklists/:checklistId/toggle', ctrl.toggleChecklist);",
      "router.delete('/checklists/:checklistId', ctrl.deleteChecklist);",
    ],
  },
  helpdesk: {
    model: 'ticket',
    entities: ['Ticket', 'FAQ'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/tickets/:id/messages', ctrl.addTicketMessage);",
      "router.put('/tickets/:id/status', authorize('helpdesk:update'), ctrl.updateTicketStatus);",
      "router.put('/tickets/:id/assign', authorize('helpdesk:update'), ctrl.assignTicket);",
    ],
  },
  serviceRequest: {
    model: 'serviceAllocation',
    entities: ['ServiceAllocation', 'ServiceRequest', 'Dialogue', 'ContactEditRequest'],
    hasTeamId: true,
    extraRoutes: [
      "router.put('/requests/:id/status', authorize('service:update'), ctrl.updateServiceRequestStatus);",
      "router.put('/edit-requests/:id/review', authorize('service:update'), ctrl.reviewEditRequest);",
    ],
  },
  discipline: {
    model: 'incident',
    entities: ['Incident'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/link-students', authorize('discipline:update'), ctrl.linkStudents);",
    ],
  },

  // Batch 10 - Content & Public
  blog: {
    model: 'blogPost',
    entities: ['BlogPost', 'BlogCategory', 'BlogTag'],
    hasTeamId: true,
    extraRoutes: [],
    publicRoutes: [
      "publicRouter.get('/', ctrl.listPublicBlogs);",
      "publicRouter.get('/:slug', ctrl.getPublicBlog);",
    ],
  },
  news: {
    model: 'newsArticle',
    entities: ['NewsArticle', 'NewsCategory', 'NewsTag'],
    hasTeamId: true,
    extraRoutes: [],
    publicRoutes: [
      "publicRouter.get('/', ctrl.listPublicNews);",
      "publicRouter.get('/:slug', ctrl.getPublicNewsArticle);",
    ],
  },
  gallery: {
    model: 'gallery',
    entities: ['Gallery'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/images', authorize('gallery:create'), ctrl.addGalleryImage);",
      "router.delete('/images/:imageId', authorize('gallery:delete'), ctrl.deleteGalleryImage);",
    ],
    publicRoutes: [
      "publicRouter.get('/', ctrl.listPublicGalleries);",
      "publicRouter.get('/:id', ctrl.getPublicGallery);",
    ],
  },
  recruitment: {
    model: 'jobVacancy',
    entities: ['JobVacancy', 'JobApplication'],
    hasTeamId: true,
    extraRoutes: [
      "router.put('/applications/:id/status', authorize('recruitment:update'), ctrl.updateApplicationStatus);",
    ],
    publicRoutes: [
      "publicRouter.get('/jobs', ctrl.listPublicJobs);",
      "publicRouter.get('/jobs/:id', ctrl.getPublicJob);",
      "publicRouter.post('/jobs/:id/apply', ctrl.applyForJob);",
    ],
  },
  activity: {
    model: 'trip',
    entities: ['Trip'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/:id/participants', authorize('activity:create'), ctrl.addParticipant);",
      "router.delete('/:id/participants/:participantId', authorize('activity:delete'), ctrl.removeParticipant);",
    ],
  },
  certificate: {
    model: 'certificateTemplate',
    entities: ['CertificateTemplate', 'IdCardTemplate'],
    hasTeamId: true,
    extraRoutes: [
      "router.post('/generate', authorize('certificate:create'), ctrl.generateCertificate);",
      "router.get('/list', authorize('certificate:read'), ctrl.listCertificates);",
      "router.post('/id-cards/generate', authorize('certificate:create'), ctrl.generateIdCard);",
      "router.get('/id-cards/list', authorize('certificate:read'), ctrl.listIdCards);",
    ],
    publicRoutes: [
      "publicRouter.get('/verify/:number', ctrl.verifyCertificate);",
    ],
  },
  onlineExam: {
    model: 'onlineExam',
    entities: ['OnlineExam'],
    hasTeamId: true,
    extraRoutes: [
      "router.get('/:id/questions', authorize('online-exam:read'), ctrl.listQuestions);",
      "router.post('/:id/questions', authorize('online-exam:create'), ctrl.addQuestion);",
      "router.put('/questions/:questionId', authorize('online-exam:update'), ctrl.updateQuestion);",
      "router.delete('/questions/:questionId', authorize('online-exam:delete'), ctrl.deleteQuestion);",
      "router.post('/:id/submit', ctrl.submitExam);",
      "router.get('/:id/submissions', authorize('online-exam:read'), ctrl.listSubmissions);",
      "router.get('/:id/results', ctrl.getResults);",
    ],
  },
  website: {
    model: 'sitePage',
    entities: ['SitePage', 'SiteMenu'],
    hasTeamId: true,
    extraRoutes: [
      "router.get('/config', authorize('website:read'), ctrl.getWebsiteConfig);",
      "router.put('/config', authorize('website:update'), ctrl.updateWebsiteConfig);",
      "router.post('/pages/:id/blocks', authorize('website:create'), ctrl.addSiteBlock);",
      "router.put('/blocks/:blockId', authorize('website:update'), ctrl.updateSiteBlock);",
      "router.delete('/blocks/:blockId', authorize('website:delete'), ctrl.deleteSiteBlock);",
    ],
    publicRoutes: [
      "publicRouter.get('/pages/:slug', ctrl.getPublicPage);",
    ],
  },

  // Batch 11 - Utilities & Integration
  payment: {
    model: 'paymentGatewayConfig',
    entities: ['PaymentGatewayConfig'],
    hasTeamId: false,
    extraRoutes: [
      "router.post('/initiate', ctrl.initiatePayment);",
      "router.post('/verify', ctrl.verifyPayment);",
      "router.get('/status/:orderId', ctrl.getPaymentStatus);",
      "router.get('/gateways', ctrl.listActiveGateways);",
    ],
    publicRoutes: [
      "publicRouter.post('/guest', ctrl.guestPayment);",
      "publicRouter.post('/webhook/:gateway', ctrl.handleWebhook);",
    ],
  },
  report: {
    model: null,
    entities: [],
    hasTeamId: true,
    customRoutes: [
      "router.get('/students/profile', authorize('report:read'), ctrl.studentProfileReport);",
      "router.get('/students/attendance', authorize('report:read'), ctrl.studentAttendanceReport);",
      "router.get('/students/subject-wise', authorize('report:read'), ctrl.subjectWiseStudentReport);",
      "router.get('/students/siblings', authorize('report:read'), ctrl.siblingReport);",
      "router.get('/exams/marks', authorize('report:read'), ctrl.examMarksReport);",
      "router.get('/finance/day-book', authorize('report:read'), ctrl.dayBookReport);",
      "router.get('/finance/fee-summary', authorize('report:read'), ctrl.feeSummaryReport);",
      "router.get('/finance/head-wise', authorize('report:read'), ctrl.headWiseFeeSummary);",
      "router.get('/finance/concession', authorize('report:read'), ctrl.concessionSummaryReport);",
      "router.get('/finance/gateway', authorize('report:read'), ctrl.gatewayReport);",
      "router.get('/finance/transport', authorize('report:read'), ctrl.transportFinanceReport);",
      "router.get('/employees/attendance', authorize('report:read'), ctrl.employeeAttendanceReport);",
    ],
  },
  utility: {
    model: 'todo',
    entities: ['Todo', 'Backup'],
    hasTeamId: true,
    extraRoutes: [
      "// Todo operations",
      "router.post('/todos/:id/items', ctrl.addTodoItem);",
      "router.put('/todos/items/:itemId/toggle', ctrl.toggleTodoItem);",
      "router.put('/todos/:id/archive', ctrl.archiveTodo);",
      "router.put('/todos/:id/unarchive', ctrl.unarchiveTodo);",
      "router.put('/todos/:id/reorder', ctrl.reorderTodoItems);",
      "router.get('/todos/export', ctrl.exportTodos);",
      "",
      "// Backups",
      "router.post('/backups', authorize('utility:create'), ctrl.createBackup);",
      "router.get('/backups', authorize('utility:read'), ctrl.listBackups);",
      "router.delete('/backups/:id', authorize('utility:delete'), ctrl.deleteBackup);",
      "",
      "// Activity logs",
      "router.get('/activity-logs', authorize('utility:read'), ctrl.listActivityLogs);",
      "router.get('/activity-logs/export', authorize('utility:export'), ctrl.exportActivityLogs);",
      "",
      "// Server logs",
      "router.get('/server-logs', authorize('utility:read'), ctrl.getServerLogs);",
    ],
  },
  importExport: {
    model: null,
    entities: [],
    hasTeamId: true,
    customRoutes: [
      "router.post('/import/:type', authorize('import:create'), ctrl.handleImport);",
      "router.get('/import/jobs', authorize('import:read'), ctrl.listImportJobs);",
      "router.delete('/import/students/rollback', authorize('import:delete'), ctrl.rollbackStudentImport);",
      "router.get('/export/:type', authorize('export:read'), ctrl.handleExport);",
      "router.get('/export/jobs', authorize('export:read'), ctrl.listExportJobs);",
    ],
  },
  dashboard: {
    model: null,
    entities: [],
    hasTeamId: true,
    customRoutes: [
      "router.get('/admin', authorize('dashboard:read'), ctrl.getAdminDashboard);",
      "router.get('/student', ctrl.getStudentDashboard);",
      "router.get('/guardian', ctrl.getGuardianDashboard);",
      "router.get('/stats', authorize('dashboard:read'), ctrl.getStats);",
      "router.get('/charts/students', authorize('dashboard:read'), ctrl.getStudentCharts);",
      "router.get('/charts/transactions', authorize('dashboard:read'), ctrl.getTransactionCharts);",
      "router.get('/charts/fees', authorize('dashboard:read'), ctrl.getFeeCharts);",
      "router.get('/birthdays', ctrl.getBirthdays);",
      "router.get('/schedule', ctrl.getSchedule);",
      "router.get('/timetable', ctrl.getDashboardTimetable);",
      "router.get('/galleries', ctrl.getDashboardGalleries);",
      "router.get('/forms', ctrl.getDashboardForms);",
      "router.get('/pinned', ctrl.getPinnedItems);",
    ],
  },
};

// =========================================================
// Generator Functions
// =========================================================

function generateRoutes(name, config) {
  const hasPublic = config.publicRoutes && config.publicRoutes.length > 0;
  const isCustom = config.customRoutes && config.customRoutes.length > 0;

  return `import { Router } from 'express';
import * as ctrl from './${name}.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();
${hasPublic ? `const publicRouter = Router();\n` : ''}

${isCustom ? '' : `router.use(authenticate);
${config.hasTeamId ? 'router.use(requireTeam);' : ''}

// CRUD routes
router.get('/', authorize('${name}:read'), ctrl.list);
router.post('/', authorize('${name}:create'), ctrl.create);
router.get('/:id', authorize('${name}:read'), ctrl.getById);
router.put('/:id', authorize('${name}:update'), ctrl.update);
router.delete('/:id', authorize('${name}:delete'), ctrl.remove);
`}

${isCustom ? `router.use(authenticate);\n${config.hasTeamId ? 'router.use(requireTeam);\n' : ''}` : ''}

// Module-specific routes
${(config.extraRoutes || []).join('\n')}
${(config.customRoutes || []).join('\n')}

${hasPublic ? `// Public routes (no auth)\n${config.publicRoutes.join('\n')}\n\nrouter.use('/public', publicRouter);` : ''}

export default router;
`;
}

function generateController(name, config) {
  const isCustom = config.customRoutes && config.customRoutes.length > 0;

  // Extract handler names from routes
  const allRoutes = [...(config.extraRoutes || []), ...(config.customRoutes || []), ...(config.publicRoutes || [])];
  const handlers = new Set();

  allRoutes.forEach(route => {
    const match = route.match(/ctrl\.(\w+)/);
    if (match) handlers.add(match[1]);
  });

  return `import * as service from './${name}.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/apiResponse.js';
import { getPagination } from '../../utils/pagination.js';

${!isCustom ? `
// Standard CRUD handlers
export const list = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query);
    const result = await service.list(req.teamId, req.query, pagination);
    return paginatedResponse(res, 'Records retrieved', result.data, { ...pagination, total: result.total });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const item = await service.getById(req.params.id, req.teamId);
    if (!item) return errorResponse(res, 'Record not found', 404);
    return successResponse(res, 'Record retrieved', item);
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const item = await service.create(req.body, req.teamId, req.user.id);
    return successResponse(res, 'Record created', item, 201);
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const item = await service.update(req.params.id, req.body, req.teamId);
    return successResponse(res, 'Record updated', item);
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.teamId);
    return successResponse(res, 'Record deleted');
  } catch (error) { next(error); }
};
` : ''}

// Module-specific handlers
${Array.from(handlers).map(handler => `
export const ${handler} = async (req, res, next) => {
  try {
    const result = await service.${handler}(req.params, req.body, req.query, req.teamId, req.user);
    return successResponse(res, 'Operation successful', result);
  } catch (error) { next(error); }
};`).join('\n')}
`;
}

function generateService(name, config) {
  const model = config.model;
  const hasTeamId = config.hasTeamId;

  // Extract handler names
  const allRoutes = [...(config.extraRoutes || []), ...(config.customRoutes || []), ...(config.publicRoutes || [])];
  const handlers = new Set();
  allRoutes.forEach(route => {
    const match = route.match(/ctrl\.(\w+)/);
    if (match) handlers.add(match[1]);
  });

  return `import prisma from '../../config/database.js';
import { buildSearchFilter } from '../../utils/pagination.js';
import { generateExcel } from '../../services/excel.service.js';

${model ? `
// ==================== Standard CRUD ====================

export const list = async (teamId, query = {}, pagination = {}) => {
  const where = {
    ${hasTeamId ? '...(teamId ? { teamId } : {}),' : ''}
    ...buildSearchFilter(query.search, ['name', 'title']),
  };
  const [data, total] = await Promise.all([
    prisma.${model}.findMany({ where, skip: pagination.skip, take: pagination.take, orderBy: { createdAt: 'desc' } }),
    prisma.${model}.count({ where }),
  ]);
  return { data, total };
};

export const getById = async (id, teamId) => {
  return prisma.${model}.findFirst({ where: { id${hasTeamId ? ', ...(teamId ? { teamId } : {})' : ''} } });
};

export const create = async (data, teamId, userId) => {
  return prisma.${model}.create({ data: { ...data, ${hasTeamId ? 'teamId,' : ''} } });
};

export const update = async (id, data, teamId) => {
  return prisma.${model}.update({ where: { id }, data });
};

export const remove = async (id, teamId) => {
  return prisma.${model}.delete({ where: { id } });
};
` : ''}

// ==================== Module-specific Operations ====================

${Array.from(handlers).map(handler => `
export const ${handler} = async (params = {}, body = {}, query = {}, teamId, user) => {
  // Implementation for ${handler}
  // TODO: Add specific business logic
  return { message: '${handler} executed', params, body: Object.keys(body) };
};`).join('\n')}
`;
}

function generateValidator(name) {
  return `import Joi from 'joi';

export const create = Joi.object({
  name: Joi.string().allow('', null),
  title: Joi.string().allow('', null),
}).unknown(true);

export const update = Joi.object({
  name: Joi.string().allow('', null),
  title: Joi.string().allow('', null),
}).unknown(true);

export const id = Joi.object({
  id: Joi.string().uuid().required(),
});
`;
}

// =========================================================
// Generate All Modules
// =========================================================

let generatedCount = 0;

for (const [name, config] of Object.entries(moduleConfigs)) {
  const dir = path.join(modulesDir, name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const files = {
    [`${name}.routes.js`]: generateRoutes(name, config),
    [`${name}.controller.js`]: generateController(name, config),
    [`${name}.service.js`]: generateService(name, config),
    [`${name}.validator.js`]: generateValidator(name),
  };

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(dir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  }

  generatedCount++;
  console.log(`✅ Generated module: ${name}`);
}

console.log(`\n🚀 Done! Generated ${generatedCount} modules.`);
