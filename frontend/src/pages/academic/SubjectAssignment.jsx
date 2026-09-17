import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Book, Search, Filter, AlertCircle, Edit2, Plus, Layers, Award, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';
import { useAcademic } from '../../context/AcademicContext';

export default function SubjectAssignment() {
  const toast = useToast();
  const location = useLocation();
  const { subjects, subjectTypes, programs, courses, divisions, employees, refreshEntity, updateLocalEntity, loading } = useAcademic();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(location.pathname.includes('subject-types') ? 'types' : 'subjects');

  useEffect(() => {
    if (location.pathname.includes('subject-types')) {
      setActiveTab('types');
    } else {
      setActiveTab('subjects');
    }
  }, [location.pathname]);

  // Modals
  const [subjectModal, setSubjectModal] = useState(false);
  const [typeModal, setTypeModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [subjectForm, setSubjectForm] = useState({
    name: '', code: '', credits: 3, semesterNumber: 1, subjectTypeId: '', programId: '', courseId: '', divisionId: ''
  });
  const [typeForm, setTypeForm] = useState({ name: '', code: '', creditWeightage: '1.0' });

  const handleCreateSubject = async () => {
    setSaving(true);
    try {
      const payload = {
        ...subjectForm,
        credits: parseFloat(subjectForm.credits) || 3.0,
        semesterNumber: parseInt(subjectForm.semesterNumber) || 1,
      };
      const res = await api.post('/academic/subjects', payload);
      toast.success('Subject created successfully');
      setSubjectModal(false);
      setSubjectForm({ name: '', code: '', credits: 3, semesterNumber: 1, subjectTypeId: '', programId: '', courseId: '', divisionId: '' });
      if (res.data?.data) updateLocalEntity('subjects', 'ADD', res.data.data);
      refreshEntity('subjects', '/academic/subjects');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create subject'); }
    finally { setSaving(false); }
  };

  const handleCreateType = async () => {
    setSaving(true);
    try {
      const res = await api.post('/academic/subject-types', typeForm);
      toast.success('Subject type created successfully');
      setTypeModal(false);
      setTypeForm({ name: '', code: '', creditWeightage: '1.0' });
      if (res.data?.data) updateLocalEntity('subjectTypes', 'ADD', res.data.data);
      refreshEntity('subjectTypes', '/academic/subject-types');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create subject type'); }
    finally { setSaving(false); }
  };

  const filteredSubjects = subjects.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.code && s.code.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-bg rounded-md animate-shimmer" />
        <div className="h-96 bg-bg rounded-md animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Subjects & Subject Types</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure subjects, credits, semester placement, and subject types</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setTypeModal(true)} className="secondary-button">
            <Plus className="w-4 h-4" /> Add Subject Type
          </button>
          <button onClick={() => setSubjectModal(true)} className="primary-button">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      <AcademicFlowNav currentStepKey={activeTab === 'types' ? 'subject-types' : 'subjects'} />

      {/* Tabs */}
      <div className="flex border-b border-glass-border space-x-6">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'subjects' ? 'text-brand border-b-2 border-brand' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'types' ? 'text-brand border-b-2 border-brand' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Subject Types ({subjectTypes.length})
        </button>
      </div>

      {activeTab === 'subjects' ? (
        <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border">
          <div className="p-4 border-b border-glass-border flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search subjects by name or code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground"
              />
            </div>
            <span className="text-xs text-muted-foreground font-semibold">{filteredSubjects.length} subjects</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Subject</th>
                  <th className="p-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Code</th>
                  <th className="p-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Type</th>
                  <th className="p-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Credits</th>
                  <th className="p-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Semester</th>
                  <th className="p-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Course / Branch</th>
                  <th className="p-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {filteredSubjects.map(sub => {
                  const sType = subjectTypes.find(t => t.id === sub.subjectTypeId);
                  const crs = courses.find(c => c.id === sub.courseId);
                  const div = divisions.find(d => d.id === sub.divisionId);
                  const initials = sub.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

                  return (
                    <tr key={sub.id} className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="mini-avatar shrink-0">{initials}</div>
                          <span className="text-xs font-bold text-foreground font-heading">{sub.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-xs text-brand font-semibold">{sub.code || '-'}</td>
                      <td className="p-3.5">
                        <StatusBadge status="active" label={sType?.name || 'Core'} size="xs" />
                      </td>
                      <td className="p-3.5 text-xs font-semibold text-foreground">{sub.credits || 3.0}</td>
                      <td className="p-3.5 text-xs text-muted-foreground font-medium">Sem {sub.semesterNumber || 1}</td>
                      <td className="p-3.5 text-xs text-muted-foreground font-medium">
                        {crs ? crs.name : 'All Courses'} {div ? `• ${div.name}` : ''}
                      </td>
                      <td className="p-3.5 text-right">
                        <button className="secondary-button p-1.5" title="Edit subject">
                          <Edit2 className="w-3.5 h-3.5 text-brand" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredSubjects.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-medium text-sm">No subjects found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectTypes.map(st => (
            <div key={st.id} className="glass-panel p-4 rounded-2xl border border-glass-border hover:border-brand/40 hover:bg-brand/5 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-foreground font-heading">{st.name}</h3>
                  {st.code && <span className="text-xs text-brand font-mono font-semibold mt-0.5 block">{st.code}</span>}
                </div>
                <StatusBadge status="active" label="Type Config" size="xs" />
              </div>
              <div className="mt-3 pt-3 border-t border-glass-border flex justify-between items-center text-xs text-muted-foreground font-medium">
                <span>Credit Weightage: {st.creditWeightage || '1.0'}</span>
                <span>{subjects.filter(s => s.subjectTypeId === st.id).length} subjects</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject Modal */}
      <Modal isOpen={subjectModal} onClose={() => setSubjectModal(false)} title="Add Subject">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Subject Name <span className="text-danger-600">*</span></label>
            <input type="text" value={subjectForm.name} onChange={e => setSubjectForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Data Structures & Algorithms"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Subject Code <span className="text-danger-600">*</span></label>
              <input type="text" value={subjectForm.code} onChange={e => setSubjectForm(p => ({ ...p, code: e.target.value }))} placeholder="e.g., CS-201"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Subject Type</label>
              <select value={subjectForm.subjectTypeId} onChange={e => setSubjectForm(p => ({ ...p, subjectTypeId: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
                <option value="">Select Type</option>
                {subjectTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Credits</label>
              <input type="number" step="0.5" value={subjectForm.credits} onChange={e => setSubjectForm(p => ({ ...p, credits: e.target.value }))} placeholder="3.0"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Semester Number</label>
              <input type="number" value={subjectForm.semesterNumber} onChange={e => setSubjectForm(p => ({ ...p, semesterNumber: e.target.value }))} placeholder="1"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Course Mapping (Optional)</label>
              <select value={subjectForm.courseId} onChange={e => setSubjectForm(p => ({ ...p, courseId: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
                <option value="">All Courses / Shared</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Branch / Stream (Optional)</label>
              <select value={subjectForm.divisionId} onChange={e => setSubjectForm(p => ({ ...p, divisionId: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
                <option value="">All Branches / Shared</option>
                {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSubjectModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleCreateSubject} disabled={saving || !subjectForm.name || !subjectForm.code}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Subject
            </button>
          </div>
        </div>
      </Modal>

      {/* Subject Type Modal */}
      <Modal isOpen={typeModal} onClose={() => setTypeModal(false)} title="Add Subject Type">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Type Name (Core, Elective, Lab, Mandatory, Audit) <span className="text-danger-600">*</span></label>
            <input type="text" value={typeForm.name} onChange={e => setTypeForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Elective / Lab"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Code</label>
            <input type="text" value={typeForm.code} onChange={e => setTypeForm(p => ({ ...p, code: e.target.value }))} placeholder="e.g., ELEC / LAB"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Credit Weightage Rule (e.g. 1.0, 0.5, Full)</label>
            <input type="text" value={typeForm.creditWeightage} onChange={e => setTypeForm(p => ({ ...p, creditWeightage: e.target.value }))} placeholder="1.0"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setTypeModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleCreateType} disabled={saving || !typeForm.name}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Type
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
