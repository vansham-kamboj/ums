import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

imports_to_add = """
// Student Pages
import MyAttendance from './pages/student/MyAttendance';
import MyFees from './pages/student/MyFees';
import MyResults from './pages/student/MyResults';
import MyTimetable from './pages/student/MyTimetable';
import MyProfile from './pages/student/MyProfile';

// Guardian Pages
import GuardianChildren from './pages/guardian/GuardianChildren';
import ChildDashboard from './pages/guardian/ChildDashboard';
"""

# Add imports after SettingsPage import
content = content.replace(
    "import SettingsPage from './pages/settings/SettingsPage';",
    "import SettingsPage from './pages/settings/SettingsPage';\n" + imports_to_add
)

routes_to_add = """
          {/* Student Custom Routes */}
          <Route path="student/profile" element={<ScopeRoute allowedScopes={['STUDENT']}><MyProfile /></ScopeRoute>} />
          <Route path="student/attendance" element={<ScopeRoute allowedScopes={['STUDENT']}><MyAttendance /></ScopeRoute>} />
          <Route path="student/fees" element={<ScopeRoute allowedScopes={['STUDENT']}><MyFees /></ScopeRoute>} />
          <Route path="student/results" element={<ScopeRoute allowedScopes={['STUDENT']}><MyResults /></ScopeRoute>} />
          <Route path="student/timetable" element={<ScopeRoute allowedScopes={['STUDENT']}><MyTimetable /></ScopeRoute>} />

          {/* Guardian Custom Routes */}
          <Route path="guardian/children" element={<ScopeRoute allowedScopes={['GUARDIAN']}><GuardianChildren /></ScopeRoute>} />
          <Route path="guardian/child/:id" element={<ScopeRoute allowedScopes={['GUARDIAN']}><ChildDashboard /></ScopeRoute>} />
"""

# Add routes before Custom Screens
content = content.replace(
    "{/* Custom Screens */}",
    routes_to_add + "\n          {/* Custom Screens */}"
)

# Also need to update GenericList mapping in App.jsx to pass readOnlyForScopes
# GenericList is called in App.jsx:
# <GenericList
#   title={config.plural}
#   ...
#   subtitle={config.subtitle}
# />

content = re.sub(
    r"subtitle=\{config\.subtitle\}\s+/>",
    "subtitle={config.subtitle}\n                      readOnlyForScopes={config.readOnlyForScopes}\n                    />",
    content
)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)

print('Updated App.jsx successfully')
