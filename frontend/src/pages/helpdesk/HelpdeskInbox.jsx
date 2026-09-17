import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MessageSquare, Send, Clock, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import SplitPanel from '../../components/ui/SplitPanel';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

function formatDate(d) {
  if (!d) return '';
  return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
}

function getPriorityColor(p) {
  switch (p?.toLowerCase()) {
    case 'high': return 'text-danger-600 bg-danger-100';
    case 'medium': return 'text-warning-600 bg-warning-100';
    case 'low': return 'text-success-600 bg-success-100';
    default: return 'text-text-secondary bg-surface';
  }
}

export default function HelpdeskInbox() {
  const toast = useToast();
  const { user } = useAuth();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null);
  
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  const fetchTickets = useCallback(async () => {
    try {
      const res = await api.get('/helpdesk', {
        params: { search, status: statusFilter }
      });
      setTickets(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const fetchTicketDetail = useCallback(async (id) => {
    try {
      const res = await api.get(`/helpdesk/${id}`);
      setTicketDetail(res.data.data);
    } catch (err) {
      toast.error('Failed to load ticket details');
    }
  }, [toast]);

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetail(selectedTicketId);
    } else {
      setTicketDetail(null);
    }
  }, [selectedTicketId, fetchTicketDetail]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedTicketId) return;
    setSending(true);
    try {
      await api.post(`/helpdesk/tickets/${selectedTicketId}/messages`, { message: messageText });
      setMessageText('');
      fetchTicketDetail(selectedTicketId);
      // optionally refresh list to update last-modified
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'CLOSED') {
      setCloseModalOpen(true);
      return;
    }
    
    try {
      await api.put(`/helpdesk/tickets/${selectedTicketId}/status`, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus}`);
      fetchTicketDetail(selectedTicketId);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const submitClose = async () => {
    if (!remarks.trim()) {
      toast.warning('Resolution note is required to close ticket');
      return;
    }
    try {
      await api.put(`/helpdesk/tickets/${selectedTicketId}/status`, { status: 'CLOSED', remarks });
      toast.success('Ticket closed successfully');
      setCloseModalOpen(false);
      setRemarks('');
      fetchTicketDetail(selectedTicketId);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close ticket');
    }
  };

  // ==================== Left Panel (List) ====================
  const leftPanel = (
    <div className="flex flex-col h-full bg-surface">
      <div className="p-4 border-b border-border space-y-3 sticky top-0 bg-surface z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg border border-border rounded-md text-sm focus:outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex gap-2">
          {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-brand-600 text-white'
                  : 'bg-bg text-text-secondary hover:bg-border'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-text-secondary text-sm animate-pulse">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-text-secondary text-sm">No tickets found</div>
        ) : (
          <div className="divide-y divide-border">
            {tickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`w-full text-left p-4 transition-colors hover:bg-bg ${
                  selectedTicketId === ticket.id ? 'bg-brand-50/50 border-l-2 border-l-brand-600' : 'border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-xs font-medium text-text-secondary truncate pr-2">#{ticket.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-[10px] text-text-disabled whitespace-nowrap">{formatDate(ticket.updatedAt)}</span>
                </div>
                <h4 className="text-sm font-semibold text-text-primary line-clamp-1 mb-2">{ticket.subject}</h4>
                <div className="flex items-center justify-between">
                  <StatusBadge 
                    status={ticket.status === 'OPEN' ? 'pending' : ticket.status === 'IN_PROGRESS' ? 'active' : ticket.status === 'RESOLVED' ? 'success' : 'inactive'} 
                    label={ticket.status.replace('_', ' ')} 
                  />
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority || 'Medium'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ==================== Right Panel (Thread) ====================
  const rightPanel = ticketDetail ? (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-surface flex justify-between items-start flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-lg font-semibold text-text-primary">{ticketDetail.subject}</h2>
            <StatusBadge 
              status={ticketDetail.status === 'OPEN' ? 'pending' : ticketDetail.status === 'IN_PROGRESS' ? 'active' : ticketDetail.status === 'RESOLVED' ? 'success' : 'inactive'} 
              label={ticketDetail.status.replace('_', ' ')} 
            />
          </div>
          <p className="text-sm text-text-secondary">Opened by user {ticketDetail.createdById.slice(0, 8)} on {formatDate(ticketDetail.createdAt)}</p>
        </div>
        
        {/* Status Actions */}
        <div className="flex gap-2">
          {ticketDetail.status === 'OPEN' && (
            <button onClick={() => handleStatusChange('IN_PROGRESS')} className="px-3 py-1.5 bg-brand-100 text-brand-700 text-sm font-medium rounded-md hover:bg-brand-200">
              Start Work
            </button>
          )}
          {ticketDetail.status === 'IN_PROGRESS' && (
            <button onClick={() => handleStatusChange('RESOLVED')} className="px-3 py-1.5 bg-success-100 text-success-700 text-sm font-medium rounded-md hover:bg-success-200">
              Mark Resolved
            </button>
          )}
          {ticketDetail.status !== 'CLOSED' && user?.scope === 'ADMIN' && (
            <button onClick={() => handleStatusChange('CLOSED')} className="px-3 py-1.5 bg-border text-text-secondary text-sm font-medium rounded-md hover:bg-gray-200">
              Close Ticket
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-bg space-y-6">
        {/* Original Description */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 bg-surface border border-border rounded-lg rounded-tl-none p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-primary">Requester</span>
              <span className="text-xs text-text-secondary">{formatDate(ticketDetail.createdAt)}</span>
            </div>
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{ticketDetail.description}</p>
          </div>
        </div>

        {/* Thread */}
        {ticketDetail.messages?.map((msg) => {
          const isSystem = msg.senderId === 'system';
          const isMe = msg.senderId === user?.id;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="px-3 py-1 bg-border text-text-secondary text-xs rounded-full flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {msg.message}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-brand-600 text-white' : 'bg-surface border border-border text-text-secondary'}`}>
                <User className="w-4 h-4" />
              </div>
              <div className={`max-w-[75%] rounded-lg p-4 shadow-sm ${
                isMe 
                  ? 'bg-brand-50 border border-brand-100 rounded-tr-none' 
                  : 'bg-surface border border-border rounded-tl-none'
              }`}>
                <div className={`flex justify-between items-center mb-2 gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-medium text-text-primary">{isMe ? 'You' : 'User'}</span>
                  <span className="text-xs text-text-secondary">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Box */}
      {ticketDetail.status !== 'CLOSED' ? (
        <div className="p-4 bg-surface border-t border-border flex-shrink-0">
          <div className="flex items-end gap-3 bg-bg border border-border rounded-lg p-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your reply here..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-2 max-h-32 min-h-[44px] resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sending}
              className="p-2 bg-brand-600 text-white rounded-md hover:bg-brand-500 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-surface border-t border-border text-center text-sm text-text-secondary">
          This ticket is closed and cannot receive new messages.
        </div>
      )}
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-text-disabled">
      <MessageSquare className="w-12 h-12 mb-4" />
      <p>Select a ticket to view the conversation</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Helpdesk Inbox</h2>
        <p className="text-sm text-text-secondary mt-0.5">Manage and respond to support tickets</p>
      </div>

      <SplitPanel left={leftPanel} right={rightPanel} leftWidth="w-80" />

      {/* Close Ticket Modal */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Close Ticket"
        size="md"
        footer={
          <>
            <button onClick={() => setCloseModalOpen(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={submitClose} className="px-4 py-2 text-sm font-medium text-white bg-danger-600 hover:bg-danger-700 rounded-md">Close Ticket</button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Please provide a resolution note before closing this ticket.</p>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Resolution Note <span className="text-danger-500">*</span></label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-danger-500/20 focus:border-danger-500"
              rows={4}
              placeholder="e.g., Issue resolved by updating user permissions..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}