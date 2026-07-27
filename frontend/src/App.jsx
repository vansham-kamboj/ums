import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { routesConfig } from './routesConfig';

// Layout
import Layout from './components/Layout';

// Generic
import GenericList from './components/GenericList';
import GenericForm from './components/GenericForm';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Custom Screens
import MarkAttendance from './pages/attendance/MarkAttendance';
import FeeCollection from './pages/fee/FeeCollection';
import MarksEntry from './pages/exam/MarksEntry';
import ChatPage from './pages/chat/ChatPage';
import ReportsHub from './pages/reports/ReportsHub';
import SettingsPage from './pages/settings/SettingsPage';

// Student Pages
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

          
          {/* Student Custom Routes */}
          <Route path="student/profile" element={<ScopeRoute allowedScopes={['STUDENT']}><MyProfile /></ScopeRoute>} />
          <Route path="student/attendance" element={<ScopeRoute allowedScopes={['STUDENT']}><MyAttendance /></ScopeRoute>} />
          <Route path="student/fees" element={<ScopeRoute allowedScopes={['STUDENT']}><MyFees /></ScopeRoute>} />
          <Route path="student/results" element={<ScopeRoute allowedScopes={['STUDENT']}><MyResults /></ScopeRoute>} />
          <Route path="student/timetable" element={<ScopeRoute allowedScopes={['STUDENT']}><MyTimetable /></ScopeRoute>} />

          {/* Guardian Custom Routes */}
          <Route path="guardian/children" element={<ScopeRoute allowedScopes={['GUARDIAN']}><GuardianChildren /></ScopeRoute>} />
          <Route path="guardian/child/:id" element={<ScopeRoute allowedScopes={['GUARDIAN']}><ChildDashboard /></ScopeRoute>} />

          {/* Custom Screens */}
          <Route path="attendance/mark" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><MarkAttendance /></ScopeRoute>} />
          <Route path="fees/collect" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><FeeCollection /></ScopeRoute>} />
          <Route path="exams/marks-entry" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><MarksEntry /></ScopeRoute>} />
          <Route path="chat" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN']}><ChatPage /></ScopeRoute>} />
          <Route path="reports" element={<ScopeRoute allowedScopes={['ADMIN', 'EMPLOYEE']}><ReportsHub /></ScopeRoute>} />
          <Route path="settings" element={<ScopeRoute allowedScopes={['ADMIN']}><SettingsPage /></ScopeRoute>} />

          {/* Dynamic Routes from routesConfig */}
          {routesConfig.map((config) => {
            const base = config.basePath.startsWith('/') ? config.basePath.slice(1) : config.basePath;
            return [
              // List
              <Route
                key={`${config.basePath}-list`}
                path={base}
                element={
                  <ScopeRoute allowedScopes={config.allowedScopes}>
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
