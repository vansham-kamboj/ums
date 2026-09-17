import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Plus, Edit2, Trash2, Search, Loader2, GitBranch, Book } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';

import { useAcademic } from '../../context/AcademicContext';

export default function BatchSetup() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const { batches, divisions, courses, programs, employees, refreshEntity, updateLocalEntity, loading } = useAcademic();

  const [search, setSearch] = useState('');
  const courseFilter = searchParams.get('courseId') || '';
  const divisionFilter = searchParams.get('divisionId') || '';

  const [modal, setModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', divisionId: '', courseId: '', sectionLabel: 'A', admissionYear: new Date().getFullYear(), classTeacherId: '', maxStrength: 60
  });

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setForm({
      name: '',
      divisionId: divisionFilter || (divisions[0]?.id || ''),
      courseId: courseFilter || (courses[0]?.id || ''),
      sectionLabel: 'A',
      admissionYear: new Date().getFullYear(),
      classTeacherId: '',
      maxStrength: 60,
    });
    setModal(true);
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setForm({
      name: batch.name || '',
      divisionId: batch.divisionId || '',
      courseId: batch.courseId || '',
      sectionLabel: batch.sectionLabel || 'A',
      admissionYear: batch.admissionYear || new Date().getFullYear(),
      classTeacherId: batch.classTeacherId || '',
      maxStrength: batch.maxStrength || 60,
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Batch name is required');
      return;
    }
    setSaving(true);
    try {
      let resolvedCourseId = form.courseId;
      if (form.divisionId && !resolvedCourseId) {
        const div = divisions.find(d => d.id === form.divisionId);
        if (div?.courseId) resolvedCourseId = div.courseId;
      }

      const payload = {
        name: form.name,
        divisionId: form.divisionId || null,
        courseId: resolvedCourseId || null,
        sectionLabel: form.sectionLabel,
        admissionYear: parseInt(form.admissionYear) || new Date().getFullYear(),
        classTeacherId: form.classTeacherId || null,
        maxStrength: parseInt(form.maxStrength) || 60,
      };

      if (editingBatch) {
        const res = await api.put(`/academic/batches/${editingBatch.id}`, payload);
        toast.success('Batch updated successfully');
        updateLocalEntity('batches', 'UPDATE', res.data?.data || { ...editingBatch, ...payload });
      } else {
        const res = await api.post('/academic/batches', payload);
        toast.success('Batch created successfully');
        if (res.data?.data) updateLocalEntity('batches', 'ADD', res.data.data);
      }
      setModal(false);
      refreshEntity('batches', '/academic/batches');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save batch'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (batchId) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) return;
    try {
      await api.delete(`/academic/batches/${batchId}`);
      toast.success('Batch deleted');
      updateLocalEntity('batches', 'DELETE', { id: batchId });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete batch'); }
  };

  const filteredBatches = batches.filter(b => {
    if (courseFilter && b.courseId !== courseFilter) return false;
    if (divisionFilter && b.divisionId !== divisionFilter) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
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
          <h1 className="text-2xl font-bold text-foreground font-heading">Batches & Sections</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage intake groups, section labels, class teachers, and student capacities</p>
        </div>
        <button onClick={handleOpenAdd} className="primary-button">
          <Plus className="w-4 h-4" /> Add Batch
        </button>
      </div>

      <AcademicFlowNav currentStepKey="batches" />

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search batch name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={courseFilter}
            onChange={e => setSearchParams(prev => {
              const next = new URLSearchParams(prev);
              if (e.target.value) next.set('courseId', e.target.value); else next.delete('courseId');
              return next;
            })}
            className="px-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium"
          >
            <option value="" className="bg-white text-foreground">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id} className="bg-white text-foreground">{c.name}</option>
            ))}
          </select>

          <select
            value={divisionFilter}
            onChange={e => setSearchParams(prev => {
              const next = new URLSearchParams(prev);
              if (e.target.value) next.set('divisionId', e.target.value); else next.delete('divisionId');
              return next;
            })}
            className="px-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium"
          >
            <option value="" className="bg-white text-foreground">All Branches / Streams</option>
            {divisions.map(d => (
              <option key={d.id} value={d.id} className="bg-white text-foreground">{d.name}</option>
            ))}
          </select>

          <span className="text-xs font-semibold text-muted-foreground">{filteredBatches.length} Batches</span>
        </div>
      </div>

      {/* Table View */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Batch Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Branch / Stream</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Parent Course</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Section & Year</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Class Teacher</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Capacity</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filteredBatches.map(batch => {
                const division = divisions.find(d => d.id === batch.divisionId);
                const course = courses.find(c => c.id === (batch.courseId || division?.courseId));
                const teacher = employees.find(e => e.id === batch.classTeacherId);
                const initials = batch.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <tr key={batch.id} className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="mini-avatar shrink-0">{initials}</div>
                        <span className="text-xs font-bold text-foreground font-heading">{batch.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-foreground">{division?.name || 'General Branch'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-muted-foreground font-medium">{course?.name || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {batch.sectionLabel && <span className="text-[11px] text-brand font-mono font-semibold px-2 py-0.5 rounded-md glass-subtle">Sec {batch.sectionLabel}</span>}
                        {batch.admissionYear && <span className="text-xs text-muted-foreground font-medium">Yr {batch.admissionYear}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-foreground font-medium">{teacher ? teacher.name : '-- Unassigned --'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-muted-foreground font-medium">{batch.maxStrength || 60} Students</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(batch)} className="secondary-button p-1.5" title="Edit batch">
                          <Edit2 className="w-3.5 h-3.5 text-brand" />
                        </button>
                        <button onClick={() => handleDelete(batch.id)} className="secondary-button p-1.5 text-rose-500" title="Delete batch">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8">
                    <EmptyState
                      title="No Batches Found"
                      message="No batch matches your current search or course/branch filters."
                      icon={Users}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editingBatch ? "Edit Batch" : "Add Batch"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Batch Name <span className="text-danger-600">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., CSE-AI 2025-A"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Branch / Stream</label>
            <select
              value={form.divisionId}
              onChange={e => setForm(p => ({ ...p, divisionId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            >
              <option value="">Select Branch / Stream</option>
              {divisions.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Course</label>
            <select
              value={form.courseId}
              onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            >
              <option value="">Auto-detect from Branch or Select</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Section Label</label>
              <input
                type="text"
                value={form.sectionLabel}
                onChange={e => setForm(p => ({ ...p, sectionLabel: e.target.value }))}
                placeholder="A"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Admission Year</label>
              <input
                type="number"
                value={form.admissionYear}
                onChange={e => setForm(p => ({ ...p, admissionYear: e.target.value }))}
                placeholder="2025"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Class Teacher</label>
            <select
              value={form.classTeacherId}
              onChange={e => setForm(p => ({ ...p, classTeacherId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            >
              <option value="">Assign Class Teacher</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Strength / Capacity</label>
            <input
              type="number"
              value={form.maxStrength}
              onChange={e => setForm(p => ({ ...p, maxStrength: e.target.value }))}
              placeholder="60"
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
              {editingBatch ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
