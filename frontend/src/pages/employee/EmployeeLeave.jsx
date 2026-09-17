import { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle, User, Loader2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';

const LEAVE_TYPES = [
  { type: 'Casual Leave', total: 12, used: 4, color: 'brand' },
  { type: 'Sick Leave', total: 10, used: 2, color: 'amber' },
  { type: 'Earned Leave', total: 15, used: 0, color: 'emerald' },
  { type: 'Comp Off', total: 3, used: 1, color: 'sky' },
];

const DEMO_LEAVES = [
  { id: 1, employee: 'Self', type: 'Casual Leave', from: '2026-08-25', to: '2026-08-26', days: 2, reason: 'Personal work', status: 'pending', appliedOn: '2026-08-20' },
  { id: 2, employee: 'Self', type: 'Sick Leave', from: '2026-08-10', to: '2026-08-11', days: 2, reason: 'Unwell', status: 'approved', appliedOn: '2026-08-09', approvedBy: 'Dr. Kumar' },
  { id: 3, employee: 'Self', type: 'Casual Leave', from: '2026-07-15', to: '2026-07-15', days: 1, reason: 'Family function', status: 'approved', appliedOn: '2026-07-12', approvedBy: 'Dr. Kumar' },
  { id: 4, employee: 'Self', type: 'Casual Leave', from: '2026-06-20', to: '2026-06-20', days: 1, reason: 'Bank work', status: 'rejected', appliedOn: '2026-06-18', remarks: 'Critical week' },
];

const TEAM_REQUESTS = [
  { id: 5, employee: 'Prof. Sharma', type: 'Sick Leave', from: '2026-08-22', to: '2026-08-23', days: 2, reason: 'Medical appointment', status: 'pending', appliedOn: '2026-08-20' },
  { id: 6, employee: 'Dr. Reddy', type: 'Earned Leave', from: '2026-09-01', to: '2026-09-05', days: 5, reason: 'Vacation', status: 'pending', appliedOn: '2026-08-19' },
];

export default function EmployeeLeave() {
  const toast = useToast();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [myLeaves, setMyLeaves] = useState(DEMO_LEAVES);
  const [teamRequests, setTeamRequests] = useState(TEAM_REQUESTS);
  const [form, setForm] = useState({ type: '', from: '', to: '', reason: '' });
  const [saving, setSaving] = useState(false);

  const handleApply = () => {
    if (!form.type || !form.from || !form.to || !form.reason) { toast.warning('Fill all fields'); return; }
    setSaving(true);
    setTimeout(() => {
      const days = Math.max(1, Math.ceil((new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24)) + 1);
      setMyLeaves(prev => [{ id: Date.now(), employee: 'Self', ...form, days, status: 'pending', appliedOn: new Date().toISOString().split('T')[0] }, ...prev]);
      setShowApplyModal(false);
      setForm({ type: '', from: '', to: '', reason: '' });
      setSaving(false);
      toast.success('Leave application submitted');
    }, 500);
  };

  const handleApprove = (id) => {
    setTeamRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    toast.success('Leave approved');
  };

  const handleReject = (id) => {
    setTeamRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    toast.success('Leave rejected');
  };

  const myTab = (
    <div className="space-y-4">
      {/* Leave Balance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {LEAVE_TYPES.map(lt => (
          <div key={lt.type} className="glass-panel p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">{lt.type}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-foreground font-heading">
                {lt.total - lt.used}
                <span className="text-xs text-muted-foreground font-normal">/{lt.total}</span>
              </p>
              <span className="text-xs text-muted-foreground">{lt.used} used</span>
            </div>
            <div className="w-full h-1.5 glass-subtle rounded-full mt-3 overflow-hidden">
              <div className="h-full rounded-full bg-brand" style={{ width: `${(lt.used / lt.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* My Applications */}
      <div className="glass-panel p-0 divide-y divide-glass-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-glass-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground font-heading">My Applications</h3>
          <span className="text-xs text-muted-foreground">{myLeaves.length} Records</span>
        </div>
        {myLeaves.map(leave => (
          <div key={leave.id} className="px-5 py-4 glass-card-interactive hover:bg-card/80 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{leave.type}</span>
                  <span className="text-xs text-muted-foreground">• {leave.days} day{leave.days > 1 ? 's' : ''}</span>
                </div>
                <p className="text-xs text-muted-foreground">{leave.from}{leave.from !== leave.to ? ` — ${leave.to}` : ''}</p>
                <p className="text-xs text-foreground/80 mt-1">{leave.reason}</p>
              </div>
              <StatusBadge
                status={leave.status === 'approved' ? 'active' : leave.status === 'rejected' ? 'danger' : 'pending'}
                label={leave.status}
              />
            </div>
            {leave.approvedBy && <p className="text-xs text-muted-foreground mt-2">Approved by: {leave.approvedBy}</p>}
            {leave.remarks && <p className="text-xs text-destructive mt-2">Remark: {leave.remarks}</p>}
          </div>
        ))}
      </div>
    </div>
  );

  const teamTab = (
    <div className="glass-panel p-0 divide-y divide-glass-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-glass-border flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground font-heading">Team Leave Requests</h3>
        <span className="text-xs text-muted-foreground">{teamRequests.length} Pending</span>
      </div>
      {teamRequests.map(req => (
        <div key={req.id} className="px-5 py-4 glass-card-interactive hover:bg-card/80 transition-colors flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-foreground">{req.employee}</span>
              <span className="text-xs px-2 py-0.5 rounded-md glass-subtle text-brand font-medium">{req.type}</span>
            </div>
            <p className="text-xs text-muted-foreground">{req.from} — {req.to} ({req.days} days)</p>
            <p className="text-xs text-foreground/80 mt-1">Reason: {req.reason}</p>
          </div>
          <div className="flex items-center gap-2">
            {req.status === 'pending' ? (
              <>
                <button onClick={() => handleApprove(req.id)} className="secondary-button p-2 text-emerald-600 hover:text-emerald-700" title="Approve">
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button onClick={() => handleReject(req.id)} className="secondary-button p-2 text-rose-500 hover:text-rose-600" title="Reject">
                  <XCircle className="w-5 h-5" />
                </button>
              </>
            ) : (
              <StatusBadge status={req.status === 'approved' ? 'active' : 'danger'} label={req.status} />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Leave Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track leave balances and submit requests</p>
        </div>
        <button onClick={() => setShowApplyModal(true)} className="primary-button text-sm px-4 py-2.5 inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Apply Leave
        </button>
      </div>

      <Tabs
        tabs={[
          { id: 'my', label: 'My Leaves', content: myTab },
          { id: 'team', label: 'Team Requests', content: teamTab },
        ]}
      />

      {/* Apply Leave Modal */}
      <Modal open={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Leave">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Leave Type</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="">Select leave type</option>
              {LEAVE_TYPES.map(t => <option key={t.type} value={t.type}>{t.type} ({t.total - t.used} available)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">From Date</label>
              <input
                type="date"
                value={form.from}
                onChange={e => setForm({ ...form, from: e.target.value })}
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">To Date</label>
              <input
                type="date"
                value={form.to}
                onChange={e => setForm({ ...form, to: e.target.value })}
                className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Reason</label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              placeholder="Provide reason for leave..."
              className="w-full px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowApplyModal(false)} className="secondary-button text-xs px-4 py-2">Cancel</button>
            <button onClick={handleApply} disabled={saving} className="primary-button text-xs px-4 py-2 inline-flex items-center gap-1.5">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Submit Application
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
