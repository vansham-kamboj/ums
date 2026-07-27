# Phase 1: UMS (University Management System) — Complete Backend Implementation

> **Goal**: Build the complete backend logic, database schema, API routes, authentication, role-based access, and all 49 modules as described in the features document. No UI work — Phase 2 will handle frontend/design.

## Tech Stack for Phase 1

| Component | Technology |
|---|---|
| **Runtime** | Node.js (v20+) |
| **Framework** | Express.js |
| **Language** | JavaScript (ES Modules) |
| **Database** | PostgreSQL via **NeonDB** (serverless) |
| **ORM** | Prisma ORM |
| **Authentication** | JWT (access + refresh tokens) + bcrypt |
| **Real-time** | Socket.io (for chat & notifications) |
| **File Upload** | Multer (local storage for now) |
| **Validation** | Joi |
| **Email** | Nodemailer |
| **PDF** | pdfkit |
| **Excel** | exceljs |
| **QR Code** | qrcode |
| **Cron Jobs** | node-cron |

---

## User Review Required

> [!IMPORTANT]
> **Tech Stack Confirmation**: The features doc mentions Laravel/Vue.js, but your request says React + Tailwind CSS + PostgreSQL. This plan uses **Node.js/Express + Prisma + PostgreSQL (NeonDB)** for the backend, with React reserved for Phase 2. Please confirm this is acceptable.

> [!IMPORTANT]
> **NeonDB Connection String**: You mentioned you'll provide the NeonDB connection string later. The code will use a `.env` placeholder (`DATABASE_URL`) that you'll fill in.

> [!WARNING]
> **Scope**: This is an extremely large system (49 modules, 230+ database tables). Phase 1 will build ALL of them as specified, but the implementation will be structured in logical batches to ensure quality. Each module will have complete CRUD APIs, business logic, and validations.

## Open Questions

> [!IMPORTANT]
> 1. **SMS/WhatsApp Provider**: Should we stub out SMS/WhatsApp integration for now, or do you have API keys for Twilio/WhatsApp Business?
> 2. **File Storage**: Local disk for Phase 1, or do you want S3/Wasabi configured from the start?
> 3. **Payment Gateways**: Should we implement Razorpay/Stripe integration stubs, or full integration with test keys?
> 4. **Multi-tenant**: The doc mentions multi-team/multi-institute. Should each institute get a separate schema, or use a `team_id` column approach?

---

## Project Structure

```
ums/
├── prisma/
│   └── schema.prisma              # Complete database schema (all 230+ tables)
├── src/
│   ├── index.js                   # Express app entry point
│   ├── config/
│   │   ├── database.js            # Prisma client singleton
│   │   ├── env.js                 # Environment variables
│   │   ├── cors.js                # CORS configuration
│   │   └── socket.js              # Socket.io setup
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   ├── authorize.js           # Role/permission middleware
│   │   ├── rateLimiter.js         # Rate limiting
│   │   ├── ipFilter.js            # IP blacklist/whitelist
│   │   ├── teamScope.js           # Multi-team scoping
│   │   ├── maintenance.js         # Maintenance mode check
│   │   ├── activityLog.js         # Activity logging
│   │   ├── upload.js              # File upload middleware
│   │   ├── validate.js            # Joi validation wrapper
│   │   └── errorHandler.js        # Global error handler
│   ├── modules/
│   │   ├── auth/                  # Authentication & Security
│   │   ├── dashboard/             # Dashboard APIs
│   │   ├── academic/              # Academic Module
│   │   ├── student/               # Student Management
│   │   ├── guardian/              # Guardian Management
│   │   ├── employee/              # Employee / HR Management
│   │   ├── fee/                   # Fee & Finance Management
│   │   ├── exam/                  # Examination Module
│   │   ├── attendance/            # Attendance Module
│   │   ├── timetable/             # Timetable Module
│   │   ├── transport/             # Transport Module
│   │   ├── library/               # Library Module
│   │   ├── hostel/                # Hostel / Room Management
│   │   ├── inventory/             # Inventory / Stock Management
│   │   ├── mess/                  # Mess / Cafeteria Module
│   │   ├── reception/             # Reception / Front Office
│   │   ├── communication/         # Communication Module
│   │   ├── calendar/              # Calendar & Events
│   │   ├── resource/              # Resource / Academic Content
│   │   ├── onlineExam/            # Online Exam Module
│   │   ├── recruitment/           # Recruitment Module
│   │   ├── discipline/            # Discipline Module
│   │   ├── activity/              # Activity / Trip Module
│   │   ├── blog/                  # Blog Module
│   │   ├── news/                  # News Module
│   │   ├── gallery/               # Gallery Module
│   │   ├── customForm/            # Custom Forms Module
│   │   ├── approval/              # Approval Workflow Module
│   │   ├── task/                  # Task Management Module
│   │   ├── helpdesk/              # Helpdesk Module
│   │   ├── socialWall/            # Post / Social Wall Module
│   │   ├── chat/                  # Chat Module (Real-time)
│   │   ├── notification/          # Reminder & Notification Module
│   │   ├── serviceRequest/        # Service Request & Dialogue Module
│   │   ├── certificate/           # Certificate & ID Card Module
│   │   ├── report/                # Reports Module
│   │   ├── payment/               # Payment Gateway Module
│   │   ├── website/               # Website / CMS Module
│   │   ├── config/                # Configuration & Settings Module
│   │   ├── user/                  # User & Role Management
│   │   ├── team/                  # Multi-Team / Multi-Institute
│   │   ├── utility/               # Utility Module (Todo, Backup, Logs)
│   │   ├── importExport/          # Import / Export Module
│   │   └── integration/           # Integration Module
│   ├── services/
│   │   ├── email.service.js       # Email service
│   │   ├── sms.service.js         # SMS service (stub)
│   │   ├── whatsapp.service.js    # WhatsApp service (stub)
│   │   ├── notification.service.js # Unified notification dispatcher
│   │   ├── pdf.service.js         # PDF generation
│   │   ├── excel.service.js       # Excel import/export
│   │   ├── qrcode.service.js      # QR code generation
│   │   ├── otp.service.js         # OTP generation & verification
│   │   ├── payment.service.js     # Payment gateway abstraction
│   │   └── storage.service.js     # File storage abstraction
│   └── utils/
│       ├── apiResponse.js         # Standardized API responses
│       ├── pagination.js          # Pagination helper
│       ├── slug.js                # Slug generation
│       ├── constants.js           # System constants & enums
│       └── helpers.js             # General utilities
├── uploads/                       # Local file storage
├── .env.example                   # Environment template
├── package.json
└── README.md
```

