# UMS — Roles, Access, Flows & Dashboard Specification
**Purpose:** Single reference for developers building role-based access, navigation, and dashboards.

---

## 1. Role Hierarchy

```
Admin (single institution, full config + approvals)
 └─ Staff (permission-based, not one fixed role)
     examples: Accountant, Front Office, Librarian, Warden,
     Transport Manager, HR Executive, Attendance Assistant
 └─ Teacher (= Employee record + academic permission set)
 Student
 Guardian (1 login → N linked students)
 Alumni (post-graduation, read-only subset of Student)
 Guest / Public (no login)
```

**Key architecture note:** Single institution, so there's one Admin tier (no institute-switching layer needed). Only 6 top-level actors reach login (Admin, Staff, Teacher, Student, Guardian, Guest-no-login). "Staff" and "Teacher" are not hardcoded roles — they're **permission bundles** assigned per user (Spatie Permission model). Build the permission system module-by-module, not role-by-role, so new staff types (e.g. Warden, Counselor) can be added without code changes.

---

## 2. Authentication & Login by Role

| Role | Account Creation | Login Method | Notes |
|---|---|---|---|
| Admin | Created at system setup | Email+Password, OTP, 2FA, Social (Microsoft) | Can impersonate any user |
| Staff | **Auto-created with Employee record** — one save action | Email+Password, OTP, 2FA | Access scoped by assigned permissions/department |
| Teacher | **Auto-created with Employee record** (academic permission set applied) | Email+Password, OTP, 2FA | Same auth stack as Staff |
| Student | **Auto-created with Admission** (Registration → Admission conversion) | Email/Username+Password, OTP | Force-password-change on first login; welcome email/SMS with credentials |
| Guardian | **Auto-created with Registration** (linked to student) or synced across siblings | Email+Password, OTP | One login, multiple linked students; "Sync Guardian" merges sibling accounts |
| Guest/Public | None | No login | Access only public pages: enquiry, registration, job application, payment, TC verification, blog/news/events |

All roles share: password reset flow, screen lock, failed-login tracking, IP allow/block list, rate limiting on auth routes. Student/Guardian logins are additionally tracked in a dedicated **User Access Log**.

> **Implementation rule:** Creating a Student, Employee, Teacher, or Guardian record must create its login/user account in the same transaction — never a separate "create user" step done afterward. One form save = profile record + user account + credential dispatch (email/SMS). This applies uniformly to every role above.

---

## 3. Access Matrix (by module category)

Legend: **Full** = create/edit/delete/config · **Assigned** = only records assigned to them · **Own** = only their own record · **View** = read-only · **Submit** = can create requests, not manage · **—** = no access

