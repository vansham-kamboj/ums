import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { routesConfig } from '../routesConfig';
import {
  Home, BookOpen, Users, GraduationCap, DollarSign, ClipboardList, Clock,
  Bus, Library, Building2, Package, UtensilsCrossed, Phone, Megaphone,
  CalendarDays, FileText, Monitor, Briefcase, Shield, Zap, PenTool,
  Newspaper, Image, FormInput, CheckSquare, ListTodo, HelpCircle,
  MessageSquare, MessageCircle, Bell, Wrench, Award, BarChart3,
  CreditCard, Globe, Settings, Building, FolderSync, ChevronDown,
  ChevronRight, Search, LogOut, User, Menu, X, ChevronLeft
} from 'lucide-react';


const getNavGroupsForUser = (user) => {
  if (!user) return [];
  
  const scope = user.scope;
  
  if (scope === 'STUDENT') {
    return [
      {
        label: 'Main',
        items: [
          { label: 'Dashboard', icon: Home, path: '/' },
          { label: 'My Profile', icon: User, path: '/student/profile' },
        ],
      },
      {
        label: 'Academic & Schedule',
        icon: BookOpen,
        items: [
          { label: 'My Attendance', path: '/student/attendance' },
          { label: 'My Timetable', path: '/student/timetable' },
          { label: 'My Exams & Results', path: '/student/results' },
          { label: 'My Assignments', path: '/resources/assignments' },
        ],
      },
      {
        label: 'Facilities & Fee',
        icon: Building2,
        items: [
          { label: 'My Fees', path: '/student/fees' },
          { label: 'My Library', path: '/library/issues' },
          { label: 'My Transport', path: '/transport/routes' },
          { label: 'My Hostel', path: '/hostel/rooms' },
          { label: 'Mess Schedule', path: '/mess/meals' },
        ],
      },
      {
        label: 'Communication',
        icon: Megaphone,
        items: [
          { label: 'Announcements', path: '/communication/announcements' },
          { label: 'Events & Holidays', path: '/calendar/events' },
          { label: 'Chat', path: '/chat' },
          { label: 'Social Wall', path: '/social-wall' },
          { label: 'Notifications', path: '/notifications' },
        ],
      },
      {
        label: 'Support',
        icon: HelpCircle,
        items: [
          { label: 'Helpdesk (Tickets)', path: '/helpdesk/tickets' },
          { label: 'FAQs', path: '/helpdesk/faqs' },
          { label: 'Service Requests', path: '/service-requests' },
        ],
      }
    ];
  }
  
  if (scope === 'GUARDIAN') {
    return [
      {
        label: 'Main',
        items: [
          { label: 'Dashboard', icon: Home, path: '/' },
          { label: 'My Children', icon: Users, path: '/guardian/children' },
        ],
      },
      {
        label: 'Child Records',
        icon: GraduationCap,
        items: [
          { label: 'Attendance', path: '/guardian/child-attendance' },
          { label: 'Fees & Payments', path: '/guardian/child-fees' },
          { label: 'Timetable', path: '/guardian/child-timetable' },
          { label: 'Exams & Results', path: '/guardian/child-results' },
          { label: 'Transport', path: '/guardian/child-transport' },
        ],
      },
      {
        label: 'Communication',
        icon: Megaphone,
        items: [
          { label: 'Announcements', path: '/communication/announcements' },
          { label: 'Events & Holidays', path: '/calendar/events' },
          { label: 'Chat', path: '/chat' },
          { label: 'Notifications', path: '/notifications' },
        ],
      },
      {
        label: 'Support',
        icon: HelpCircle,
        items: [
          { label: 'Helpdesk', path: '/helpdesk/tickets' },
          { label: 'Service Requests', path: '/service-requests' },
        ],
      }
    ];
  }

  // Admin and Employee
  return navGroupsAdminEmployee;
};

