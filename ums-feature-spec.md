# UMS — Role-Based Feature Specification

> **Purpose:** Definitive reference specifying exactly what each user role sees and can do in every module. All UI pages, sidebar items, and API endpoints must conform to this document.

---

## Roles

| Role | Code | Description |
|---|---|---|
| Admin | `ADMIN` | Full access to everything. Can configure, create, edit, delete all records. |
| Employee/Staff/Teacher | `EMPLOYEE` | Permission-driven. Teachers manage their batches. Staff handle assigned modules. |
| Student | `STUDENT` | Views own data only. Can submit assignments, take exams, raise tickets, pay fees. |
| Guardian | `GUARDIAN` | Views linked children's data. Can pay fees, communicate with institute. |
| Guest | (no login) | Public pages only: enquiry, registration, job apply, guest payment, TC verify. |

---

## Module-by-Module Specification

### 1. Dashboard

| Role | What they see |
|---|---|
| **Admin** | Stats (students/employees/revenue/courses), enrollment chart, fee distribution pie, recent activity, quick actions (Add Student, Collect Fee, Mark Attendance, etc.), birthday list |
| **Employee** | Scoped stats for their department/module, assigned tasks/tickets, today's timetable (if teacher), leave status, announcements |
| **Student** | Attendance %, fee dues + Pay Now, today's timetable, upcoming exams, pending assignments, recent announcements, library books issued, transport info |
| **Guardian** | Child switcher (if multiple), per-child: attendance %, fee dues, timetable, recent results, transport route, announcements, payment history |

---

### 2. Academic Setup (Sessions, Programs, Courses, Batches, Subjects, etc.)

| Role | Access |
|---|---|
| **Admin** | Full CRUD on all academic setup |
| **Employee** | View (if permitted). Config if HR/academic staff. |
| **Student** | ❌ No access. Not shown in sidebar. |
| **Guardian** | ❌ No access. Not shown in sidebar. |

**Sidebar:** Show only for ADMIN, EMPLOYEE.

---

### 3. Student Management (Enquiries, Registrations, Students, Alumni)

| Role | Access |
|---|---|
| **Admin** | Full CRUD on enquiries, registrations, students, alumni |
| **Employee** | Assigned enquiries/registrations. View/edit assigned batch students. |
| **Student** | Own profile only (read-only, with "Request Edit" button) |
| **Guardian** | Linked children profiles only (read-only) |

**Pages:**
- Admin/Employee → Full student list + create/edit/delete
- Student → "My Profile" page (read-only)
- Guardian → "My Children" page (read-only list of linked students)

---

### 4. Guardian Management

| Role | Access |
|---|---|
| **Admin** | Full CRUD |
| **Employee** | View assigned guardians |
| **Student** | ❌ No access |
| **Guardian** | Own profile (read-only, with "Request Edit") |

---

### 5. Employee / HR Module

| Role | Access |
|---|---|
| **Admin** | Full CRUD on employees, payroll, salary, leave management |
| **Employee** | Own profile, own leave requests, own payslips (self-service). HR staff → manage all. |
| **Student** | ❌ No access |
| **Guardian** | ❌ No access |

---

### 6. Fee & Finance

| Role | Access |
|---|---|
| **Admin** | Full CRUD on all fee setup, structures, concessions, ledgers, transactions |
| **Employee (Accountant)** | Fee collection, day closure, transaction management |
| **Student** | **"My Fees" page:** View own fee allocation, installments, payment history. Pay online. ❌ Cannot create/edit fee structures. |
| **Guardian** | **Per-child fees:** View linked child's fees. Pay online. ❌ Cannot modify fee setup. |

**Pages:**
- Admin/Employee → Fee Groups, Fee Heads, Structures, Concessions, Student Fees list, Fee Collection, Ledgers, Transactions
- Student → "My Fees" (summary card + installments + payment history + Pay Now button)
- Guardian → Child switcher → same view per child

---

### 7. Examination

| Role | Access |
|---|---|
| **Admin** | Full CRUD on terms, exams, grades, assessments, schedules. Publish results. |
| **Employee/Teacher** | Create/manage exams for assigned subjects. Enter marks. |
| **Student** | **"My Exams" page:** View exam schedule (read-only), view published results/marksheets. ❌ Cannot create exams, enter marks, modify grades. |
| **Guardian** | View linked child's exam schedule + results. ❌ No write access. |

**Pages:**
- Admin/Employee → Exam Terms, Exams, Grades, Assessments, Schedules, Marks Entry
- Student → "My Exams" (upcoming schedule + past results)
- Guardian → Per-child exam view

---

### 8. Attendance

| Role | Access |
|---|---|
| **Admin** | Full access. Mark attendance. View all records & reports. |
| **Employee/Teacher** | Mark attendance for assigned batches. View attendance records for assigned batches. |
| **Student** | **"My Attendance" page:** View own attendance (%, monthly breakdown, recent absences). ❌ Cannot mark attendance. |
| **Guardian** | View linked child's attendance. ❌ Cannot mark. |