| Module Category | Admin | Staff* | Teacher | Student | Guardian | Guest |
|---|---|---|---|---|---|---|
| Academic Setup (sessions, courses, subjects) | Full | Config (if permitted) | View | — | — | — |
| Enquiry | Full | Assigned | — | — | — | Submit |
| Registration | Full | Assigned | — | — | — | Submit |
| Admission | Full | Assigned | — | — | — | — |
| Student Profile & Records | Full | Assigned/Dept | Assigned batch | Own | Linked child | — |
| Guardian Management | Full | Assigned | View (own students) | — | Own | — |
| Employee / HR / Payroll | Full | Own (self-service) + Assigned (if HR) | Own | — | — | — |
| Fee & Finance | Full | Assigned (Accountant) | — | Own (view/pay) | Linked child (view/pay) | Guest payment |
| Examination & Results | Full | — | Assigned subjects | Own (view) | Linked child (view) | — |
| Attendance | Full | Assigned | Assigned batch (mark) | Own (view) | Linked child (view) | — |
| Timetable | Full | View | Own (view) | Own (view) | Linked child (view) | — |
| Transport | Full | Assigned | — | Own route (view) | Linked child (view) | — |
| Library | Full | Assigned (Librarian) | Issue/return (own) | Own history | View | Public book list |
| Hostel | Full | Assigned (Warden) | — | Own room (view) | Linked child (view) | — |
| Inventory / Stock | Full | Assigned | — | — | — | — |
| Mess / Cafeteria | Full | Assigned | — | View schedule | View schedule | — |
| Reception (Visitor/Gate Pass/Call Log) | Full | Assigned | — | — | — | — |
| Communication (Announcements, Chat, Notifications) | Full | Send (if permitted) | Send to own batch | Receive/Reply | Receive/Reply | — |
| Calendar & Events | Full | View/Config | View | View | View | View (public events) |
| Learning Resources / Homework | Full | — | Assigned batch (create) | Own (view/submit) | Linked child (view) | — |
| Online Exam | Full | — | Assigned (create/grade) | Own (take) | Linked child (view result) | — |
| Recruitment | Full | Assigned (HR) | — | — | — | Apply |
| Discipline | Full | Assigned | Assigned batch (log) | Own (view) | Linked child (view) | — |
| Activities / Trips | Full | Assigned | Assigned (manage) | Own (register) | Linked child (view) | — |
| Blog / News / Gallery / CMS | Full | Editorial (if permitted) | — | View | View | View |
| Custom Forms | Full | Config | Fill (if targeted) | Fill (if targeted) | Fill (if targeted) | Fill (public forms) |
| Approval Workflow | Full (final approver) | Submit + approve (if in chain) | Submit | Submit | Submit | — |
| Task Management | Full | Assigned | Assigned | — | — | — |
| Helpdesk (Tickets/FAQ) | Full | Assigned (resolver) | Raise | Raise | Raise | View FAQ |
| Social Wall | Full | Post (if permitted) | Post | View/Comment | View/Comment | — |
| Certificates & ID Cards | Full | Generate (if permitted) | — | Own (view/download) | Linked child (download) | TC verification |
| Reports | Full | Scoped to module | Scoped (attendance/marks) | — | — | — |
| Settings / User & Role Mgmt | Full | — | — | — | — | — |
| Import / Export | Full | Scoped | — | — | — | — |

*Staff access is always permission-driven — the row above shows the typical ceiling, not a fixed default.

---

## 4. Core System Flows

### A. Academic & Student Lifecycle
`Setup → Enquiry → Registration → Admission → Active Student → Transfer/Alumni`
1. Admin configures sessions, programs, courses, batches, subjects, fee structures.
2. Guest/Staff logs an Enquiry → Staff follows up → converts to Registration.
3. Registration collects student + guardian details, documents, registration fee → Admin/Staff verifies.
4. Approved Registration → converted to Admission → course/batch assigned → fees allocated → **login auto-created**.
5. Enrollment status tracked; transfers, TC generation, and alumni conversion handled at exit.

### B. Daily Operations
`Attendance → Timetable → Homework/Learning Material → Facilities → Communication`
1. Teachers mark attendance (daily/subject-wise/QR), publish homework and learning material.
2. Students/Guardians view assigned transport route, hostel room, library status, mess schedule.
3. Admin/Teachers broadcast announcements; students/guardians raise service requests or helpdesk tickets.
4. Discipline incidents logged against students; activities/trips scheduled with registration.

### C. Assessment & Examination
`Configuration → Execution → Publication`
1. Admin/Teachers configure exam terms, schedules, grading scale, competencies.
2. Teachers conduct exams (offline/online), enter marks; marks auto-lock post-deadline.
3. Admin publishes results → Students/Guardians view and download marksheets.

### D. Finance & Fee
`Allocation → Collection → Management → Reporting`
1. Fee structures auto-allocated on admission (course/batch/gender-based).
2. Guardians/Students pay online (10 gateway support, guest payment without login) or Staff collects at counter.
3. Finance staff applies concessions, processes refunds, manages ledgers, clears cheques/DDs, performs day closure.
4. Admin reviews day book and finance reports.

### E. Facility Management
`Transport → Hostel → Library → Mess`
1. Students assigned to transport routes/stoppages with fee mapping.
2. Hostel rooms allocated (block → floor → room) with occupancy tracking.
3. Books issued/returned with overdue tracking; hostel/mess schedules pushed to dashboards.

