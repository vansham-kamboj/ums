import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Phone, Mail, BookOpen, Clock, ChevronRight, Eye, MoreHorizontal, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useStudent } from '../../context/StudentContext';
import { useAcademic } from '../../context/AcademicContext';
import StatusBadge from '../../components/ui/StatusBadge';

export default function EnquiryList() {
  const navigate = useNavigate();
  const toast = useToast();
  const { enquiries, refreshStudentEntity, updateLocalStudentEntity, loading } = useStudent();
  const { courses } = useAcademic();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  // New Enquiry Modal State
  const [showModal, setShowModal] = useState(false);
  const [newEnquiry, setNewEnquiry] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    courseId: '',
    source: 'Walk-in',
    remarks: ''
  });

  const filteredEnquiries = enquiries.filter(e => {
    const matchSearch = !search ||
      `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
      (e.phone && e.phone.includes(search)) ||
      (e.email && e.email.toLowerCase().includes(search.toLowerCase()));
    const matchStage = !stageFilter || e.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/students/enquiries', newEnquiry);
      toast.success('New enquiry logged successfully!');
      setShowModal(false);
      setNewEnquiry({ firstName: '', lastName: '', phone: '', email: '', courseId: '', source: 'Walk-in', remarks: '' });
      if (res.data?.data) updateLocalStudentEntity('enquiries', 'ADD', res.data.data);
      refreshStudentEntity('enquiries', '/students/enquiries');
      if (res.data?.data?.id) {
        navigate(`/students/enquiries/${res.data.data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create enquiry');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Enquiries</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {enquiries.length} prospective student inquiries in pipeline
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="primary-button text-sm px-4 py-2"
        >
          <Plus className="w-4 h-4" /> Add Enquiry
        </button>
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
            className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="secondary-button text-xs py-2 px-3 appearance-none pr-8 cursor-pointer"
            >
              <option value="">All Stages</option>
              <option value="New">New</option>
              <option value="Followed Up">Followed Up</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
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
                <th className="py-4 px-6">Enquiry / Student</th>
                <th className="py-4 px-6">Course / Interest</th>
                <th className="py-4 px-6">Contact Details</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-muted-foreground">
                    <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-3" />
                    Loading enquiries...
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-muted-foreground">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr 
                    key={enq.id}
                    onClick={() => navigate(`/students/enquiries/${enq.id}`)}
                    className="hover:bg-card/70 transition-all cursor-pointer group"
                  >
                    {/* Student Name + Initials Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand font-bold text-xs flex items-center justify-center border border-brand/20 shrink-0">
                          {enq.firstName?.charAt(0)}{enq.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-brand transition-colors">
                            {enq.firstName} {enq.lastName}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            {enq.enquiryNumber || 'ENQ-GEN'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6 text-xs text-foreground font-medium">
                      {enq.records?.[0]?.course?.name || 'General Inquiry'}
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      <p className="text-foreground font-medium">{enq.phone || '—'}</p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">{enq.email || '—'}</p>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      <StatusBadge status={enq.isConverted ? 'Converted' : (enq.stage || 'New')} />
                    </td>

                    {/* Action Icon */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        to={`/students/enquiries/${enq.id}`} 
                        className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-brand transition-colors inline-block"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Enquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm">
          <div className="glass-dialog w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground font-heading">Add New Enquiry</h3>
            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newEnquiry.firstName}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, firstName: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newEnquiry.lastName}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, lastName: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={newEnquiry.phone}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={newEnquiry.email}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                    className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Interested Course</label>
                <select
                  value={newEnquiry.courseId}
                  onChange={(e) => setNewEnquiry({ ...newEnquiry, courseId: e.target.value })}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save & Open Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