**Pages:**
- Admin/Employee → Mark Attendance, Student Attendance Records, Employee Attendance Records
- Student → "My Attendance" (summary card + calendar view + stats)
- Guardian → Per-child attendance view

---

### 9. Timetable

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Create/edit timetables. |
| **Employee/Teacher** | View own timetable (teaching schedule). |
| **Student** | **"My Timetable":** View own timetable (today + weekly). ❌ Cannot create/edit. |
| **Guardian** | View linked child's timetable. |

---

### 10. Transport

| Role | Access |
|---|---|
| **Admin** | Full CRUD on circles, stoppages, routes, vehicles, fuel/service records |
| **Employee (Transport Manager)** | Manage routes, vehicles, assignments |
| **Student** | **"My Transport":** View assigned route, stoppage, vehicle, pickup time. ❌ Cannot modify. |
| **Guardian** | View linked child's transport info. |

**Pages:**
- Admin/Employee → Full transport management (circles, stoppages, routes, vehicles, records)
- Student → "My Transport" card on dashboard
- Guardian → Per-child transport info

---

### 11. Library

| Role | Access |
|---|---|
| **Admin** | Full CRUD on books, issue/return, reports |
| **Employee (Librarian)** | Issue/return books, manage catalog |
| **Student** | **"My Library":** View issued books + due dates. Browse catalog (read-only). ❌ Cannot issue/return. |
| **Guardian** | View linked child's issued books. |

---

### 12. Hostel

| Role | Access |
|---|---|
| **Admin** | Full CRUD on blocks, floors, rooms, allocations |
| **Employee (Warden)** | Manage room allocations |
| **Student** | **"My Hostel":** View own room allocation. ❌ Cannot modify. |
| **Guardian** | View linked child's hostel info. |

---

### 13. Inventory / Stock

| Role | Access |
|---|---|
| **Admin** | Full CRUD |
| **Employee** | Assigned inventory management |
| **Student** | ❌ No access |
| **Guardian** | ❌ No access |

---

### 14. Mess / Cafeteria

| Role | Access |
|---|---|
| **Admin** | Full CRUD on menu items, meals, schedules |
| **Employee** | Manage mess operations |
| **Student** | View today's menu + schedule (read-only) |
| **Guardian** | View mess schedule (read-only) |

---

### 15. Reception / Front Office (Visitors, Gate Pass, Call Logs, Complaints, Postal)

| Role | Access |
|---|---|
| **Admin** | Full CRUD |
| **Employee (Front Office)** | Full operational access |
| **Student** | ❌ No access |
| **Guardian** | ❌ No access |

---

### 16. Communication (Announcements)

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Create, target audience, pin. |
| **Employee** | Create announcements (if permitted). Send to own batch (teachers). |
| **Student** | View announcements (read-only feed). ❌ Cannot create. |
| **Guardian** | View announcements (read-only feed). ❌ Cannot create. |

---

### 17. Calendar & Events

| Role | Access |
|---|---|
| **Admin** | Full CRUD on events, holidays |
| **Employee** | View events/holidays. Create if permitted. |
| **Student** | View events and holidays (read-only). ❌ Cannot create. |
| **Guardian** | View events and holidays (read-only). ❌ Cannot create. |

---

### 18. Resources (Assignments, Diary, Lesson Plans, Syllabus, Learning Materials, Online Classes)

| Role | Access |
|---|---|
| **Admin** | Full CRUD on all resources |
| **Employee/Teacher** | Create assignments, diary entries, lesson plans for assigned batches. Upload materials. Schedule online classes. |
| **Student** | View assignments + submit. View diary, lesson plans, syllabus, materials (read-only). View online class links. ❌ Cannot create any resources. |
| **Guardian** | View linked child's assignments, diary, materials (read-only). ❌ Cannot create. |

---

### 19. Online Exams

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Create exams, questions. |
| **Employee/Teacher** | Create/manage online exams for assigned subjects. Grade submissions. |
| **Student** | Take online exams. View own results. ❌ Cannot create exams/questions. |
| **Guardian** | View linked child's results. ❌ Cannot take exams. |

---

### 20. Recruitment

| Role | Access |
|---|---|
| **Admin** | Full CRUD on vacancies, applications |
| **Employee (HR)** | Manage vacancies, review applications |
| **Student** | ❌ No access |
| **Guardian** | ❌ No access |
| **Guest** | Apply for jobs (public page) |

---

### 21. Discipline

| Role | Access |
|---|---|
| **Admin** | Full CRUD on incidents |
| **Employee/Teacher** | Log incidents for assigned batches |
| **Student** | View own incidents (read-only). ❌ Cannot create/edit. |
| **Guardian** | View linked child's incidents (read-only). |

---

### 22. Activities / Trips