Each module folder follows a consistent pattern:
```
modules/<module>/
├── <module>.routes.js        # Express routes
├── <module>.controller.js    # Request handlers
├── <module>.service.js       # Business logic
└── <module>.validator.js     # Joi validation schemas
```

---

## Proposed Changes

### Core Infrastructure

#### [NEW] `package.json`
- Initialize Node.js project with all dependencies listed in tech stack table above.

#### [NEW] `prisma/schema.prisma`
- Complete Prisma schema with **230+ models** covering every database table for all 49 modules.
- Key model groups:
  - **Core**: Organization, Team, User, Role, Permission, UserRole, UserPermission, ActivityLog
  - **Academic**: AcademicSession, Period, ProgramType, Department, Program, Division, Course, Batch, Subject, SubjectType, SubjectRecord, SubjectIncharge, ClassTiming, ClassTimingSession, EnrollmentSeat
  - **Student**: Enquiry, EnquiryRecord, EnquiryFollowup, Registration, RegistrationFee, Student, StudentRecord, StudentDocument, StudentQualification, StudentAccount, StudentHealthRecord, StudentTag, StudentGroup, Alumni
  - **Guardian**: Guardian, StudentGuardian
  - **Employee**: Employee, EmployeeRecord, EmployeeDocument, EmployeeQualification, EmployeeExperience, EmployeeAccount, EmployeeTag, EmployeeGroup, WorkShift, EmployeeWorkShift, Timesheet, LeaveType, LeaveAllocation, LeaveRequest, PayHead, SalaryTemplate, SalaryTemplateRecord, SalaryStructure, SalaryStructureRecord, Payroll, PayrollRecord
  - **Fee**: FeeGroup, FeeHead, FeeComponent, FeeStructure, FeeStructureComponent, FeeInstallment, FeeInstallmentRecord, FeeConcession, FeeConcessionRecord, StudentFee, StudentFeeRecord, FeePayment, FeePaymentRecord, FeeRefund, LedgerType, Ledger, Transaction, TransactionRecord, TransactionPayment
  - **Exam**: ExamTerm, Exam, ExamGrade, ExamAssessment, ExamSchedule, ExamRecord, ExamResult, ExamCompetency, ExamObservation
  - **Attendance**: StudentAttendance, EmployeeAttendance, AttendanceType
  - **Timetable**: Timetable, TimetableRecord, TimetableAllocation
  - **Transport**: TransportCircle, TransportStoppage, TransportRoute, TransportRouteRecord, TransportRouteStoppage, TransportRoutePassenger, TransportFee, Vehicle, VehicleDocument, VehicleIncharge, FuelRecord, ServiceRecord, TripRecord, CaseRecord, VehicleExpense
  - **Library**: Book, BookCopy, BookAddition, BookIssue, BookReturn
  - **Hostel**: Block, Floor, Room, RoomAllocation
  - **Inventory**: Inventory, StockCategory, StockItem, StockItemCopy, StockPurchase, StockRequisition, StockTransfer, StockAdjustment, StockReturn, StockBalance, Vendor
  - **Mess**: MenuItem, Meal, MealLog, MealLogRecord
  - **Reception**: VisitorLog, GatePass, CallLog, Complaint, ComplaintLog, PostalCorrespondence, OnlineQuery
  - **Communication**: Announcement, CommunicationRecord, MailTemplate, SmsTemplate, WhatsappTemplate, PushTemplate
  - **Calendar**: Event, Holiday
  - **Resource**: Assignment, AssignmentSubmission, Diary, LessonPlan, Syllabus, SyllabusUnit, LearningMaterial, OnlineClass, Download
  - **Online Exam**: OnlineExam, OnlineExamQuestion, OnlineExamSubmission
  - **Recruitment**: JobVacancy, JobApplication
  - **Discipline**: Incident
  - **Activity**: Trip, TripParticipant
  - **Blog**: BlogPost, BlogCategory, BlogTag
  - **News**: NewsArticle, NewsCategory, NewsTag
  - **Gallery**: Gallery, GalleryImage
  - **Custom Form**: CustomForm, CustomFormField, FormSubmission, FormSubmissionRecord
  - **Approval**: ApprovalType, ApprovalLevel, ApprovalRequest
  - **Task**: Task, TaskMember, TaskChecklist
  - **Helpdesk**: Ticket, TicketMessage, FAQ
  - **Social Wall**: Post, PostComment
  - **Chat**: Conversation, ChatParticipant, ChatMessage
  - **Notification**: Notification, Reminder, ReminderUser, DeviceToken
  - **Service Request**: ServiceAllocation, ServiceRequest, Dialogue, ContactEditRequest
  - **Certificate**: CertificateTemplate, Certificate, IdCardTemplate, IdCard
  - **Payment**: PaymentGateway, PaymentTransaction
  - **Website**: SitePage, SiteMenu, SiteBlock, WebsiteConfig
  - **Config**: SystemConfig, ModuleConfig, Locale, LocaleTranslation, CustomField, Option, OptionItem
  - **Utility**: Todo, TodoItem, Backup
  - **Import/Export**: ImportJob, ExportJob

