import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { routesConfig } from './routesConfig';

// Layout
import Layout from './components/Layout';

// Generic
import GenericList from './components/GenericList';
import GenericForm from './components/GenericForm';

// Academic Custom Lists
import AcademicSessionList from './pages/academic/AcademicSessionList';
import CourseList from './pages/academic/CourseList';
import SubjectRecordList from './pages/academic/SubjectRecordList';
import AcademicRoutes from './pages/academic/AcademicRoutes';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Custom Screens
import MarkAttendance from './pages/attendance/MarkAttendance';
import AttendanceReports from './pages/attendance/AttendanceReports';
import AttendanceHistory from './pages/attendance/AttendanceHistory';
import FeeCollection from './pages/fee/FeeCollection';
import FeeDashboard from './pages/fee/FeeDashboard';
import FeeLedger from './pages/fee/FeeLedger';
import MarksEntry from './pages/exam/MarksEntry';
import ExamSetup from './pages/exam/ExamSetup';
import ChatPage from './pages/chat/ChatPage';
import ReportsHub from './pages/reports/ReportsHub';
import CertificateTemplates from './pages/certificate/CertificateTemplates';
import ApprovalTypeConfig from './pages/approval/ApprovalTypeConfig';
import EmployeeLeave from './pages/employee/EmployeeLeave';
import SettingsPage from './pages/settings/SettingsPage';

// Custom Module Screens (replacing generic CRUD)
import LibraryWorkstation from './pages/library/LibraryWorkstation';
import HelpdeskInbox from './pages/helpdesk/HelpdeskInbox';
import HostelOccupancy from './pages/hostel/HostelOccupancy';
import TransportRouteView from './pages/transport/TransportRouteView';
import TaskBoard from './pages/task/TaskBoard';
import ApprovalWorkflow from './pages/approval/ApprovalWorkflow';
import ExamPlayer from './pages/exam/ExamPlayer';
import CertificateGenerator from './pages/certificate/CertificateGenerator';
import HiringPipeline from './pages/recruitment/HiringPipeline';
import SocialFeed from './pages/social/SocialFeed';
import BlogEditor from './pages/cms/BlogEditor';
import NewsEditor from './pages/cms/NewsEditor';
import GalleryManager from './pages/cms/GalleryManager';
import PageBuilder from './pages/cms/PageBuilder';
import WebsiteConfig from './pages/cms/WebsiteConfig';
import PayrollWorkstation from './pages/payroll/PayrollWorkstation';
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import TimetableGrid from './pages/timetable/TimetableGrid';

// Student Pages
import StudentDirectory from './pages/student/StudentDirectory';
import StudentProfile from './pages/student/StudentProfile';
import EnquiryList from './pages/student/EnquiryList';
import EnquiryDetail from './pages/student/EnquiryDetail';
import EmployeeDirectory from './pages/employee/EmployeeDirectory';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import RegistrationList from './pages/student/RegistrationList';
import RegistrationWizard from './pages/student/RegistrationWizard';
import MyAttendance from './pages/student/MyAttendance';
import MyFees from './pages/student/MyFees';
import MyResults from './pages/student/MyResults';
import MyTimetable from './pages/student/MyTimetable';
import MyProfile from './pages/student/MyProfile';

