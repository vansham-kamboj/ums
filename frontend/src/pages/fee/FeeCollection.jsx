import { useState, useRef } from 'react';
import { Search, DollarSign, Receipt, Loader2, Printer, Download, CreditCard, Banknote, Globe, FileText, X, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SearchInput from '../../components/ui/SearchInput';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v) || 0);
}
function formatDate(d) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d));
}

function feeStatus(fee) {
  const balance = Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0) - Number(fee.concessionAmount || 0);
  if (balance <= 0) return 'paid';
  if (fee.records?.some(r => r.dueDate && new Date(r.dueDate) < new Date() && r.status !== 'PAID')) return 'overdue';
  return 'due';
}

export default function FeeCollection() {
  const toast = useToast();
  const receiptRef = useRef(null);

  // State
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [selectedFeeIds, setSelectedFeeIds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [partialAmount, setPartialAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const searchStudents = async (q) => {
    const res = await api.get('/students', { params: { search: q, limit: 10 } });
    const data = Array.isArray(res.data.data) ? res.data.data : [];
    return data;
  };

  const selectStudent = async (s) => {
    setStudent(s);
    setSelectedFeeIds([]);
    setReceipt(null);
    setLoading(true);
    try {
      const res = await api.get('/fees/student-fees', { params: { studentId: s.id } });
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setFees(data);
    } catch { setFees([]); }
    finally { setLoading(false); }
  };

  const toggleFee = (id) => {
    setSelectedFeeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setPartialAmount('');
  };

  const selectedFees = fees.filter(f => selectedFeeIds.includes(f.id));
  const totalDue = selectedFees.reduce((sum, f) => {
    const bal = Number(f.totalAmount || 0) - Number(f.paidAmount || 0) - Number(f.concessionAmount || 0);
    return sum + Math.max(0, bal);
  }, 0);
  const payAmount = partialAmount ? Math.min(Number(partialAmount), totalDue) : totalDue;
  const changeDue = paymentMethod === 'cash' && partialAmount ? Math.max(0, Number(partialAmount) - totalDue) : 0;

  const handleCollect = async () => {
    if (selectedFeeIds.length === 0) { toast.warning('Select at least one fee'); return; }
    if (paymentMethod === 'cheque' && !chequeNumber) { toast.warning('Enter cheque number'); return; }
    setCollecting(true);
    try {
      const res = await api.post('/fees/payments', {
        studentId: student.id,
        feeIds: selectedFeeIds,
        amount: payAmount,
        paymentMethod,
        chequeNumber: paymentMethod === 'cheque' ? chequeNumber : undefined,
        bankName: paymentMethod === 'cheque' ? bankName : undefined,
      });
      const payment = res.data.data;
      toast.success('Payment collected successfully!');

      setReceipt({
        receiptNumber: payment.receiptNumber || `REC-${Date.now()}`,
        date: new Date(),
        student,
        items: selectedFees.map(f => ({
          name: f.feeHead?.name || f.feeStructure?.name || 'Fee',
          amount: Number(f.totalAmount || 0) - Number(f.paidAmount || 0) - Number(f.concessionAmount || 0),
        })),
        concession: selectedFees.reduce((s, f) => s + Number(f.concessionAmount || 0), 0),
        totalPaid: payAmount,
        paymentMethod,
      });

      // Refresh student fees
      selectStudent(student);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to collect payment');
    } finally { setCollecting(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Fee Collection counter</h1>
          <p className="text-sm text-muted-foreground mt-1">Search student, view pending dues, and collect payments</p>
        </div>
      </div>

      {/* Search Bar Panel */}
      <div className="glass-panel p-6 space-y-3">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Student</label>
        <SearchInput
          placeholder="Search by student name, roll number, or admission number..."
          onSearch={searchStudents}
          onSelect={selectStudent}
          renderItem={(s) => (
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="text-sm font-bold text-foreground">{s.firstName} {s.lastName}</p>
                <p className="text-xs text-muted-foreground">{s.admissionNumber || s.rollNumber} • {s.academicClass?.name || 'Class'}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand/15 text-brand">Select</span>
            </div>
          )}
        />
      </div>

      {/* Main Counter Layout */}
      {student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dues Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="brand-mark w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-bold font-heading shadow-md">
                  {student.firstName?.[0]}{student.lastName?.[0] || ''}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground font-heading">{student.firstName} {student.lastName}</h2>
                  <p className="text-xs text-muted-foreground">{student.admissionNumber} • {student.academicClass?.name || 'Student'}</p>
                </div>
              </div>
              <button onClick={() => setStudent(null)} className="secondary-button text-xs px-3 py-1.5">Change</button>
            </div>

            <div className="glass-panel p-0 overflow-hidden">
              <div className="p-4 border-b border-glass-border flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground font-heading">Fee Dues Schedule</h3>
                <span className="text-xs text-muted-foreground">{fees.length} Fee heads</span>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-3 border-brand/30 border-t-brand rounded-full animate-spin mx-auto" />
                </div>
              ) : fees.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-sm">No fee records found for this student.</div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                      <th className="px-5 py-3 w-12">Select</th>
                      <th className="px-5 py-3">Fee Head</th>
                      <th className="px-5 py-3 text-right">Total</th>
                      <th className="px-5 py-3 text-right">Paid</th>
                      <th className="px-5 py-3 text-right">Balance</th>
                      <th className="px-5 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {fees.map(f => {
                      const balance = Number(f.totalAmount || 0) - Number(f.paidAmount || 0) - Number(f.concessionAmount || 0);
                      const isPaid = balance <= 0;
                      const isSelected = selectedFeeIds.includes(f.id);

                      return (
                        <tr
                          key={f.id}
                          onClick={() => !isPaid && toggleFee(f.id)}
                          className={`glass-card-interactive transition-all ${
                            isPaid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-card/80'
                          } ${isSelected ? 'bg-brand/10' : ''}`}
                        >
                          <td className="px-5 py-3.5">
                            <input
                              type="checkbox"
                              disabled={isPaid}
                              checked={isSelected}
                              onChange={() => toggleFee(f.id)}
                              className="rounded border-glass-border text-brand focus:ring-brand/30"
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-foreground">{f.feeHead?.name || f.feeStructure?.name || 'Fee'}</p>
                            <p className="text-xs text-muted-foreground">{f.academicSession?.name || 'Term Fee'}</p>
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-xs text-foreground/80">{formatCurrency(f.totalAmount)}</td>
                          <td className="px-5 py-3.5 text-right font-mono text-xs text-emerald-600">{formatCurrency(f.paidAmount)}</td>
                          <td className="px-5 py-3.5 text-right font-mono font-bold text-foreground">{formatCurrency(balance)}</td>
                          <td className="px-5 py-3.5 text-center">
                            <StatusBadge status={isPaid ? 'active' : 'pending'} label={isPaid ? 'Paid' : 'Due'} size="xs" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Payment Terminal Panel */}
          <div className="space-y-4">
            <div className="glass-panel p-6 space-y-4 sticky top-6">
              <h3 className="text-base font-bold text-foreground font-heading border-b border-glass-border pb-3">Collect Payment</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Selected Fee Count:</span>
                  <span className="font-bold text-foreground">{selectedFees.length}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-1">
                  <span>Total Amount Due:</span>
                  <span className="font-mono text-brand text-xl">{formatCurrency(totalDue)}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash', label: 'Cash', icon: Banknote },
                    { id: 'online', label: 'Online', icon: Globe },
                    { id: 'cheque', label: 'Cheque', icon: CreditCard },
                  ].map(m => {
                    const Icon = m.icon;
                    const active = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                          active ? 'bg-brand text-white border-brand shadow-md' : 'glass-subtle text-muted-foreground border-glass-border hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cheque / Bank Details */}
              {paymentMethod === 'cheque' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Cheque Number</label>
                    <input
                      type="text"
                      value={chequeNumber}
                      onChange={e => setChequeNumber(e.target.value)}
                      placeholder="e.g. 000124"
                      className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Partial Amount */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Paying Amount (Optional Partial)</label>
                <input
                  type="number"
                  value={partialAmount}
                  onChange={e => setPartialAmount(e.target.value)}
                  placeholder={formatCurrency(totalDue)}
                  className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground font-mono focus:outline-none"
                />
              </div>

              {/* Change calculation for Cash */}
              {changeDue > 0 && (
                <div className="glass-subtle p-3 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Return Change:</span>
                  <span className="font-bold font-mono text-emerald-600">{formatCurrency(changeDue)}</span>
                </div>
              )}

              <button
                onClick={handleCollect}
                disabled={collecting || selectedFeeIds.length === 0}
                className="primary-button w-full py-3 text-sm font-bold inline-flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {collecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                Confirm Payment ({formatCurrency(payAmount)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Printable Modal */}
      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Fee Payment Receipt">
        {receipt && (
          <div className="space-y-4">
            <div ref={receiptRef} className="glass-panel p-6 space-y-4 bg-white/90 text-slate-800 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">University Management System</h2>
                  <p className="text-xs text-slate-500">Official Fee Payment Receipt</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-slate-800">{receipt.receiptNumber}</p>
                  <p className="text-[11px] text-slate-500">{formatDate(receipt.date)}</p>
                </div>
              </div>

              <div className="text-xs space-y-1 py-1">
                <p><span className="text-slate-500">Student Name:</span> <strong className="text-slate-900">{receipt.student?.firstName} {receipt.student?.lastName}</strong></p>
                <p><span className="text-slate-500">Admission No:</span> <strong className="text-slate-900">{receipt.student?.admissionNumber}</strong></p>
                <p><span className="text-slate-500">Payment Mode:</span> <span className="uppercase font-bold text-slate-700">{receipt.paymentMethod}</span></p>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 uppercase font-semibold">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {receipt.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 text-slate-800">{item.name}</td>
                      <td className="py-2 text-right font-mono text-slate-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-300 pt-3 flex justify-between items-center text-sm font-bold">
                <span>Total Paid Amount:</span>
                <span className="font-mono text-emerald-700 text-base">{formatCurrency(receipt.totalPaid)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => window.print()} className="secondary-button text-xs px-4 py-2 inline-flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button onClick={() => setReceipt(null)} className="primary-button text-xs px-4 py-2">Done</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
