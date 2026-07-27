import re

with open('frontend/src/components/Layout.jsx', 'r') as f:
    content = f.read()

new_nav_logic = """
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
"""

# Replace the static navGroups array declaration with the dynamic one
content = re.sub(r'const navGroups = \[', new_nav_logic, content)

# Replace the filtering logic in the render method to use getNavGroupsForUser
old_render_logic = """          {navGroups
            .map(group => {
              // Create a mapping of path -> allowedScopes from routesConfig
              const scopeMap = routesConfig.reduce((acc, route) => {
                acc[route.basePath] = route.allowedScopes || ['ADMIN', 'EMPLOYEE'];
                return acc;
              }, {});
              
              // Custom routes mapping (not in routesConfig)
              scopeMap['/'] = ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'];
              scopeMap['/attendance/mark'] = ['ADMIN', 'EMPLOYEE'];
              scopeMap['/fees/collect'] = ['ADMIN', 'EMPLOYEE'];
              scopeMap['/exams/marks-entry'] = ['ADMIN', 'EMPLOYEE'];
              scopeMap['/chat'] = ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'];
              scopeMap['/reports'] = ['ADMIN', 'EMPLOYEE'];
              scopeMap['/settings'] = ['ADMIN'];
              
              // Filter items based on user scope
              const filteredItems = group.items.filter(item => {
                const scopes = scopeMap[item.path];
                if (!scopes) return true; // If path not mapped, assume visible, or change to false if strict
                return user && scopes.includes(user.scope);
              });
              
              return { ...group, items: filteredItems };
            })
            .filter(group => group.items.length > 0)
            .map((group) => ("""

new_render_logic = """          {getNavGroupsForUser(user)
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
            .map((group) => ("""

content = content.replace(old_render_logic, new_render_logic)

with open('frontend/src/components/Layout.jsx', 'w') as f:
    f.write(content)

print('Layout.jsx updated')
