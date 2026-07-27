import { useState } from 'react';
import { Search, DollarSign, Receipt, Loader2, Printer } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function FeeCollection() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [collecting, setCollecting] = useState(false);

  const searchStudent = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/students', { params: { search: searchQuery, limit: 1 } });
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      if (list.length > 0) {
        setStudent(list[0]);
        // Fetch student fees
        try {
          const feeRes = await api.get(`/fees/student-fees`, { params: { studentId: list[0].id } });
          setFees(Array.isArray(feeRes.data.data) ? feeRes.data.data : []);
        } catch { setFees([]); }
      } else {
        toast.warning('No student found');
        setStudent(null);
        setFees([]);
      }
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const toggleFee = (feeId) => {
    setSelectedFees(prev => prev.includes(feeId) ? prev.filter(id => id !== feeId) : [...prev, feeId]);
  };

  const totalSelected = fees.filter(f => selectedFees.includes(f.id)).reduce((sum, f) => sum + (Number(f.totalAmount) - Number(f.paidAmount || 0)), 0);

  const handleCollect = async () => {
    if (selectedFees.length === 0) { toast.warning('Select at least one fee to collect'); return; }
    setCollecting(true);
    try {
      await api.post('/fees/payments', {
        studentId: student.id,
        feeIds: selectedFees,
        amount: totalSelected,
        paymentMethod,
      });
      toast.success('Payment collected successfully!');
      setSelectedFees([]);
      // Refresh fees
      const feeRes = await api.get(`/fees/student-fees`, { params: { studentId: student.id } });
      setFees(Array.isArray(feeRes.data.data) ? feeRes.data.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to collect payment');
    } finally { setCollecting(false); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Fee Collection</h2>
        <p className="text-sm text-text-secondary mt-0.5">Search for a student and collect fees</p>
      </div>

      {/* Search */}
      <div className="bg-surface rounded-md border border-border p-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
            <input
              type="text"
              placeholder="Search by name, admission number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchStudent()}
              className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <button onClick={searchStudent} disabled={loading}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md text-sm disabled:opacity-50 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Student Info */}
          <div className="bg-surface rounded-md border border-border p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold">
                {(student.firstName?.[0] || '') + (student.lastName?.[0] || '')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{student.firstName} {student.lastName}</h3>
                <p className="text-sm text-text-secondary">{student.admissionNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Email</span><span className="font-medium">{student.email || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Phone</span><span className="font-medium">{student.phone || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Course</span><span className="font-medium">{student.course?.name || 'N/A'}</span></div>
            </div>
          </div>

          {/* Fee List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface rounded-md border border-border overflow-hidden">
              <div className="px-5 py-3 bg-bg border-b border-border flex justify-between items-center">
                <h3 className="text-sm font-semibold text-text-secondary">Fee Details</h3>
                <span className="text-xs text-text-disabled">{fees.length} fee(s) found</span>
              </div>
              {fees.length === 0 ? (
                <div className="p-8 text-center text-text-disabled text-sm">No fees allocated for this student</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {fees.map(fee => {
                    const balance = Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0);
                    const isPaid = balance <= 0;
                    return (
                      <div key={fee.id} className={`flex items-center gap-4 px-5 py-3 ${isPaid ? 'opacity-50' : 'hover:bg-bg'}`}>
                        <input type="checkbox" disabled={isPaid} checked={selectedFees.includes(fee.id)} onChange={() => toggleFee(fee.id)}
                          className="w-4 h-4 rounded border-border text-brand-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">{fee.feeStructure?.name || 'Fee'}</p>
                          <p className="text-xs text-text-disabled">Total: ₹{Number(fee.totalAmount || 0).toLocaleString()} | Paid: ₹{Number(fee.paidAmount || 0).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${isPaid ? 'text-success-600' : 'text-danger-600'}`}>
                            {isPaid ? 'Paid' : `₹${balance.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment */}
            {totalSelected > 0 && (
              <div className="bg-surface rounded-md border border-border p-5 animate-slide-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-text-primary">Payment Summary</h3>
                  <p className="text-2xl font-bold text-brand-600">₹{totalSelected.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium text-text-secondary">Payment Method:</label>
                  <div className="flex gap-2">
                    {['cash', 'card', 'online', 'cheque'].map(method => (
                      <button key={method} onClick={() => setPaymentMethod(method)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border capitalize transition-all ${
                          paymentMethod === method ? 'bg-brand-100 border-primary-500 text-brand-600' : 'border-border text-text-secondary hover:border-border'
                        }`}>
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCollect} disabled={collecting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-success-600 hover:bg-success-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors">
                    {collecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                    {collecting ? 'Processing...' : 'Collect Payment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