| Role | Access |
|---|---|
| **Admin** | Full CRUD |
| **Employee** | Manage assigned activities/trips |
| **Student** | View trips. Register for participation. ❌ Cannot create trips. |
| **Guardian** | View linked child's activities (read-only). |

---

### 23. Blog / News / Gallery / CMS

| Role | Access |
|---|---|
| **Admin** | Full CRUD |
| **Employee** | Editorial access (if permitted) |
| **Student** | View published content (read-only) |
| **Guardian** | View published content (read-only) |

---

### 24. Custom Forms

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Create forms, view submissions. |
| **Employee** | Config (if permitted). Fill targeted forms. |
| **Student** | Fill forms targeted to them. ❌ Cannot create forms. |
| **Guardian** | Fill forms targeted to them. ❌ Cannot create forms. |

---

### 25. Approval Workflow

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Final approver. |
| **Employee** | Submit requests. Approve if in chain. |
| **Student** | Submit requests (if applicable). |
| **Guardian** | Submit requests (if applicable). |

---

### 26. Task Management

| Role | Access |
|---|---|
| **Admin** | Full CRUD |
| **Employee** | View/manage assigned tasks |
| **Student** | ❌ No access |
| **Guardian** | ❌ No access |

---

### 27. Helpdesk (Tickets & FAQ)

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Manage all tickets. |
| **Employee** | Resolve assigned tickets. |
| **Student** | Raise tickets. View own tickets. View FAQs (read-only). ❌ Cannot create FAQs. |
| **Guardian** | Raise tickets. View own tickets. View FAQs (read-only). |

---

### 28. Social Wall

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Post, moderate. |
| **Employee** | Post (if permitted). |
| **Student** | View feed. Comment on posts. ❌ Cannot create posts (per spec). |
| **Guardian** | View feed. Comment on posts. |

---

### 29. Chat

| Role | Access |
|---|---|
| **Admin** | Full access |
| **Employee** | Full access |
| **Student** | Chat with teachers/staff |
| **Guardian** | Chat with teachers/staff |

---

### 30. Notifications & Reminders

| Role | Access |
|---|---|
| **Admin** | View all notifications. Create reminders. |
| **Employee** | View own notifications. Create reminders. |
| **Student** | View own notifications. ❌ Cannot create reminders. |
| **Guardian** | View own notifications. ❌ Cannot create reminders. |

---

### 31. Service Requests & Dialogues

| Role | Access |
|---|---|
| **Admin** | Full CRUD. Manage all requests. |
| **Employee** | Handle assigned requests. Own dialogues. |
| **Student** | Raise service requests. Own dialogues. View own status. |
| **Guardian** | Raise service requests for linked children. Own dialogues. |

---

### 32. Certificates & ID Cards

| Role | Access |
|---|---|
| **Admin** | Full CRUD on templates. Generate certificates/IDs. |
| **Employee** | Generate (if permitted). |
| **Student** | View/download own certificates and ID card. ❌ Cannot create templates. |
| **Guardian** | Download linked child's certificates/ID. |

---

### 33. Reports

| Role | Access |
|---|---|
| **Admin** | Full access to all reports |
| **Employee** | Scoped reports (own module/department) |
| **Student** | ❌ No access to reports hub |
| **Guardian** | ❌ No access to reports hub |

---

### 34. Settings / Config / Users / Roles

| Role | Access |
|---|---|
| **Admin** | Full access |
| **Employee** | ❌ No access |
| **Student** | ❌ No access |
| **Guardian** | ❌ No access |

---

### 35. Import / Export

| Role | Access |
|---|---|
| **Admin** | Full access |
| **Employee** | Scoped exports (if permitted) |
| **Student** | ❌ No access |
| **Guardian** | ❌ No access |

---

## Sidebar Navigation by Role

### Admin Sidebar
All groups visible: Dashboard, Academic Setup, Student Management, HR & Employees, Fee & Finance, Examination, Attendance & Schedule, Facilities (Transport, Library, Hostel, Inventory, Mess), Communication, Front Office & Support, Workflow & Forms, Content & Resources, Recruitment, Website CMS, System & Config.

### Employee/Teacher Sidebar
Visible based on permissions: Dashboard, Student Management (assigned), Examination (if teacher), Attendance (if teacher/attendance assistant), Fee & Finance (if accountant), Communication, Front Office (if front office), Content & Resources (if teacher), Tasks, Helpdesk, My Leave/HR (self-service).

### Student Sidebar
- Dashboard
- My Profile
- My Attendance
- My Timetable
- My Fees
- My Exams & Results
- My Assignments
- My Library
- My Transport
- My Hostel
- Mess Schedule
- Announcements
- Events & Holidays
- Helpdesk (Raise Ticket, FAQs)
- Service Requests
- Chat
- Social Wall
- Notifications

### Guardian Sidebar
- Dashboard
- My Children
- Attendance (per child)
- Timetable (per child)
- Fees & Payments
- Exams & Results
- Transport
- Announcements
- Events & Holidays
- Helpdesk
- Chat
- Notifications
