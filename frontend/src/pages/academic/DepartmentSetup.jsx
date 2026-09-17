import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Edit2, Trash2, Search, Loader2, FolderTree, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';

import { useAcademic } from '../../context/AcademicContext';

export default function DepartmentSetup() {
  const toast = useToast();
  const navigate = useNavigate();
  const { departments, programs, employees, refreshEntity, updateLocalEntity, loading } = useAcademic();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', hodId: '', description: '' });

  const handleOpenAdd = () => {
    setEditingDepartment(null);
    setForm({ name: '', code: '', hodId: '', description: '' });
    setModal(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDepartment(dept);
    setForm({
      name: dept.name || '',
      code: dept.code || '',
      hodId: dept.hodId || '',
      description: dept.description || '',
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) {
      toast.error('Department name and code are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        hodId: form.hodId || null,
        description: form.description || null,
      };

      if (editingDepartment) {
        const res = await api.put(`/academic/departments/${editingDepartment.id}`, payload);
        toast.success('Department updated successfully');
        updateLocalEntity('departments', 'UPDATE', res.data?.data || { ...editingDepartment, ...payload });
      } else {
        const res = await api.post('/academic/departments', payload);
        toast.success('Department created successfully');
        if (res.data?.data) updateLocalEntity('departments', 'ADD', res.data.data);
      }
      setModal(false);
      refreshEntity('departments', '/academic/departments');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save department'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (deptId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.delete(`/academic/departments/${deptId}`);
      toast.success('Department deleted');
      updateLocalEntity('departments', 'DELETE', { id: deptId });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete department'); }
  };

  const filteredDepartments = departments.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || (d.code && d.code.toLowerCase().includes(search.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-foreground font-heading">Academic Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">Top-level academic units (e.g. School of Computer Sciences - SOCS)</p>
        </div>
        <button onClick={handleOpenAdd} className="primary-button">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <AcademicFlowNav currentStepKey="departments" />

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search department name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{filteredDepartments.length} Departments</span>
      </div>

      {/* Table View */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Department Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Code</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Head of Department (HOD)</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Offered Programs</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filteredDepartments.map(dept => {
                const hodEmp = employees.find(e => e.id === dept.hodId);
                const deptPrograms = programs.filter(p => p.departmentId === dept.id);
                const initials = dept.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <tr key={dept.id} className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="mini-avatar shrink-0">{initials}</div>
                        <div>
                          <span className="text-xs font-bold text-foreground font-heading block">{dept.name}</span>
                          {dept.description && <span className="text-[11px] text-muted-foreground truncate max-w-xs block mt-0.5">{dept.description}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-brand font-mono font-semibold px-2.5 py-1 rounded-md glass-subtle">{dept.code || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-foreground font-medium">{hodEmp ? hodEmp.name : '-- Unassigned --'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/academic/programs?departmentId=${dept.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                      >
                        <FolderTree className="w-3.5 h-3.5" />
                        {deptPrograms.length} Programs
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/academic/programs?departmentId=${dept.id}`)}
                          className="secondary-button p-1.5 text-xs flex items-center gap-1 text-brand"
                          title="View Programs"
                        >
                          Programs <ArrowRight className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleOpenEdit(dept)} className="secondary-button p-1.5" title="Edit department">
                          <Edit2 className="w-3.5 h-3.5 text-brand" />
                        </button>
                        <button onClick={() => handleDelete(dept.id)} className="secondary-button p-1.5 text-rose-500" title="Delete department">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDepartments.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8">
                    <EmptyState
                      title="No Departments Found"
                      message="No department matches your current search criteria."
                      icon={Building2}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editingDepartment ? "Edit Department" : "Add Department"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Department Name <span className="text-danger-600">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., School of Computer Sciences"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Department Code <span className="text-danger-600">*</span></label>
            <input
              type="text"
              value={form.code}
              onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
              placeholder="e.g., SOCS"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Head of Department (HOD)</label>
            <select
              value={form.hodId}
              onChange={e => setForm(p => ({ ...p, hodId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            >
              <option value="">Assign HOD (Employee)</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of the department..."
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.code}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingDepartment ? 'Update Department' : 'Create Department'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
