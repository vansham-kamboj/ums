import { useState } from 'react';
import { CreditCard, Users, DollarSign, Download, Calendar, Search, CheckCircle, Clock, AlertCircle, Loader2, ChevronDown, Filter, FileText, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v) || 0);
}

const DEMO_EMPLOYEES = [
  { id: 1, name: 'Dr. Anand Kumar', empCode: 'EMP-001', department: 'Computer Science', designation: 'Professor', basic: 85000, hra: 34000, da: 12750, pf: 10200, tax: 8500, net: 113050, status: 'processed' },
  { id: 2, name: 'Prof. Meera Sharma', empCode: 'EMP-002', department: 'Mathematics', designation: 'Assoc. Professor', basic: 72000, hra: 28800, da: 10800, pf: 8640, tax: 6200, net: 96760, status: 'processed' },
  { id: 3, name: 'Dr. Rajesh Singh', empCode: 'EMP-003', department: 'Electronics', designation: 'Professor', basic: 90000, hra: 36000, da: 13500, pf: 10800, tax: 9500, net: 119200, status: 'pending' },
  { id: 4, name: 'Mrs. Priya Reddy', empCode: 'EMP-004', department: 'Admin', designation: 'Admin Officer', basic: 45000, hra: 18000, da: 6750, pf: 5400, tax: 2800, net: 61550, status: 'pending' },
  { id: 5, name: 'Mr. Vikram Patil', empCode: 'EMP-005', department: 'Mechanical', designation: 'Asst. Professor', basic: 55000, hra: 22000, da: 8250, pf: 6600, tax: 3500, net: 75150, status: 'processed' },
  { id: 6, name: 'Ms. Sneha Gupta', empCode: 'EMP-006', department: 'Library', designation: 'Librarian', basic: 42000, hra: 16800, da: 6300, pf: 5040, tax: 2100, net: 57960, status: 'draft' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function PayrollWorkstation() {
  const toast = useToast();
  const [employees, setEmployees] = useState(DEMO_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(2026);
  const [statusFilter, setStatusFilter] = useState('');
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [processing, setProcessing] = useState(false);

  const filtered = employees.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.empCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalGross = employees.reduce((s, e) => s + e.basic + e.hra + e.da, 0);
  const totalDeductions = employees.reduce((s, e) => s + e.pf + e.tax, 0);
  const totalNet = employees.reduce((s, e) => s + e.net, 0);
  const processedCount = employees.filter(e => e.status === 'processed').length;

  const handleProcessAll = () => {
    setProcessing(true);
    setTimeout(() => {
      setEmployees(prev => prev.map(e => ({ ...e, status: 'processed' })));
      setProcessing(false);
      toast.success('All payroll entries processed!');
    }, 1500);
  };

  const viewSlip = (emp) => {
    setSelectedEmployee(emp);
    setShowSlipModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Payroll Workstation</h1>
          <p className="text-sm text-muted-foreground mt-1">Process monthly salaries and generate payslips</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="secondary-button text-xs font-semibold px-4 py-2.5 inline-flex items-center gap-2">
            <Download className="w-4 h-4 text-brand" /> Export
          </button>
          <button
            onClick={handleProcessAll}
            disabled={processing || processedCount === employees.length}
            className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2 disabled:opacity-50"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Process All
          </button>
        </div>
      </div>

      {/* Period Selector + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Payroll Period</label>
          <div className="flex gap-2">
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="flex-1 px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            >
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-24 px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            />
          </div>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Total Gross</p>
          <p className="text-2xl font-bold text-foreground font-heading">{formatCurrency(totalGross)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{employees.length} employees</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Total Deductions</p>
          <p className="text-2xl font-bold text-rose-500 font-heading">{formatCurrency(totalDeductions)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">PF + Tax</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Net Disbursement</p>
          <p className="text-2xl font-bold text-emerald-600 font-heading">{formatCurrency(totalNet)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{processedCount}/{employees.length} Processed</p>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2 border-b border-glass-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employee or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5 text-right">Basic</th>
                <th className="px-5 py-3.5 text-right">Allowances</th>
                <th className="px-5 py-3.5 text-right">Deductions</th>
                <th className="px-5 py-3.5 text-right">Net Salary</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filtered.map(emp => (
                <tr key={emp.id} className="glass-card-interactive hover:bg-card/80 transition-all">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-foreground">{emp.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{emp.empCode}</div>
                  </td>
                  <td className="px-5 py-3.5 text-foreground/80">{emp.department}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs">{formatCurrency(emp.basic)}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-emerald-600">+{formatCurrency(emp.hra + emp.da)}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-rose-500">-{formatCurrency(emp.pf + emp.tax)}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-foreground">{formatCurrency(emp.net)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge status={emp.status === 'processed' ? 'active' : emp.status === 'pending' ? 'pending' : 'inactive'} label={emp.status} size="xs" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => viewSlip(emp)} className="secondary-button text-xs px-3 py-1.5 inline-flex items-center gap-1.5 text-brand">
                      <FileText className="w-3.5 h-3.5" /> Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      <Modal open={showSlipModal} onClose={() => setShowSlipModal(false)} title="Salary Payslip">
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="glass-panel p-4 space-y-2">
              <div className="flex justify-between items-center border-b border-glass-border pb-2">
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedEmployee.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedEmployee.designation} • {selectedEmployee.empCode}</p>
                </div>
                <StatusBadge status={selectedEmployee.status === 'processed' ? 'active' : 'pending'} label={selectedEmployee.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <p className="font-semibold text-foreground mb-1">Earnings</p>
                  <div className="flex justify-between py-1 border-b border-glass-border/40">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span className="font-mono">{formatCurrency(selectedEmployee.basic)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-glass-border/40">
                    <span className="text-muted-foreground">HRA</span>
                    <span className="font-mono">{formatCurrency(selectedEmployee.hra)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">DA</span>
                    <span className="font-mono">{formatCurrency(selectedEmployee.da)}</span>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-foreground mb-1">Deductions</p>
                  <div className="flex justify-between py-1 border-b border-glass-border/40">
                    <span className="text-muted-foreground">Provident Fund</span>
                    <span className="font-mono text-rose-500">-{formatCurrency(selectedEmployee.pf)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Income Tax</span>
                    <span className="font-mono text-rose-500">-{formatCurrency(selectedEmployee.tax)}</span>
                  </div>
                </div>
              </div>

              <div className="glass-subtle p-3 rounded-xl flex justify-between items-center mt-3">
                <span className="text-sm font-bold text-foreground">Net Payable Amount</span>
                <span className="text-lg font-bold font-mono text-emerald-600">{formatCurrency(selectedEmployee.net)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSlipModal(false)} className="secondary-button text-xs px-4 py-2">Close</button>
              <button onClick={() => toast.success('Payslip PDF downloaded')} className="primary-button text-xs px-4 py-2 inline-flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}