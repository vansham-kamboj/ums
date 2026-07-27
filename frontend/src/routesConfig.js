// UMS Routes Configuration — All 49 Modules
// Each config drives GenericList + GenericForm automatically
// Custom screens are handled separately in App.jsx

export const routesConfig = [
  // =====================================================
  // ACADEMIC MODULE
  // =====================================================
  {
    module: 'academic', title: 'Academic Session', plural: 'Academic Sessions',
    basePath: '/academic/sessions', allowedScopes: ['ADMIN'], endpoint: '/academic/sessions',
    listColumns: [
      { key: 'name', label: 'Session Name' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'isDefault', label: 'Default', type: 'boolean' },
    ],
    formFields: [
      { name: 'name', label: 'Session Name', type: 'text', required: true, fullWidth: true, placeholder: 'e.g. 2024-2025' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { name: 'isDefault', label: 'Set as Default', type: 'select', required: true, options: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }] },
    ],
  },
  {
    module: 'academic', title: 'Program Type', plural: 'Program Types',
    basePath: '/academic/program-types', allowedScopes: ['ADMIN'], endpoint: '/academic/program-types',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
    ],
    formFields: [
      { name: 'name', label: 'Program Type Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Department', plural: 'Departments',
    basePath: '/academic/departments', allowedScopes: ['ADMIN'], endpoint: '/academic/departments',
    listColumns: [
      { key: 'name', label: 'Department Name' },
      { key: 'code', label: 'Code' },
    ],
    formFields: [
      { name: 'name', label: 'Department Name', type: 'text', required: true },
      { name: 'code', label: 'Department Code', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Program', plural: 'Programs',
    basePath: '/academic/programs', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/programs',
    listColumns: [
      { key: 'name', label: 'Program Name' },
      { key: 'code', label: 'Code' },
      { key: 'programType.name', label: 'Type' },
    ],
    formFields: [
      { name: 'name', label: 'Program Name', type: 'text', required: true },
      { name: 'code', label: 'Program Code', type: 'text', required: true },
      { name: 'programTypeId', label: 'Program Type', type: 'api-select', optionsEndpoint: '/academic/program-types', required: true },
      { name: 'departmentId', label: 'Department', type: 'api-select', optionsEndpoint: '/academic/departments' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Division', plural: 'Divisions',
    basePath: '/academic/divisions', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/divisions',
    listColumns: [
      { key: 'name', label: 'Division Name' },
      { key: 'code', label: 'Code' },
      { key: 'program.name', label: 'Program' },
    ],
    formFields: [
      { name: 'name', label: 'Division Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'programId', label: 'Program', type: 'api-select', optionsEndpoint: '/academic/programs', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Course', plural: 'Courses',
    basePath: '/academic/courses', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/courses',
    listColumns: [
      { key: 'name', label: 'Course Name' },
      { key: 'code', label: 'Code' },
      { key: 'duration', label: 'Duration (Months)' },
      { key: 'division.name', label: 'Division' },
    ],
    formFields: [
      { name: 'name', label: 'Course Name', type: 'text', required: true, fullWidth: true },
      { name: 'code', label: 'Course Code', type: 'text', required: true },
      { name: 'duration', label: 'Duration (Months)', type: 'number', required: true },
      { name: 'divisionId', label: 'Division', type: 'api-select', optionsEndpoint: '/academic/divisions' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Batch', plural: 'Batches',
    basePath: '/academic/batches', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/batches',
    listColumns: [
      { key: 'name', label: 'Batch Name' },
      { key: 'course.name', label: 'Course' },
      { key: 'maxStrength', label: 'Max Strength' },
    ],
    formFields: [
      { name: 'name', label: 'Batch Name', type: 'text', required: true },
      { name: 'courseId', label: 'Course', type: 'api-select', optionsEndpoint: '/academic/courses', required: true },
      { name: 'maxStrength', label: 'Max Strength', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Subject', plural: 'Subjects',
    basePath: '/academic/subjects', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/subjects',
    listColumns: [
      { key: 'name', label: 'Subject Name' },
      { key: 'code', label: 'Code' },
      { key: 'subjectType.name', label: 'Type' },
    ],
    formFields: [
      { name: 'name', label: 'Subject Name', type: 'text', required: true },
      { name: 'code', label: 'Subject Code', type: 'text', required: true },
      { name: 'subjectTypeId', label: 'Subject Type', type: 'api-select', optionsEndpoint: '/academic/subject-types' },
      { name: 'maxTheory', label: 'Max Theory Marks', type: 'number' },
      { name: 'maxPractical', label: 'Max Practical Marks', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Subject Type', plural: 'Subject Types',
    basePath: '/academic/subject-types', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/subject-types',
    listColumns: [
      { key: 'name', label: 'Type Name' },
      { key: 'code', label: 'Code' },
    ],
    formFields: [
      { name: 'name', label: 'Type Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Class Timing', plural: 'Class Timings',
    basePath: '/academic/class-timings', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/class-timings',
    listColumns: [
      { key: 'name', label: 'Timing Name' },
    ],
    formFields: [
      { name: 'name', label: 'Timing Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'academic', title: 'Enrollment Seat', plural: 'Enrollment Seats',
    basePath: '/academic/enrollment-seats', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/academic/enrollment-seats',
    listColumns: [
      { key: 'name', label: 'Seat Category' },
      { key: 'totalSeats', label: 'Total Seats' },
      { key: 'course.name', label: 'Course' },
    ],
    formFields: [
      { name: 'name', label: 'Seat Category', type: 'text', required: true },
      { name: 'totalSeats', label: 'Total Seats', type: 'number', required: true },
      { name: 'courseId', label: 'Course', type: 'api-select', optionsEndpoint: '/academic/courses', required: true },
    ],
  },

  // =====================================================
  // STUDENT MODULE
  // =====================================================
  {
    module: 'student', title: 'Enquiry', plural: 'Enquiries',
    basePath: '/students/enquiries', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/students/enquiries',
    listColumns: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    formFields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'courseId', label: 'Course', type: 'api-select', optionsEndpoint: '/academic/courses' },
      { name: 'source', label: 'Source', type: 'select', options: [{ label: 'Website', value: 'website' }, { label: 'Walk-in', value: 'walk_in' }, { label: 'Referral', value: 'referral' }, { label: 'Social Media', value: 'social_media' }, { label: 'Other', value: 'other' }] },
      { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'student', title: 'Registration', plural: 'Registrations',
    basePath: '/students/registrations', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/students/registrations',
    listColumns: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'createdAt', label: 'Date', type: 'date' },
    ],
    formFields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true, fullWidth: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }] },
      { name: 'courseId', label: 'Course', type: 'api-select', optionsEndpoint: '/academic/courses', required: true },
      { name: 'batchId', label: 'Batch', type: 'api-select', optionsEndpoint: '/academic/batches' },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'student', title: 'Student', plural: 'Students',
    basePath: '/students', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/students', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'admissionNumber', label: 'Admission No' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    formFields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', fullWidth: true },
      { name: 'admissionNumber', label: 'Admission Number', type: 'text', required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }] },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'courseId', label: 'Course', type: 'api-select', optionsEndpoint: '/academic/courses' },
      { name: 'batchId', label: 'Batch', type: 'api-select', optionsEndpoint: '/academic/batches' },
      { name: 'bloodGroup', label: 'Blood Group', type: 'select', options: [{ label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' }, { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' }, { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' }, { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' }] },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'student', title: 'Student Group', plural: 'Student Groups',
    basePath: '/students/groups', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/students/groups',
    listColumns: [{ key: 'name', label: 'Group Name' }, { key: 'description', label: 'Description' }],
    formFields: [
      { name: 'name', label: 'Group Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'student', title: 'Alumni', plural: 'Alumni',
    basePath: '/students/alumni', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/students/alumni',
    listColumns: [{ key: 'student.firstName', label: 'Name' }, { key: 'graduationYear', label: 'Graduation Year' }, { key: 'currentOrganization', label: 'Organization' }],
    formFields: [
      { name: 'studentId', label: 'Student', type: 'api-select', optionsEndpoint: '/students', optionLabel: 'firstName', required: true },
      { name: 'graduationYear', label: 'Graduation Year', type: 'number', required: true },
      { name: 'currentOrganization', label: 'Current Organization', type: 'text' },
      { name: 'designation', label: 'Designation', type: 'text' },
    ],
  },

  // =====================================================
  // GUARDIAN MODULE
  // =====================================================
  {
    module: 'guardian', title: 'Guardian', plural: 'Guardians',
    basePath: '/guardians', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/guardians',
    listColumns: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'relation', label: 'Relation' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
    ],
    formFields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'relation', label: 'Relation', type: 'select', required: true, options: [{ label: 'Father', value: 'father' }, { label: 'Mother', value: 'mother' }, { label: 'Guardian', value: 'guardian' }] },
      { name: 'occupation', label: 'Occupation', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // EMPLOYEE / HR MODULE
  // =====================================================
  {
    module: 'employee', title: 'Employee', plural: 'Employees',
    basePath: '/employees', allowedScopes: ['ADMIN'], endpoint: '/employees',
    listColumns: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'employeeCode', label: 'Code' },
      { key: 'designation', label: 'Designation' },
      { key: 'department', label: 'Department' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    formFields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true, fullWidth: true },
      { name: 'employeeCode', label: 'Employee Code', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }] },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'employee', title: 'Work Shift', plural: 'Work Shifts',
    basePath: '/employees/work-shifts', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/work-shifts',
    listColumns: [{ key: 'name', label: 'Shift Name' }, { key: 'startTime', label: 'Start' }, { key: 'endTime', label: 'End' }],
    formFields: [
      { name: 'name', label: 'Shift Name', type: 'text', required: true },
      { name: 'startTime', label: 'Start Time', type: 'time', required: true },
      { name: 'endTime', label: 'End Time', type: 'time', required: true },
    ],
  },
  {
    module: 'employee', title: 'Timesheet', plural: 'Timesheets',
    basePath: '/employees/timesheets', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/timesheets',
    listColumns: [{ key: 'employee.firstName', label: 'Employee' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'hoursWorked', label: 'Hours' }],
    formFields: [
      { name: 'employeeId', label: 'Employee', type: 'api-select', optionsEndpoint: '/employees', optionLabel: 'firstName', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'hoursWorked', label: 'Hours Worked', type: 'number', required: true },
      { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'employee', title: 'Leave Type', plural: 'Leave Types',
    basePath: '/employees/leave-types', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/leave-types',
    listColumns: [{ key: 'name', label: 'Type Name' }, { key: 'code', label: 'Code' }, { key: 'maxDays', label: 'Max Days' }],
    formFields: [
      { name: 'name', label: 'Leave Type Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'maxDays', label: 'Max Days Per Year', type: 'number' },
      { name: 'isPaid', label: 'Is Paid Leave', type: 'select', options: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }] },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'employee', title: 'Leave Allocation', plural: 'Leave Allocations',
    basePath: '/employees/leave-allocations', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/leave-allocations',
    listColumns: [{ key: 'employee.firstName', label: 'Employee' }, { key: 'leaveType.name', label: 'Leave Type' }, { key: 'allocated', label: 'Allocated' }, { key: 'used', label: 'Used' }],
    formFields: [
      { name: 'employeeId', label: 'Employee', type: 'api-select', optionsEndpoint: '/employees', optionLabel: 'firstName', required: true },
      { name: 'leaveTypeId', label: 'Leave Type', type: 'api-select', optionsEndpoint: '/employees/leave-types', required: true },
      { name: 'allocated', label: 'Days Allocated', type: 'number', required: true },
    ],
  },
  {
    module: 'employee', title: 'Leave Request', plural: 'Leave Requests',
    basePath: '/employees/leave-requests', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/leave-requests',
    listColumns: [{ key: 'employee.firstName', label: 'Employee' }, { key: 'leaveType.name', label: 'Type' }, { key: 'startDate', label: 'From', type: 'date' }, { key: 'endDate', label: 'To', type: 'date' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'leaveTypeId', label: 'Leave Type', type: 'api-select', optionsEndpoint: '/employees/leave-types', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date', required: true },
      { name: 'reason', label: 'Reason', type: 'textarea', required: true, fullWidth: true },
    ],
  },
  {
    module: 'employee', title: 'Pay Head', plural: 'Pay Heads',
    basePath: '/employees/pay-heads', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/pay-heads',
    listColumns: [{ key: 'name', label: 'Pay Head' }, { key: 'type', label: 'Type' }, { key: 'category', label: 'Category' }],
    formFields: [
      { name: 'name', label: 'Pay Head Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', required: true, options: [{ label: 'Earning', value: 'earning' }, { label: 'Deduction', value: 'deduction' }] },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'employee', title: 'Salary Template', plural: 'Salary Templates',
    basePath: '/employees/salary-templates', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/salary-templates',
    listColumns: [{ key: 'name', label: 'Template Name' }, { key: 'description', label: 'Description' }],
    formFields: [
      { name: 'name', label: 'Template Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'employee', title: 'Salary Structure', plural: 'Salary Structures',
    basePath: '/employees/salary-structures', allowedScopes: ['ADMIN'], endpoint: '/employees/salary-structures',
    listColumns: [{ key: 'employee.firstName', label: 'Employee' }, { key: 'effectiveDate', label: 'Effective Date', type: 'date' }, { key: 'grossSalary', label: 'Gross', type: 'currency' }],
    formFields: [
      { name: 'employeeId', label: 'Employee', type: 'api-select', optionsEndpoint: '/employees', optionLabel: 'firstName', required: true },
      { name: 'salaryTemplateId', label: 'Salary Template', type: 'api-select', optionsEndpoint: '/employees/salary-templates' },
      { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { name: 'grossSalary', label: 'Gross Salary', type: 'number', required: true },
    ],
  },
  {
    module: 'employee', title: 'Payroll', plural: 'Payroll',
    basePath: '/employees/payroll', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/employees/payroll',
    listColumns: [{ key: 'month', label: 'Month' }, { key: 'year', label: 'Year' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'totalAmount', label: 'Total', type: 'currency' }],
    formFields: [
      { name: 'month', label: 'Month', type: 'number', required: true, min: 1, max: 12 },
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'employeeId', label: 'Employee', type: 'api-select', optionsEndpoint: '/employees', optionLabel: 'firstName' },
    ],
  },

  // =====================================================
  // FEE & FINANCE MODULE
  // =====================================================
  {
    module: 'fee', title: 'Fee Group', plural: 'Fee Groups',
    basePath: '/fees/groups', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/fees/groups',
    listColumns: [{ key: 'name', label: 'Group Name' }, { key: 'description', label: 'Description' }],
    formFields: [
      { name: 'name', label: 'Fee Group Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'fee', title: 'Fee Head', plural: 'Fee Heads',
    basePath: '/fees/heads', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/fees/heads',
    listColumns: [{ key: 'name', label: 'Fee Head' }, { key: 'feeGroup.name', label: 'Group' }, { key: 'amount', label: 'Amount', type: 'currency' }],
    formFields: [
      { name: 'name', label: 'Fee Head Name', type: 'text', required: true },
      { name: 'feeGroupId', label: 'Fee Group', type: 'api-select', optionsEndpoint: '/fees/groups', required: true },
      { name: 'amount', label: 'Default Amount', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'fee', title: 'Fee Structure', plural: 'Fee Structures',
    basePath: '/fees/structures', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/fees/structures',
    listColumns: [{ key: 'name', label: 'Structure Name' }, { key: 'course.name', label: 'Course' }, { key: 'totalAmount', label: 'Total', type: 'currency' }],
    formFields: [
      { name: 'name', label: 'Structure Name', type: 'text', required: true },
      { name: 'courseId', label: 'Course', type: 'api-select', optionsEndpoint: '/academic/courses', required: true },
      { name: 'batchId', label: 'Batch', type: 'api-select', optionsEndpoint: '/academic/batches' },
      { name: 'totalAmount', label: 'Total Amount', type: 'number', required: true },
    ],
  },
  {
    module: 'fee', title: 'Fee Concession', plural: 'Fee Concessions',
    basePath: '/fees/concessions', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/fees/concessions',
    listColumns: [{ key: 'name', label: 'Concession Name' }, { key: 'type', label: 'Type' }, { key: 'value', label: 'Value' }],
    formFields: [
      { name: 'name', label: 'Concession Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', required: true, options: [{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed Amount', value: 'fixed' }] },
      { name: 'value', label: 'Value', type: 'number', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'fee', title: 'Student Fee', plural: 'Student Fees',
    basePath: '/fees/student-fees', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/fees/student-fees', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'student.firstName', label: 'Student' }, { key: 'feeStructure.name', label: 'Structure' }, { key: 'totalAmount', label: 'Total', type: 'currency' }, { key: 'paidAmount', label: 'Paid', type: 'currency' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'studentId', label: 'Student', type: 'api-select', optionsEndpoint: '/students', optionLabel: 'firstName', required: true },
      { name: 'feeStructureId', label: 'Fee Structure', type: 'api-select', optionsEndpoint: '/fees/structures', required: true },
    ],
  },
  {
    module: 'fee', title: 'Ledger Type', plural: 'Ledger Types',
    basePath: '/fees/ledger-types', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/fees/ledger-types',
    listColumns: [{ key: 'name', label: 'Ledger Type' }, { key: 'type', label: 'Category' }],
    formFields: [
      { name: 'name', label: 'Ledger Type Name', type: 'text', required: true },
      { name: 'type', label: 'Category', type: 'select', required: true, options: [{ label: 'Asset', value: 'asset' }, { label: 'Liability', value: 'liability' }, { label: 'Income', value: 'income' }, { label: 'Expense', value: 'expense' }] },
    ],
  },
  {
    module: 'fee', title: 'Ledger', plural: 'Ledgers',
    basePath: '/fees/ledgers', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/fees/ledgers',
    listColumns: [{ key: 'name', label: 'Ledger Name' }, { key: 'ledgerType.name', label: 'Type' }, { key: 'balance', label: 'Balance', type: 'currency' }],
    formFields: [
      { name: 'name', label: 'Ledger Name', type: 'text', required: true },
      { name: 'ledgerTypeId', label: 'Ledger Type', type: 'api-select', optionsEndpoint: '/fees/ledger-types', required: true },
      { name: 'openingBalance', label: 'Opening Balance', type: 'number' },
    ],
  },
  {
    module: 'fee', title: 'Transaction', plural: 'Transactions',
    basePath: '/fees/transactions', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/fees/transactions', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'voucherNumber', label: 'Voucher No' }, { key: 'type', label: 'Type', type: 'status' }, { key: 'amount', label: 'Amount', type: 'currency' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'type', label: 'Type', type: 'select', required: true, options: [{ label: 'Receipt', value: 'receipt' }, { label: 'Payment', value: 'payment' }, { label: 'Journal', value: 'journal' }, { label: 'Contra', value: 'contra' }] },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'ledgerId', label: 'Ledger', type: 'api-select', optionsEndpoint: '/fees/ledgers' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // EXAMINATION MODULE
  // =====================================================
  {
    module: 'exam', title: 'Exam Term', plural: 'Exam Terms',
    basePath: '/exams/terms', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/exams/terms',
    listColumns: [{ key: 'name', label: 'Term Name' }, { key: 'position', label: 'Order' }],
    formFields: [
      { name: 'name', label: 'Term Name', type: 'text', required: true },
      { name: 'position', label: 'Display Order', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'exam', title: 'Exam', plural: 'Exams',
    basePath: '/exams', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/exams', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'name', label: 'Exam Name' }, { key: 'examTerm.name', label: 'Term' }, { key: 'startDate', label: 'Start', type: 'date' }, { key: 'endDate', label: 'End', type: 'date' }],
    formFields: [
      { name: 'name', label: 'Exam Name', type: 'text', required: true },
      { name: 'examTermId', label: 'Exam Term', type: 'api-select', optionsEndpoint: '/exams/terms', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'exam', title: 'Exam Grade', plural: 'Exam Grades',
    basePath: '/exams/grades', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/exams/grades',
    listColumns: [{ key: 'name', label: 'Grade' }, { key: 'minPercentage', label: 'Min %' }, { key: 'maxPercentage', label: 'Max %' }, { key: 'gradePoint', label: 'Grade Point' }],
    formFields: [
      { name: 'name', label: 'Grade Name (e.g. A+)', type: 'text', required: true },
      { name: 'minPercentage', label: 'Min Percentage', type: 'number', required: true },
      { name: 'maxPercentage', label: 'Max Percentage', type: 'number', required: true },
      { name: 'gradePoint', label: 'Grade Point', type: 'number' },
    ],
  },
  {
    module: 'exam', title: 'Exam Assessment', plural: 'Exam Assessments',
    basePath: '/exams/assessments', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/exams/assessments',
    listColumns: [{ key: 'name', label: 'Assessment' }, { key: 'maxMarks', label: 'Max Marks' }],
    formFields: [
      { name: 'name', label: 'Assessment Name', type: 'text', required: true },
      { name: 'maxMarks', label: 'Max Marks', type: 'number', required: true },
      { name: 'examId', label: 'Exam', type: 'api-select', optionsEndpoint: '/exams' },
    ],
  },
  {
    module: 'exam', title: 'Exam Schedule', plural: 'Exam Schedules',
    basePath: '/exams/schedules', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/exams/schedules', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'exam.name', label: 'Exam' }, { key: 'subject.name', label: 'Subject' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'startTime', label: 'Start' }, { key: 'endTime', label: 'End' }],
    formFields: [
      { name: 'examId', label: 'Exam', type: 'api-select', optionsEndpoint: '/exams', required: true },
      { name: 'subjectId', label: 'Subject', type: 'api-select', optionsEndpoint: '/academic/subjects', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'startTime', label: 'Start Time', type: 'time', required: true },
      { name: 'endTime', label: 'End Time', type: 'time', required: true },
      { name: 'room', label: 'Room / Hall', type: 'text' },
    ],
  },

  // =====================================================
  // TRANSPORT MODULE
  // =====================================================
  {
    module: 'transport', title: 'Transport Circle', plural: 'Transport Circles',
    basePath: '/transport/circles', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/transport/circles',
    listColumns: [{ key: 'name', label: 'Circle Name' }],
    formFields: [{ name: 'name', label: 'Circle Name', type: 'text', required: true }, { name: 'description', label: 'Description', type: 'textarea', fullWidth: true }],
  },
  {
    module: 'transport', title: 'Stoppage', plural: 'Stoppages',
    basePath: '/transport/stoppages', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/transport/stoppages',
    listColumns: [{ key: 'name', label: 'Stoppage Name' }],
    formFields: [{ name: 'name', label: 'Stoppage Name', type: 'text', required: true }, { name: 'description', label: 'Description', type: 'textarea', fullWidth: true }],
  },
  {
    module: 'transport', title: 'Route', plural: 'Routes',
    basePath: '/transport/routes', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/transport/routes', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'name', label: 'Route Name' }, { key: 'circle.name', label: 'Circle' }],
    formFields: [
      { name: 'name', label: 'Route Name', type: 'text', required: true },
      { name: 'circleId', label: 'Transport Circle', type: 'api-select', optionsEndpoint: '/transport/circles' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'transport', title: 'Vehicle', plural: 'Vehicles',
    basePath: '/transport/vehicles', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/transport/vehicles', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'registrationNumber', label: 'Reg No' }, { key: 'type', label: 'Type' }, { key: 'capacity', label: 'Capacity' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'registrationNumber', label: 'Registration Number', type: 'text', required: true },
      { name: 'type', label: 'Vehicle Type', type: 'text', required: true },
      { name: 'capacity', label: 'Seating Capacity', type: 'number' },
      { name: 'make', label: 'Make', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
    ],
  },
  {
    module: 'transport', title: 'Fuel Record', plural: 'Fuel Records',
    basePath: '/transport/fuel-records', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/transport/fuel-records',
    listColumns: [{ key: 'vehicle.registrationNumber', label: 'Vehicle' }, { key: 'quantity', label: 'Liters' }, { key: 'amount', label: 'Amount', type: 'currency' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'vehicleId', label: 'Vehicle', type: 'api-select', optionsEndpoint: '/transport/vehicles', optionLabel: 'registrationNumber', required: true },
      { name: 'quantity', label: 'Quantity (Liters)', type: 'number', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
    ],
  },

  // =====================================================
  // LIBRARY MODULE
  // =====================================================
  {
    module: 'library', title: 'Book', plural: 'Books',
    basePath: '/library/books', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/library/books', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'author', label: 'Author' }, { key: 'isbn', label: 'ISBN' }, { key: 'category', label: 'Category' }, { key: 'copies', label: 'Copies' }],
    formFields: [
      { name: 'title', label: 'Book Title', type: 'text', required: true, fullWidth: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'isbn', label: 'ISBN', type: 'text' },
      { name: 'publisher', label: 'Publisher', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'copies', label: 'Total Copies', type: 'number' },
      { name: 'price', label: 'Price', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'library', title: 'Book Issue', plural: 'Book Issues',
    basePath: '/library/issues', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/library/issues', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'book.title', label: 'Book' }, { key: 'issuedTo', label: 'Issued To' }, { key: 'issueDate', label: 'Issue Date', type: 'date' }, { key: 'dueDate', label: 'Due Date', type: 'date' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'bookId', label: 'Book', type: 'api-select', optionsEndpoint: '/library/books', optionLabel: 'title', required: true },
      { name: 'issuedTo', label: 'Issued To (User ID)', type: 'text', required: true },
      { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
    ],
  },

  // =====================================================
  // HOSTEL MODULE
  // =====================================================
  {
    module: 'hostel', title: 'Block', plural: 'Hostel Blocks',
    basePath: '/hostel/blocks', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/hostel/blocks',
    listColumns: [{ key: 'name', label: 'Block Name' }, { key: 'type', label: 'Type' }],
    formFields: [
      { name: 'name', label: 'Block Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Boys', value: 'boys' }, { label: 'Girls', value: 'girls' }, { label: 'Co-ed', value: 'coed' }] },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'hostel', title: 'Floor', plural: 'Hostel Floors',
    basePath: '/hostel/floors', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/hostel/floors',
    listColumns: [{ key: 'name', label: 'Floor' }, { key: 'block.name', label: 'Block' }],
    formFields: [
      { name: 'name', label: 'Floor Name', type: 'text', required: true },
      { name: 'blockId', label: 'Block', type: 'api-select', optionsEndpoint: '/hostel/blocks', required: true },
    ],
  },
  {
    module: 'hostel', title: 'Room', plural: 'Hostel Rooms',
    basePath: '/hostel/rooms', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/hostel/rooms', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'number', label: 'Room No' }, { key: 'floor.name', label: 'Floor' }, { key: 'capacity', label: 'Capacity' }, { key: 'occupied', label: 'Occupied' }],
    formFields: [
      { name: 'number', label: 'Room Number', type: 'text', required: true },
      { name: 'floorId', label: 'Floor', type: 'api-select', optionsEndpoint: '/hostel/floors', required: true },
      { name: 'capacity', label: 'Capacity', type: 'number', required: true },
      { name: 'type', label: 'Room Type', type: 'select', options: [{ label: 'Single', value: 'single' }, { label: 'Double', value: 'double' }, { label: 'Triple', value: 'triple' }, { label: 'Dormitory', value: 'dormitory' }] },
    ],
  },

  // =====================================================
  // INVENTORY MODULE
  // =====================================================
  {
    module: 'inventory', title: 'Stock Category', plural: 'Stock Categories',
    basePath: '/inventory/categories', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/inventory/categories',
    listColumns: [{ key: 'name', label: 'Category' }],
    formFields: [{ name: 'name', label: 'Category Name', type: 'text', required: true }, { name: 'description', label: 'Description', type: 'textarea', fullWidth: true }],
  },
  {
    module: 'inventory', title: 'Stock Item', plural: 'Stock Items',
    basePath: '/inventory/items', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/inventory/items',
    listColumns: [{ key: 'name', label: 'Item Name' }, { key: 'category.name', label: 'Category' }, { key: 'quantity', label: 'Qty' }, { key: 'unit', label: 'Unit' }],
    formFields: [
      { name: 'name', label: 'Item Name', type: 'text', required: true },
      { name: 'categoryId', label: 'Category', type: 'api-select', optionsEndpoint: '/inventory/categories', required: true },
      { name: 'quantity', label: 'Initial Quantity', type: 'number' },
      { name: 'unit', label: 'Unit', type: 'text' },
      { name: 'minStock', label: 'Min Stock Alert', type: 'number' },
    ],
  },
  {
    module: 'inventory', title: 'Vendor', plural: 'Vendors',
    basePath: '/inventory/vendors', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/inventory/vendors',
    listColumns: [{ key: 'name', label: 'Vendor Name' }, { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Email' }],
    formFields: [
      { name: 'name', label: 'Vendor Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // MESS MODULE
  // =====================================================
  {
    module: 'mess', title: 'Menu Item', plural: 'Menu Items',
    basePath: '/mess/menu-items', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/mess/menu-items',
    listColumns: [{ key: 'name', label: 'Item Name' }, { key: 'type', label: 'Type' }],
    formFields: [
      { name: 'name', label: 'Item Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Breakfast', value: 'breakfast' }, { label: 'Lunch', value: 'lunch' }, { label: 'Dinner', value: 'dinner' }, { label: 'Snack', value: 'snack' }] },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'mess', title: 'Meal', plural: 'Meals',
    basePath: '/mess/meals', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/mess/meals', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'name', label: 'Meal Name' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'type', label: 'Type' }],
    formFields: [
      { name: 'name', label: 'Meal Name', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'type', label: 'Type', type: 'select', required: true, options: [{ label: 'Breakfast', value: 'breakfast' }, { label: 'Lunch', value: 'lunch' }, { label: 'Dinner', value: 'dinner' }] },
    ],
  },

  // =====================================================
  // RECEPTION MODULE
  // =====================================================
  {
    module: 'reception', title: 'Visitor Log', plural: 'Visitor Logs',
    basePath: '/reception/visitors', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/reception/visitors',
    listColumns: [{ key: 'name', label: 'Visitor Name' }, { key: 'purpose', label: 'Purpose' }, { key: 'inTime', label: 'In Time' }, { key: 'outTime', label: 'Out Time' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'name', label: 'Visitor Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'purpose', label: 'Purpose', type: 'text', required: true },
      { name: 'toMeet', label: 'Person to Meet', type: 'text' },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'inTime', label: 'In Time', type: 'time' },
      { name: 'outTime', label: 'Out Time', type: 'time' },
    ],
  },
  {
    module: 'reception', title: 'Gate Pass', plural: 'Gate Passes',
    basePath: '/reception/gate-passes', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/reception/gate-passes',
    listColumns: [{ key: 'type', label: 'Type' }, { key: 'reason', label: 'Reason' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'type', label: 'Type', type: 'select', required: true, options: [{ label: 'Student', value: 'student' }, { label: 'Employee', value: 'employee' }, { label: 'Visitor', value: 'visitor' }] },
      { name: 'reason', label: 'Reason', type: 'textarea', required: true, fullWidth: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
    ],
  },
  {
    module: 'reception', title: 'Call Log', plural: 'Call Logs',
    basePath: '/reception/call-logs', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/reception/call-logs',
    listColumns: [{ key: 'callerName', label: 'Caller' }, { key: 'phone', label: 'Phone' }, { key: 'purpose', label: 'Purpose' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'callerName', label: 'Caller Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'purpose', label: 'Purpose', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'reception', title: 'Complaint', plural: 'Complaints',
    basePath: '/reception/complaints', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/reception/complaints',
    listColumns: [{ key: 'subject', label: 'Subject' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'createdAt', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'subject', label: 'Subject', type: 'text', required: true, fullWidth: true },
      { name: 'type', label: 'Type', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true },
      { name: 'priority', label: 'Priority', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }, { label: 'Urgent', value: 'urgent' }] },
    ],
  },
  {
    module: 'reception', title: 'Postal', plural: 'Postal Correspondence',
    basePath: '/reception/postal', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/reception/postal',
    listColumns: [{ key: 'type', label: 'Type' }, { key: 'senderReceiver', label: 'From/To' }, { key: 'subject', label: 'Subject' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'type', label: 'Type', type: 'select', required: true, options: [{ label: 'Incoming', value: 'incoming' }, { label: 'Outgoing', value: 'outgoing' }] },
      { name: 'senderReceiver', label: 'From/To', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // COMMUNICATION MODULE
  // =====================================================
  {
    module: 'communication', title: 'Announcement', plural: 'Announcements',
    basePath: '/communication/announcements', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/communication/announcements', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'audience', label: 'Audience' }, { key: 'createdAt', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'General', value: 'general' }, { label: 'Academic', value: 'academic' }, { label: 'Emergency', value: 'emergency' }] },
      { name: 'audience', label: 'Audience', type: 'select', options: [{ label: 'All', value: 'all' }, { label: 'Students', value: 'students' }, { label: 'Employees', value: 'employees' }, { label: 'Guardians', value: 'guardians' }] },
      { name: 'content', label: 'Content', type: 'textarea', required: true, fullWidth: true },
    ],
  },

  // =====================================================
  // CALENDAR MODULE
  // =====================================================
  {
    module: 'calendar', title: 'Event', plural: 'Events',
    basePath: '/calendar/events', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/calendar/events', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Event Title' }, { key: 'startDate', label: 'Start', type: 'date' }, { key: 'endDate', label: 'End', type: 'date' }, { key: 'type', label: 'Type' }],
    formFields: [
      { name: 'title', label: 'Event Title', type: 'text', required: true, fullWidth: true },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date', required: true },
      { name: 'type', label: 'Type', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'calendar', title: 'Holiday', plural: 'Holidays',
    basePath: '/calendar/holidays', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/calendar/holidays', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'name', label: 'Holiday' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'type', label: 'Type' }],
    formFields: [
      { name: 'name', label: 'Holiday Name', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Public', value: 'public' }, { label: 'Restricted', value: 'restricted' }] },
    ],
  },

  // =====================================================
  // RESOURCE MODULE
  // =====================================================
  {
    module: 'resource', title: 'Assignment', plural: 'Assignments',
    basePath: '/resources/assignments', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/resources/assignments', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'subject.name', label: 'Subject' }, { key: 'dueDate', label: 'Due Date', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Assignment Title', type: 'text', required: true, fullWidth: true },
      { name: 'subjectId', label: 'Subject', type: 'api-select', optionsEndpoint: '/academic/subjects' },
      { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { name: 'maxMarks', label: 'Max Marks', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'resource', title: 'Diary Entry', plural: 'Diary',
    basePath: '/resources/diary', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/resources/diary', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'content', label: 'Content', type: 'textarea', required: true, fullWidth: true },
    ],
  },
  {
    module: 'resource', title: 'Lesson Plan', plural: 'Lesson Plans',
    basePath: '/resources/lesson-plans', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/resources/lesson-plans', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'subject.name', label: 'Subject' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true },
      { name: 'subjectId', label: 'Subject', type: 'api-select', optionsEndpoint: '/academic/subjects' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'content', label: 'Content', type: 'textarea', required: true, fullWidth: true },
    ],
  },
  {
    module: 'resource', title: 'Syllabus', plural: 'Syllabus',
    basePath: '/resources/syllabus', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/resources/syllabus', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'subject.name', label: 'Subject' }],
    formFields: [
      { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true },
      { name: 'subjectId', label: 'Subject', type: 'api-select', optionsEndpoint: '/academic/subjects', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'resource', title: 'Learning Material', plural: 'Learning Materials',
    basePath: '/resources/materials', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/resources/materials', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'subject.name', label: 'Subject' }],
    formFields: [
      { name: 'title', label: 'Title', type: 'text', required: true, fullWidth: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Document', value: 'document' }, { label: 'Video', value: 'video' }, { label: 'Link', value: 'link' }] },
      { name: 'subjectId', label: 'Subject', type: 'api-select', optionsEndpoint: '/academic/subjects' },
      { name: 'url', label: 'URL / File Link', type: 'text', fullWidth: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'resource', title: 'Online Class', plural: 'Online Classes',
    basePath: '/resources/online-classes', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/resources/online-classes', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'startTime', label: 'Start' }, { key: 'platform', label: 'Platform' }],
    formFields: [
      { name: 'title', label: 'Class Title', type: 'text', required: true, fullWidth: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'startTime', label: 'Start Time', type: 'time', required: true },
      { name: 'endTime', label: 'End Time', type: 'time' },
      { name: 'platform', label: 'Platform', type: 'select', options: [{ label: 'Zoom', value: 'zoom' }, { label: 'Google Meet', value: 'google_meet' }, { label: 'Microsoft Teams', value: 'ms_teams' }, { label: 'Other', value: 'other' }] },
      { name: 'link', label: 'Meeting Link', type: 'text', fullWidth: true },
      { name: 'subjectId', label: 'Subject', type: 'api-select', optionsEndpoint: '/academic/subjects' },
    ],
  },

  // =====================================================
  // ONLINE EXAM MODULE
  // =====================================================
  {
    module: 'onlineExam', title: 'Online Exam', plural: 'Online Exams',
    basePath: '/online-exams', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/online-exams', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'duration', label: 'Duration (min)' }, { key: 'totalMarks', label: 'Total Marks' }, { key: 'startDate', label: 'Start', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Exam Title', type: 'text', required: true, fullWidth: true },
      { name: 'duration', label: 'Duration (Minutes)', type: 'number', required: true },
      { name: 'totalMarks', label: 'Total Marks', type: 'number', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
      { name: 'instructions', label: 'Instructions', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // RECRUITMENT MODULE
  // =====================================================
  {
    module: 'recruitment', title: 'Job Vacancy', plural: 'Job Vacancies',
    basePath: '/recruitment/vacancies', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/recruitment/vacancies',
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'department', label: 'Department' }, { key: 'positions', label: 'Positions' }, { key: 'lastDate', label: 'Last Date', type: 'date' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'title', label: 'Job Title', type: 'text', required: true, fullWidth: true },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'positions', label: 'Number of Positions', type: 'number', required: true },
      { name: 'lastDate', label: 'Application Deadline', type: 'date' },
      { name: 'description', label: 'Job Description', type: 'textarea', fullWidth: true },
      { name: 'requirements', label: 'Requirements', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'recruitment', title: 'Job Application', plural: 'Job Applications',
    basePath: '/recruitment/applications', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/recruitment/applications',
    listColumns: [{ key: 'applicantName', label: 'Applicant' }, { key: 'vacancy.title', label: 'Position' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'createdAt', label: 'Applied', type: 'date' }],
    formFields: [
      { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'vacancyId', label: 'Job Vacancy', type: 'api-select', optionsEndpoint: '/recruitment/vacancies', optionLabel: 'title', required: true },
      { name: 'coverLetter', label: 'Cover Letter', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // DISCIPLINE MODULE
  // =====================================================
  {
    module: 'discipline', title: 'Incident', plural: 'Discipline Incidents',
    basePath: '/discipline/incidents', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/discipline/incidents', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'severity', label: 'Severity', type: 'status' }, { key: 'date', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Incident Title', type: 'text', required: true, fullWidth: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'severity', label: 'Severity', type: 'select', required: true, options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }, { label: 'Critical', value: 'critical' }] },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true },
      { name: 'actionTaken', label: 'Action Taken', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // ACTIVITY MODULE
  // =====================================================
  {
    module: 'activity', title: 'Trip', plural: 'Trips & Activities',
    basePath: '/activities/trips', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/activities/trips', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'destination', label: 'Destination' }, { key: 'startDate', label: 'Start', type: 'date' }, { key: 'endDate', label: 'End', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Trip Title', type: 'text', required: true, fullWidth: true },
      { name: 'destination', label: 'Destination', type: 'text', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // BLOG MODULE
  // =====================================================
  {
    module: 'blog', title: 'Blog Post', plural: 'Blog Posts',
    basePath: '/blog/posts', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/blogs',
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'createdAt', label: 'Published', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Post Title', type: 'text', required: true, fullWidth: true },
      { name: 'slug', label: 'Slug', type: 'text', hint: 'Auto-generated from title if left blank' },
      { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
      { name: 'content', label: 'Content', type: 'textarea', required: true, fullWidth: true, rows: 8 },
    ],
  },
  {
    module: 'blog', title: 'Blog Category', plural: 'Blog Categories',
    basePath: '/blog/categories', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/blog-categories',
    listColumns: [{ key: 'name', label: 'Category Name' }, { key: 'slug', label: 'Slug' }],
    formFields: [
      { name: 'name', label: 'Category Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text' },
    ],
  },

  // =====================================================
  // NEWS MODULE
  // =====================================================
  {
    module: 'news', title: 'News Article', plural: 'News Articles',
    basePath: '/news/articles', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/news',
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'publishedAt', label: 'Published', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Article Title', type: 'text', required: true, fullWidth: true },
      { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
      { name: 'content', label: 'Content', type: 'textarea', required: true, fullWidth: true, rows: 8 },
    ],
  },
  {
    module: 'news', title: 'News Category', plural: 'News Categories',
    basePath: '/news/categories', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/news-categories',
    listColumns: [{ key: 'name', label: 'Category Name' }, { key: 'slug', label: 'Slug' }],
    formFields: [
      { name: 'name', label: 'Category Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text' },
    ],
  },

  // =====================================================
  // GALLERY MODULE
  // =====================================================
  {
    module: 'gallery', title: 'Gallery', plural: 'Galleries',
    basePath: '/gallery', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/galleries',
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'createdAt', label: 'Created', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Gallery Title', type: 'text', required: true, fullWidth: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Photo', value: 'photo' }, { label: 'Video', value: 'video' }] },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // CUSTOM FORMS MODULE
  // =====================================================
  {
    module: 'customForm', title: 'Custom Form', plural: 'Custom Forms',
    basePath: '/custom-forms', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/custom-forms', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'title', label: 'Form Title' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'submissions', label: 'Submissions' }],
    formFields: [
      { name: 'title', label: 'Form Title', type: 'text', required: true, fullWidth: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // APPROVAL MODULE
  // =====================================================
  {
    module: 'approval', title: 'Approval Type', plural: 'Approval Types',
    basePath: '/approvals/types', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/approvals/types',
    listColumns: [{ key: 'name', label: 'Approval Type' }, { key: 'levels', label: 'Levels' }],
    formFields: [
      { name: 'name', label: 'Approval Type Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'approval', title: 'Approval Request', plural: 'Approval Requests',
    basePath: '/approvals/requests', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/approvals/requests',
    listColumns: [{ key: 'subject', label: 'Subject' }, { key: 'approvalType.name', label: 'Type' }, { key: 'priority', label: 'Priority', type: 'status' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'createdAt', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'subject', label: 'Subject', type: 'text', required: true, fullWidth: true },
      { name: 'approvalTypeId', label: 'Approval Type', type: 'api-select', optionsEndpoint: '/approvals/types', required: true },
      { name: 'priority', label: 'Priority', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }] },
      { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true },
    ],
  },

  // =====================================================
  // TASK MODULE
  // =====================================================
  {
    module: 'task', title: 'Task', plural: 'Tasks',
    basePath: '/tasks', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/tasks',
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'priority', label: 'Priority', type: 'status' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'dueDate', label: 'Due Date', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Task Title', type: 'text', required: true, fullWidth: true },
      { name: 'priority', label: 'Priority', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }, { label: 'Urgent', value: 'urgent' }] },
      { name: 'status', label: 'Status', type: 'select', options: [{ label: 'To Do', value: 'todo' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Done', value: 'done' }] },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // HELPDESK MODULE
  // =====================================================
  {
    module: 'helpdesk', title: 'Ticket', plural: 'Tickets',
    basePath: '/helpdesk/tickets', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/helpdesk/tickets',
    listColumns: [{ key: 'subject', label: 'Subject' }, { key: 'category', label: 'Category' }, { key: 'priority', label: 'Priority', type: 'status' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'createdAt', label: 'Created', type: 'date' }],
    formFields: [
      { name: 'subject', label: 'Subject', type: 'text', required: true, fullWidth: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'priority', label: 'Priority', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }, { label: 'Urgent', value: 'urgent' }] },
      { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true },
    ],
  },
  {
    module: 'helpdesk', title: 'FAQ', plural: 'FAQs',
    basePath: '/helpdesk/faqs', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/helpdesk/faqs', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'question', label: 'Question' }, { key: 'category', label: 'Category' }],
    formFields: [
      { name: 'question', label: 'Question', type: 'text', required: true, fullWidth: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true, fullWidth: true },
      { name: 'category', label: 'Category', type: 'text' },
    ],
  },

  // =====================================================
  // SOCIAL WALL MODULE
  // =====================================================
  {
    module: 'socialWall', title: 'Post', plural: 'Social Wall Posts',
    basePath: '/social-wall', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/social-wall/posts', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'content', label: 'Content' }, { key: 'author.firstName', label: 'Author' }, { key: 'createdAt', label: 'Posted', type: 'date' }],
    formFields: [
      { name: 'content', label: 'Post Content', type: 'textarea', required: true, fullWidth: true, rows: 6 },
    ],
  },

  // =====================================================
  // NOTIFICATION MODULE
  // =====================================================
  {
    module: 'notification', title: 'Notification', plural: 'Notifications',
    basePath: '/notifications', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/notifications',
    hideCreate: true,
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'isRead', label: 'Read', type: 'boolean' }, { key: 'createdAt', label: 'Date', type: 'date' }],
    formFields: [],
  },
  {
    module: 'notification', title: 'Reminder', plural: 'Reminders',
    basePath: '/notifications/reminders', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/notifications/reminders',
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'scheduledAt', label: 'Scheduled', type: 'datetime' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'title', label: 'Reminder Title', type: 'text', required: true, fullWidth: true },
      { name: 'scheduledAt', label: 'Scheduled Date/Time', type: 'datetime-local', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // SERVICE REQUEST MODULE
  // =====================================================
  {
    module: 'serviceRequest', title: 'Service Request', plural: 'Service Requests',
    basePath: '/service-requests', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/service-requests',
    listColumns: [{ key: 'subject', label: 'Subject' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'createdAt', label: 'Date', type: 'date' }],
    formFields: [
      { name: 'subject', label: 'Subject', type: 'text', required: true, fullWidth: true },
      { name: 'type', label: 'Type', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true },
    ],
  },
  {
    module: 'serviceRequest', title: 'Dialogue', plural: 'Dialogues',
    basePath: '/service-requests/dialogues', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/service-requests/dialogues',
    listColumns: [{ key: 'subject', label: 'Subject' }, { key: 'category', label: 'Category' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'subject', label: 'Subject', type: 'text', required: true, fullWidth: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, fullWidth: true },
    ],
  },

  // =====================================================
  // CERTIFICATE MODULE
  // =====================================================
  {
    module: 'certificate', title: 'Certificate Template', plural: 'Certificate Templates',
    basePath: '/certificates/templates', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/certificates/templates', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'name', label: 'Template Name' }, { key: 'type', label: 'Type' }],
    formFields: [
      { name: 'name', label: 'Template Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Transfer Certificate', value: 'transfer' }, { label: 'Character Certificate', value: 'character' }, { label: 'Bonafide', value: 'bonafide' }, { label: 'Custom', value: 'custom' }] },
      { name: 'content', label: 'Template Content', type: 'textarea', fullWidth: true, rows: 8 },
    ],
  },
  {
    module: 'certificate', title: 'ID Card Template', plural: 'ID Card Templates',
    basePath: '/certificates/id-card-templates', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/certificates/id-card-templates', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'name', label: 'Template Name' }, { key: 'type', label: 'For' }],
    formFields: [
      { name: 'name', label: 'Template Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Student', value: 'student' }, { label: 'Employee', value: 'employee' }, { label: 'Guardian', value: 'guardian' }] },
      { name: 'layout', label: 'Layout JSON', type: 'textarea', fullWidth: true, rows: 8 },
    ],
  },

  // =====================================================
  // PAYMENT MODULE
  // =====================================================
  {
    module: 'payment', title: 'Payment', plural: 'Payments',
    basePath: '/payments', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/payments',
    listColumns: [{ key: 'transactionId', label: 'Transaction ID' }, { key: 'amount', label: 'Amount', type: 'currency' }, { key: 'gateway', label: 'Gateway' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'createdAt', label: 'Date', type: 'date' }],
    formFields: [],
    hideCreate: true,
  },

  // =====================================================
  // WEBSITE / CMS MODULE
  // =====================================================
  {
    module: 'website', title: 'Site Page', plural: 'Site Pages',
    basePath: '/website/pages', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/website/pages',
    listColumns: [{ key: 'title', label: 'Page Title' }, { key: 'slug', label: 'Slug' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [
      { name: 'title', label: 'Page Title', type: 'text', required: true, fullWidth: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }] },
      { name: 'content', label: 'Page Content', type: 'textarea', required: true, fullWidth: true, rows: 10 },
    ],
  },
  {
    module: 'website', title: 'Site Menu', plural: 'Site Menus',
    basePath: '/website/menus', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/website/menus',
    listColumns: [{ key: 'label', label: 'Label' }, { key: 'url', label: 'URL' }, { key: 'position', label: 'Position' }],
    formFields: [
      { name: 'label', label: 'Menu Label', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'text', required: true },
      { name: 'position', label: 'Position', type: 'number' },
    ],
  },

  // =====================================================
  // CONFIG MODULE
  // =====================================================
  {
    module: 'config', title: 'Custom Field', plural: 'Custom Fields',
    basePath: '/config/custom-fields', allowedScopes: ['ADMIN'], endpoint: '/config/custom-fields',
    listColumns: [{ key: 'name', label: 'Field Name' }, { key: 'type', label: 'Type' }, { key: 'module', label: 'Module' }],
    formFields: [
      { name: 'name', label: 'Field Name', type: 'text', required: true },
      { name: 'type', label: 'Field Type', type: 'select', required: true, options: [{ label: 'Text', value: 'text' }, { label: 'Number', value: 'number' }, { label: 'Date', value: 'date' }, { label: 'Select', value: 'select' }, { label: 'Textarea', value: 'textarea' }, { label: 'File', value: 'file' }] },
      { name: 'module', label: 'Module', type: 'select', options: [{ label: 'Student', value: 'student' }, { label: 'Employee', value: 'employee' }, { label: 'Registration', value: 'registration' }] },
    ],
  },
  {
    module: 'config', title: 'Option', plural: 'Options',
    basePath: '/config/options', allowedScopes: ['ADMIN'], endpoint: '/config/options',
    listColumns: [{ key: 'name', label: 'Option Name' }, { key: 'type', label: 'Type' }],
    formFields: [
      { name: 'name', label: 'Option Name', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // TEAM & ORGANIZATION MODULE
  // =====================================================
  {
    module: 'team', title: 'Organization', plural: 'Organizations',
    basePath: '/organizations', allowedScopes: ['ADMIN'], endpoint: '/teams/organizations',
    listColumns: [{ key: 'name', label: 'Organization Name' }, { key: 'code', label: 'Code' }, { key: 'email', label: 'Email' }, { key: 'isActive', label: 'Active', type: 'boolean' }],
    formFields: [
      { name: 'name', label: 'Organization Name', type: 'text', required: true, fullWidth: true },
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'website', label: 'Website', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'team', title: 'Team', plural: 'Teams / Institutes',
    basePath: '/teams', allowedScopes: ['ADMIN'], endpoint: '/teams',
    listColumns: [{ key: 'name', label: 'Team Name' }, { key: 'code', label: 'Code' }, { key: 'organization.name', label: 'Organization' }, { key: 'isActive', label: 'Active', type: 'boolean' }],
    formFields: [
      { name: 'name', label: 'Team / Institute Name', type: 'text', required: true, fullWidth: true },
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'organizationId', label: 'Organization', type: 'api-select', optionsEndpoint: '/teams/organizations', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'timezone', label: 'Timezone', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // USER & ROLE MODULE
  // =====================================================
  {
    module: 'user', title: 'User', plural: 'Users',
    basePath: '/users', allowedScopes: ['ADMIN'], endpoint: '/users',
    listColumns: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'scope', label: 'Scope', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    formFields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true, fullWidth: true },
      { name: 'password', label: 'Password', type: 'password', hint: 'Leave blank to keep unchanged (edit mode)' },
      { name: 'scope', label: 'Scope', type: 'select', required: true, options: [{ label: 'Admin', value: 'ADMIN' }, { label: 'Employee', value: 'EMPLOYEE' }, { label: 'Student', value: 'STUDENT' }, { label: 'Guardian', value: 'GUARDIAN' }] },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }, { label: 'Banned', value: 'BANNED' }] },
    ],
  },
  {
    module: 'user', title: 'Role', plural: 'Roles',
    basePath: '/users/roles', allowedScopes: ['ADMIN'], endpoint: '/roles',
    listColumns: [{ key: 'name', label: 'Role Name' }, { key: 'slug', label: 'Slug' }, { key: 'description', label: 'Description' }],
    formFields: [
      { name: 'name', label: 'Role Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },

  // =====================================================
  // UTILITY MODULE
  // =====================================================
  {
    module: 'utility', title: 'Todo', plural: 'Todos',
    basePath: '/utility/todos', allowedScopes: ['ADMIN'], endpoint: '/utilities/todos',
    listColumns: [{ key: 'title', label: 'Title' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'dueDate', label: 'Due Date', type: 'date' }],
    formFields: [
      { name: 'title', label: 'Todo Title', type: 'text', required: true, fullWidth: true },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
  },
  {
    module: 'utility', title: 'Backup', plural: 'Backups',
    basePath: '/utility/backups', allowedScopes: ['ADMIN'], endpoint: '/utilities/backups',
    listColumns: [{ key: 'name', label: 'Backup Name' }, { key: 'size', label: 'Size' }, { key: 'createdAt', label: 'Created', type: 'date' }],
    formFields: [
      { name: 'name', label: 'Backup Name', type: 'text', required: true },
    ],
  },
  {
    module: 'utility', title: 'Activity Log', plural: 'Activity Logs',
    basePath: '/utility/activity-logs', allowedScopes: ['ADMIN'], endpoint: '/utilities/activity-logs',
    hideCreate: true, hideDelete: true,
    listColumns: [{ key: 'action', label: 'Action' }, { key: 'module', label: 'Module' }, { key: 'user.firstName', label: 'User' }, { key: 'createdAt', label: 'Date', type: 'datetime' }],
    formFields: [],
  },

  // =====================================================
  // ATTENDANCE MODULE (list views)
  // =====================================================
  {
    module: 'attendance', title: 'Student Attendance', plural: 'Student Attendance Records',
    basePath: '/attendance/students', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/attendance/students',
    hideCreate: true,
    listColumns: [{ key: 'student.firstName', label: 'Student' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [],
  },
  {
    module: 'attendance', title: 'Employee Attendance', plural: 'Employee Attendance Records',
    basePath: '/attendance/employees', allowedScopes: ['ADMIN', 'EMPLOYEE'], endpoint: '/attendance/employees',
    hideCreate: true,
    listColumns: [{ key: 'employee.firstName', label: 'Employee' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'status', label: 'Status', type: 'status' }],
    formFields: [],
  },

  // =====================================================
  // TIMETABLE MODULE
  // =====================================================
  {
    module: 'timetable', title: 'Timetable', plural: 'Timetables',
    basePath: '/timetable', allowedScopes: ['ADMIN', 'EMPLOYEE', 'STUDENT', 'GUARDIAN'], endpoint: '/timetables', readOnlyForScopes: ['STUDENT', 'GUARDIAN'],
    listColumns: [{ key: 'name', label: 'Timetable Name' }, { key: 'course.name', label: 'Course' }, { key: 'batch.name', label: 'Batch' }],
    formFields: [
      { name: 'name', label: 'Timetable Name', type: 'text', required: true, fullWidth: true },
      { name: 'courseId', label: 'Course', type: 'api-select', optionsEndpoint: '/academic/courses' },
      { name: 'batchId', label: 'Batch', type: 'api-select', optionsEndpoint: '/academic/batches' },
    ],
  },
];
