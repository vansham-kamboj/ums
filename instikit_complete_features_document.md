# School, College, Institute & Academy Management System Documentation

> **Tech Stack**: react + Tailwind CSS 
> **Database**: Postgresql

---

## 📑 Table of Contents

1. [System Flow Overview](#system-flow-overview)
2. [Technology Stack & Architecture](#1-technology-stack--architecture)
3. [Authentication & Security](#2-authentication--security)
4. [Dashboard](#3-dashboard)
5. [Academic Module](#4-academic-module)
6. [Student Management](#5-student-management)
7. [Guardian Management](#6-guardian-management)
8. [Employee / HR Management](#7-employee--hr-management)
9. [Fee & Finance Management](#8-fee--finance-management)
10. [Examination Module](#9-examination-module)
11. [Attendance Module](#10-attendance-module)
12. [Timetable Module](#11-timetable-module)
13. [Transport Module](#12-transport-module)
14. [Library Module](#13-library-module)
15. [Hostel / Room Management](#14-hostel--room-management)
16. [Inventory / Stock Management](#15-inventory--stock-management)
17. [Mess / Cafeteria Module](#16-mess--cafeteria-module)
18. [Reception / Front Office](#17-reception--front-office)
19. [Communication Module](#18-communication-module)
20. [Calendar & Events](#19-calendar--events)
21. [Resource / Academic Content](#20-resource--academic-content)
22. [Online Exam Module](#21-online-exam-module)
23. [Recruitment Module](#22-recruitment-module)
24. [Discipline Module](#23-discipline-module)
25. [Activity / Trip Module](#24-activity--trip-module)
26. [Blog Module](#25-blog-module)
27. [News Module](#26-news-module)
28. [Gallery Module](#27-gallery-module)
29. [Custom Forms Module](#28-custom-forms-module)
30. [Approval Workflow Module](#29-approval-workflow-module)
31. [Task Management Module](#30-task-management-module)
32. [Helpdesk Module (Tickets & FAQ)](#31-helpdesk-module-tickets--faq)
33. [Post / Social Wall Module](#32-post--social-wall-module)
34. [Chat Module (Real-time)](#33-chat-module-real-time)
35. [Reminder & Notification Module](#34-reminder--notification-module)
36. [Service Request & Dialogue Module](#35-service-request--dialogue-module)
37. [Certificate & ID Card Module](#36-certificate--id-card-module)
38. [Reports Module](#37-reports-module)
39. [Payment Gateway Integrations](#38-payment-gateway-integrations)
40. [Website / CMS Module](#39-website--cms-module)
41. [Configuration & Settings](#40-configuration--settings)
42. [User & Role Management](#41-user--role-management)
43. [Multi-Team / Multi-Institute](#42-multi-team--multi-institute)
44. [Utility Module](#43-utility-module)
45. [Import / Export Module](#44-import--export-module)
46. [Integration Module](#45-integration-module)
47. [Guest / Public-Facing Features](#46-guest--public-facing-features)
48. [Print & PDF Module](#47-print--pdf-module)
49. [Mobile App Support](#48-mobile-app-support)
50. [Configurable Option Types](#49-configurable-option-types)

---

## System Flow Overview

### Core Academic Flow
- **Setup** -> Configure academic sessions, departments, programs, courses, batches, subjects, class timings, fee structures, roles, permissions, and system options.
- **Enquiry** -> Capture enquiries from public forms or reception, assign them to staff, track follow-ups, and move qualified enquiries into registration.
- **Registration** -> Collect applicant details, guardian details, documents, registration fees, verification status, and approval decisions.
- **Admission** -> Convert approved registrations into admitted students, assign course/batch/subjects, allocate fees, upload documents, and create login access.
- **Daily Operations** -> Manage attendance, timetable, homework, lesson plans, learning material, communication, transport, hostel, library, mess, activities, and discipline.
- **Assessment** -> Configure exams, schedules, grades, assessments, competencies, marks entry, result publication, marksheets, and exam reports.
- **Finance** -> Allocate fees, collect payments, apply concessions, process refunds, record transactions, close daily collections, and generate finance reports.
- **Progression** -> Track enrollment status, transfers, certificates, alumni records, and historical student data.

### User Access Flow
- **Administrator** -> Configures the system, manages users/roles, monitors dashboards, controls approvals, and reviews reports.
- **Staff / Employee** -> Handles assigned academic, HR, finance, reception, communication, support, or operational tasks based on permissions.
- **Teacher** -> Manages subjects, timetable, attendance, lesson plans, learning material, exams, marks, diary entries, and student communication.
- **Student** -> Views profile, timetable, attendance, fees, assignments, learning material, exams, results, announcements, requests, and messages.
- **Guardian** -> Views linked students, fee payments, attendance, transport, mess schedule, announcements, documents, and communication.
- **Guest / Public User** -> Submits enquiries, registrations, job applications, forms, online payments, contact messages, and public page interactions.

### Page & Module Flow
- **Authentication Pages** -> Login, OTP login, 2FA, registration, password reset, screen lock, and email verification.
- **Dashboard Pages** -> Role-based summaries for students, employees, attendance, fees, charts, birthdays, schedules, galleries, and forms.
- **Master Setup Pages** -> Academic setup, finance setup, HR setup, transport setup, library setup, inventory setup, options, templates, and integrations.
- **Transaction Pages** -> Admissions, fee payments, refunds, attendance marking, exam marks, stock movement, transport records, library issue/return, tickets, approvals, and requests.
- **Communication Pages** -> Announcements, email/SMS/WhatsApp templates, notifications, chat, social wall posts, reminders, service dialogues, and helpdesk messages.
- **Report Pages** -> Student, employee, attendance, exam, finance, transport, library, inventory, payroll, activity, and audit reports.
- **Public Pages** -> Enquiry, registration, career application, payment, certificate verification, book list, CMS pages, blog, news, events, gallery, and contact forms.

---

## 1. Technology Stack & Architecture

### Backend
| Component | Technology |
|---|---|
| Framework | **Laravel 12** (PHP 8.2+) |
| API Authentication | **Laravel Sanctum** (token-based) |
| Real-time | **Pusher** (WebSocket for chat & notifications) |
| Queue Management | **Laravel Horizon** (Redis-based job queue) |
| Permission System | **Spatie Laravel Permission** (roles & granular permissions) |
| Activity Logging | **Spatie Activity Log** |
| Backup | **Spatie Laravel Backup** |
| Excel Import/Export | **Maatwebsite/Excel** |
| PDF Generation | **mPDF** + **Spatie Browsershot** |
| Image Processing | **Intervention/Image** |
| QR Code | **chillerlan/php-qrcode** |
| Barcode | **milon/barcode** |
| Markdown | **League/CommonMark** |
| SMS | **Twilio SDK** |
| Social Login | **Laravel Socialite** (+ Microsoft provider) |

### Frontend
| Component | Technology |
|---|---|
| JavaScript Framework | **Vue.js** (latest) |
| SPA Routing | **Inertia.js** |
| CSS Framework | **Tailwind CSS 4** |
| Server Components | **Livewire 3** |
| Page Routing | **Laravel Folio** |

### Storage
| Component | Technology |
|---|---|
| File Storage | Local, **AWS S3**, **Wasabi** |
| Database | SQLite (default) / MySQL |
| Cache/Queue | **Redis** via Predis |

### DevOps
| Component | Technology |
|---|---|
| Containerization | **Docker** + docker-compose |
| Testing | **PestPHP 3** |
| Code Style | **Laravel Pint** |
| Log Viewer | **opcodesio/log-viewer** |

---

## 2. Authentication & Security

### Login & Authentication
- **Email + Password login** with throttle protection
- **Login with OTP** — Email & SMS OTP-based login
- **Two-Factor Authentication (2FA)** — Additional security layer
- **Social Login** — Microsoft account integration via Socialite
- **Screen Lock/Unlock** — Lock session without logging out
- **Password Reset** — Request, confirm & reset password flow
- **Force Change Password** — Admin can force users to change password on next login
- **User Registration** — Email verification during registration

### Security Features
- **Failed Login Attempt Tracking** — Log and monitor failed login attempts
- **IP Blacklist/Whitelist Filter** — Restrict access by IP addresses
- **CSRF Protection** — Cross-site request forgery prevention
- **Rate Limiting** — Throttle on auth, OTP, and sensitive routes
- **Test Mode Restriction** — Middleware to restrict demo/test environment actions
- **User Impersonation** — Admin can log in as any user for troubleshooting
- **User Access Log** — Track student/parent login activity
- **Under Maintenance Mode** — Put the system under maintenance

---

## 3. Dashboard

### Admin/Staff Dashboard
- **Statistics Overview** — Total students, employees, fee collection summary
- **Student Chart Data** — Graphical representation of student enrollment
- **Transaction Chart Data** — Financial transaction charts
- **Concession & Course-wise Fee Charts** — Visual fee breakdown
- **Employee Attendance Summary** — Overview of employee attendance
- **Birthday List** — Today's birthdays of students & employees (celebration)
- **Schedule & Calendar** — Upcoming events, holidays, todos
- **Timetable View** — Current day timetable
- **Gallery View** — Recent photo galleries
- **Form List** — Custom forms available for submission

### Student/Guardian Dashboard
- **Student List** — Guardian can see their children
- **Transport Route** — View assigned transport route & details
- **Mess Schedule** — View mess/cafeteria schedule
- **Institute Info** — View institute details & contact
- **Timetable in Feed** — Student & employee timetable on dashboard
- **Pinned Announcements & Events** — Important announcements pinned to feed

---

## 4. Academic Module

### Academic Session Management
- **Sessions** — Create and manage academic sessions/years
- **Archive/Unarchive Periods** — Archive old periods, restore when needed

### Program & Course Structure
- **Program Types** — Define program types (e.g., Undergraduate, Postgraduate)
- **Academic Departments** — Manage academic departments
- **Programs** — Create programs (e.g., Science, Arts, Commerce)
- **Divisions** — Create divisions under programs
- **Courses** — Define courses (e.g., Class 1, Class 2, B.Tech CSE)
- **Batches** — Create batches/sections within courses (e.g., Section A, B)
- **Import Course & Batch** — Bulk import courses and batches

### Subjects
- **Subject Management** — Create, edit, delete subjects
- **Subject Types** — Categorize subjects (Core, Elective, etc.)
- **Subject Records** — Link subjects to batches
- **Batch Subject Records** — Batch-wise subject mapping
- **Subject Incharge** — Assign teacher with multiple batch support
- **Subject-wise Student Mapping** — Assign students to elective subjects

### Certificates & ID Cards
- **Certificate Templates** — Design certificate templates with custom layouts
- **Certificate Generation** — Generate certificates for students/employees
- **Custom Certificate Numbering** — Custom numbering format for certificates
- **ID Card Templates** — Design ID card templates
- **ID Cards for Students** — Generate student ID cards
- **ID Cards for Parents/Guardians** — Generate parent/guardian ID cards

### Book Lists
- **Book List Management** — Course-wise book list management
- **Public Book List Page** — Accessible by students/guardians

### Class Timing
- **Class Timing Sessions** — Define class timing sessions (e.g., Morning, Afternoon)
- **Multiple Session Allotment** — Support for multiple sessions in timetable

### Enrollment Seats
- **Seat-wise Admission Enrollment** — Define available seats per course/batch

---

## 5. Student Management

### Student Lifecycle
- **Enquiry** → **Registration** → **Admission** → **Active Student** → **Transfer/Alumni**

### Enquiry
- **Online Enquiry Module** — Public-facing enquiry form
- **Detailed Enquiry Form Wizard** — Multi-step enquiry form
- **Enquiry Records** — Track enquiry details with follow-ups
- **Enquiry Follow-ups** — Schedule and track follow-up actions
- **Enquiry Stages** — Define custom enquiry stages
- **Enquiry Types & Sources** — Categorize enquiries
- **Convert Enquiry to Registration** — One-click conversion
- **Enquiry Bulk Actions** — Bulk operations on enquiries
- **Printable Enquiry Form** — Print enquiry details
- **Assign Enquiry to Employee** — Route enquiries to staff
- **Import Enquiry** — Bulk import enquiries
- **Enquiry Notifications** — Automated notifications

### Registration
- **Online Registration** — Public-facing registration form
- **Detailed Registration Form Wizard** — Multi-step registration form
- **Registration Stages** — Define custom registration stages
- **Registration Verification** — Verify registration details
- **Registration Fee Online Payment** — Pay registration fee online
- **Partial Registration Fee Payment** — Pay in parts with due dates
- **Convert Registration to Admission** — One-click conversion
- **Registration Bulk Actions** — Bulk operations on registrations
- **Printable Registration Form** — Print registration details
- **Registration Notifications** — Automated notifications
- **Guardian Import** — Import guardian details along with registration

### Admission
- **Student Admission** — Complete admission process
- **Provisional Admission** — Mark admission as provisional
- **Printable Admission Form** — Print admission details
- **Admission Types** — Regular, Lateral Entry, etc.
- **Editable Course & Batch** — Update course/batch in student record

### Student Profile
- **Personal Details** — Name, DOB, gender, blood group, religion, caste, category, etc.
- **Contact Information** — Address, phone, email
- **Photo Upload** — Upload student photo
- **Health Records** — Maintain student health records
- **Custom Fields** — Custom field support for additional data
- **Tags & Groups** — Tag students, create groups
- **Documents** — Upload and manage student documents (dedicated module)
- **Account Details** — Bank account information (dedicated module)
- **Qualifications** — Previous qualifications (dedicated module)
- **Emergency Contact** — Emergency contact details

### Student Operations
- **Student Fee Allocation** — Allocate fees to students
- **Student Fee Payment** — Process fee payments
- **Student Fee Payment List** — View all payments
- **Student Attendance** — View attendance in profile
- **Student Subjects** — View assigned subjects in profile
- **Student Exam Records** — View exam results in profile
- **Student Enrollment Status Log** — Track enrollment changes
- **Student Clock In/Out** — Timesheet tracking for students
- **Student Leave Request** — Apply for leaves
- **Student Diary** — Student-wise diary publishing
- **Student Learning Material** — Student-wise material publishing
- **Transfer Request** — Initiate transfer requests
- **Transfer Certificate** — Generate & verify transfer certificates
- **Contact Edit Request** — Student/guardian can request profile edit
- **Service Request** — Students can raise service requests
- **Dialogue with Institute** — Student & institute communication
- **Mentor Assignment** — Assign mentor to students
- **Bulk Update** — Bulk update student details

### Student Search & Navigation
- **Keyboard Navigation** — Quick search with keyboard shortcuts
- **Global Search** — Search across all student records
- **Export to Excel** — Export student lists

### Alumni
- **Alumni Module** — Manage alumni records
- **Events for Alumni** — Special events for alumni

---

## 6. Guardian Management

- **Guardian Profiles** — Manage guardian/parent details
- **Multiple Guardians per Student** — Support for mother, father, local guardian
- **Primary Guardian Designation** — Mark primary guardian
- **Sibling Record** — View sibling details in fee payment
- **Guardian Import** — Bulk import guardians
- **Guardian User Account** — Separate login for guardians
- **ID Cards for Guardians** — Generate guardian ID cards
- **Sync Guardian** — Sync guardian records across siblings

---

## 7. Employee / HR Management

### Employee Records
- **Department Management** — Create and manage departments
- **Designation Management** — Create and manage designations
- **Employee Records** — Comprehensive employee profiles
- **Employee Tags & Groups** — Tag and group employees
- **Documents** — Upload employee documents (dedicated module)
- **Account Details** — Bank account information (dedicated module)
- **Qualifications** — Employee qualifications (dedicated module)
- **Experience** — Work experience records (dedicated module)
- **Custom Fields** — Custom field support
- **Employee Welcome Email** — Automatic email on account creation
- **Department-level Access** — Restrict access by department
- **Program-level Access** — Restrict access by program
- **Bulk Update** — Bulk update employee details
- **Export to Excel** — Export employee lists

### Employee Attendance
- **Attendance Types** — Define custom attendance types (Present, Absent, Half Day, etc.)
- **Daily Attendance** — Mark daily attendance
- **Attendance Records** — Track attendance history
- **Provision for Half Day Leave** — Support half-day leave marking
- **Biometric Integration** — (Addon) Integrate biometric devices

### Work Shifts & Timesheets
- **Work Shifts** — Define work shifts (e.g., Morning, Evening)
- **Employee Work Shift Assignment** — Assign shifts to employees
- **Timesheets** — Track employee work hours

### Leave Management
- **Leave Types** — Define custom leave types (CL, EL, SL, etc.)
- **Leave Allocations** — Allocate leave quota per employee
- **Leave Allocation Records** — Track leave balance
- **Leave Requests** — Employees apply for leave
- **Leave Request Records** — Track request history
- **Leave Request Approval** — Multi-level leave approval

### Payroll Management
- **Pay Heads** — Define earning & deduction heads
- **Support for PayHead as Total** — Use total-type pay heads
- **Salary Templates** — Create salary templates
- **Salary Template Records** — Map pay heads to templates
- **Salary Structures** — Assign salary structures to employees
- **Salary Structure Records** — Individual salary components
- **Conditional Formula** — Conditional formulas in payroll calculations
- **Payroll Processing** — Generate monthly payroll
- **Payroll Records** — Track payroll history
- **Bulk Payroll Process** — Process payroll for multiple employees at once
- **Salary Sheet Print** — Print salary sheets
- **Payment Advice Print** — Print payment advice slips
- **Salary Template Recalculation** — Recalculate salary templates

### Employee Ticket System
- **Employee Tickets** — Employees can raise internal tickets
- **Ticket Assignment** — Assign tickets to resolvers
- **Ticket Messages** — Threaded ticket conversation

---

## 8. Fee & Finance Management

### Fee Structure Setup
- **Fee Groups** — Group fee heads (e.g., Tuition, Lab, etc.)
- **Fee Heads** — Individual fee components
- **Fee Components** — Detailed fee component breakdown
- **Fee Structure** — Define fee structures per course/batch
- **Fee Structure Components** — Map components to structures
- **Fee Installments** — Define installment schedules
- **Fee Installment Records** — Map fee heads to installments
- **Gender-wise Fee Structure** — Different fees based on gender
- **Tax Management** — Define taxes on fee heads
- **Tax Types** — Inclusive/exclusive tax support

### Fee Concessions
- **Fee Concessions** — Create concession types
- **Fee Concession Records** — Map concessions to fee heads
- **Fee Concession Types** — Categorize concessions
- **Custom Fee Concession** — Custom concession management
- **Round Off Fee Concession** — Round off concession amounts
- **Secondary Fee Concession** — Additional concession layer
- **Installment-wise Fee Concession Restriction** — Control concessions per installment
- **Sibling Concession Check** — Verify sibling-based concessions
- **Fee Concession Summary Report** — Report on concessions given
- **Fee Concession Amount Log** — Log concession amounts in payments

### Student Fee
- **Fee Allocation** — Allocate fees to students
- **Student Fee Records** — Track individual student fee
- **Fee Payments** — Process fee payments
- **Head-wise Fee Payment** — Pay specific fee heads
- **Multi Installment Fee Payment** — Pay multiple installments at once
- **Flexible Fee Installment Payment** — Flexible payment amounts
- **Fee Refunds** — Process fee refunds
- **Fee Refund Records** — Track refund details
- **Custom Fee Import** — Import custom fees
- **Missing Student Fee Detection** — Detect students without fees
- **Fee Payment Mismatch Detection** — Detect calculation mismatches

### Financial Transactions
- **Ledger Types** — Income, Expense, Asset, Liability
- **Ledgers** — Create financial ledgers
- **Payment Methods** — Cash, Cheque, DD, Online, Bank Transfer, etc.
- **Transactions** — Record income/expense transactions
- **Transaction Records** — Line items for each transaction
- **Transaction Payments** — Payment details for transactions
- **Transaction Categories** — Categorize transactions
- **Transaction Import** — Import transactions from file
- **Cheque/DD Clearing Date** — Manage clearing dates
- **Print Vouchers** — Print transaction vouchers
- **Voucher Number Placeholder** — Ledger & payment method in voucher numbers
- **Transaction User Transfer** — Transfer transaction ownership

### Bank Transfer & Payments
- **Bank Transfer Payment** — Record bank transfers
- **Bank Transfer Approval** — Approve bank transfer payments
- **Bank Transfer Status** — Track transfer statuses

### Day Closure
- **Day Closure for Cashier/Accountant** — Close daily cash records
- **User-wise Collection** — Track collections per user

### Financial Reports
- **Day Book** — Daily financial summary
- **Day Book with User-wise Collection** — Day book per cashier
- **Fee Summary Report** — Overall fee collection summary
- **Head-wise Fee Summary** — Fee summary by fee head
- **Fee Summary with Status Filter** — Filter by paid/unpaid status
- **Payment Gateway Account-wise Report** — Track online payments by gateway
- **Guest Payment Fee Receipt** — Receipts for guest payments
- **Export Detailed Fee Payment Report** — Excel export of fee details
- **Transport Reports** — Transport-related financial reports

---

## 9. Examination Module

### Exam Setup
- **Exam Terms** — Define exam terms (e.g., Mid-Term, Final)
- **Exam Term Reorder** — Reorder exam terms
- **Exams** — Create exams within terms
- **Exam Reorder** — Reorder exams
- **Exam Grades** — Define grading system (A+, A, B, etc.)
- **Exam Assessments** — Define assessment criteria
- **Exam Assessment Attempt** — Support for multiple attempts
- **Exam Observations** — Add observation parameters
- **Exam Weightage Record** — Record exam weightage

### Exam Scheduling
- **Exam Schedules** — Schedule exams with date, time, subject, room
- **Improved Exam Schedule Layout** — Enhanced schedule display

### Marks & Results
- **Exam Records** — Enter marks per student
- **Exam Results** — Generate and publish results
- **Exam Forms** — Students fill exam forms
- **Auto-lock Exam Marks** — Automatically lock marks after deadline
- **Improved Locking of Exam Marks** — Enhanced lock mechanism
- **Marksheet Improvements** — Enhanced marksheet design

### Competency-based Evaluation
- **Exam Competencies** — Define competency criteria
- **Exam Competency Records** — Record student competencies
- **Competency in Exam Schedules** — Link competencies to exam schedules

### Exam Reports
- **Subject-wise Student Report** — Report by subject
- **Exam Mark Report** — Export exam marks

---

## 10. Attendance Module

### Student Attendance
- **Daily Attendance** — Mark daily student attendance
- **Subject-wise Attendance** — Elective subject-wise attendance
- **Custom Attendance Types** — Define custom types (Present, Absent, Late, etc.)
- **Attendance Session** — Morning/Afternoon session tracking
- **QR Code-based Attendance** — Scan QR for attendance
- **Student Clock In/Out** — Clock in/out timesheet
- **Attendance Migration** — Migrate attendance on course/batch change
- **Student Attendance Report** — Detailed attendance reports
- **Subject-wise Attendance Report** — Report by subject

### Employee Attendance
- **Daily Attendance** — Mark employee attendance
- **Attendance Types** — Present, Absent, Half Day, Leave
- **Attendance Records** — Historical records
- **Attendance Assistant Role** — Dedicated role for attendance marking
- **Biometric Integration** — (Addon) Connect biometric devices
- **Employee Attendance Summary** — Dashboard summary

---

## 11. Timetable Module

- **Class Timings** — Define class timing slots
- **Class Timing Sessions** — Multiple sessions per day
- **Timetable Management** — Create and manage timetables
- **Timetable Records** — Day-wise timetable entries
- **Timetable Allocations** — Assign teachers, subjects, rooms
- **Multiple Session Allotment** — Support multiple sessions
- **Print Batch-wise Timetable** — Print timetable by batch
- **Teacher Timetable** — View timetable for teachers
- **Student & Employee Timetable in Dashboard** — Timetable on feed
- **Division, Course, Batch-wise Period Update** — Bulk period updates

---

## 12. Transport Module

### Route & Stoppage Management
- **Transport Circles** — Define transport zones/circles
- **Transport Stoppages** — Create bus stops
- **Transport Routes** — Define routes with stoppages
- **Transport Route Records** — Route details
- **Transport Route Stoppages** — Map stoppages to routes with order
- **Import Stoppage between Periods** — Bulk import stoppages

### Passengers
- **Transport Route Passengers** — Assign students to routes
- **Transport Fees** — Define transport fee structures
- **Transport Fee Records** — Individual transport fee records

### Vehicle Management
- **Vehicles** — Register vehicles with details
- **Vehicle Types** — Categorize vehicles
- **Vehicle Documents** — Track vehicle documents & expiry
- **Vehicle Incharge** — Assign vehicle incharge

### Vehicle Records
- **Fuel Records** — Track fuel consumption & cost
- **Service Records** — Track vehicle service history
- **Trip Records** — Record vehicle trips
- **Case Records** — Record vehicle incidents/cases
- **Expense Records** — Track vehicle expenses

### Transport Reports
- **Transport Reports** — Comprehensive transport analytics

---

## 13. Library Module

### Book Management
- **Books** — Add and manage books with full details
- **Book Authors** — Manage author list
- **Book Publishers** — Manage publisher list
- **Book Languages** — Define book languages
- **Book Topics** — Categorize by topics
- **Book Categories** — Broad categories
- **Book Conditions** — Track book condition
- **Book Additions** — Record book additions/purchases
- **Book Copies** — Track individual copies with barcodes

### Book Transactions
- **Book Issue** — Issue books to students/employees
- **Book Return** — Record book returns
- **Transaction Records** — Detailed issue/return records
- **Overdue Tracking** — Track overdue books

### Library Reports
- **Library Reports** — Book usage, overdue, and inventory reports

---

## 14. Hostel / Room Management

- **Blocks** — Define hostel blocks/buildings
- **Floors** — Create floors within blocks
- **Rooms** — Define rooms with capacity & details
- **Room Allocations** — Allocate students to rooms
- **Room Availability** — Track room occupancy

---

## 15. Inventory / Stock Management

### Stock Setup
- **Inventories** — Define inventory locations
- **Stock Categories** — Categorize stock items
- **Stock Items** — Create stock items with details
- **Stock Item Types** — Define item types
- **Stock Item Copies** — Track individual item copies
- **Stock Item Copy Records** — Historical tracking
- **Stock Item Records** — Item-level records
- **Stock Category & Item Import** — Bulk import
- **Set Stock Item Quantity During Creation** — Initial quantity setup
- **Units** — Define measurement units

### Stock Operations
- **Stock Purchases** — Record stock purchases
- **Stock Requisitions** — Raise stock requisitions
- **Stock Transfers** — Transfer stock between locations
- **Stock Adjustments** — Adjust stock quantities
- **Stock Returns** — Record stock returns
- **Stock Balances** — View current stock levels

### Inventory Vendor Management
- **Vendors** — Manage vendor/supplier details

---

## 16. Mess / Cafeteria Module

- **Menu Items** — Define food menu items
- **Meals** — Create meal plans (Breakfast, Lunch, Dinner)
- **Meal Logs** — Log daily meals served
- **Meal Log Records** — Detailed meal records
- **Mess Schedule on Dashboard** — View today's menu

---

## 17. Reception / Front Office

### Enquiry Management
- **Enquiry** — Manage enquiries with full details
- **Enquiry Records** — Track enquiry course interests
- **Enquiry Follow-ups** — Schedule follow-up actions
- **Enquiry Stages, Types, Sources** — Configurable options
- **Online Enquiry Module** — Public-facing enquiry form
- **Convert Enquiry to Registration** — Seamless conversion
- **Import Enquiry** — Bulk import
- **Assign Enquiry to Employee** — Route to staff
- **Access Based on Assignment** — View enquiries based on assignment

### Visitor Management
- **Visitor Logs** — Record visitor entries with details
- **Visiting Purpose** — Categorize visits

### Gate Pass
- **Gate Pass Management** — Issue gate passes
- **Gate Pass Purpose** — Categorize gate pass reasons

### Call Log
- **Call Logs** — Record incoming/outgoing calls
- **Calling Purpose** — Categorize calls

### Complaint Management
- **Complaints** — Record and track complaints
- **Complaint Types** — Categorize complaints
- **Complaint Logs** — Track complaint progress
- **Assign Complaint to Employees** — Route complaints
- **Complaint Notification** — Automated notifications
- **Access Based on Assignment** — View complaints based on assignment

### Online Query
- **Query Management** — Manage public queries

### Correspondence
- **Postal Correspondence** — Track postal dispatch & receipt

---

## 18. Communication Module

### Announcements
- **Announcements** — Create and publish announcements
- **Announcement Types** — Categorize announcements
- **Audience Management** — Target specific audiences (students, employees, parents)
- **Pin Announcement to Feed** — Pin important announcements

### Communication / Messaging
- **Communication Records** — Send bulk communications
- **Email Communication** — Send emails to users
- **SMS Communication** — Send SMS messages
- **WhatsApp Communication** — Send WhatsApp messages

### Templates
- **Mail Templates** — Customize email templates
- **SMS Templates** — Customize SMS templates
- **WhatsApp Templates** — Customize WhatsApp templates
- **Push Notification Templates** — Customize push notification templates
- **Template Status Management** — Enable/disable templates

---

## 19. Calendar & Events

- **Events** — Create and manage events with full details
- **Event Types** — Categorize events (Sports, Cultural, Academic, etc.)
- **Event Incharge** — Assign event manager
- **Events for Alumni** — Special alumni events
- **Holidays** — Define holidays & breaks
- **Pin Events to Feed** — Pin important events
- **Todo & Events in Calendar** — Combined calendar view

---

## 20. Resource / Academic Content

### Assignments
- **Assignment Creation** — Create assignments for students
- **Assignment Types** — Categorize assignments
- **Assignment Submission** — Students submit assignments
- **Assignment Evaluation** — Teachers evaluate submissions
- **Date-wise Report** — Report assignments by date

### Diary
- **Student Diary** — Daily diary entries
- **Student-wise Diary Publishing** — Publish diary per student
- **Date-wise Report** — Report diary by date

### Lesson Plans
- **Lesson Plan Creation** — Create detailed lesson plans

### Syllabus
- **Syllabus Management** — Define syllabus structure
- **Syllabus Units** — Break syllabus into units

### Learning Materials
- **Learning Material Upload** — Upload study materials
- **Student-wise Publishing** — Publish materials per student
- **Date-wise Report** — Report materials by date

### Online Classes
- **Online Class Scheduling** — Schedule virtual classes

### Downloads
- **Download Management** — Manage downloadable resources

---

## 21. Online Exam Module

- **Online Exams** — Create online tests
- **Online Exam Types** — Quiz, Test, etc.
- **Online Exam Questions** — Create questions (MCQ, etc.)
- **Question Types** — Multiple Choice, True/False, etc.
- **Online Exam Submissions** — Student submissions
- **Auto-grading** — Automatic score calculation

---

## 22. Recruitment Module

- **Job Vacancies** — Create job postings
- **Job Vacancy Records** — Track vacancy details
- **Job Applications** — Receive applications online
- **Public Job Listing** — Public-facing job portal
- **Application Management** — Review and manage applications

---

## 23. Discipline Module

- **Incidents** — Record disciplinary incidents
- **Incident Categories** — Categorize incidents
- **Incident Details** — Date, description, action taken
- **Student Linking** — Link incidents to students

---

## 24. Activity / Trip Module

- **Trips** — Plan and manage trips/excursions
- **Trip Participants** — Manage participant list
- **Trip Types** — Categorize trips (Field Trip, Educational Tour, etc.)
- **Activity Management** — Track activities

---

## 25. Blog Module

- **Blog Posts** — Create and publish blog articles
- **Blog Categories** — Categorize blog posts
- **Blog Tags** — Tag blog posts
- **Blog on Website** — Display blogs on public website
- **Category & Tag Filtering** — Filter blogs by category/tag
- **SEO-friendly URLs** — Slug-based blog URLs

---

## 26. News Module

- **News Articles** — Create and publish news
- **News Categories** — Categorize news
- **News Tags** — Tag news items
- **News on Website** — Display news on public website
- **News Summary in Website** — News summary blocks
- **Category & Tag Filtering** — Filter news by category/tag

---

## 27. Gallery Module

- **Gallery Management** — Create photo/video galleries
- **Gallery Images** — Upload multiple images per gallery
- **Gallery Types** — Photo/Video galleries
- **Watermark in Gallery Images** — Add watermark to images
- **Gallery on Website** — Display galleries on public website
- **Dashboard Gallery** — View galleries on dashboard

---

## 28. Custom Forms Module

- **Form Builder** — Create custom forms with fields
- **Form Fields** — Various field types (text, select, file, etc.)
- **Form Submissions** — Collect submissions
- **Form Submission Records** — Detailed submission data
- **Dashboard Form List** — View available forms on dashboard

---

## 29. Approval Workflow Module

- **Approval Types** — Define approval workflows
- **Approval Levels** — Multi-level approval chains
- **Approval Requests** — Submit requests for approval
- **Request Priority** — Set request priority
- **Request Groups** — Group requests
- **Request Nature** — Categorize request nature
- **Multi-level Approval** — Support for approval chains
- **Approval Print** — Print approval requests

---

## 30. Task Management Module

- **Task Creation** — Create and assign tasks
- **Task Members** — Assign multiple members
- **Task Checklists** — Create checklists within tasks
- **Task Categories** — Categorize tasks
- **Task Priorities** — Set priority levels
- **Task Lists** — Organize tasks into lists

---

## 31. Helpdesk Module (Tickets & FAQ)

### Tickets
- **Ticket Creation** — Create support tickets
- **Ticket Categories** — Categorize tickets
- **Ticket Priorities** — Set priority levels
- **Ticket Lists** — Organize tickets
- **Ticket Assignees** — Assign tickets to staff
- **Ticket Messages** — Threaded conversation
- **Ticket Status Management** — Open, In Progress, Resolved, Closed

### FAQ
- **FAQ Management** — Create and manage FAQs
- **FAQ Categories** — Categorize FAQs

---

## 32. Post / Social Wall Module

- **Facebook-like Wall** — Share updates on social wall
- **Post Creation** — Create posts with text & media
- **Post Feed** — Scrollable feed of updates
- **Comments** — Comment on posts
- **Audience Targeting** — Target specific user groups

---

## 33. Chat Module (Real-time)

- **Real-time Chat** — Instant messaging between users
- **Chat Conversations** — Create chat threads
- **Chat Participants** — Multi-user chat support
- **Chat Messages** — Send and receive messages
- **Read Receipts** — Mark messages as read
- **User Search** — Search users to start chat
- **Chat Enabled/Disabled** — Toggle chat feature
- **Pusher Integration** — Real-time via WebSocket

---

## 34. Reminder & Notification Module

### Reminders
- **Reminder Creation** — Set reminders for self or others
- **Reminder Users** — Assign reminders to specific users
- **Reminder Notifications** — Get notified at reminder time

### Notifications
- **In-app Notifications** — Bell icon notification center
- **Mark as Read** — Mark individual/all notifications as read
- **Mobile Push Notification** — Push notifications to mobile
- **App Notification** — In-app notification system
- **Email Notifications** — Automated email notifications
- **SMS Notifications** — Automated SMS notifications
- **WhatsApp Notifications** — Automated WhatsApp messages
- **Enquiry Notifications** — Notifications for new enquiries
- **Registration Notifications** — Notifications for registrations
- **Complaint Notifications** — Notifications for complaints

---

## 35. Service Request & Dialogue Module

### Service Requests
- **Service Allocations** — Define available services
- **Service Requests** — Students/guardians raise requests
- **Service Request Status** — Track request progress
- **Service Request Types** — Categorize requests

### Dialogue
- **Student & Employee Dialogue** — Two-way communication with institute
- **Dialogue Categories** — Student & employee dialogue categories

### Contact Edit Requests
- **Edit Request Submission** — Students/parents request profile changes
- **Edit Request Review** — Staff reviews and approves edits

---

## 36. Certificate & ID Card Module

- **Certificate Templates** — Design custom certificate templates
- **Certificate Generation** — Generate certificates for students/employees
- **Custom Certificate Numbering** — Custom number format
- **ID Card Templates** — Design custom ID card templates
- **ID Card Generation** — Generate ID cards
- **ID Cards for Parents/Guardians** — Generate parent ID cards
- **Transfer Certificate Verification** — Public verification of TCs

---

## 37. Reports Module

### Student Reports
- **Student Profile Report** — Comprehensive student report
- **Student Attendance Report** — Attendance statistics
- **Subject-wise Attendance Report** — By subject
- **Subject-wise Student Report** — Performance by subject
- **Sibling Report** — Export sibling information

### Exam Reports
- **Exam Mark Report** — Exam marks export

### Finance Reports
- **Finance Report Index** — All financial reports
- **Head-wise Fee Summary** — Fee summary by fee head
- **Day Book** — Daily financial summary
- **Fee Summary with Status Filter** — Filter paid/unpaid
- **Fee Concession Summary** — Concession analytics
- **Payment Gateway Report** — Online payment analytics
- **Transport Reports** — Transport fee reports

### Employee Reports
- **Employee Attendance Summary** — Attendance overview

---

## 38. Payment Gateway Integrations

| Gateway | Region | Features |
|---|---|---|
| **Razorpay** | India | Online fee payment |
| **Stripe** | Global | Card payments |
| **Paystack** | Africa | Online payments |
| **Billdesk** | India | Status check, response, cancel |
| **CCAvenue** | India | Status check, response, cancel |
| **Billplz** | Malaysia | Response, redirect |
| **Hubtel** | Ghana | Status check, callback |
| **Payzone** | — | Response, cancel |
| **Amwalpay** | — | Online payments |
| **Bank Transfer** | — | Manual bank transfer with approval |

### Payment Features
- **Guest Payment** — Pay fees without login
- **Anonymous Payment** — Pay with minimal details
- **Registration Fee Online Payment** — Pay registration fee online
- **Payment Link QR Code** — QR code for payment links
- **Payment Gateway Test Mode** — Test gateway integration
- **Multi-gateway Support** — Use multiple gateways simultaneously

---

## 39. Website / CMS Module

### Website Builder
- **Enable/Disable Website** — Toggle public website
- **Theme Support** — Default, Modern, Custom themes
- **Predefined Color Themes** — Quick theme selection
- **Custom Theme** — Fully customizable theme

### Pages & Content
- **Site Pages** — Create and manage web pages
- **Site Menus** — Define navigation menus
- **Site Blocks** — Add content blocks to pages
- **CTA Blocks** — Call-to-action sections
- **Blog Integration** — Display blog posts on website
- **News Integration** — Display news on website
- **Events on Website** — Show events on website
- **Announcements on Website** — Show announcements
- **Gallery on Website** — Display photo galleries
- **Event/Announcement/Gallery Summary** — Summary blocks on pages

### Public-facing Pages
- **Home Page** — Institute landing page
- **Dynamic Pages** — Slug-based pages
- **Blog Detail Page** — Individual blog post page
- **News Detail Page** — Individual news article page
- **Event Detail Page** — Individual event page
- **Announcement Detail Page** — Individual announcement page
- **Gallery Detail Page** — Individual gallery page

---

## 40. Configuration & Settings

### System Configuration
- **General Settings** — Institute name, logo, contact, timezone
- **Module Configuration** — Enable/disable specific modules
- **Module Pre-requisites** — Check module dependencies
- **Asset Upload/Remove** — Upload logo, favicon, etc.

### Communication Config
- **Mail Configuration** — SMTP/Mailgun setup + test
- **SMS Configuration** — SMS gateway setup + test
- **WhatsApp Configuration** — WhatsApp API setup + test
- **Pusher Configuration** — Real-time WebSocket setup + test
- **App Notification Configuration** — Push notification setup + test

### Locale & Language
- **Locale Management** — Add, edit languages
- **Locale Sync** — Sync translation files
- **Multi-language Support** — Full i18n support

### Custom Fields
- **Custom Field Forms** — Student, Employee, Registration
- **Custom Field Types** — Text, Number, Date, Select, etc.
- **Custom Field Management** — Create, edit, delete custom fields

### Options Configuration
- **70+ Configurable Option Types** — (See Section 49)
- **Option Import** — Import options
- **Option Reorder** — Reorder option items
- **Option Export** — Export options

---

## 41. User & Role Management

### Users
- **User Management** — Create, edit, deactivate users
- **User Scopes** — Admin, Student, Guardian, Employee
- **User Status** — Active, Inactive, Banned
- **User Search** — Quick user search
- **User Pre-requisites** — Check user setup
- **User Export** — Export user list
- **User Impersonation** — Login as another user
- **User Scope Update** — Change user scope
- **Force Change Password** — Admin-triggered password reset

### Roles & Permissions
- **Role Management** — Create custom roles
- **Granular Permissions** — Module-level, action-level permissions
- **Role-wise Permission Assignment** — Bulk permission assignment
- **User-wise Permission Assignment** — Override role permissions
- **Permission Search** — Search available permissions
- **Import Role & Permission** — Import between installations
- **Export Roles & Permissions** — Export for backup/transfer

### Access Control
- **IP Blacklist/Whitelist** — Restrict access by IP
- **Menu Show/Hide** — Control menu visibility
- **Menu Reorder** — Reorder navigation menu
- **Department-level Employee Access** — Restrict by department
- **Program-level Employee Access** — Restrict by program

---

## 42. Multi-Team / Multi-Institute

- **Organization Management** — Create organizations
- **Team/Institute Management** — Multiple institutes under one organization
- **Team Configuration** — Per-team settings
- **Team Switching** — Switch between teams
- **Team Export** — Export team data

---

## 43. Utility Module

### Todo
- **Todo Lists** — Create todo lists
- **Todo Items** — Manage tasks within lists
- **Todo Status** — Toggle completion status
- **Todo Archive/Unarchive** — Archive completed todos
- **Todo Reorder** — Drag-and-drop reorder
- **Todo List Move** — Move items between lists
- **Todo Export** — Export todos

### Backup
- **Manual Backup** — Create manual backups
- **Backup Management** — View, download, delete backups
- **Backup Export** — Export backup list

### Activity Log
- **Activity Logging** — Track all system activities
- **Activity Log Viewer** — View logs with filters
- **Activity Log Export** — Export logs

### Log Viewer
- **Server Log Viewer** — View Laravel log files (opcodesio/log-viewer)

---

## 44. Import / Export Module

### Imports
- **Student Import** — Bulk import students
- **Employee Import** — Bulk import employees
- **Guardian Import** — Bulk import guardians
- **Enquiry Import** — Bulk import enquiries
- **Course & Batch Import** — Bulk import academic structure
- **Transaction Import** — Bulk import transactions
- **Custom Fee Import** — Bulk import custom fees
- **Stock Category & Item Import** — Bulk import inventory
- **Stoppage Import** — Bulk import transport stoppages
- **Option Import** — Bulk import configurable options
- **Bulk Upload Action** — General bulk upload handler
- **Delete Imported Students** — Remove imported students at once

### Exports
- **Student List Export** — Excel export
- **Employee List Export** — Excel export
- **Fee Payment Report Export** — Detailed Excel export
- **Todo Export** — Excel export
- **Activity Log Export** — Excel export
- **Backup Export** — Excel export
- **User Export** — Excel export
- **Team Export** — Excel export
- **Role Export** — Excel export
- **Option Export** — Excel export
- **Custom Field Export** — Excel export
- **Roles & Permissions Export** — Complete R&P export

---

## 45. Integration Module

- **Biometric Integration** — (Addon) Connect biometric attendance devices
- **WhatsApp Integration** — WhatsApp Business API for messaging
- **SMS Gateway Integration** — Twilio and custom SMS gateways
- **Pusher Integration** — Real-time WebSocket for chat & notifications
- **Social Login** — Microsoft account login
- **Mailgun** — Transactional email via Mailgun
- **AWS S3 / Wasabi** — Cloud storage support
- **Math Equation Support** — LaTeX equations in markdown editor

---

## 46. Guest / Public-Facing Features

- **Guest Payment Portal** — Pay fees without login
- **Anonymous Payment** — Pay with student details only
- **Online Enquiry Form** — Public enquiry submission
- **Online Registration Portal** — Multi-step public registration
- **Registration Fee Payment** — Online registration fee collection
- **Job Vacancy Listing** — Public job board
- **Job Application** — Apply for jobs online
- **Transfer Certificate Verification** — Public TC verification
- **Website Pages** — Public CMS pages
- **Blog Pages** — Public blog
- **News Pages** — Public news
- **Book List Page** — Public book lists

---

## 47. Print & PDF Module

### Student Prints
- **Student Profile** — Printable student profile
- **Student Fee Receipt** — Fee receipt print
- **Student List** — Printable student list
- **Admission Form** — Printable admission form
- **Enquiry Form** — Printable enquiry form
- **Registration Form** — Printable registration form

### Academic Prints
- **Batch-wise Timetable** — Print timetable by batch
- **Certificate Print** — Print certificates
- **ID Card Print** — Print ID cards

### Exam Prints
- **Marksheet Print** — Print exam marksheets
- **Exam Schedule Print** — Print exam schedule

### Finance Prints
- **Fee Receipt** — Print fee receipts
- **Transaction Voucher** — Print transaction vouchers
- **Salary Sheet** — Print salary sheets
- **Payment Advice** — Print payment advice

### Employee Prints
- **Employee Profile** — Printable employee profile

### Other Prints
- **Approval Request Print** — Print approval requests
- **Visitor Log** — Print visitor details
- **Gate Pass** — Print gate passes
- **Library Prints** — Print library reports
- **Inventory Prints** — Print inventory reports
- **Transport Prints** — Print transport reports
- **Reception Prints** — Print reception reports

---

## 48. Mobile App Support

- **Mobile Application Support** — Dedicated mobile app integration
- **Mobile Push Notifications** — Firebase-based push notifications
- **Device Management** — Register and manage user devices
- **App Notification System** — In-app notifications

---

## 49. Configurable Option Types

The system includes **70+ configurable option types** that allow granular customization. Each can be managed through the admin panel:

| # | Option Type | Module |
|---|---|---|
| 1 | Todo List | Utility |
| 2 | Member Caste | Contact |
| 3 | Member Category | Contact |
| 4 | Religion | Contact |
| 5 | Document Type | Contact |
| 6 | Qualification Level | Contact |
| 7 | Registration Stage | Student |
| 8 | Student Attendance Type | Student |
| 9 | Student Enrollment Type | Student |
| 10 | Student Enrollment Status | Student |
| 11 | Student Dialogue Category | Student |
| 12 | Student Document Type | Student |
| 13 | Student Transfer Reason | Student |
| 14 | Student Leave Category | Student |
| 15 | Student Group | Student |
| 16 | Employee Dialogue Category | Employee |
| 17 | Employee Document Type | Employee |
| 18 | Employment Status | Employee |
| 19 | Employment Type | Employee |
| 20 | Employee Group | Employee |
| 21 | Bank Name | Finance |
| 22 | Card Provider | Finance |
| 23 | Vehicle Type | Transport |
| 24 | Vehicle Document Type | Transport |
| 25 | Vehicle Trip Purpose | Transport |
| 26 | Vehicle Case Type | Transport |
| 27 | Vehicle Expense Type | Transport |
| 28 | Book Author | Library |
| 29 | Book Language | Library |
| 30 | Book Publisher | Library |
| 31 | Book Topic | Library |
| 32 | Book Condition | Library |
| 33 | Book Category | Library |
| 34 | Calling Purpose | Reception |
| 35 | Visiting Purpose | Reception |
| 36 | Gate Pass Purpose | Reception |
| 37 | Enquiry Stage | Reception |
| 38 | Enquiry Type | Reception |
| 39 | Enquiry Source | Reception |
| 40 | Complaint Type | Reception |
| 41 | Subject Type | Academic |
| 42 | Event Type | Calendar |
| 43 | Assignment Type | Resource |
| 44 | Announcement Type | Communication |
| 45 | Fee Concession Type | Finance |
| 46 | Trip Type | Activity |
| 47 | Incident Category | Discipline |
| 48 | Blog Category | Blog |
| 49 | News Category | News |
| 50 | Transaction Category | Finance |
| 51 | Approval Request Priority | Approval |
| 52 | Approval Request Group | Approval |
| 53 | Approval Request Nature | Approval |
| 54 | Unit | Inventory |
| 55 | Stock Item Condition | Inventory |
| 56 | Task Category | Task |
| 57 | Task Priority | Task |
| 58 | Task List | Task |
| 59 | FAQ Category | Helpdesk |
| 60 | Ticket Category | Helpdesk |
| 61 | Ticket Priority | Helpdesk |
| 62 | Ticket List | Helpdesk |

---

## 📊 Summary Statistics

| Metric | Count |
|---|---|
| **Database Tables (Migrations)** | 236 |
| **Eloquent Models** | 150+ |
| **Route Modules** | 31 |
| **Controller Directories** | 41+ |
| **Service Directories** | 38+ |
| **Configurable Option Types** | 62+ |
| **Payment Gateways** | 10 |
| **Enum Types** | 46+ |
| **Print/PDF Templates** | 11+ categories |
| **Export Types** | 12+ |
| **Import Types** | 10+ |

---

---
