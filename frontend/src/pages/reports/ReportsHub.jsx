import { BarChart3, Users, GraduationCap, DollarSign, ClipboardList, Calendar, TrendingUp, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const reportCategories = [
  {
    title: 'Student Reports',
    icon: GraduationCap,
    color: 'blue',
    reports: [
      { name: 'Student List', path: '/students', description: 'Complete list of all students' },
      { name: 'Attendance Summary', path: '/attendance/students', description: 'Student attendance overview' },
      { name: 'Enquiry Report', path: '/students/enquiries', description: 'Enquiry pipeline analysis' },
      { name: 'Alumni Report', path: '/students/alumni', description: 'Alumni tracking data' },
    ],
  },
  {
    title: 'Financial Reports',
    icon: DollarSign,
    color: 'green',
    reports: [
      { name: 'Fee Collection', path: '/fees/transactions', description: 'All fee transactions' },
      { name: 'Pending Fees', path: '/fees/student-fees', description: 'Outstanding fee amounts' },
      { name: 'Payment Gateway', path: '/payments', description: 'Online payment records' },
      { name: 'Ledger Report', path: '/fees/ledgers', description: 'Account ledger summaries' },
    ],
  },
  {
    title: 'Academic Reports',
    icon: ClipboardList,
    color: 'purple',
    reports: [
      { name: 'Exam Results', path: '/exams', description: 'Examination results overview' },
      { name: 'Subject Wise', path: '/academic/subjects', description: 'Subject-wise performance' },
      { name: 'Course Report', path: '/academic/courses', description: 'Course statistics' },
      { name: 'Batch Report', path: '/academic/batches', description: 'Batch-wise data' },
    ],
  },
  {
    title: 'HR Reports',
    icon: Users,
    color: 'orange',
    reports: [
      { name: 'Employee List', path: '/employees', description: 'Complete staff directory' },
      { name: 'Leave Summary', path: '/employees/leave-requests', description: 'Leave request analysis' },
      { name: 'Payroll Report', path: '/employees/payroll', description: 'Payroll processing data' },
      { name: 'Attendance', path: '/attendance/employees', description: 'Staff attendance records' },
    ],
  },
  {
    title: 'Facility Reports',
    icon: Calendar,
    color: 'pink',
    reports: [
      { name: 'Transport', path: '/transport/vehicles', description: 'Vehicle and route data' },
      { name: 'Library', path: '/library/books', description: 'Book inventory status' },
      { name: 'Hostel', path: '/hostel/rooms', description: 'Room occupancy data' },
      { name: 'Inventory', path: '/inventory/items', description: 'Stock level reports' },
    ],
  },
  {
    title: 'Communication',
    icon: TrendingUp,
    color: 'cyan',
    reports: [
      { name: 'Announcements', path: '/communication/announcements', description: 'Announcement history' },
      { name: 'Complaints', path: '/reception/complaints', description: 'Complaint tracking' },
      { name: 'Visitor Log', path: '/reception/visitors', description: 'Visitor records' },
      { name: 'Tickets', path: '/helpdesk/tickets', description: 'Support ticket data' },
    ],
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100', hover: 'hover:border-blue-200' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100', hover: 'hover:border-green-200' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100', hover: 'hover:border-purple-200' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100', hover: 'hover:border-orange-200' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-100', hover: 'hover:border-pink-200' },
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'border-cyan-100', hover: 'hover:border-cyan-200' },
};

export default function ReportsHub() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Reports Hub</h2>
          <p className="text-sm text-text-secondary mt-0.5">Access all reports and analytics from one place</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {reportCategories.map((cat) => {
          const Icon = cat.icon;
          const c = colorMap[cat.color];
          return (
            <div key={cat.title} className={`bg-surface rounded-md border ${c.border} ${c.hover} transition-all`}>
              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md ${c.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <h3 className="text-base font-semibold text-text-primary">{cat.title}</h3>
              </div>
              <div className="p-3 space-y-1">
                {cat.reports.map(report => (
                  <Link key={report.name} to={report.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-bg transition-colors group">
                    <FileText className="w-4 h-4 text-text-disabled group-hover:text-brand-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-secondary group-hover:text-brand-600">{report.name}</p>
                      <p className="text-xs text-text-disabled">{report.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
