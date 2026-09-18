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
      { label: 'Students', path: '/students/directory' },
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
      { label: 'Leave Management', path: '/employees/leave' },
      { label: 'Work Shifts', path: '/employees/work-shifts' },
      { label: 'Timesheets', path: '/employees/timesheets' },
      { label: 'Leave Types', path: '/employees/leave-types' },
      { label: 'Leave Allocations', path: '/employees/leave-allocations' },
      { label: 'Leave Requests', path: '/employees/leave-requests' },
      { label: 'Pay Heads', path: '/employees/pay-heads' },
      { label: 'Salary Templates', path: '/employees/salary-templates' },
      { label: 'Salary Structures', path: '/employees/salary-structures' },
      { label: 'Payroll', path: '/payroll' },
    ],
  },
  {
    label: 'Fee & Finance',
    icon: DollarSign,
    items: [
      { label: 'Fee Dashboard', path: '/fees/dashboard' },
      { label: 'Fee Collection', path: '/fees/collect' },
      { label: 'Transactions Ledger', path: '/fees/ledger' },
      { label: 'Fee Groups', path: '/fees/groups' },
      { label: 'Fee Heads', path: '/fees/heads' },
      { label: 'Fee Structures', path: '/fees/structures' },
      { label: 'Fee Concessions', path: '/fees/concessions' },
      { label: 'Student Fees', path: '/fees/student-fees' },
    ],
  },
  {
    label: 'Examination',
    icon: ClipboardList,
    items: [
      { label: 'Exam Setup', path: '/exams/setup' },
      { label: 'Exam Terms', path: '/exams/terms' },
      { label: 'Exams', path: '/exams' },
      { label: 'Exam Grades', path: '/exams/grades' },
      { label: 'Exam Assessments', path: '/exams/assessments' },
      { label: 'Exam Schedules', path: '/exams/schedules' },
      { label: 'Marks Entry', path: '/exams/marks-entry' },
      { label: 'Online Exams', path: '/online-exams' },
    ],
  },
  {
    label: 'Attendance & Schedule',
    icon: Clock,
    items: [
      { label: 'Mark Attendance', path: '/attendance/mark' },
      { label: 'Attendance Reports', path: '/attendance/reports' },
      { label: 'Attendance History', path: '/attendance/history' },
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
      { label: 'Hostel Occupancy', path: '/hostel' },
      { label: 'Hostel Blocks', path: '/hostel/blocks' },
      { label: 'Hostel Floors', path: '/hostel/floors' },
      { label: 'Hostel Rooms', path: '/hostel/rooms' },
      { label: 'Inventory', path: '/inventory' },
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
      { label: 'Approvals', path: '/approvals' },
      { label: 'Approval Config', path: '/approvals/config' },
      { label: 'Custom Forms', path: '/custom-forms' },
      { label: 'Discipline Incidents', path: '/discipline/incidents' },
    ],
  },
  {
    label: 'Content & Resources',
    icon: FileText,
    items: [
      { label: 'Certificates', path: '/certificates' },
      { label: 'Certificate Templates', path: '/certificates/templates' },
      { label: 'Online Exams', path: '/online-exams' },
      { label: 'Blog Posts', path: '/cms/blog/new' },
      { label: 'News Articles', path: '/cms/news/new' },
      { label: 'Gallery', path: '/cms/gallery' },
      { label: 'Assignments', path: '/resources/assignments' },
      { label: 'Lesson Plans', path: '/resources/lesson-plans' },
      { label: 'Syllabus', path: '/resources/syllabus' },
      { label: 'Learning Materials', path: '/resources/materials' },
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
      { label: 'Site Pages', path: '/cms/pages' },
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
      <div className="mb-3">
        {!isCollapsed && <p className="nav-label">Workspace</p>}
        <Link
          to={item.path}
          className={`nav-item ${isActive ? 'nav-item-active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
          title={isCollapsed ? item.label : undefined}
        >
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          {!isCollapsed && <span>{item.label}</span>}
        </Link>
      </div>
    );
  }

  const GroupIcon = group.icon;
  const hasActive = group.items.some(item =>
    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  if (isCollapsed) {
    const exactMatchExists = group.items.some(i => location.pathname === i.path);
    return (
      <div className="relative group/nav mb-1">
        <button
          className={`nav-item justify-center px-0 ${hasActive ? 'nav-item-active' : ''}`}
          title={group.label}
        >
          {GroupIcon && <GroupIcon className="w-4 h-4" />}
        </button>
        {/* Flyout menu on hover */}
        <div className="absolute left-full top-0 ml-2 w-52 glass-panel shadow-xl border border-glass-border py-1.5 hidden group-hover/nav:block z-50 rounded-xl">
          <div className="nav-label pt-1">{group.label}</div>
          {group.items.map((item) => {
            const isExact = location.pathname === item.path;
            const isSubPath = !exactMatchExists && item.path !== '/' && location.pathname.startsWith(item.path + '/');
            const isActive = isExact || isSubPath;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item rounded-none text-xs py-1.5 ${isActive ? 'nav-item-active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const exactMatchExists = group.items.some(i => location.pathname === i.path);

  return (
    <div className="mb-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`nav-item justify-between ${hasActive && !expanded ? 'nav-item-active' : ''}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {GroupIcon && <GroupIcon className="w-4 h-4 flex-shrink-0" />}
          <span className="truncate">{group.label}</span>
        </div>
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="ml-3.5 pl-2.5 border-l border-glass-border/60 mt-1 space-y-0.5 animate-fade-in">
          {group.items.map((item) => {
            const isExact = location.pathname === item.path;
            const isSubPath = !exactMatchExists && item.path !== '/' && location.pathname.startsWith(item.path + '/');
            const isActive = isExact || isSubPath;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item text-xs py-1.5 ${isActive ? 'nav-item-active' : ''}`}
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (e) {
      // ignore
    } finally {
      setLoggingOut(false);
      navigate('/login');
    }
  };

  const initials = user
    ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <div className="app-shell flex h-screen overflow-hidden font-body text-foreground relative">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col glass-sidebar transition-all duration-300 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo / Header */}
        <div className={`h-20 flex items-center border-b border-border/40 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'px-5'}`}>
          {sidebarCollapsed ? (
            <div className="brand-mark w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg font-heading shadow-md">
              A
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="brand-mark w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg font-heading shadow-md">
                A
              </div>
              <div>
                <h1 className="text-foreground font-bold text-base tracking-tight font-heading">Academix</h1>
                <p className="text-muted-foreground text-[11px] font-medium tracking-wide">University Portal</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-1.5">
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
        <div className="border-t border-glass-border/40 p-3 flex-shrink-0">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Top Header - Floating Glass Panel style */}
        <div className="p-4 pb-0 lg:p-6 lg:pb-0 z-40 relative">
          <header className="h-16 glass-panel flex items-center justify-between px-4 lg:px-6 flex-shrink-0 relative z-50">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-black/5 lg:hidden"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              {/* Search */}
              <div className="hidden md:flex relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search modules, records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button
                type="button"
                onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }}
                className="relative p-2 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive ring-2 ring-background" />
              </button>

              {/* User Menu Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold font-heading shadow-sm">
                    {initials}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-foreground tracking-tight">{user?.firstName || 'User'} {user?.lastName || ''}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{user?.scope || 'Admin'}</p>
                  </div>
                  <ChevronDown className="hidden md:block w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>

      {/* ======= DROPDOWNS rendered at ROOT level (outside <main>) so backdrop-filter blurs the real background ======= */}

      {/* Notifications Dropdown */}
      {notificationsOpen && (
        <>
          <div className="fixed inset-0 z-[998]" onClick={() => setNotificationsOpen(false)} />
          <div
            className="fixed z-[999] animate-scale-in"
            style={{
              top: '5.5rem',
              right: '18rem',
              width: '23rem',
              maxHeight: '29rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1.25rem',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,1), 0 20px 50px -10px rgba(15, 23, 42, 0.16)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0F172A]">Notifications</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">3 New</span>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white">
              {[
                { title: 'New Student Enrolled', desc: 'Arjun Patel has been added to Class 10-A', time: '2 min ago', dot: 'bg-emerald-500' },
                { title: 'Fee Payment Received', desc: '₹15,000 received from Priya Sharma', time: '15 min ago', dot: 'bg-blue-600' },
                { title: 'Exam Schedule Updated', desc: 'Mid-term exams rescheduled to Oct 15', time: '1 hr ago', dot: 'bg-amber-500' },
                { title: 'Attendance Report', desc: 'Daily attendance report is ready', time: '3 hrs ago', dot: 'bg-purple-500' },
              ].map((n, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#F4F8FD] hover:bg-white border border-[#E1EAF3] hover:border-blue-300 shadow-[inset_0_1px_3px_rgba(15,23,42,0.04)] transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${n.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">{n.title}</p>
                      <p className="text-xs text-[#526075] mt-0.5 truncate font-medium">{n.desc}</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
              <button 
                type="button"
                onClick={() => { setNotificationsOpen(false); navigate('/notifications'); }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}

      {/* Profile Dropdown */}
      {userMenuOpen && (
        <>
          <div className="fixed inset-0 z-[998]" onClick={() => setUserMenuOpen(false)} />
          <div
            className="fixed z-[999] animate-scale-in"
            style={{
              top: '5.5rem',
              right: '1.5rem',
              width: '14rem',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              borderRadius: '1rem',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 24px 48px -12px rgba(30,58,138,0.22)',
              overflow: 'hidden',
            }}
          >
            <div className="px-4 py-3 border-b border-white/30">
              <p className="text-sm font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="p-1 space-y-0.5">
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/40 transition-all cursor-pointer" 
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="w-4 h-4 text-muted-foreground" /> Settings
              </Link>
              <Link 
                to="/users" 
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/40 transition-all cursor-pointer" 
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="w-4 h-4 text-muted-foreground" /> My Profile
              </Link>
            </div>
            <div className="border-t border-white/30 p-1 mt-0.5">
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="group flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl text-red-600 hover:text-red-700 hover:bg-red-500/15 w-full transition-all font-semibold cursor-pointer disabled:opacity-50"
              >
                {loggingOut ? (
                  <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin shrink-0" />
                ) : (
                  <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 shrink-0" />
                )}
                <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Full-screen Glass Loading Overlay on Sign Out */}
      {loggingOut && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center animate-fade-in">
          <div className="px-8 py-6 rounded-3xl flex flex-col items-center gap-3 border border-white/60 bg-[#E8F1F8]/90 shadow-2xl backdrop-blur-xl">
            <div className="w-9 h-9 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-sm font-bold text-[#0F172A]">Signing out...</p>
              <p className="text-xs text-[#526075] mt-0.5 font-medium">Securing session and clearing credentials</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