### F. Communication & Support
`Announcement → Chat/Social Wall → Helpdesk Ticket → Service Request/Dialogue`
1. Targeted announcements (audience-based) pinned to feeds.
2. Real-time chat and social wall for engagement.
3. Tickets raised by any role, assigned to a resolver, tracked to resolution.
4. Students/Guardians can submit profile edit requests and dialogues with the institute.

### G. Approval Workflow
`Request Raised → Routed by Priority/Group/Nature → Multi-level Approval → Logged`
Applies to leave requests, transfers, bank transfer payments, and any custom approval-gated action.

### H. HR & Payroll
`Attendance/Shift → Leave Request → Approval → Payroll Processing → Payslip`
1. Employee attendance and work shifts tracked; leave requested and approved (multi-level).
2. Salary templates + structures generate monthly payroll; salary sheets and payment advice printed.

### I. Recruitment
`Job Posted (Public) → Application → Shortlist → Convert to Employee`

### J. Content / Public CMS
`Admin/Staff publishes Blog, News, Gallery, Events, CMS pages → visible on public site and dashboards`

---

## 5. Dashboard Specification by Role

### Admin Dashboard
- Stats: total students, employees, fee collection summary
- Student enrollment chart, transaction/finance chart, concession & course-wise fee chart
- Employee attendance summary
- Birthday list (students + employees, today)
- Calendar: upcoming events, holidays, todos
- Today's timetable snapshot
- Recent gallery uploads
- Pending approvals & open tickets count
- Custom form list (submissions pending review)

### Staff Dashboard (scoped to permissions/department)
- Module-specific widgets only (e.g. Accountant sees fee collection + day book; Front Office sees enquiries + visitor log)
- Assigned tasks and tickets
- Department-level attendance/leave summary
- Notifications relevant to assigned modules

### Teacher Dashboard
- Today's timetable
- Assigned batches — attendance not yet marked (action prompt)
- Homework/learning material pending publish
- Exam marks entry pending (if in active exam window)
- Leave request status
- Pinned announcements
- Birthday list for own batch

### Student Dashboard
- Today's timetable
- Attendance summary (%, recent absences)
- Fee due summary + quick pay button
- Upcoming exams / recent results
- Homework/assignments due
- Transport route + pickup time
- Mess schedule (today's menu)
- Pinned announcements & events
- Library — books currently issued + due dates
- Open helpdesk tickets/service requests

### Guardian Dashboard
- Linked student switcher (if multiple children)
- Per-child: attendance, fee dues, timetable, results, transport, mess
- Institute contact info
- Pinned announcements & events
- Payment history + pending dues across all children
- Communication/dialogue thread with institute

### Guest / Public Pages (no dashboard, no login)
- Enquiry form
- Registration portal (multi-step)
- Job vacancy listing + application
- Guest fee payment (anonymous, by student ID)
- TC verification
- Blog, News, Events, Gallery, Book List
- Contact / CMS pages

---

## 6. Developer Notes

1. **Permission model:** Build on a granular module×action permission system (create/view/edit/delete/approve per module), not hardcoded roles. Admin and "Staff" differ only in default permission sets, not in schema.
2. **Teacher ≠ separate user type:** Teacher is an Employee record with academic permissions + Subject Incharge assignments. Don't create a parallel `teachers` table separate from `employees`.
3. **Guardian-student linking:** Support many-to-many (multiple guardians per student, multiple students per guardian/sibling). One login per guardian, scoped view per linked student.
4. **Auto-provisioning (all roles):** Never require a separate "create user" step for any role. Creating a Student (on Admission), Guardian (on Registration), Employee, or Teacher record must programmatically provision its login account in the same operation — with credential delivery via email/SMS and forced password change on first login.
5. **Scoping pattern:** Most Staff/Teacher access should be filtered by "assignment" (department, batch, subject-incharge, ticket-assignee) rather than institute-wide by default — enforce at query level, not just UI level.
6. **Audit:** Every login (especially Student/Guardian) and every impersonation action should write to the Activity/Access Log — required for security review.
7. **Public vs authenticated split:** Keep Guest-facing routes (enquiry, registration, payment, TC verification, CMS) entirely separate from the authenticated app shell — they have no dashboard and no session-based access control.