const navGroupsAdminEmployee = [

  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: Home, path: '/' },
    ],
  },
  {
    label: 'Academic Setup',
    icon: BookOpen,
    items: [
      { label: 'Academic Sessions', path: '/academic/sessions' },
      { label: 'Program Types', path: '/academic/program-types' },
      { label: 'Departments', path: '/academic/departments' },
      { label: 'Programs', path: '/academic/programs' },
      { label: 'Divisions', path: '/academic/divisions' },
      { label: 'Courses', path: '/academic/courses' },
      { label: 'Batches', path: '/academic/batches' },
      { label: 'Subjects', path: '/academic/subjects' },
      { label: 'Subject Types', path: '/academic/subject-types' },
      { label: 'Class Timings', path: '/academic/class-timings' },
      { label: 'Enrollment Seats', path: '/academic/enrollment-seats' },
    ],
  },
  {
    label: 'Student Management',
    icon: GraduationCap,
    items: [
      { label: 'Enquiries', path: '/students/enquiries' },
      { label: 'Registrations', path: '/students/registrations' },
      { label: 'Students', path: '/students' },
      { label: 'Student Groups', path: '/students/groups' },
      { label: 'Alumni', path: '/students/alumni' },
      { label: 'Guardians', path: '/guardians' },
    ],
  },
  {
    label: 'HR & Employees',
    icon: Briefcase,
    items: [
      { label: 'Employees', path: '/employees' },
      { label: 'Work Shifts', path: '/employees/work-shifts' },
      { label: 'Timesheets', path: '/employees/timesheets' },
      { label: 'Leave Types', path: '/employees/leave-types' },
      { label: 'Leave Allocations', path: '/employees/leave-allocations' },
      { label: 'Leave Requests', path: '/employees/leave-requests' },
      { label: 'Pay Heads', path: '/employees/pay-heads' },
      { label: 'Salary Templates', path: '/employees/salary-templates' },
      { label: 'Salary Structures', path: '/employees/salary-structures' },
      { label: 'Payroll', path: '/employees/payroll' },
    ],
  },
  {
    label: 'Fee & Finance',
    icon: DollarSign,
    items: [
      { label: 'Fee Groups', path: '/fees/groups' },
      { label: 'Fee Heads', path: '/fees/heads' },
      { label: 'Fee Structures', path: '/fees/structures' },
      { label: 'Fee Concessions', path: '/fees/concessions' },
      { label: 'Student Fees', path: '/fees/student-fees' },
      { label: 'Fee Collection', path: '/fees/collect' },
      { label: 'Ledger Types', path: '/fees/ledger-types' },
      { label: 'Ledgers', path: '/fees/ledgers' },
      { label: 'Transactions', path: '/fees/transactions' },
    ],
  },
  {
    label: 'Examination',
    icon: ClipboardList,
    items: [
      { label: 'Exam Terms', path: '/exams/terms' },
      { label: 'Exams', path: '/exams' },
      { label: 'Exam Grades', path: '/exams/grades' },
      { label: 'Exam Assessments', path: '/exams/assessments' },
      { label: 'Exam Schedules', path: '/exams/schedules' },
      { label: 'Marks Entry', path: '/exams/marks-entry' },
    ],
  },
  {
    label: 'Attendance & Schedule',
    icon: Clock,
    items: [
      { label: 'Mark Attendance', path: '/attendance/mark' },
      { label: 'Student Attendance', path: '/attendance/students' },
      { label: 'Employee Attendance', path: '/attendance/employees' },
      { label: 'Timetable', path: '/timetable' },
    ],
  },
  {
    label: 'Facilities',
    icon: Building2,
    items: [
      { label: 'Transport Circles', path: '/transport/circles' },
      { label: 'Stoppages', path: '/transport/stoppages' },
      { label: 'Routes', path: '/transport/routes' },
      { label: 'Vehicles', path: '/transport/vehicles' },
      { label: 'Fuel Records', path: '/transport/fuel-records' },
      { label: 'Books', path: '/library/books' },
      { label: 'Book Issues', path: '/library/issues' },
      { label: 'Hostel Blocks', path: '/hostel/blocks' },
      { label: 'Hostel Floors', path: '/hostel/floors' },
      { label: 'Hostel Rooms', path: '/hostel/rooms' },
      { label: 'Stock Categories', path: '/inventory/categories' },
      { label: 'Stock Items', path: '/inventory/items' },
      { label: 'Vendors', path: '/inventory/vendors' },
      { label: 'Menu Items', path: '/mess/menu-items' },
      { label: 'Meals', path: '/mess/meals' },
    ],
  },
  {
    label: 'Communication',
    icon: Megaphone,
    items: [
      { label: 'Announcements', path: '/communication/announcements' },
      { label: 'Events', path: '/calendar/events' },
      { label: 'Holidays', path: '/calendar/holidays' },
      { label: 'Notifications', path: '/notifications' },
      { label: 'Reminders', path: '/notifications/reminders' },
      { label: 'Chat', path: '/chat' },
      { label: 'Social Wall', path: '/social-wall' },
    ],
  },
  {
    label: 'Front Office & Support',
    icon: Phone,
    items: [
      { label: 'Visitor Logs', path: '/reception/visitors' },
      { label: 'Gate Passes', path: '/reception/gate-passes' },
      { label: 'Call Logs', path: '/reception/call-logs' },
      { label: 'Complaints', path: '/reception/complaints' },
      { label: 'Postal', path: '/reception/postal' },
      { label: 'Tickets', path: '/helpdesk/tickets' },
      { label: 'FAQs', path: '/helpdesk/faqs' },
      { label: 'Service Requests', path: '/service-requests' },
      { label: 'Dialogues', path: '/service-requests/dialogues' },
    ],
  },
  {
    label: 'Workflow & Forms',
    icon: CheckSquare,
    items: [
      { label: 'Tasks', path: '/tasks' },
      { label: 'Approval Types', path: '/approvals/types' },
      { label: 'Approval Requests', path: '/approvals/requests' },
      { label: 'Custom Forms', path: '/custom-forms' },
      { label: 'Discipline Incidents', path: '/discipline/incidents' },
    ],
  },
  {
    label: 'Content & Resources',
    icon: FileText,
    items: [
      { label: 'Assignments', path: '/resources/assignments' },
      { label: 'Diary', path: '/resources/diary' },
      { label: 'Lesson Plans', path: '/resources/lesson-plans' },
      { label: 'Syllabus', path: '/resources/syllabus' },
      { label: 'Learning Materials', path: '/resources/materials' },
      { label: 'Online Classes', path: '/resources/online-classes' },
      { label: 'Online Exams', path: '/online-exams' },
      { label: 'Blog Posts', path: '/blog/posts' },
      { label: 'News Articles', path: '/news/articles' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Certificates', path: '/certificates/templates' },
      { label: 'ID Cards', path: '/certificates/id-card-templates' },
    ],
  },
  {
    label: 'Recruitment',
    icon: Briefcase,
    items: [
      { label: 'Job Vacancies', path: '/recruitment/vacancies' },
      { label: 'Job Applications', path: '/recruitment/applications' },
      { label: 'Trips & Activities', path: '/activities/trips' },
    ],
  },
  {
    label: 'Website CMS',
    icon: Globe,
    items: [
      { label: 'Site Pages', path: '/website/pages' },
      { label: 'Site Menus', path: '/website/menus' },
      { label: 'Website Config', path: '/website/config' },
    ],
  },
  {
    label: 'System & Config',
    icon: Settings,
    items: [
      { label: 'Settings', path: '/settings' },
      { label: 'Users', path: '/users' },
      { label: 'Roles', path: '/users/roles' },
      { label: 'Organizations', path: '/organizations' },
      { label: 'Teams', path: '/teams' },
      { label: 'Custom Fields', path: '/config/custom-fields' },
      { label: 'Options', path: '/config/options' },
      { label: 'Reports', path: '/reports' },
      { label: 'Payments', path: '/payments' },
      { label: 'Todos', path: '/utility/todos' },
      { label: 'Backups', path: '/utility/backups' },
      { label: 'Activity Logs', path: '/utility/activity-logs' },
    ],
  },
];