#### [NEW] `src/index.js`
- Express app initialization, middleware registration, route mounting, Socket.io setup, error handling.

#### [NEW] `src/config/` (all files)
- Database connection (Prisma client), environment config, CORS, Socket.io configuration.

#### [NEW] `src/middleware/` (all files)
- JWT auth, role/permission authorization, rate limiting, IP filtering, team scoping, maintenance mode, activity logging, file uploads, validation wrapper, global error handler.

#### [NEW] `src/utils/` (all files)
- API response formatter, pagination helper, slug generator, constants/enums, general utilities.

#### [NEW] `src/services/` (all files)
- Email (Nodemailer), SMS (stub), WhatsApp (stub), unified notification dispatcher, PDF generation, Excel import/export, QR code, OTP, payment gateway abstraction, file storage abstraction.

---

### Module 1: Authentication & Security

#### [NEW] `src/modules/auth/`
**Features**:
- Email + password login with bcrypt hashing & JWT tokens (access + refresh)
- Login with OTP (email & SMS)
- Two-Factor Authentication (2FA) with TOTP
- Social login stubs (Microsoft)
- Screen lock/unlock (session-based lock without logout)
- Password reset flow (request → verify token → reset)
- Force change password on next login
- User registration with email verification
- Failed login attempt tracking & account lockout
- IP blacklist/whitelist filter middleware
- CSRF protection headers
- Rate limiting on auth routes
- User impersonation (admin → any user)
- User access log (track login activity)
- Maintenance mode middleware

