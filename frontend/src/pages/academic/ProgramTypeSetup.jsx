import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus, Edit2, Trash2, Search, Loader2, FolderTree, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';

import { useAcademic } from '../../context/AcademicContext';

export default function ProgramTypeSetup() {
  const toast = useToast();
  const navigate = useNavigate();
  const { programTypes, programs, refreshEntity, updateLocalEntity, loading } = useAcademic();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });

  const handleOpenAdd = () => {
    setEditingType(null);
    setForm({ name: '', code: '' });
    setModal(true);
  };

  const handleOpenEdit = (pt) => {
    setEditingType(pt);
    setForm({ name: pt.name || '', code: pt.code || '' });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Program type name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name, code: form.code };
      if (editingType) {
        const res = await api.put(`/academic/program-types/${editingType.id}`, payload);
        toast.success('Program type updated successfully');
        updateLocalEntity('programTypes', 'UPDATE', res.data?.data || { ...editingType, ...payload });
      } else {
        const res = await api.post('/academic/program-types', payload);
        toast.success('Program type created successfully');
        if (res.data?.data) updateLocalEntity('programTypes', 'ADD', res.data.data);
      }
      setModal(false);
      refreshEntity('programTypes', '/academic/program-types');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save program type'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (ptId) => {
    if (!window.confirm('Are you sure you want to delete this program type?')) return;
    try {
      await api.delete(`/academic/program-types/${ptId}`);
      toast.success('Program type deleted');
      updateLocalEntity('programTypes', 'DELETE', { id: ptId });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete program type'); }
  };

  const filteredTypes = programTypes.filter(pt =>
    !search || pt.name.toLowerCase().includes(search.toLowerCase()) || (pt.code && pt.code.toLowerCase().includes(search.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-foreground font-heading">Program Types</h1>
          <p className="text-sm text-muted-foreground mt-1">Degree levels offered by the institution (e.g. Undergraduate / UG, Postgraduate / PG, Diploma)</p>
        </div>
        <button onClick={handleOpenAdd} className="primary-button">
          <Plus className="w-4 h-4" /> Add Program Type
        </button>
      </div>

      <AcademicFlowNav currentStepKey="program-types" />

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search program type or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{filteredTypes.length} Program Types</span>
      </div>

      {/* Table View */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Program Type</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Code</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Offered Programs</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filteredTypes.map(pt => {
                const typePrograms = programs.filter(p => p.programTypeId === pt.id);
                const initials = pt.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <tr key={pt.id} className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="mini-avatar shrink-0">{initials}</div>
                        <span className="text-xs font-bold text-foreground font-heading">{pt.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-brand font-mono font-semibold px-2.5 py-1 rounded-md glass-subtle">{pt.code || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/academic/programs?programTypeId=${pt.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                      >
                        <FolderTree className="w-3.5 h-3.5" />
                        {typePrograms.length} Programs
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/academic/programs?programTypeId=${pt.id}`)}
                          className="secondary-button p-1.5 text-xs flex items-center gap-1 text-brand"
                          title="View Programs"
                        >
                          Programs <ArrowRight className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleOpenEdit(pt)} className="secondary-button p-1.5" title="Edit program type">
                          <Edit2 className="w-3.5 h-3.5 text-brand" />
                        </button>
                        <button onClick={() => handleDelete(pt.id)} className="secondary-button p-1.5 text-rose-500" title="Delete program type">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTypes.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8">
                    <EmptyState
                      title="No Program Types Found"
                      message="No program type matches your current search criteria."
                      icon={Layers}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editingType ? "Edit Program Type" : "Add Program Type"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Program Type Name <span className="text-danger-600">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Undergraduate (UG)"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Code</label>
            <input
              type="text"
              value={form.code}
              onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
              placeholder="e.g., UG / PG / DIPLOMA"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingType ? 'Update Program Type' : 'Create Program Type'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