function SidebarGroup({ group, isCollapsed }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Auto-expand if current route matches any item in this group
  useEffect(() => {
    const match = group.items.some(item =>
      location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
    );
    if (match) setExpanded(true);
  }, [location.pathname, group.items]);

  // Single item group (Dashboard)
  if (group.items.length === 1 && group.label === 'Main') {
    const item = group.items[0];
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
          isActive
            ? 'bg-brand-600 text-white shadow-lg shadow-primary-600/30'
            : 'text-text-disabled hover:bg-ink-700 hover:text-white'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? item.label : undefined}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  }

  const GroupIcon = group.icon;
  const hasActive = group.items.some(item =>
    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  if (isCollapsed) {
    return (
      <div className="relative group/nav">
        <button
          className={`w-full flex items-center justify-center p-2.5 rounded-md transition-all ${
            hasActive ? 'bg-brand-600/20 text-brand-500' : 'text-text-disabled hover:bg-ink-700 hover:text-white'
          }`}
          title={group.label}
        >
          {GroupIcon && <GroupIcon className="w-5 h-5" />}
        </button>
        {/* Flyout menu on hover */}
        <div className="absolute left-full top-0 ml-2 w-48 bg-ink-700 rounded-md shadow-lg border border-ink-700 py-1 hidden group-hover/nav:block z-50">
          <div className="px-3 py-2 text-xs font-semibold text-text-disabled uppercase">{group.label}</div>
          {group.items.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-1.5 text-sm ${isActive ? 'text-brand-500 bg-brand-600/10' : 'text-text-disabled hover:text-white hover:bg-ink-700'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          hasActive ? 'text-brand-500' : 'text-text-disabled hover:bg-ink-700 hover:text-white'
        }`}
      >
        {GroupIcon && <GroupIcon className="w-4 h-4 flex-shrink-0" />}
        <span className="flex-1 text-left">{group.label}</span>
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {expanded && (
        <div className="ml-4 pl-3 border-l border-ink-700/50 mt-1 space-y-0.5 animate-fade-in">
          {group.items.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-1.5 rounded-md text-sm transition-all ${
                  isActive
                    ? 'text-white bg-brand-600/20 font-medium'
                    : 'text-text-secondary hover:text-text-disabled hover:bg-ink-700/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user
    ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-ink-900 transition-all duration-300 ${
          sidebarCollapsed ? 'w-[68px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-ink-700 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'px-5'}`}>
          {sidebarCollapsed ? (
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
              <div>
                <h1 className="text-white font-bold text-base tracking-tight">UMS</h1>
                <p className="text-text-secondary text-[10px] font-medium">Management System</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-1">
          {getNavGroupsForUser(user)
            .map(group => {
              // For Admin/Employee, apply the routesConfig filtering
              if (user && (user.scope === 'ADMIN' || user.scope === 'EMPLOYEE')) {
                const scopeMap = routesConfig.reduce((acc, route) => {
                  acc[route.basePath] = route.allowedScopes || ['ADMIN', 'EMPLOYEE'];
                  return acc;
                }, {});
                
                scopeMap['/'] = ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'];
                scopeMap['/attendance/mark'] = ['ADMIN', 'EMPLOYEE'];
                scopeMap['/fees/collect'] = ['ADMIN', 'EMPLOYEE'];
                scopeMap['/exams/marks-entry'] = ['ADMIN', 'EMPLOYEE'];
                scopeMap['/chat'] = ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'];
                scopeMap['/reports'] = ['ADMIN', 'EMPLOYEE'];
                scopeMap['/settings'] = ['ADMIN'];
                
                const filteredItems = group.items.filter(item => {
                  const scopes = scopeMap[item.path];
                  if (!scopes) return true;
                  return user && scopes.includes(user.scope);
                });
                return { ...group, items: filteredItems };
              }
              // For Student/Guardian, the groups are pre-filtered
              return group;
            })
            .filter(group => group.items.length > 0)
            .map((group) => (
              <SidebarGroup key={group.label} group={group} isCollapsed={sidebarCollapsed} />
            ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-ink-700 p-3 flex-shrink-0">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-md text-text-disabled hover:bg-ink-700 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-md hover:bg-bg lg:hidden"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
            {/* Search */}
            <div className="hidden md:flex relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled w-4 h-4" />
              <input
                type="text"
                placeholder="Search modules, records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-md hover:bg-bg transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-1.5 rounded-md hover:bg-bg transition-colors"
              >
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-text-secondary">{user?.firstName || 'User'} {user?.lastName || ''}</p>
                  <p className="text-xs text-text-disabled">{user?.scope || 'Admin'}</p>
                </div>
                <ChevronDown className="hidden md:block w-4 h-4 text-text-disabled" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-md shadow-lg border border-border py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-text-secondary">{user?.email}</p>
                    </div>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-bg" onClick={() => setUserMenuOpen(false)}>
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <Link to="/users" className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-bg" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
