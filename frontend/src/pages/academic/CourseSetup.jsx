import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Book, Plus, Edit2, Trash2, Search, Loader2, GitBranch, Users, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';

import { useAcademic } from '../../context/AcademicContext';

export default function CourseSetup() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { courses, programs, divisions, batches, refreshEntity, updateLocalEntity, loading } = useAcademic();

  const [search, setSearch] = useState('');
  const programFilter = searchParams.get('programId') || '';

  const [modal, setModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', programId: '', durationOverride: '' });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setForm({ name: '', code: '', programId: programFilter || (programs[0]?.id || ''), durationOverride: '' });
    setModal(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setForm({
      name: course.name || '',
      code: course.code || '',
      programId: course.programId || '',
      durationOverride: course.durationOverride || '',
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.programId) {
      toast.error('Course name and parent program are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        programId: form.programId,
        durationOverride: form.durationOverride ? parseInt(form.durationOverride) : null,
      };

      if (editingCourse) {
        const res = await api.put(`/academic/courses/${editingCourse.id}`, payload);
        toast.success('Course updated successfully');
        updateLocalEntity('courses', 'UPDATE', res.data?.data || { ...editingCourse, ...payload });
      } else {
        const res = await api.post('/academic/courses', payload);
        toast.success('Course created successfully');
        if (res.data?.data) updateLocalEntity('courses', 'ADD', res.data.data);
      }
      setModal(false);
      refreshEntity('courses', '/academic/courses');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save course'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/academic/courses/${courseId}`);
      toast.success('Course deleted');
      updateLocalEntity('courses', 'DELETE', { id: courseId });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete course'); }
  };

  const filteredCourses = courses.filter(c => {
    if (programFilter && c.programId !== programFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !(c.code && c.code.toLowerCase().includes(search.toLowerCase()))) return false;
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
          <h1 className="text-2xl font-bold text-foreground font-heading">Specialization Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage degree specializations under academic programs</p>
        </div>
        <button onClick={handleOpenAdd} className="primary-button">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <AcademicFlowNav currentStepKey="courses" />

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search course name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={programFilter}
            onChange={e => setSearchParams(e.target.value ? { programId: e.target.value } : {})}
            className="px-4 py-2 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium"
          >
            <option value="" className="bg-white text-foreground">All Degree Programs</option>
            {programs.map(p => (
              <option key={p.id} value={p.id} className="bg-white text-foreground">{p.name}</option>
            ))}
          </select>
          <span className="text-xs font-semibold text-muted-foreground">{filteredCourses.length} Courses</span>
        </div>
      </div>

      {/* Table View */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Course / Specialization</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Parent Program</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Duration</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Branches / Streams</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">Batches</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {filteredCourses.map(course => {
                const program = programs.find(p => p.id === course.programId);
                const courseDivs = divisions.filter(d => d.courseId === course.id || d.programId === course.programId);
                const courseBts = batches.filter(b => b.courseId === course.id);
                const initials = course.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <tr key={course.id} className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="mini-avatar shrink-0">{initials}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground font-heading">{course.name}</span>
                            {course.code && <span className="text-[11px] text-brand font-mono font-semibold px-2 py-0.5 rounded-md glass-subtle">{course.code}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-foreground">{program?.name || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-muted-foreground font-medium">
                        {course.durationOverride ? `${course.durationOverride} yrs (Override)` : `${program?.duration || 4} yrs`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/academic/divisions?courseId=${course.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        {courseDivs.length} Branches
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/academic/batches?courseId=${course.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {courseBts.length} Batches
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/academic/divisions?courseId=${course.id}`)}
                          className="secondary-button p-1.5 text-xs flex items-center gap-1 text-brand"
                          title="View Branches / Streams"
                        >
                          Branches <ArrowRight className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleOpenEdit(course)} className="secondary-button p-1.5" title="Edit course">
                          <Edit2 className="w-3.5 h-3.5 text-brand" />
                        </button>
                        <button onClick={() => handleDelete(course.id)} className="secondary-button p-1.5 text-rose-500" title="Delete course">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8">
                    <EmptyState
                      title="No Courses Found"
                      message="No course matches your current search or program filter."
                      icon={Book}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editingCourse ? "Edit Course" : "Add Course"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Course Name <span className="text-danger-600">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Computer Science & Engineering"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Course Code</label>
            <input
              type="text"
              value={form.code}
              onChange={e => setForm(p => ({ ...p, code: e.target.value }))}
              placeholder="e.g., CSE"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Program <span className="text-danger-600">*</span></label>
            <select
              value={form.programId}
              onChange={e => setForm(p => ({ ...p, programId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            >
              <option value="">Select Parent Program</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Duration Override (Optional, in years)</label>
            <input
              type="number"
              value={form.durationOverride}
              onChange={e => setForm(p => ({ ...p, durationOverride: e.target.value }))}
              placeholder="e.g., 3"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.programId}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingCourse ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
