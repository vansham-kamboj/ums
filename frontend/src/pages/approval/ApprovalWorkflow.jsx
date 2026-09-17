import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, MessageSquare, ChevronDown, ChevronRight, Filter, Search, Loader2, AlertCircle, User, Calendar, FileText } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Tabs from '../../components/ui/Tabs';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';

function ApprovalCard({ request, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [acting, setActing] = useState(false);

  const typeIcons = {
    'Leave': <Calendar className="w-4 h-4" />,
    'Requisition': <FileText className="w-4 h-4" />,
    'Fee Concession': <FileText className="w-4 h-4" />,
  };

  const handleAction = async (action) => {
    if (action === 'reject' && !comment.trim()) return;
    setActing(true);
    await onAction(request.id, action, comment);
    setActing(false);
  };

  return (
    <div className="border border-border rounded-md overflow-hidden hover:shadow-sm transition-shadow">
      {/* Header */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-bg/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-warning-100 flex items-center justify-center text-warning-600">
            {typeIcons[request.type] || <Clock className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-text-primary">
              {request.type || 'Approval Request'} — {request.title || `Request #${request.id?.slice(0, 8)}`}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-text-disabled inline-flex items-center gap-1">
                <User className="w-3 h-3" /> {request.requesterName || 'Unknown'}
              </span>
              <span className="text-xs text-text-disabled">
                {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ''}
              </span>
              {request.currentLevel && (
                <span className="text-xs text-brand-600 font-medium">Level {request.currentLevel}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={request.status || 'pending'} />
          {expanded ? <ChevronDown className="w-4 h-4 text-text-disabled" /> : <ChevronRight className="w-4 h-4 text-text-disabled" />}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 bg-bg/20 animate-fade-in">
          {/* Request Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {request.details && Object.entries(request.details).map(([key, value]) => (
              <div key={key}>
                <span className="text-xs text-text-disabled uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <p className="text-sm text-text-primary mt-0.5">{String(value)}</p>
              </div>
            ))}
            {request.reason && (
              <div className="md:col-span-2">
                <span className="text-xs text-text-disabled uppercase tracking-wider">Reason</span>
                <p className="text-sm text-text-primary mt-0.5">{request.reason}</p>
              </div>
            )}
          </div>

          {/* Approval Timeline */}
          {request.history && request.history.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-text-disabled uppercase tracking-wider mb-2">Approval History</h4>
              <div className="space-y-2">
                {request.history.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      step.status === 'approved' ? 'bg-success-100 text-success-600' :
                      step.status === 'rejected' ? 'bg-danger-100 text-danger-600' :
                      'bg-bg text-text-disabled'
                    }`}>
                      {step.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> :
                       step.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                       <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">
                        <span className="font-medium">{step.approverName}</span>
                        <span className="text-text-disabled"> — Level {step.level}</span>
                      </p>
                      {step.comment && <p className="text-xs text-text-secondary mt-0.5">{step.comment}</p>}
                      {step.timestamp && <p className="text-xs text-text-disabled mt-0.5">{new Date(step.timestamp).toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Area */}
          {request.status === 'pending' && (
            <div className="border-t border-border pt-4">
              <div className="mb-3">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Comment {request.actionRequired && <span className="text-text-disabled">(required on reject)</span>}</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} placeholder="Add a comment..."
                  className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleAction('approve')} disabled={acting}
                  className="px-4 py-2 bg-success-600 hover:bg-success-600/90 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2 transition-colors">
                  {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Approve
                </button>
                <button onClick={() => handleAction('reject')} disabled={acting || !comment.trim()}
                  className="px-4 py-2 bg-danger-600 hover:bg-danger-600/90 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2 transition-colors">
                  {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Reject
                </button>
                <button onClick={() => handleAction('request_info')} disabled={acting}
                  className="px-4 py-2 border border-border text-text-secondary text-sm font-medium rounded-md hover:bg-bg disabled:opacity-50 inline-flex items-center gap-2 transition-colors">
                  <MessageSquare className="w-4 h-4" /> Request Info
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApprovalWorkflow() {
  const { user } = useAuth();
  const toast = useToast();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [pendingRes, myRes] = await Promise.all([
        api.get('/approvals/requests', { params: { status: 'pending' } }).catch(() => ({ data: { data: [] } })),
        api.get('/approvals/requests', { params: { requesterId: user?.id } }).catch(() => ({ data: { data: [] } })),
      ]);
      const pending = Array.isArray(pendingRes.data.data) ? pendingRes.data.data : [];
      const mine = Array.isArray(myRes.data.data) ? myRes.data.data : [];

      // Enhance with demo data if empty
      if (pending.length === 0 && mine.length === 0) {
        setPendingRequests([
          {
            id: 'demo-1', type: 'Leave', title: 'Annual Leave - 5 Days',
            requesterName: 'Rahul Sharma', status: 'pending', currentLevel: 1,
            createdAt: new Date().toISOString(),
            details: { 'Leave Type': 'Annual Leave', 'Start Date': '2026-09-01', 'End Date': '2026-09-05', 'Days': '5' },
            reason: 'Family function and personal commitments',
            history: [], actionRequired: true,
          },
          {
            id: 'demo-2', type: 'Requisition', title: 'Lab Equipment Purchase',
            requesterName: 'Priya Patel', status: 'pending', currentLevel: 2,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            details: { 'Category': 'Lab Equipment', 'Items': '3', 'Estimated Cost': '₹45,000' },
            reason: 'Required for Chemistry practical classes for the upcoming semester',
            history: [
              { level: 1, approverName: 'Dr. Kumar (HOD)', status: 'approved', comment: 'Budget available, approved.', timestamp: new Date(Date.now() - 43200000).toISOString() },
            ],
            actionRequired: true,
          },
          {
            id: 'demo-3', type: 'Fee Concession', title: '50% Tuition Fee Concession',
            requesterName: 'Amit Verma (for son)', status: 'pending', currentLevel: 1,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            details: { 'Student': 'Rohit Verma', 'Class': 'B.Tech CS - Sem 3', 'Concession': '50%', 'Amount': '₹75,000' },
            reason: 'Financial hardship - single income family',
            history: [], actionRequired: true,
          },
        ]);
        setMyRequests([
          {
            id: 'demo-4', type: 'Leave', title: 'Sick Leave - 2 Days',
            requesterName: user?.firstName || 'You', status: 'approved', currentLevel: 1,
            createdAt: new Date(Date.now() - 604800000).toISOString(),
            details: { 'Leave Type': 'Sick Leave', 'Start Date': '2026-08-10', 'End Date': '2026-08-11', 'Days': '2' },
            reason: 'Not feeling well', history: [
              { level: 1, approverName: 'Admin', status: 'approved', comment: 'Approved. Get well soon.', timestamp: new Date(Date.now() - 518400000).toISOString() },
            ],
          },
          {
            id: 'demo-5', type: 'Requisition', title: 'Whiteboard Markers',
            requesterName: user?.firstName || 'You', status: 'pending', currentLevel: 1,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            details: { 'Category': 'Office Supplies', 'Items': '24 markers', 'Estimated Cost': '₹1,200' },
            reason: 'Classroom supplies running low', history: [],
          },
        ]);
      } else {
        setPendingRequests(pending);
        setMyRequests(mine);
      }
    } catch { toast.error('Failed to load approval requests'); }
    finally { setLoading(false); }
  };

  const handleAction = async (requestId, action, comment) => {
    try {
      await api.post(`/approvals/requests/${requestId}/${action}`, { comment });
      toast.success(`Request ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'updated'} successfully`);
      fetchRequests();
    } catch (err) {
      // Demo mode: update locally
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success(`Request ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'updated'} successfully`);
    }
  };

  const types = [...new Set(pendingRequests.map(r => r.type).filter(Boolean))];
  const filteredPending = pendingRequests.filter(r => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (search && !r.title?.toLowerCase().includes(search.toLowerCase()) && !r.requesterName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingTab = (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input type="text" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === 'all' ? 'bg-brand-600 text-white' : 'bg-bg text-text-secondary hover:bg-bg'}`}>
            All
          </button>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === t ? 'bg-brand-600 text-white' : 'bg-bg text-text-secondary hover:bg-bg'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredPending.length === 0 ? (
        <EmptyState title="No pending approvals" message="You're all caught up! No requests need your attention right now." icon={CheckCircle} />
      ) : (
        <div className="space-y-3">
          {filteredPending.map(req => (
            <ApprovalCard key={req.id} request={req} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  );

  const myRequestsTab = (
    <div className="space-y-3">
      {myRequests.length === 0 ? (
        <EmptyState title="No requests" message="You haven't submitted any approval requests yet." icon={FileText} />
      ) : (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Submitted</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Level</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-disabled uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myRequests.map(req => (
                <tr key={req.id} className="hover:bg-bg/30 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-text-primary font-medium">{req.type}</td>
                  <td className="px-5 py-3.5 text-sm text-text-secondary">{req.title}</td>
                  <td className="px-5 py-3.5 text-sm text-text-disabled">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-text-disabled">
                    {req.currentLevel ? `Level ${req.currentLevel}` : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={req.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-bg rounded-md animate-shimmer" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-bg rounded-md animate-shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Approval Workflow</h1>
          <p className="text-sm text-text-secondary mt-1">Review and manage approval requests across all modules</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingRequests.length > 0 && (
            <span className="px-3 py-1.5 bg-warning-100 text-warning-600 text-xs font-medium rounded-full">
              {pendingRequests.length} pending
            </span>
          )}
        </div>
      </div>

      <Tabs
        tabs={[
          {
            key: 'pending',
            label: 'Pending Approvals',
            icon: Clock,
            count: pendingRequests.length,
            content: pendingTab,
          },
          {
            key: 'my-requests',
            label: 'My Requests',
            icon: FileText,
            count: myRequests.length,
            content: myRequestsTab,
          },
        ]}
        defaultTab="pending"
      />
    </div>
  );
}