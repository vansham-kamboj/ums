import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FolderTree, Plus, Edit2, Trash2, Search, Loader2, Book, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';

import { useAcademic } from '../../context/AcademicContext';

export default function ProgramSetup() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { programs, departments, programTypes, courses, refreshEntity, updateLocalEntity, loading } = useAcademic();

  const [search, setSearch] = useState('');
  const departmentFilter = searchParams.get('departmentId') || '';
  const programTypeFilter = searchParams.get('programTypeId') || '';

  const [modal, setModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', departmentId: '', programTypeId: '', duration: 4, totalSemesters: 8
  });

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setForm({
      name: '',
      code: '',
      departmentId: departmentFilter || (departments[0]?.id || ''),
      programTypeId: programTypeFilter || (programTypes[0]?.id || ''),
      duration: 4,
      totalSemesters: 8,
    });
    setModal(true);
  };

  const handleOpenEdit = (prog) => {
    setEditingProgram(prog);
    setForm({
      name: prog.name || '',
      code: prog.code || '',
      departmentId: prog.departmentId || '',
      programTypeId: prog.programTypeId || '',
      duration: prog.duration || 4,
      totalSemesters: prog.totalSemesters || 8,
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code || !form.departmentId || !form.programTypeId) {
      toast.error('Program name, code, department, and program type are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        departmentId: form.departmentId,
        programTypeId: form.programTypeId,
        duration: parseInt(form.duration) || 4,
        totalSemesters: parseInt(form.totalSemesters) || 8,
      };

      if (editingProgram) {
        const res = await api.put(`/academic/programs/${editingProgram.id}`, payload);
        toast.success('Program updated successfully');
        updateLocalEntity('programs', 'UPDATE', res.data?.data || { ...editingProgram, ...payload });
      } else {
        const res = await api.post('/academic/programs', payload);
        toast.success('Program created successfully');
        if (res.data?.data) updateLocalEntity('programs', 'ADD', res.data.data);
      }
      setModal(false);
      refreshEntity('programs', '/academic/programs');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save program'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (progId) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await api.delete(`/academic/programs/${progId}`);
      toast.success('Program deleted');
      updateLocalEntity('programs', 'DELETE', { id: progId });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete program'); }
  };

  const filteredPrograms = programs.filter(p => {
    if (departmentFilter && p.departmentId !== departmentFilter) return false;
    if (programTypeFilter && p.programTypeId !== programTypeFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !(p.code && p.code.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

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
          <h1 className="text-2xl font-bold text-foreground font-heading">Academic Degree Programs</h1>
          <p className="text-sm text-muted-foreground mt-1">Degree levels offered by departments (e.g. BTech, MTech, BCA)</p>
        </div>
        <button onClick={handleOpenAdd} className="primary-button">
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      <AcademicFlowNav currentStepKey="programs" />

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search program name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={departmentFilter}
            onChange={e => setSearchParams(prev => {
              const next = new URLSearchParams(prev);
              if (e.target.value) next.set('departmentId', e.target.value); else next.delete('departmentId');
              return next;
            })}
            className="px-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium"
          >
            <option value="" className="bg-white text-foreground">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id} className="bg-white text-foreground">{d.name}</option>
            ))}
          </select>

          <select
            value={programTypeFilter}
            onChange={e => setSearchParams(prev => {
              const next = new URLSearchParams(prev);
              if (e.target.value) next.set('programTypeId', e.target.value); else next.delete('programTypeId');
              return next;
            })}
            className="px-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium"
          >
            <option value="" className="bg-white text-foreground">All Program Types</option>
            {programTypes.map(pt => (
              <option key={pt.id} value={pt.id} className="bg-white text-foreground">{pt.name}</option>
            ))}
          </select>

          <span className="text-xs font-semibold text-muted-foreground">{filteredPrograms.length} Programs</span>
        </div>
      </div>

      {/* Table View */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Degree Program</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Parent Department</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Program Type</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Duration & Semesters</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Courses</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filteredPrograms.map(prog => {
                const dept = departments.find(d => d.id === prog.departmentId);
                const pt = programTypes.find(t => t.id === prog.programTypeId);
                const progCourses = courses.filter(c => c.programId === prog.id);
                const initials = prog.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <tr key={prog.id} className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="mini-avatar shrink-0">{initials}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground font-heading">{prog.name}</span>
                            {prog.code && <span className="text-[11px] text-brand font-mono font-semibold px-2 py-0.5 rounded-md glass-subtle">{prog.code}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-foreground">{dept?.name || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status="active" label={pt?.name || 'UG'} size="xs" />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-muted-foreground font-medium">
                        {prog.duration || 4} Years ({prog.totalSemesters || 8} Semesters)
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/academic/courses?programId=${prog.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                      >
                        <Book className="w-3.5 h-3.5" />
                        {progCourses.length} Specializations
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/academic/courses?programId=${prog.id}`)}
                          className="secondary-button p-1.5 text-xs flex items-center gap-1 text-brand"
                          title="View Specialization Courses"
                        >
                          Courses <ArrowRight className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleOpenEdit(prog)} className="secondary-button p-1.5" title="Edit program">
                          <Edit2 className="w-3.5 h-3.5 text-brand" />
                        </button>
                        <button onClick={() => handleDelete(prog.id)} className="secondary-button p-1.5 text-rose-500" title="Delete program">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPrograms.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8">
                    <EmptyState
                      title="No Programs Found"
                      message="No degree program matches your current search or department/type filters."
                      icon={FolderTree}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editingProgram ? "Edit Degree Program" : "Add Degree Program"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Program Name <span className="text-danger-600">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Bachelor of Technology (BTech)"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Program Code <span className="text-danger-600">*</span></label>
            <input
              type="text"
              value={form.code}
              onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
              placeholder="e.g., BTECH"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Department <span className="text-danger-600">*</span></label>
            <select
              value={form.departmentId}
              onChange={e => setForm(p => ({ ...p, departmentId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            >
              <option value="">Select Parent Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Program Type (Level) <span className="text-danger-600">*</span></label>
            <select
              value={form.programTypeId}
              onChange={e => setForm(p => ({ ...p, programTypeId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            >
              <option value="">Select Program Type</option>
              {programTypes.map(pt => (
                <option key={pt.id} value={pt.id}>{pt.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Duration (in Years)</label>
              <input
                type="number"
                value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                placeholder="4"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Total Semesters</label>
              <input
                type="number"
                value={form.totalSemesters}
                onChange={e => setForm(p => ({ ...p, totalSemesters: e.target.value }))}
                placeholder="8"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.code || !form.departmentId || !form.programTypeId}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingProgram ? 'Update Program' : 'Create Program'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