// Guardian Pages
import GuardianChildren from './pages/guardian/GuardianChildren';
import ChildDashboard from './pages/guardian/ChildDashboard';


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-10 h-10 border-3 border-brand-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function ScopeRoute({ children, allowedScopes }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedScopes && user && !allowedScopes.includes(user.scope)) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold text-ink-900">Access Denied</h2>
        <p className="text-text-secondary mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="academic/*" element={<AcademicRoutes />} />

          {/* Student Management Phase 2 Custom Routes */}
          <Route path="students/enquiries" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><EnquiryList /></ScopeRoute>} />
          <Route path="students/enquiries/:id" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><EnquiryDetail /></ScopeRoute>} />
          <Route path="students/directory" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><StudentDirectory /></ScopeRoute>} />
          <Route path="students/:id" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><StudentProfile /></ScopeRoute>} />
          <Route path="students/registrations" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><RegistrationList /></ScopeRoute>} />
          <Route path="students/registrations/new" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE', 'GUARDIAN']}><RegistrationWizard /></ScopeRoute>} />
          <Route path="student/profile" element={<ScopeRoute allowedScopes={['STUDENT']}><MyProfile /></ScopeRoute>} />
          <Route path="student/attendance" element={<ScopeRoute allowedScopes={['STUDENT']}><MyAttendance /></ScopeRoute>} />
          <Route path="student/fees" element={<ScopeRoute allowedScopes={['STUDENT']}><MyFees /></ScopeRoute>} />
          <Route path="student/results" element={<ScopeRoute allowedScopes={['STUDENT']}><MyResults /></ScopeRoute>} />
          <Route path="student/timetable" element={<ScopeRoute allowedScopes={['STUDENT']}><MyTimetable /></ScopeRoute>} />

          {/* Guardian Custom Routes */}
          <Route path="guardian/children" element={<ScopeRoute allowedScopes={['GUARDIAN']}><GuardianChildren /></ScopeRoute>} />
          <Route path="guardian/child/:id" element={<ScopeRoute allowedScopes={['GUARDIAN']}><ChildDashboard /></ScopeRoute>} />

          {/* Employee Management Custom Pages */}
          <Route path="employees" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><EmployeeDirectory /></ScopeRoute>} />
          <Route path="employees/:id" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><EmployeeProfile /></ScopeRoute>} />
          <Route path="employees/leave" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><EmployeeLeave /></ScopeRoute>} />

          {/* Custom Screens */}
          <Route path="attendance/mark" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><MarkAttendance /></ScopeRoute>} />
          <Route path="attendance/reports" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><AttendanceReports /></ScopeRoute>} />
          <Route path="attendance/history" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><AttendanceHistory /></ScopeRoute>} />
          <Route path="fees/collect" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><FeeCollection /></ScopeRoute>} />
          <Route path="fees/dashboard" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><FeeDashboard /></ScopeRoute>} />
          <Route path="fees/ledger" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><FeeLedger /></ScopeRoute>} />
          <Route path="exams/marks-entry" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><MarksEntry /></ScopeRoute>} />
          <Route path="exams/setup" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><ExamSetup /></ScopeRoute>} />
          <Route path="chat" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN']}><ChatPage /></ScopeRoute>} />
          <Route path="reports" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><ReportsHub /></ScopeRoute>} />
          <Route path="settings" element={<ScopeRoute allowedScopes={['ADMIN']}><SettingsPage /></ScopeRoute>} />

          {/* Module-Specific Custom Screens */}
          <Route path="academic/*" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><AcademicRoutes /></ScopeRoute>} />
          <Route path="library" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN']}><LibraryWorkstation /></ScopeRoute>} />
          <Route path="helpdesk" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN']}><HelpdeskInbox /></ScopeRoute>} />
          <Route path="hostel" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><HostelOccupancy /></ScopeRoute>} />
          <Route path="transport" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><TransportRouteView /></ScopeRoute>} />
          <Route path="tasks" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><TaskBoard /></ScopeRoute>} />
          <Route path="approvals" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><ApprovalWorkflow /></ScopeRoute>} />
          <Route path="approvals/config" element={<ScopeRoute allowedScopes={['ADMIN']}><ApprovalTypeConfig /></ScopeRoute>} />
          <Route path="online-exams/:examId/take" element={<ScopeRoute allowedScopes={['STUDENT']}><ExamPlayer /></ScopeRoute>} />
          <Route path="certificates" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><CertificateGenerator /></ScopeRoute>} />
          <Route path="certificates/templates" element={<ScopeRoute allowedScopes={['ADMIN']}><CertificateTemplates /></ScopeRoute>} />
          <Route path="recruitment" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><HiringPipeline /></ScopeRoute>} />
          <Route path="social" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN']}><SocialFeed /></ScopeRoute>} />
          <Route path="cms/blog/new" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><BlogEditor /></ScopeRoute>} />
          <Route path="cms/blog/:id/edit" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><BlogEditor /></ScopeRoute>} />
          <Route path="cms/news/new" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><NewsEditor /></ScopeRoute>} />
          <Route path="cms/news/:id/edit" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><NewsEditor /></ScopeRoute>} />
          <Route path="cms/gallery" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><GalleryManager /></ScopeRoute>} />
          <Route path="cms/pages" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><PageBuilder /></ScopeRoute>} />
          <Route path="website/config" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><WebsiteConfig /></ScopeRoute>} />
          <Route path="payroll" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><PayrollWorkstation /></ScopeRoute>} />
          <Route path="inventory" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><InventoryDashboard /></ScopeRoute>} />
          <Route path="timetable" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN']}><TimetableGrid /></ScopeRoute>} />

          {/* Dynamic Routes from routesConfig */}
          {routesConfig.map((config) => {
            const base = config.basePath.startsWith('/') ? config.basePath.slice(1) : config.basePath;
            let ListComponent = GenericList;
            if (base === 'academic/sessions') ListComponent = AcademicSessionList;
            else if (base === 'academic/courses') ListComponent = CourseList;
            else if (base === 'academic/subject-records') ListComponent = SubjectRecordList;

            return [
              // List
              <Route
                key={`${config.basePath}-list`}
                path={base}
                element={
                  <ScopeRoute allowedScopes={config.allowedScopes}>
                    {ListComponent === GenericList ? (
                      <GenericList
                        title={config.plural}
                        endpoint={config.endpoint}
                        columns={config.listColumns}
                        createPath={config.hideCreate ? undefined : `${config.basePath}/new`}
                        editPath={`${config.basePath}/:id/edit`}
                        hideCreate={config.hideCreate}
                        hideDelete={config.hideDelete}
                        subtitle={config.subtitle}
                        readOnlyForScopes={config.readOnlyForScopes}
                      />
                    ) : (
                      <ListComponent config={config} />
                    )}
                  </ScopeRoute>
                }
              />,
              // Create
              ...(config.formFields?.length > 0 && !config.hideCreate ? [
                <Route
                  key={`${config.basePath}-create`}
                  path={`${base}/new`}
                  element={
                    <ScopeRoute allowedScopes={config.allowedScopes}>
                      <GenericForm
                        title={config.title}
                        endpoint={config.endpoint}
                        fields={config.formFields}
                        listPath={config.basePath}
                        sections={config.formSections}
                      />
                    </ScopeRoute>
                  }
                />,
              ] : []),
              // Edit
              ...(config.formFields?.length > 0 ? [
                <Route
                  key={`${config.basePath}-edit`}
                  path={`${base}/:id/edit`}
                  element={
                    <ScopeRoute allowedScopes={config.allowedScopes}>
                      <GenericForm
                        title={config.title}
                        endpoint={config.endpoint}
                        fields={config.formFields}
                        listPath={config.basePath}
                        sections={config.formSections}
                        isEdit={true}
                      />
                    </ScopeRoute>
                  }/>,
              ] : []),
            ];
          }).flat()}

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
