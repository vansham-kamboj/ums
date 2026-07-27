import { Router } from 'express';
import * as ctrl from './student.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize, authorizeScope } from '../../middleware/authorize.js';
import { requireTeam } from '../../middleware/teamScope.js';

const router = Router();


router.use(authenticate);
router.use(requireTeam);

// CRUD routes
router.get('/', authorize('student:read'), ctrl.list);
router.post('/', authorize('student:create'), ctrl.create);
router.get('/:id', authorize('student:read'), ctrl.getById);
router.put('/:id', authorize('student:update'), ctrl.update);
router.delete('/:id', authorize('student:delete'), ctrl.remove);




// Module-specific routes
// My Profile
router.get('/my-profile', authorizeScope('STUDENT'), ctrl.getMyProfile);

// Enquiry routes
router.get('/enquiries', authorize('enquiry:read'), ctrl.listEnquiries);
router.post('/enquiries', authorize('enquiry:create'), ctrl.createEnquiry);
router.get('/enquiries/:id', authorize('enquiry:read'), ctrl.getEnquiry);
router.put('/enquiries/:id', authorize('enquiry:update'), ctrl.updateEnquiry);
router.delete('/enquiries/:id', authorize('enquiry:delete'), ctrl.deleteEnquiry);
router.post('/enquiries/:id/followup', authorize('enquiry:update'), ctrl.addFollowup);
router.post('/enquiries/:id/convert', authorize('enquiry:update'), ctrl.convertToRegistration);
router.post('/enquiries/import', authorize('enquiry:create'), ctrl.importEnquiries);

// Registration routes
router.get('/registrations', authorize('registration:read'), ctrl.listRegistrations);
router.post('/registrations', authorize('registration:create'), ctrl.createRegistration);
router.get('/registrations/:id', authorize('registration:read'), ctrl.getRegistration);
router.put('/registrations/:id', authorize('registration:update'), ctrl.updateRegistration);
router.delete('/registrations/:id', authorize('registration:delete'), ctrl.deleteRegistration);
router.post('/registrations/:id/verify', authorize('registration:update'), ctrl.verifyRegistration);
router.post('/registrations/:id/convert', authorize('registration:update'), ctrl.convertToAdmission);

// Student operations
router.get('/:id/fees', authorize('student:read'), ctrl.getStudentFees);
router.get('/:id/attendance', authorize('student:read'), ctrl.getStudentAttendance);
router.get('/:id/subjects', authorize('student:read'), ctrl.getStudentSubjects);
router.get('/:id/exam-records', authorize('student:read'), ctrl.getStudentExamRecords);
router.get('/:id/documents', authorize('student:read'), ctrl.getStudentDocuments);
router.post('/:id/documents', authorize('student:update'), ctrl.addStudentDocument);
router.get('/:id/qualifications', authorize('student:read'), ctrl.getStudentQualifications);
router.post('/:id/qualifications', authorize('student:update'), ctrl.addStudentQualification);
router.get('/:id/health-records', authorize('student:read'), ctrl.getStudentHealthRecords);
router.post('/:id/health-records', authorize('student:update'), ctrl.addStudentHealthRecord);
router.post('/:id/clock', authorize('student:update'), ctrl.clockInOut);
router.post('/:id/leave-request', ctrl.createLeaveRequest);
router.post('/:id/transfer-request', ctrl.createTransferRequest);
router.put('/:id/mentor', authorize('student:update'), ctrl.assignMentor);
router.post('/bulk-update', authorize('student:update'), ctrl.bulkUpdate);
router.get('/export', authorize('student:export'), ctrl.exportStudents);
router.get('/search', authorize('student:read'), ctrl.searchStudents);

// Alumni
router.get('/alumni', authorize('alumni:read'), ctrl.listAlumni);
router.post('/alumni', authorize('alumni:create'), ctrl.createAlumni);
router.put('/alumni/:id', authorize('alumni:update'), ctrl.updateAlumni);
router.delete('/alumni/:id', authorize('alumni:delete'), ctrl.deleteAlumni);

// Public routes (no auth)




export default router;
