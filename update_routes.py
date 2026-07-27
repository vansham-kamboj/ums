import re

with open('frontend/src/routesConfig.js', 'r') as f:
    content = f.read()

# 1. Update Exam Grades explicitly
content = re.sub(
    r"module: 'exam', title: 'Exam Grade', plural: 'Exam Grades',\s*basePath: '/exams/grades', allowedScopes: \['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'\],",
    "module: 'exam', title: 'Exam Grade', plural: 'Exam Grades',\n    basePath: '/exams/grades', allowedScopes: ['ADMIN', 'EMPLOYEE'],",
    content
)

# 2. Add readOnlyForScopes to specific routes
routes_to_make_readonly = [
    '/exams', '/exams/schedules', '/transport/routes', '/transport/vehicles',
    '/library/books', '/library/issues', '/hostel/rooms', '/mess/meals',
    '/communication/announcements', '/calendar/events', '/calendar/holidays',
    '/resources/assignments', '/resources/diary', '/resources/lesson-plans',
    '/resources/syllabus', '/resources/materials', '/resources/online-classes',
    '/online-exams', '/discipline/incidents', '/activities/trips', '/custom-forms',
    '/certificates/templates', '/certificates/id-card-templates', '/timetable',
    '/students', '/fees/student-fees', '/fees/transactions', '/social-wall'
]

for route in routes_to_make_readonly:
    pattern = r"(basePath: '" + route + r"', allowedScopes: \['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'\], endpoint: '[^']+',)"
    content = re.sub(pattern, r"\1 readOnlyForScopes: ['STUDENT', 'GUARDIAN'],", content)

# helpdesk faqs
content = re.sub(
    r"(basePath: '/helpdesk/faqs', allowedScopes: \['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'\], endpoint: '[^']+',)",
    r"\1 readOnlyForScopes: ['STUDENT', 'GUARDIAN'],",
    content
)

with open('frontend/src/routesConfig.js', 'w') as f:
    f.write(content)

print('Successfully updated routesConfig.js')
