import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import env from './config/env.js';
import { corsOptions } from './config/cors.js';
import { initSocket } from './config/socket.js';
import { ensureUploadDir } from './services/storage.service.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { activityLogger } from './middleware/activityLog.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { maintenanceMode } from './middleware/maintenance.js';

// Module routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import teamRoutes from './modules/team/team.routes.js';
import configRoutes from './modules/config/config.routes.js';
import academicRoutes from './modules/academic/academic.routes.js';
import studentRoutes from './modules/student/student.routes.js';
import guardianRoutes from './modules/guardian/guardian.routes.js';
import employeeRoutes from './modules/employee/employee.routes.js';
import feeRoutes from './modules/fee/fee.routes.js';
import examRoutes from './modules/exam/exam.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import timetableRoutes from './modules/timetable/timetable.routes.js';
import transportRoutes from './modules/transport/transport.routes.js';
import libraryRoutes from './modules/library/library.routes.js';
import hostelRoutes from './modules/hostel/hostel.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import messRoutes from './modules/mess/mess.routes.js';
import receptionRoutes from './modules/reception/reception.routes.js';
import communicationRoutes from './modules/communication/communication.routes.js';
import calendarRoutes from './modules/calendar/calendar.routes.js';
import resourceRoutes from './modules/resource/resource.routes.js';
import onlineExamRoutes from './modules/onlineExam/onlineExam.routes.js';
import recruitmentRoutes from './modules/recruitment/recruitment.routes.js';
import disciplineRoutes from './modules/discipline/discipline.routes.js';
import activityRoutes from './modules/activity/activity.routes.js';
import blogRoutes from './modules/blog/blog.routes.js';
import newsRoutes from './modules/news/news.routes.js';
import galleryRoutes from './modules/gallery/gallery.routes.js';
import customFormRoutes from './modules/customForm/customForm.routes.js';
import approvalRoutes from './modules/approval/approval.routes.js';
import taskRoutes from './modules/task/task.routes.js';
import helpdeskRoutes from './modules/helpdesk/helpdesk.routes.js';
import socialWallRoutes from './modules/socialWall/socialWall.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import serviceRequestRoutes from './modules/serviceRequest/serviceRequest.routes.js';
import certificateRoutes from './modules/certificate/certificate.routes.js';
import reportRoutes from './modules/report/report.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import websiteRoutes from './modules/website/website.routes.js';
import utilityRoutes from './modules/utility/utility.routes.js';
import importExportRoutes from './modules/importExport/importExport.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import genericRoutes from './modules/generic/generic.routes.js';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Ensure upload directory exists
ensureUploadDir();

// Global middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(generalLimiter);
app.use(maintenanceMode);
app.use(activityLogger);

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'UMS API is running', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/config', configRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/reception', receptionRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/online-exams', onlineExamRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/discipline', disciplineRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/custom-forms', customFormRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/social-wall', socialWallRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/utilities', utilityRoutes);
app.use('/api/import-export', importExportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Generic CRUD router fallback for unmapped endpoints
app.use('/api', genericRoutes);


// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
httpServer.listen(env.port, () => {
  console.log(`🚀 UMS Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

export default app;
