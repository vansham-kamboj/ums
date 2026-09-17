import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2, Users, Book, Layers, Loader2, Search, FolderTree, GitBranch } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

export default function CourseBatchTree() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, type: null, parentId: null });
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, dRes, bRes, pRes, eRes] = await Promise.all([
        api.get('/academic/courses'),
        api.get('/academic/divisions'),
        api.get('/academic/batches'),
        api.get('/academic/programs'),
        api.get('/employee/employees').catch(() => api.get('/employees/directory')).catch(() => ({ data: { data: [] } })),
      ]);
      setCourses(Array.isArray(cRes.data.data) ? cRes.data.data : []);
      setDivisions(Array.isArray(dRes.data.data) ? dRes.data.data : []);
      setBatches(Array.isArray(bRes.data.data) ? bRes.data.data : []);
      setPrograms(Array.isArray(pRes.data.data) ? pRes.data.data : []);
      const empList = Array.isArray(eRes.data?.data) ? eRes.data.data : [];
      setEmployees(empList.map(e => ({ id: e.id, name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.email })));
    } catch { toast.error('Failed to load course data'); }
    finally { setLoading(false); }
  };

  const toggleCourse = (id) => {
    setExpandedCourses(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getCourseDivisions = (courseId) => {
    return divisions.filter(d => d.courseId === courseId || d.programId === courses.find(c => c.id === courseId)?.programId);
  };

  const getDivisionBatches = (divisionId, courseId) => {
    return batches.filter(b => b.divisionId === divisionId || (!b.divisionId && b.courseId === courseId));
  };

  const getCourseBatches = (courseId) => batches.filter(b => b.courseId === courseId);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const endpoints = { course: '/academic/courses', division: '/academic/divisions', batch: '/academic/batches' };
      const payload = { ...formData };
      
      if (modal.type === 'division' && modal.parentId) {
        payload.courseId = modal.parentId;
        const parentCourse = courses.find(c => c.id === modal.parentId);
        if (parentCourse) payload.programId = parentCourse.programId;
        if (payload.seatCapacity) payload.seatCapacity = parseInt(payload.seatCapacity) || 60;
      }
      
      if (modal.type === 'batch') {
        if (modal.parentId) payload.divisionId = modal.parentId;
        if (payload.divisionId) {
          const parentDiv = divisions.find(d => d.id === payload.divisionId);
          if (parentDiv?.courseId) payload.courseId = parentDiv.courseId;
        }
        if (payload.maxStrength) payload.maxStrength = parseInt(payload.maxStrength) || 60;
        if (payload.admissionYear) payload.admissionYear = parseInt(payload.admissionYear) || new Date().getFullYear();
      }

      if (modal.type === 'course' && payload.durationOverride) {
        payload.durationOverride = parseInt(payload.durationOverride) || null;
      }

      await api.post(endpoints[modal.type], payload);
      toast.success(`${modal.type === 'division' ? 'Branch/Stream' : modal.type} created successfully`);
      setModal({ open: false, type: null, parentId: null });
      setFormData({});
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create'); }
    finally { setSaving(false); }
  };

  const filteredCourses = courses.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.code && c.code.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-bg rounded-md animate-shimmer" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-bg rounded-md animate-shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Courses, Branches/Streams & Batches</h1>
          <p className="text-sm text-muted-foreground mt-1">Academic hierarchy: Program → Course → Branch / Stream → Batch</p>
        </div>
        <button onClick={() => setModal({ open: true, type: 'course', parentId: null })}
          className="primary-button">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 glass-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground" />
        </div>
      </div>

      {/* Tree View */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses found"
          message="Create your first course to build the academic hierarchy."
          icon={FolderTree}
          action={
            <button onClick={() => setModal({ open: true, type: 'course', parentId: null })}
              className="primary-button">
              <Plus className="w-4 h-4" /> Add Course
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredCourses.map(course => {
            const isExpanded = expandedCourses.has(course.id);
            const courseDivisions = getCourseDivisions(course.id);
            const courseBatches = getCourseBatches(course.id);
            const program = programs.find(p => p.id === course.programId);

            return (
              <div key={course.id} className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-md">
                {/* Course Header */}
                <button onClick={() => toggleCourse(course.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150">
                  <div className="flex items-center gap-4">
                    <div className="mini-avatar shrink-0">
                      {course.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground font-heading">{course.name}</h3>
                        {course.code && <span className="text-xs text-brand font-mono font-semibold">{course.code}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {program && <span className="text-xs text-muted-foreground font-medium">Program: {program.name}</span>}
                        {course.durationOverride && <span className="text-xs text-amber font-medium">• Duration Override: {course.durationOverride} yrs</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <GitBranch className="w-3.5 h-3.5 text-brand" /> {courseDivisions.length} Branches/Streams
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Users className="w-3.5 h-3.5 text-accent" /> {courseBatches.length} Batches
                      </span>
                    </div>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-glass-border animate-fade-in divide-y divide-glass-border">
                    {/* Branch / Stream section */}
                    <div className="px-5 py-3.5 bg-glass-subtle">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5 text-brand" /> Branches / Streams
                        </h4>
                        <button onClick={(e) => { e.stopPropagation(); setModal({ open: true, type: 'division', parentId: course.id }); }}
                          className="text-xs text-brand hover:underline font-semibold inline-flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Add Branch / Stream
                        </button>
                      </div>

                      {courseDivisions.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2 italic">No branches/streams configured for this course yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {courseDivisions.map(div => {
                            const divBatches = getDivisionBatches(div.id, course.id);
                            return (
                              <div key={div.id} className="glass-panel p-3.5 rounded-xl border border-glass-border">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-foreground font-heading">{div.name}</span>
                                      {div.code && <span className="text-[11px] text-brand font-mono font-semibold">{div.code}</span>}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                                      <span>Seat Capacity: {div.seatCapacity || 60}</span>
                                      {div.curriculumVersion && <span>• Curriculum: {div.curriculumVersion}</span>}
                                    </div>
                                  </div>
                                  <button onClick={() => setModal({ open: true, type: 'batch', parentId: div.id })}
                                    className="text-xs text-brand hover:underline font-semibold inline-flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Add Batch
                                  </button>
                                </div>

                                {/* Batches under this division */}
                                {divBatches.length > 0 && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3 pt-2.5 border-t border-glass-border">
                                    {divBatches.map(b => {
                                      const teacher = employees.find(e => e.id === b.classTeacherId);
                                      return (
                                        <div key={b.id} className="glass-row p-3 justify-between items-start group">
                                          <div>
                                            <h5 className="text-xs font-bold text-foreground">{b.name}</h5>
                                            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                                              {b.sectionLabel && <span className="font-semibold text-brand">Sec {b.sectionLabel}</span>}
                                              {b.admissionYear && <span>({b.admissionYear})</span>}
                                              {b.maxStrength && <span>Cap: {b.maxStrength}</span>}
                                            </div>
                                            {teacher && <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Teacher: {teacher.name}</p>}
                                          </div>
                                          <button className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-brand transition-all">
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Course Modal */}
      <Modal isOpen={modal.open && modal.type === 'course'} onClose={() => { setModal({ open: false, type: null, parentId: null }); setFormData({}); }} title="Add Specialization Course">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Course Name <span className="text-danger-600">*</span></label>
            <input type="text" value={formData.name || ''} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Computer Science Engineering"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Course Code <span className="text-danger-600">*</span></label>
            <input type="text" value={formData.code || ''} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} placeholder="e.g., CSE"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Program <span className="text-danger-600">*</span></label>
            <select value={formData.programId || ''} onChange={e => setFormData(p => ({ ...p, programId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Parent Program</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Duration Override (Optional, in years)</label>
            <input type="number" value={formData.durationOverride || ''} onChange={e => setFormData(p => ({ ...p, durationOverride: e.target.value }))} placeholder="Optional override"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModal({ open: false, type: null, parentId: null }); setFormData({}); }} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleCreate} disabled={saving || !formData.name || !formData.programId}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Course
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Branch / Stream Modal */}
      <Modal isOpen={modal.open && modal.type === 'division'} onClose={() => { setModal({ open: false, type: null, parentId: null }); setFormData({}); }} title="Add Branch / Stream">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Branch / Stream Name <span className="text-danger-600">*</span></label>
            <input type="text" value={formData.name || ''} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., CSE AI & ML"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Branch Code</label>
            <input type="text" value={formData.code || ''} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} placeholder="e.g., CSE-AIML"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Seat Capacity</label>
            <input type="number" value={formData.seatCapacity || ''} onChange={e => setFormData(p => ({ ...p, seatCapacity: e.target.value }))} placeholder="60"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Curriculum Version (Optional)</label>
            <input type="text" value={formData.curriculumVersion || ''} onChange={e => setFormData(p => ({ ...p, curriculumVersion: e.target.value }))} placeholder="e.g., v2025.1"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModal({ open: false, type: null, parentId: null }); setFormData({}); }} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleCreate} disabled={saving || !formData.name}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Branch / Stream
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Batch Modal */}
      <Modal isOpen={modal.open && modal.type === 'batch'} onClose={() => { setModal({ open: false, type: null, parentId: null }); setFormData({}); }} title="Add Batch / Section">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Batch Name <span className="text-danger-600">*</span></label>
            <input type="text" value={formData.name || ''} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., CSE-AI 2025-A"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Section Label</label>
              <input type="text" value={formData.sectionLabel || ''} onChange={e => setFormData(p => ({ ...p, sectionLabel: e.target.value }))} placeholder="A"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Admission Year</label>
              <input type="number" value={formData.admissionYear || ''} onChange={e => setFormData(p => ({ ...p, admissionYear: e.target.value }))} placeholder="2025"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Class Teacher</label>
            <select value={formData.classTeacherId || ''} onChange={e => setFormData(p => ({ ...p, classTeacherId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Assign Class Teacher</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Strength</label>
            <input type="number" value={formData.maxStrength || ''} onChange={e => setFormData(p => ({ ...p, maxStrength: e.target.value }))} placeholder="60"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModal({ open: false, type: null, parentId: null }); setFormData({}); }} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleCreate} disabled={saving || !formData.name}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Batch
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
