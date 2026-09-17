import { useState } from 'react';
import { FileText, Search, Download, Calendar, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v) || 0);
}
function formatDate(d) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));
}

const DEMO_LEDGER = [
  { id: 1, date: '2026-08-20', student: 'Aarav Sharma', admNo: 'STU-001', type: 'Payment', amount: 35000, receiptNo: 'REC-1001', method: 'Cash' },
  { id: 2, date: '2026-08-19', student: 'Priya Patel', admNo: 'STU-002', type: 'Payment', amount: 42000, receiptNo: 'REC-1002', method: 'Online' },
  { id: 3, date: '2026-08-19', student: 'Sneha Gupta', admNo: 'STU-004', type: 'Payment', amount: 28000, receiptNo: 'REC-1003', method: 'Card' },
  { id: 4, date: '2026-08-18', student: 'Vikram Singh', admNo: 'STU-005', type: 'Payment', amount: 15000, receiptNo: 'REC-1004', method: 'Cash' },
  { id: 5, date: '2026-08-18', student: 'Vikram Singh', admNo: 'STU-005', type: 'Reversal', amount: -15000, receiptNo: 'REC-1004-R', method: 'Reversal', originalRef: 'REC-1004' },
  { id: 6, date: '2026-08-17', student: 'Rohit Kumar', admNo: 'STU-003', type: 'Payment', amount: 20000, receiptNo: 'REC-1005', method: 'Cheque' },
  { id: 7, date: '2026-08-16', student: 'Ananya Mishra', admNo: 'STU-006', type: 'Payment', amount: 50000, receiptNo: 'REC-1006', method: 'Online' },
  { id: 8, date: '2026-08-15', student: 'Karan Joshi', admNo: 'STU-007', type: 'Payment', amount: 18000, receiptNo: 'REC-1007', method: 'Cash' },
];

export default function FeeLedger() {
  const toast = useToast();
  const [entries, setEntries] = useState(DEMO_LEDGER);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showReversalModal, setShowReversalModal] = useState(false);
  const [reverseEntry, setReverseEntry] = useState(null);
  const [reverseReason, setReverseReason] = useState('');

  const filtered = entries.filter(e => {
    const matchSearch = !search || e.student.toLowerCase().includes(search.toLowerCase()) || e.admNo.toLowerCase().includes(search.toLowerCase()) || e.receiptNo.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPayments = entries.filter(e => e.type === 'Payment').reduce((s, e) => s + e.amount, 0);
  const totalReversals = entries.filter(e => e.type === 'Reversal').reduce((s, e) => s + Math.abs(e.amount), 0);

  const handleReverse = () => {
    if (!reverseEntry || !reverseReason.trim()) {
      toast.warning('Reason is required for reversal');
      return;
    }
    const newReversal = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      student: reverseEntry.student,
      admNo: reverseEntry.admNo,
      type: 'Reversal',
      amount: -reverseEntry.amount,
      receiptNo: `${reverseEntry.receiptNo}-R`,
      method: 'Reversal',
      originalRef: reverseEntry.receiptNo,
    };
    setEntries(prev => [newReversal, ...prev]);
    setShowReversalModal(false);
    setReverseEntry(null);
    setReverseReason('');
    toast.success('Payment reversed (new reversal entry created)');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Fee Ledger / Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Immutable transaction log — entries cannot be edited or deleted</p>
        </div>
        <button className="secondary-button text-xs font-semibold px-4 py-2.5 inline-flex items-center gap-2">
          <Download className="w-4 h-4 text-brand" /> Export Ledger
        </button>
      </div>

      {/* Summary Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 text-center">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Total Payments</p>
          <p className="text-2xl font-bold text-emerald-600 font-heading">{formatCurrency(totalPayments)}</p>
        </div>
        <div className="glass-panel p-5 text-center">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Reversals</p>
          <p className="text-2xl font-bold text-rose-500 font-heading">{formatCurrency(totalReversals)}</p>
        </div>
        <div className="glass-panel p-5 text-center">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Net Collection</p>
          <p className="text-2xl font-bold text-foreground font-heading">{formatCurrency(totalPayments - totalReversals)}</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pb-2 border-b border-glass-border">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student, admission no, or receipt..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="Payment">Payments Only</option>
            <option value="Reversal">Reversals Only</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Receipt No</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filtered.map(entry => (
                <tr key={entry.id} className="glass-card-interactive hover:bg-card/80 transition-all">
                  <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{formatDate(entry.date)}</td>
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-foreground">{entry.receiptNo}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-foreground">{entry.student}</p>
                    <p className="text-xs text-muted-foreground">{entry.admNo}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={entry.type === 'Payment' ? 'active' : 'danger'} label={entry.type} size="xs" />
                  </td>
                  <td className="px-5 py-3.5 text-foreground/80 text-xs font-medium">{entry.method}</td>
                  <td className={`px-5 py-3.5 text-right font-mono font-bold ${entry.amount < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {entry.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(entry.amount))}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {entry.type === 'Payment' && (
                      <button
                        onClick={() => { setReverseEntry(entry); setShowReversalModal(true); }}
                        className="secondary-button text-xs px-2.5 py-1 text-rose-500 hover:text-rose-600 inline-flex items-center gap-1"
                        title="Reverse Transaction"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reverse
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reversal Confirmation Modal */}
      <Modal open={showReversalModal} onClose={() => setShowReversalModal(false)} title="Reverse Payment Transaction">
        {reverseEntry && (
          <div className="space-y-4">
            <div className="glass-panel p-4 space-y-2 border border-rose-500/30 bg-rose-500/5">
              <p className="text-xs font-bold text-rose-600 uppercase">Warning: Immutable Action</p>
              <p className="text-xs text-muted-foreground">
                Reversing transaction <strong className="text-foreground">{reverseEntry.receiptNo}</strong> ({formatCurrency(reverseEntry.amount)}) for <strong className="text-foreground">{reverseEntry.student}</strong> will create an offsetting negative ledger entry.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Reason for Reversal *</label>
              <textarea
                rows={3}
                value={reverseReason}
                onChange={e => setReverseReason(e.target.value)}
                placeholder="Specify audit/correction reason..."
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowReversalModal(false)} className="secondary-button text-xs px-4 py-2">Cancel</button>
              <button onClick={handleReverse} className="primary-button bg-rose-600 hover:bg-rose-500 text-xs px-4 py-2">
                Confirm Reversal
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
