import { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Users, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v) || 0);
}

const DEMO_OVERDUE = [
  { id: 1, name: 'Rohit Kumar', admNo: 'STU-003', course: 'B.Tech CS', dueAmount: 35000, dueDate: '2026-07-15' },
  { id: 2, name: 'Karan Joshi', admNo: 'STU-007', course: 'B.Tech EE', dueAmount: 28000, dueDate: '2026-07-20' },
  { id: 3, name: 'Vikram Singh', admNo: 'STU-005', course: 'B.Tech ME', dueAmount: 15000, dueDate: '2026-08-01' },
  { id: 4, name: 'Harsh Patel', admNo: 'STU-018', course: 'MCA', dueAmount: 22000, dueDate: '2026-08-05' },
];

const COLLECTION_TREND = [
  { month: 'Mar', amount: 820000 },
  { month: 'Apr', amount: 1150000 },
  { month: 'May', amount: 640000 },
  { month: 'Jun', amount: 1380000 },
  { month: 'Jul', amount: 920000 },
  { month: 'Aug', amount: 750000 },
];

export default function FeeDashboard() {
  const [period, setPeriod] = useState('term');
  const totalCollected = 5660000;
  const totalDue = 1820000;
  const overdueCount = DEMO_OVERDUE.length;
  const concessions = 340000;
  const maxAmount = Math.max(...COLLECTION_TREND.map(c => c.amount));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Fee Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of fee collection, dues, and financial health</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="term">This Term</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
          </select>
          <button className="secondary-button text-xs font-semibold px-4 py-2.5 inline-flex items-center gap-2">
            <Download className="w-4 h-4 text-brand" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Total Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-heading">{formatCurrency(totalCollected)}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-semibold">+12% vs last term</span>
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Total Due</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 font-heading">{formatCurrency(totalDue)}</p>
          <p className="text-xs text-muted-foreground mt-1.5">Across all enrolled students</p>
        </div>

        <div className={`glass-panel p-5 border ${overdueCount > 0 ? 'border-rose-500/40 bg-rose-500/5' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Overdue Dues</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-500 font-heading">{overdueCount} Students</p>
          <p className="text-xs text-muted-foreground mt-1.5">Exceeded payment deadline</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Concessions Given</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground font-heading">{formatCurrency(concessions)}</p>
          <p className="text-xs text-muted-foreground mt-1.5">Approved scholarships & waivers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Collection Trend */}
        <div className="lg:col-span-3 glass-panel p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-glass-border">
            <h3 className="text-base font-bold text-foreground font-heading">Collection Trend</h3>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-3 h-52">
              {COLLECTION_TREND.map(item => {
                const height = (item.amount / maxAmount) * 100;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-semibold font-mono">
                      {formatCurrency(item.amount).replace('₹', '₹')}
                    </span>
                    <div className="w-full glass-subtle rounded-t-xl overflow-hidden" style={{ height: '100%' }}>
                      <div
                        className="w-full bg-gradient-to-t from-brand to-brand/80 rounded-t-xl transition-all hover:brightness-110 shadow-sm"
                        style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-bold">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overdue List */}
        <div className="lg:col-span-2 glass-panel p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-glass-border flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground font-heading">Overdue Students</h3>
            <span className="px-2.5 py-0.5 bg-rose-500/15 text-rose-600 text-xs font-bold rounded-full">{overdueCount}</span>
          </div>
          <div className="divide-y divide-glass-border">
            {DEMO_OVERDUE.map(student => (
              <div key={student.id} className="px-5 py-4 glass-card-interactive hover:bg-card/80 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold font-heading shadow-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.admNo} • {student.course}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold font-mono text-rose-500">{formatCurrency(student.dueAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