**APIs**: `POST /auth/login`, `POST /auth/login-otp`, `POST /auth/verify-otp`, `POST /auth/register`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/refresh-token`, `POST /auth/logout`, `POST /auth/lock-screen`, `POST /auth/unlock-screen`, `POST /auth/impersonate/:userId`, `GET /auth/me`, `PUT /auth/change-password`, `POST /auth/2fa/enable`, `POST /auth/2fa/verify`

---

### Module 2: User & Role Management

#### [NEW] `src/modules/user/`
**Features**:
- Full CRUD for users (create, edit, deactivate, search, export)
- User scopes: Admin, Student, Guardian, Employee
- User statuses: Active, Inactive, Banned
- Role management: create custom roles with granular permissions
- Module-level & action-level permission assignment
- Role-wise & user-wise permission assignment/override
- Permission search
- Import/export roles & permissions
- Force change password by admin
- User scope update

**APIs**: `GET/POST/PUT/DELETE /users`, `GET/POST/PUT/DELETE /roles`, `GET /permissions`, `POST /roles/:id/permissions`, `POST /users/:id/permissions`, `POST /users/:id/force-change-password`, `PUT /users/:id/scope`, `GET /users/export`, `POST /roles/import`, `GET /roles/export`

---

### Module 3: Multi-Team / Multi-Institute

#### [NEW] `src/modules/team/`
**Features**:
- Organization CRUD
- Team/Institute CRUD under organizations
- Per-team configuration settings
- Team switching for multi-team users
- Team export
- All data scoped by `team_id` via middleware

**APIs**: `GET/POST/PUT/DELETE /organizations`, `GET/POST/PUT/DELETE /teams`, `PUT /teams/:id/config`, `POST /teams/switch`, `GET /teams/export`

---

### Module 4: Configuration & Settings

#### [NEW] `src/modules/config/`
**Features**:
- General settings (institute name, logo, contact, timezone)
- Module enable/disable configuration
- Module prerequisite checks
- Asset upload/remove (logo, favicon)
- Mail/SMS/WhatsApp/Pusher/Push notification configuration with test endpoints
- Locale management, translation sync, multi-language support
- Custom field management (student, employee, registration forms with text/number/date/select types)
- 62+ configurable option types — full CRUD with import, export, reorder
- Option items management per option type

**APIs**: `GET/PUT /config/general`, `GET/PUT /config/modules`, `POST /config/assets`, `GET/PUT /config/mail`, `POST /config/mail/test`, `GET/PUT /config/sms`, `POST /config/sms/test`, `GET/POST/PUT/DELETE /locales`, `POST /locales/sync`, `GET/POST/PUT/DELETE /custom-fields`, `GET/POST/PUT/DELETE /options`, `GET/POST/PUT/DELETE /options/:typeId/items`, `POST /options/import`, `GET /options/export`, `PUT /options/reorder`

---

### Module 5: Academic Module

#### [NEW] `src/modules/academic/`
**Features**:
- Academic session CRUD with archive/unarchive
- Program types, departments, programs, divisions, courses, batches — full hierarchy CRUD
- Course & batch bulk import
- Subject management: CRUD, types, records, batch mapping, incharge assignment, student elective mapping
- Certificate & ID card template design (JSON template storage)
- Certificate generation with custom numbering
- ID card generation for students, parents, guardians
- Book list management (course-wise), public access
- Class timing sessions with multiple session support
- Seat-wise admission enrollment

**APIs**: `GET/POST/PUT/DELETE /academic/sessions`, `PUT /academic/sessions/:id/archive`, `GET/POST/PUT/DELETE /academic/program-types`, `GET/POST/PUT/DELETE /academic/departments`, `GET/POST/PUT/DELETE /academic/programs`, `GET/POST/PUT/DELETE /academic/divisions`, `GET/POST/PUT/DELETE /academic/courses`, `GET/POST/PUT/DELETE /academic/batches`, `POST /academic/courses/import`, `GET/POST/PUT/DELETE /academic/subjects`, `GET/POST/PUT/DELETE /academic/subject-types`, `POST /academic/subjects/:id/incharge`, `POST /academic/subjects/:id/students`, `GET/POST/PUT/DELETE /academic/class-timings`, `GET/POST/PUT/DELETE /academic/enrollment-seats`, `GET/POST/PUT/DELETE /academic/book-lists`, `GET /public/book-lists`

---

### Module 6: Student Management

#### [NEW] `src/modules/student/`
**Features**:
- **Enquiry**: Online enquiry, detailed wizard, records, follow-ups, stages/types/sources, convert to registration, bulk actions, print, assign to employee, import, notifications
- **Registration**: Online registration, detailed wizard, stages, verification, registration fee (online & partial), convert to admission, bulk actions, print, notifications, guardian import
- **Admission**: Full admission process, provisional admission, admission types, editable course/batch
- **Student Profile**: Personal details, contact info, photo upload, health records, custom fields, tags/groups, documents, account details, qualifications, emergency contact
- **Student Operations**: Fee allocation/payment, attendance view, subjects, exam records, enrollment status log, clock in/out, leave requests, diary, learning material, transfer request/certificate, contact edit request, service request, dialogue, mentor assignment, bulk update
- **Search & Navigation**: Global search, keyboard nav, export to Excel
- **Alumni**: Alumni records, alumni events

**APIs**: 60+ endpoints covering full Enquiry→Registration→Admission→Student lifecycle, profile CRUD, operations, and alumni management.

---

### Module 7: Guardian Management

#### [NEW] `src/modules/guardian/`
**Features**:
- Guardian profiles CRUD
- Multiple guardians per student (mother, father, local guardian)
- Primary guardian designation
- Sibling record view in fee payment
- Guardian import (bulk)
- Guardian user account creation (separate login)
- Guardian ID card generation
- Guardian sync across siblings

**APIs**: `GET/POST/PUT/DELETE /guardians`, `POST /guardians/:id/link-student`, `PUT /guardians/:id/primary`, `POST /guardians/import`, `POST /guardians/:id/create-account`, `POST /guardians/:id/generate-id-card`, `POST /guardians/:id/sync`

---

### Module 8: Employee / HR Management

#### [NEW] `src/modules/employee/`
**Features**:
- Department/designation CRUD
- Employee records with comprehensive profiles, tags, groups, documents, accounts, qualifications, experience, custom fields
- Welcome email on account creation
- Department-level & program-level access control
- Bulk update, export to Excel
- Attendance: custom types, daily marking, records, half-day, biometric stub
- Work shifts & timesheets
- Leave management: types, allocations, requests, multi-level approval
- Payroll: pay heads, salary templates with conditional formulas, structures, monthly processing, bulk processing, salary sheet/payment advice print
- Employee ticket system with threaded conversations

**APIs**: 50+ endpoints covering departments, designations, employees, attendance, shifts, timesheets, leave, payroll, and tickets.

---

### Module 9: Fee & Finance Management

#### [NEW] `src/modules/fee/`
**Features**:
- Fee structure setup: groups, heads, components, structures, installments, gender-wise fees, tax management
- Fee concessions: types, records, custom/round-off/secondary concessions, installment-wise restrictions, sibling check, summary reports
- Student fee: allocation, payment (head-wise, multi-installment, flexible), refunds, custom fee import, missing fee detection, mismatch detection
- Financial transactions: ledger types, ledgers, payment methods, transaction CRUD with records/payments/categories, import, voucher print, cheque clearing, user transfer
- Bank transfer with approval workflow
- Day closure for cashier/accountant, user-wise collection tracking
- Financial reports: day book, fee summary, head-wise summary, payment gateway reports, guest payment receipts, export

**APIs**: 70+ endpoints covering complete fee lifecycle and financial operations.

---

### Module 10: Examination Module

#### [NEW] `src/modules/exam/`
**Features**:
- Exam terms/exams with reorder support
- Grading system, assessment criteria, multiple attempt support, observations, weightage records
- Exam scheduling with date/time/subject/room
- Marks entry, results generation/publication, exam forms, auto-lock & improved lock mechanisms
- Competency-based evaluation
- Exam reports (subject-wise, mark reports)

**APIs**: `GET/POST/PUT/DELETE /exams/terms`, `GET/POST/PUT/DELETE /exams`, `GET/POST/PUT/DELETE /exams/grades`, `GET/POST/PUT/DELETE /exams/assessments`, `GET/POST/PUT/DELETE /exams/schedules`, `POST /exams/records`, `POST /exams/results/publish`, `POST /exams/records/lock`, `GET /exams/reports/subject-wise`, `GET /exams/reports/marks`

---

### Module 11: Attendance Module

#### [NEW] `src/modules/attendance/`
**Features**:
- Student attendance: daily, subject-wise, custom types, sessions, QR-code based, clock in/out, migration on course/batch change, reports
- Employee attendance: daily, types, records, attendance assistant role, biometric stub, summary

**APIs**: `POST /attendance/students/mark`, `POST /attendance/students/qr`, `POST /attendance/students/clock`, `GET /attendance/students/report`, `POST /attendance/employees/mark`, `GET /attendance/employees/summary`

---

### Module 12: Timetable Module

#### [NEW] `src/modules/timetable/`
**Features**:
- Class timings/sessions management
- Timetable CRUD with day-wise records
- Allocations (teacher, subject, room assignment)
- Multiple session support
- Print batch-wise timetable, teacher timetable view
- Dashboard timetable feed
- Bulk period updates by division/course/batch

**APIs**: `GET/POST/PUT/DELETE /timetables`, `POST /timetables/:id/records`, `POST /timetables/:id/allocations`, `GET /timetables/batch/:id`, `GET /timetables/teacher/:id`, `PUT /timetables/bulk-update`

---

### Module 13: Transport Module

#### [NEW] `src/modules/transport/`
**Features**:
- Transport circles, stoppages, routes (with stoppage mapping & ordering), bulk import
- Passenger assignment, transport fee structures & records
- Vehicle management: types, details, documents (with expiry tracking), incharge
- Vehicle records: fuel, service, trip, case, expense
- Transport reports

**APIs**: 30+ endpoints covering routes, passengers, vehicles, records, and reports.

---

### Module 14: Library Module

#### [NEW] `src/modules/library/`
**Features**:
- Book management: CRUD with authors, publishers, languages, topics, categories, conditions
- Book additions/purchases, individual copy tracking with barcodes
- Book issue/return transactions, overdue tracking
- Library reports

**APIs**: `GET/POST/PUT/DELETE /library/books`, `POST /library/books/:id/copies`, `POST /library/issue`, `POST /library/return`, `GET /library/overdue`, `GET /library/reports`

---

### Module 15: Hostel / Room Management

#### [NEW] `src/modules/hostel/`
**Features**:
- Blocks, floors, rooms CRUD with capacity
- Room allocation to students
- Room availability/occupancy tracking

**APIs**: `GET/POST/PUT/DELETE /hostel/blocks`, `GET/POST/PUT/DELETE /hostel/floors`, `GET/POST/PUT/DELETE /hostel/rooms`, `POST /hostel/rooms/:id/allocate`, `GET /hostel/availability`

---

### Module 16: Inventory / Stock Management

#### [NEW] `src/modules/inventory/`
**Features**:
- Inventory locations, stock categories/items/types/copies with records
- Bulk import, units management, initial quantity setup
- Stock operations: purchases, requisitions, transfers, adjustments, returns, balances
- Vendor management

**APIs**: 25+ endpoints covering complete inventory lifecycle.

---

### Module 17: Mess / Cafeteria Module

#### [NEW] `src/modules/mess/`
**Features**:
- Menu items, meal plans (breakfast/lunch/dinner)
- Daily meal logging with records
- Dashboard mess schedule

**APIs**: `GET/POST/PUT/DELETE /mess/menu-items`, `GET/POST/PUT/DELETE /mess/meals`, `POST /mess/meal-logs`, `GET /mess/schedule/today`

---

### Module 18: Reception / Front Office

#### [NEW] `src/modules/reception/`
**Features**:
- Enquiry management with follow-ups, stages, types, sources, assignment, import
- Visitor logs with visiting purposes
- Gate pass management with purposes
- Call logs with calling purposes
- Complaint management: types, logs, assignment, notifications, access-based views
- Online query management
- Postal correspondence tracking

**APIs**: 30+ endpoints covering all reception operations.

---

### Module 19: Communication Module

#### [NEW] `src/modules/communication/`
**Features**:
- Announcements CRUD with types, audience targeting, pin to feed
- Bulk communication records (email, SMS, WhatsApp)
- Template management: mail, SMS, WhatsApp, push notification templates with enable/disable status

**APIs**: `GET/POST/PUT/DELETE /announcements`, `POST /communications/send`, `GET/POST/PUT/DELETE /templates/mail`, `GET/POST/PUT/DELETE /templates/sms`, `GET/POST/PUT/DELETE /templates/whatsapp`, `GET/POST/PUT/DELETE /templates/push`

---

### Module 20: Calendar & Events

#### [NEW] `src/modules/calendar/`
**Features**:
- Events CRUD with types, event incharge, alumni events
- Holidays management
- Pin events to feed
- Combined todo + events calendar view

**APIs**: `GET/POST/PUT/DELETE /events`, `GET/POST/PUT/DELETE /holidays`, `GET /calendar/combined`

---

### Module 21: Resource / Academic Content

#### [NEW] `src/modules/resource/`
**Features**:
- Assignments: creation, types, submission, evaluation, date-wise reports
- Student diary with per-student publishing
- Lesson plans, syllabus with units
- Learning material upload with per-student publishing
- Online class scheduling
- Download management

**APIs**: 25+ endpoints covering assignments, diary, lesson plans, syllabus, materials, classes, and downloads.

---

### Module 22: Online Exam Module

#### [NEW] `src/modules/onlineExam/`
**Features**:
- Online exam CRUD with types
- Question management (MCQ, True/False, etc.)
- Student submission & auto-grading

**APIs**: `GET/POST/PUT/DELETE /online-exams`, `GET/POST/PUT/DELETE /online-exams/:id/questions`, `POST /online-exams/:id/submit`, `GET /online-exams/:id/results`

---

### Module 23: Recruitment Module

#### [NEW] `src/modules/recruitment/`
**Features**:
- Job vacancy CRUD with detailed records
- Job application management
- Public job listing & online application
- Application review workflow

**APIs**: `GET/POST/PUT/DELETE /recruitment/vacancies`, `GET/POST /recruitment/applications`, `GET /public/jobs`, `POST /public/jobs/:id/apply`

---

### Module 24: Discipline Module

#### [NEW] `src/modules/discipline/`
**Features**:
- Incident recording with categories, details, actions
- Student linking to incidents

**APIs**: `GET/POST/PUT/DELETE /discipline/incidents`, `POST /discipline/incidents/:id/link-students`

---

### Module 25: Activity / Trip Module

#### [NEW] `src/modules/activity/`
**Features**:
- Trip planning with types, participants
- Activity tracking

**APIs**: `GET/POST/PUT/DELETE /activities/trips`, `POST /activities/trips/:id/participants`, `GET/POST/PUT/DELETE /activities`

---

### Module 26: Blog Module

#### [NEW] `src/modules/blog/`
**Features**:
- Blog post CRUD with categories, tags, SEO-friendly slugs
- Category & tag filtering
- Public blog display

**APIs**: `GET/POST/PUT/DELETE /blogs`, `GET/POST/PUT/DELETE /blog-categories`, `GET /public/blogs`

---

### Module 27: News Module

#### [NEW] `src/modules/news/`
**Features**:
- News article CRUD with categories, tags
- Public news display with summary blocks
- Category & tag filtering

**APIs**: `GET/POST/PUT/DELETE /news`, `GET/POST/PUT/DELETE /news-categories`, `GET /public/news`

---

### Module 28: Gallery Module

#### [NEW] `src/modules/gallery/`
**Features**:
- Gallery CRUD with types (photo/video)
- Multi-image upload per gallery
- Watermark support
- Public gallery display, dashboard gallery

**APIs**: `GET/POST/PUT/DELETE /galleries`, `POST /galleries/:id/images`, `GET /public/galleries`

---

### Module 29: Custom Forms Module

#### [NEW] `src/modules/customForm/`
**Features**:
- Form builder with multiple field types (text, select, file, etc.)
- Form submission collection with detailed records
- Dashboard form list

**APIs**: `GET/POST/PUT/DELETE /custom-forms`, `POST /custom-forms/:id/fields`, `POST /custom-forms/:id/submit`, `GET /custom-forms/:id/submissions`

---

### Module 30: Approval Workflow Module

#### [NEW] `src/modules/approval/`
**Features**:
- Approval types with multi-level chains
- Approval request submission with priority, groups, nature
- Multi-level approval processing
- Approval request print

**APIs**: `GET/POST/PUT/DELETE /approvals/types`, `POST /approvals/types/:id/levels`, `POST /approvals/requests`, `PUT /approvals/requests/:id/approve`, `PUT /approvals/requests/:id/reject`

---

### Module 31: Task Management Module

#### [NEW] `src/modules/task/`
**Features**:
- Task CRUD with categories, priorities, lists
- Task member assignment
- Task checklists with progress tracking

**APIs**: `GET/POST/PUT/DELETE /tasks`, `POST /tasks/:id/members`, `POST /tasks/:id/checklists`, `PUT /tasks/checklists/:id/toggle`

---

### Module 32: Helpdesk Module

#### [NEW] `src/modules/helpdesk/`
**Features**:
- Ticket CRUD with categories, priorities, lists, assignees
- Threaded ticket messages
- Ticket status management (Open → In Progress → Resolved → Closed)
- FAQ management with categories

**APIs**: `GET/POST/PUT/DELETE /helpdesk/tickets`, `POST /helpdesk/tickets/:id/messages`, `PUT /helpdesk/tickets/:id/status`, `GET/POST/PUT/DELETE /helpdesk/faqs`

---

### Module 33: Social Wall Module

#### [NEW] `src/modules/socialWall/`
**Features**:
- Facebook-like wall with post creation (text & media)
- Scrollable feed, comments, audience targeting

**APIs**: `GET/POST/PUT/DELETE /social-wall/posts`, `POST /social-wall/posts/:id/comments`, `GET /social-wall/feed`

---

### Module 34: Chat Module (Real-time)

#### [NEW] `src/modules/chat/`
**Features**:
- Real-time chat via Socket.io
- Conversation threads with multi-user support
- Messages with read receipts
- User search for starting chats
- Chat enable/disable toggle

**APIs**: `GET/POST /chat/conversations`, `GET/POST /chat/conversations/:id/messages`, `PUT /chat/messages/:id/read`, `GET /chat/users/search` + Socket.io events for real-time messaging

---

### Module 35: Reminder & Notification Module

#### [NEW] `src/modules/notification/`
**Features**:
- Reminder creation for self/others with notification scheduling (node-cron)
- In-app notifications (bell icon)
- Mark as read (individual/all)
- Push notification stubs (mobile)
- Email/SMS/WhatsApp notification dispatching
- Enquiry/registration/complaint auto-notifications

**APIs**: `GET/POST/PUT/DELETE /reminders`, `GET /notifications`, `PUT /notifications/:id/read`, `PUT /notifications/read-all`, `POST /notifications/push/register-device`

---

### Module 36: Service Request & Dialogue Module

#### [NEW] `src/modules/serviceRequest/`
**Features**:
- Service allocation definitions, service request workflow with status tracking, types
- Student & employee dialogue (two-way communication) with categories
- Contact edit request submission & admin review/approval

**APIs**: `GET/POST/PUT/DELETE /service-requests/allocations`, `POST /service-requests`, `PUT /service-requests/:id/status`, `GET/POST /dialogues`, `POST /contact-edit-requests`, `PUT /contact-edit-requests/:id/review`

---

### Module 37: Certificate & ID Card Module

#### [NEW] `src/modules/certificate/`
**Features**:
- Certificate template design (JSON-based layout storage)
- Certificate generation for students/employees with custom numbering
- ID card template design
- ID card generation for students, parents, guardians
- Public transfer certificate verification

**APIs**: `GET/POST/PUT/DELETE /certificates/templates`, `POST /certificates/generate`, `GET/POST/PUT/DELETE /id-cards/templates`, `POST /id-cards/generate`, `GET /public/verify-certificate/:number`

---

### Module 38: Reports Module

#### [NEW] `src/modules/report/`
**Features**:
- Student reports: profile, attendance, subject-wise, sibling
- Exam reports: mark export
- Finance reports: day book, fee summary (head-wise, status-filtered), concession summary, payment gateway, transport
- Employee reports: attendance summary

**APIs**: `GET /reports/students/profile`, `GET /reports/students/attendance`, `GET /reports/exams/marks`, `GET /reports/finance/day-book`, `GET /reports/finance/fee-summary`, `GET /reports/employees/attendance`

---

### Module 39: Payment Gateway Module

#### [NEW] `src/modules/payment/`
**Features**:
- Payment gateway abstraction layer supporting Razorpay, Stripe (stubs for others)
- Guest payment portal (pay without login)
- Anonymous payment support
- Registration fee online payment
- Payment link QR code generation
- Test mode support
- Multi-gateway support

**APIs**: `POST /payments/initiate`, `POST /payments/verify`, `POST /payments/webhook/:gateway`, `POST /public/payments/guest`, `GET /payments/qr/:studentId`

---

### Module 40: Website / CMS Module

#### [NEW] `src/modules/website/`
**Features**:
- Website enable/disable toggle
- Theme configuration (default, modern, custom with predefined colors)
- Site pages CRUD with slug-based routing
- Navigation menus, content blocks, CTA blocks
- Blog/news/events/announcements/gallery integration on website
- Public-facing pages: home, dynamic pages, detail pages

**APIs**: `GET/PUT /website/config`, `GET/POST/PUT/DELETE /website/pages`, `GET/POST/PUT/DELETE /website/menus`, `POST /website/pages/:id/blocks`, `GET /public/pages/:slug`

---

### Module 41: Utility Module

#### [NEW] `src/modules/utility/`
**Features**:
- Todo lists with items, status toggle, archive/unarchive, reorder, move, export
- Manual backup creation, management, download, delete, export
- Activity log viewing with filters and export
- Server log viewer

**APIs**: `GET/POST/PUT/DELETE /todos`, `POST /todos/:id/items`, `PUT /todos/items/:id/toggle`, `POST /backups`, `GET /backups`, `GET /activity-logs`, `GET /server-logs`

---

### Module 42: Import / Export Module

#### [NEW] `src/modules/importExport/`
**Features**:
- Import handlers for: students, employees, guardians, enquiries, courses/batches, transactions, custom fees, stock, stoppages, options
- Bulk upload action handler
- Delete imported students
- Export handlers for: student list, employee list, fee payment report, todos, activity logs, backups, users, teams, roles, options, custom fields, roles & permissions
- All exports in Excel format via exceljs

**APIs**: `POST /import/:type`, `GET /export/:type`, `DELETE /import/students/rollback`

---

### Module 43: Integration Module

#### [NEW] `src/modules/integration/`
**Features**:
- Biometric integration stub
- WhatsApp Business API integration
- SMS gateway (Twilio) integration
- Socket.io for real-time features
- Social login (Microsoft) via passport.js
- Cloud storage (S3/Wasabi) stub
- Math equation (LaTeX) support stub

**APIs**: Configuration-based, integrated into respective modules.

---

### Module 44: Dashboard

#### [NEW] `src/modules/dashboard/`
**Features**:
- Admin/Staff dashboard: statistics overview, student/transaction charts, concession/course-wise fee charts, employee attendance summary, birthday list, schedule/calendar, timetable view, gallery view, form list
- Student/Guardian dashboard: student list (guardian children), transport route, mess schedule, institute info, timetable in feed, pinned announcements & events

**APIs**: `GET /dashboard/admin`, `GET /dashboard/student`, `GET /dashboard/guardian`, `GET /dashboard/stats`, `GET /dashboard/charts/students`, `GET /dashboard/charts/transactions`, `GET /dashboard/birthdays`, `GET /dashboard/schedule`

---

## Verification Plan

### Automated Tests
- `npm test` — Run the test suite (basic API tests for each module)
- `npx prisma db push` — Verify schema applies cleanly to NeonDB
- `npx prisma generate` — Verify Prisma client generation

### Manual Verification
- Start the dev server with `npm run dev` and test API endpoints via REST client/Postman
- Verify all database tables are created correctly in NeonDB
- Test auth flow (register → login → JWT → protected routes)
- Test role-based access control
- Test multi-team scoping
- Test core flows: Enquiry → Registration → Admission → Student

---

## Execution Strategy

Given the massive scope (49 modules, 500+ API endpoints, 230+ DB tables), the implementation will be executed in logical batches:

### Phase 1: Backend API & Logic (Current)
1. **Batch 1 — Foundation**: Project setup, Prisma schema, middleware, utilities, services
2. **Batch 2 — Auth & Users**: Authentication, User/Role management, Multi-team
3. **Batch 3 — Configuration**: Settings, options, custom fields, locales
4. **Batch 4 — Academic Core**: Academic module, Student management, Guardian management
5. **Batch 5 — HR & Finance**: Employee/HR, Fee & Finance, Payroll
6. **Batch 6 — Academic Operations**: Exam, Attendance, Timetable, Resource/Content
7. **Batch 7 — Facility Modules**: Transport, Library, Hostel, Inventory, Mess
8. **Batch 8 — Communication & Engagement**: Reception, Communication, Calendar, Notification, Chat, Social Wall
9. **Batch 9 — Support & Workflow**: Custom Forms, Approval, Task, Helpdesk, Service Request, Discipline
10. **Batch 10 — Content & Public**: Blog, News, Gallery, Recruitment, Activity, Certificate, Website/CMS
11. **Batch 11 — Utilities & Integration**: Payment gateways, Reports, Import/Export, Utility, Dashboard, Integration

### Phase 1.5: Comprehensive RBAC & Auto-Provisioning
> [!IMPORTANT]
> Based on the `user_roles_and_flows.md` specification, we will implement auto-provisioning and strict Role-Based Access Control (RBAC) across the system.

1. **Auto-Provisioning**:
    - **Student Service (`src/modules/student/student.service.js`)**: Automatically create a `User` account (`scope: 'STUDENT'`) and a `UserTeam` link when a Student is admitted/created.
    - **Employee Service (`src/modules/employee/employee.service.js`)**: Automatically create a `User` account (`scope: 'EMPLOYEE'`) and a `UserTeam` link when an Employee is created. If they are marked as a Teacher, grant academic permission sets.
    - **Guardian Service (`src/modules/guardian/guardian.service.js`)**: Automatically create a `User` account (`scope: 'GUARDIAN'`) and a `UserTeam` link when a Guardian is registered.
    - *Note*: All auto-provisioned accounts will have `forcePasswordChange: true` and use a standard default password (e.g., DOB or `Welcome123!`).

2. **Frontend RBAC Enforcer**:
    - Enhance `frontend/src/routesConfig.js` to define `allowedScopes` and granular `requiredPermissions` for every one of the 49 modules.
    - Update `frontend/src/components/Layout.jsx` and the `AuthContext` to strictly filter navigation visibility and enforce route guarding based on the user's scope and assigned permissions.

3. **Backend Middleware Integration**:
    - Enhance backend controllers to explicitly check access scopes (Admin vs Staff vs Student vs Guardian). Students and Guardians will be restricted to querying only their own records, while Staff will be filtered based on assignments.

### Phase 2: Frontend Basic UI (React + Tailwind)
> [!IMPORTANT]
> Since we are pivoting to "make the whole UMS ready with basic UI to make it functional", we will adopt a Rapid Application Development strategy for the frontend.

1. **Frontend Foundation**: Initialize Vite + React + TailwindCSS in a `frontend/` directory.
2. **Routing & Auth**: Setup React Router, Login/Register pages, and JWT storage context.
3. **Core Dashboards**: Create Admin Dashboard and Student/Guardian Dashboard layouts with a sidebar.
4. **Generic CRUD Engine**: Build a data-driven generic list/form component to rapidly generate screens for all 230+ models. 
    - **Engine Architecture**:
      - `GenericList.jsx`: Automatically fetches data via Axios, renders a paginated Tailwind table, and includes search/filter capabilities.
      - `GenericForm.jsx`: Dynamically renders inputs (text, select, date, etc.) based on a passed JSON schema configuration, and handles POST/PUT requests.
      - `api.js`: An Axios instance configured with an interceptor to automatically attach the JWT token for authentication.
      - `routesConfig.js`: A central configuration file mapping the 49 modules and 200+ screens to the Generic Engine, meaning we can build dozens of screens with just a few lines of JSON!
5. **Custom Screens**: Build custom, complex screens for critical flows like `Fee Collection`, `Attendance Marking`, and `Exam Grading`.

### Phase 2.1: Design System & Theming
> [!IMPORTANT]
> The design system (`ums-design-system.md`) calls for a specific set of tokens, typography, and spacing. This phase will refactor the frontend structural files to adopt the new theme completely.

1. **Typography Setup**: Inject Google Fonts (Lexend, Inter) into `frontend/index.html`.
2. **CSS Variables & Tailwind Config**: 
    - Map the brand colors (`ink`, `brand`, `accent`, `surface`, `bg`) in `frontend/src/index.css` as CSS variables.
    - Update `frontend/tailwind.config.js` to expose these variables as Tailwind utilities (e.g., `bg-brand-600`, `text-ink-900`, `font-display`).
3. **Core Structural Refactor**: Use a script to sweep through `Layout.jsx`, `GenericList.jsx`, `GenericForm.jsx`, `Dashboard.jsx`, and `Login.jsx` to swap generic Tailwind colors (e.g. `bg-secondary-900`, `text-slate-500`) with the strict token names (`bg-ink-900`, `text-text-secondary`).
4. **Elevation & Spacing**: Adjust padding and shadows across `GenericList` and `GenericForm` to match the `radius-sm/md` and flat shadow rules defined in the design guide.
