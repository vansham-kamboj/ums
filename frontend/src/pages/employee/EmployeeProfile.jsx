import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Mail, Phone, Calendar, Clock, CreditCard, ChevronLeft, FileText, Building2, Briefcase, Edit2, Download, Award } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/employees/${id}`);
      setEmployee(res.data.data);
    } catch (error) {
      // Demo fallback
      setEmployee({
        firstName: 'Dr. Anand', lastName: 'Kumar', email: 'anand.k@university.edu',
        phone: '9876543210', employeeCode: 'EMP-001', department: 'Computer Science',
        designation: 'Professor', gender: 'Male', dateOfBirth: '1985-03-15',
        dateOfJoining: '2015-08-01', bloodGroup: 'O+', status: 'active',
        address: '42, Faculty Quarters, University Campus', qualification: 'Ph.D Computer Science',
        specialization: 'Artificial Intelligence & Machine Learning',
        experience: '11 years',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-brand/30 border-t-brand rounded-full animate-spin" />
    </div>
  );
  if (!employee) return (
    <div className="py-20 text-center glass-panel p-8">
      <User className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground">Employee not found</p>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'timesheet', label: 'Timesheets', icon: Clock },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground font-medium mt-0.5">{value || 'Not specified'}</p>
      </div>
    </div>
  );

  // Demo timesheet data
  const timesheetData = [
    { date: '2026-08-20', checkIn: '09:05 AM', checkOut: '05:30 PM', hours: '8h 25m', status: 'present' },
    { date: '2026-08-19', checkIn: '08:55 AM', checkOut: '05:15 PM', hours: '8h 20m', status: 'present' },
    { date: '2026-08-18', checkIn: '—', checkOut: '—', hours: '—', status: 'absent' },
    { date: '2026-08-17', checkIn: '09:10 AM', checkOut: '06:00 PM', hours: '8h 50m', status: 'present' },
    { date: '2026-08-16', checkIn: '08:45 AM', checkOut: '05:00 PM', hours: '8h 15m', status: 'present' },
  ];

  const leaveData = [
    { type: 'Casual Leave', allotted: 12, taken: 4, balance: 8 },
    { type: 'Sick Leave', allotted: 10, taken: 2, balance: 8 },
    { type: 'Earned Leave', allotted: 15, taken: 5, balance: 10 },
  ];

  const payrollData = [
    { component: 'Basic Salary', amount: 85000, type: 'earning' },
    { component: 'HRA', amount: 34000, type: 'earning' },
    { component: 'DA', amount: 12750, type: 'earning' },
    { component: 'PF Deduction', amount: 10200, type: 'deduction' },
    { component: 'Professional Tax', amount: 2400, type: 'deduction' },
    { component: 'Income Tax', amount: 8500, type: 'deduction' },
  ];

  const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner & Card */}
      <div className="glass-panel p-0 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand to-accent relative opacity-90" />
        <div className="px-6 pb-6">
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4">
            <div className="flex items-end gap-4">
              <div className="brand-mark w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-heading shadow-xl ring-4 ring-white/50">
                {employee.firstName?.[0]}{employee.lastName?.[0] || ''}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground font-heading">{employee.firstName} {employee.lastName}</h1>
                  <StatusBadge status={employee.status === 'active' ? 'active' : 'pending'} label={employee.status} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{employee.designation} • {employee.department}</p>
                <p className="text-xs text-brand font-mono mt-0.5">{employee.employeeCode}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/employees')} className="secondary-button text-xs px-3 py-2 inline-flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Back to Directory
              </button>
              <button className="primary-button text-xs px-4 py-2 inline-flex items-center gap-1.5">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-t border-glass-border px-6 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  active ? 'border-brand text-brand bg-brand/10' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground font-heading border-b border-glass-border pb-3">Personal & Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={Mail} label="Email Address" value={employee.email} />
                <InfoRow icon={Phone} label="Phone Number" value={employee.phone} />
                <InfoRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth} />
                <InfoRow icon={User} label="Gender" value={employee.gender} />
                <InfoRow icon={Award} label="Blood Group" value={employee.bloodGroup} />
                <InfoRow icon={MapPin} label="Address" value={employee.address} />
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground font-heading border-b border-glass-border pb-3">Employment Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={Briefcase} label="Designation" value={employee.designation} />
                <InfoRow icon={Building2} label="Department" value={employee.department} />
                <InfoRow icon={Calendar} label="Date of Joining" value={employee.dateOfJoining} />
                <InfoRow icon={Award} label="Qualification" value={employee.qualification} />
                <InfoRow icon={Briefcase} label="Experience" value={employee.experience} />
                <InfoRow icon={FileText} label="Specialization" value={employee.specialization} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground font-heading">Quick Stats</h3>
              <div className="space-y-2">
                <div className="glass-subtle p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Attendance Rate</span>
                  <span className="text-sm font-bold text-emerald-600">96.4%</span>
                </div>
                <div className="glass-subtle p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Leave Balance</span>
                  <span className="text-sm font-bold text-brand">26 Days</span>
                </div>
                <div className="glass-subtle p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Years Served</span>
                  <span className="text-sm font-bold text-amber-600">11 Years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timesheet' && (
        <div className="glass-panel p-0 overflow-hidden">
          <div className="p-4 border-b border-glass-border">
            <h3 className="text-base font-bold text-foreground font-heading">Recent Timesheets</h3>
          </div>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Check In</th>
                <th className="px-5 py-3">Check Out</th>
                <th className="px-5 py-3">Total Hours</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {timesheetData.map((t, idx) => (
                <tr key={idx} className="glass-card-interactive hover:bg-card/80 transition-all">
                  <td className="px-5 py-3.5 font-medium text-foreground">{t.date}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.checkIn}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.checkOut}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-foreground/80">{t.hours}</td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status={t.status === 'present' ? 'active' : 'danger'} label={t.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-base font-bold text-foreground font-heading border-b border-glass-border pb-3">Leave Balance Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {leaveData.map((l, i) => (
              <div key={i} className="glass-subtle p-4 rounded-xl border border-glass-border">
                <h4 className="text-sm font-bold text-foreground">{l.type}</h4>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-brand font-heading">{l.balance}</span>
                  <span className="text-xs text-muted-foreground">{l.taken} taken / {l.allotted} allotted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-base font-bold text-foreground font-heading border-b border-glass-border pb-3">Salary Breakup</h3>
          <div className="space-y-3">
            {payrollData.map((p, i) => (
              <div key={i} className="glass-subtle p-3.5 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{p.component}</span>
                <span className={`text-sm font-bold font-mono ${p.type === 'earning' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {p.type === 'earning' ? '+' : '-'}{formatCurrency(p.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-base font-bold text-foreground font-heading border-b border-glass-border pb-3">Employee Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Appointment Letter.pdf', 'Educational Certificates.pdf', 'ID Proof (Aadhaar).pdf', 'Experience Certificate.pdf'].map((doc, i) => (
              <div key={i} className="glass-subtle p-4 rounded-xl border border-glass-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand" />
                  <span className="text-sm font-medium text-foreground">{doc}</span>
                </div>
                <button className="secondary-button p-2 text-brand" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
