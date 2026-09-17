import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, UserCheck, MoreHorizontal } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useStudent } from '../../context/StudentContext';
import StatusBadge from '../../components/ui/StatusBadge';

export default function RegistrationList() {
  const navigate = useNavigate();
  const toast = useToast();
  const { registrations, refreshStudentEntity, updateLocalStudentEntity, loading } = useStudent();
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);

  const filteredRegistrations = registrations.filter(r =>
    !search ||
    `${r.firstName || ''} ${r.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    (r.registrationNumber && r.registrationNumber.toLowerCase().includes(search.toLowerCase())) ||
    (r.phone && r.phone.includes(search))
  );

  const handleApproveEnroll = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to Approve & Enroll this student? This will create an active Student record.")) return;
    
    setProcessing(id);
    try {
      await api.post(`/students/registrations/${id}/convert`, { batchId: null });
      toast.success('Registration approved & student enrolled successfully!');
      refreshStudentEntity('registrations', '/students/registrations');
      refreshStudentEntity('students', '/students');
    } catch (error) {
      toast.error("Error approving registration.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Registrations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredRegistrations.length} pending registration forms submitted
          </p>
        </div>
        <Link to="/students/registrations/new" className="primary-button text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Add Registration
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 shadow-sm font-body"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="secondary-button text-xs py-2 px-3">
            <Filter className="w-3.5 h-3.5 text-brand" /> Filter
          </button>
        </div>
      </div>

      {/* Lovable Design Glass Table */}
      <div className="glass-panel overflow-hidden p-0 border border-glass-border shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-[11px] font-bold uppercase tracking-wider bg-card/30">
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Reg No</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-muted-foreground font-body">
                    <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-3" />
                    Loading registrations...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-muted-foreground font-body">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr 
                    key={reg.id} 
                    className="hover:bg-card/70 transition-all cursor-pointer group"
                  >
                    {/* Student Name + Initials Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand font-bold text-xs flex items-center justify-center border border-brand/20 shrink-0">
                          {reg.firstName?.charAt(0)}{reg.lastName?.charAt(0)}
                        </div>
                        <p className="font-semibold text-foreground group-hover:text-brand transition-colors font-body">
                          {reg.firstName} {reg.lastName}
                        </p>
                      </div>
                    </td>

                    {/* Reg No */}
                    <td className="py-4 px-6 text-xs text-muted-foreground font-mono">
                      {reg.registrationNumber || 'REG-PENDING'}
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      <p className="text-foreground font-medium">{reg.phone || '—'}</p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">{reg.email || '—'}</p>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <StatusBadge status={reg.stage || 'Pending'} />
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {reg.stage !== 'Approved' && (
                          <button
                            onClick={(e) => handleApproveEnroll(reg.id, e)}
                            disabled={processing === reg.id}
                            className="primary-button text-xs py-1 px-3"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            {processing === reg.id ? 'Enrolling...' : 'Approve'}
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-brand transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
