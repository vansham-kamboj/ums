import { useState, useEffect } from 'react';
import { Settings, Calendar, Plus, Edit2, Archive, CheckCircle, ChevronRight, Book, Layers, Users, Loader2, MoreVertical, Star, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';

import { useAcademic } from '../../context/AcademicContext';

export default function SessionSetup() {
  const toast = useToast();
  const { sessions, batches: classes, divisions: sections, subjects, refreshEntity, updateLocalEntity, loading } = useAcademic();
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showNewSession, setShowNewSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({ name: '', startDate: '', endDate: '', isActive: false, status: 'Upcoming' });
  const [editingSession, setEditingSession] = useState(null);
  const [saving, setSaving] = useState(false);

  const activeSessionId = selectedSessionId || sessions.find(s => s.isActive || s.isDefault)?.id || sessions[0]?.id || null;

  const handleSaveSession = async () => {
    setSaving(true);
    try {
      const payload = {
        name: sessionForm.name,
        startDate: sessionForm.startDate,
        endDate: sessionForm.endDate,
        isActive: sessionForm.isActive,
        isDefault: sessionForm.isActive,
        status: sessionForm.status || 'Upcoming',
      };
      if (editingSession) {
        const res = await api.put(`/academic/sessions/${editingSession.id}`, payload);
        toast.success('Session updated successfully');
        updateLocalEntity('sessions', 'UPDATE', res.data?.data || { ...editingSession, ...payload });
      } else {
        const res = await api.post('/academic/sessions', payload);
        toast.success('Session created successfully');
        if (res.data?.data) updateLocalEntity('sessions', 'ADD', res.data.data);
      }
      setShowNewSession(false);
      setEditingSession(null);
      setSessionForm({ name: '', startDate: '', endDate: '', isActive: false, status: 'Upcoming' });
      refreshEntity('sessions', '/academic/sessions');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save session'); }
    finally { setSaving(false); }
  };

  const handleSetActive = async (sessionId) => {
    try {
      await api.put(`/academic/sessions/${sessionId}`, { isActive: true, isDefault: true, status: 'Ongoing' });
      toast.success('Session activated successfully');
      refreshEntity('sessions', '/academic/sessions');
    } catch (err) { toast.error('Failed to activate session'); }
  };

  const handleEditClick = (session) => {
    setEditingSession(session);
    setSessionForm({
      name: session.name || '',
      startDate: session.startDate ? new Date(session.startDate).toISOString().split('T')[0] : '',
      endDate: session.endDate ? new Date(session.endDate).toISOString().split('T')[0] : '',
      isActive: Boolean(session.isActive || session.isDefault),
      status: session.status || 'Upcoming',
    });
    setShowNewSession(true);
  };

  const filteredSections = sections.filter(s => s.batchId === selectedClass);
  const filteredSubjects = subjects.filter(s => s.batchId === selectedClass);
  const currentSession = sessions.find(s => s.id === activeSessionId);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-bg rounded-md animate-shimmer" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-bg rounded-md animate-shimmer" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-bg rounded-md animate-shimmer" />
          <div className="lg:col-span-2 h-96 bg-bg rounded-md animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Academic Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage sessions, classes, sections, and subjects</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={activeSessionId || ''} onChange={(e) => setSelectedSessionId(e.target.value)}
            className="px-4 py-2.5 glass-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium">
            {sessions.map(s => (
              <option key={s.id} value={s.id} className="bg-white text-foreground">{s.name} {s.isDefault ? '(Active)' : ''}</option>
            ))}
          </select>
          <button onClick={() => setShowNewSession(true)}
            className="primary-button">
            <Plus className="w-4 h-4" /> New Session
          </button>
        </div>
      </div>

      <AcademicFlowNav currentStepKey="sessions" />

      {/* Session Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel glass-card-interactive p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Session</span>
            <Calendar className="w-4 h-4 text-brand" />
          </div>
          <p className="text-xl font-bold text-foreground font-heading">{currentSession?.name || 'None'}</p>
          {currentSession?.startDate && (
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              {new Date(currentSession.startDate).toLocaleDateString()} – {new Date(currentSession.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="glass-panel glass-card-interactive p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classes</span>
            <Layers className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground font-heading">{classes.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">Active batches</p>
        </div>
        <div className="glass-panel glass-card-interactive p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sections</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <p className="text-2xl font-bold text-foreground font-heading">{sections.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">Across all classes</p>
        </div>
        <div className="glass-panel glass-card-interactive p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subjects</span>
            <Book className="w-4 h-4 text-amber" />
          </div>
          <p className="text-2xl font-bold text-foreground font-heading">{subjects.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">Configured subjects</p>
        </div>
      </div>

      {/* Three Linked Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Panel */}
        <div className="glass-panel overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
          <div className="p-4 border-b border-glass-border flex justify-between items-center flex-shrink-0">
            <h2 className="font-semibold text-foreground text-sm flex items-center gap-2 font-heading">
              <Layers className="w-4 h-4 text-brand" /> Classes
            </h2>
            <span className="text-xs text-muted-foreground font-medium">{classes.length} total</span>
          </div>
          <div className="p-3 overflow-y-auto flex-1 space-y-2">
            {classes.map(cls => {
              const sectionCount = sections.filter(s => s.batchId === cls.id).length;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center justify-between ${
                    selectedClass === cls.id
                      ? 'nav-item-active'
                      : 'glass-row hover:bg-black/5'
                  }`}
                >
                  <div>
                    <h3 className={`text-sm font-semibold ${selectedClass === cls.id ? 'text-white' : 'text-foreground'}`}>{cls.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`inline-flex items-center gap-1 text-xs ${selectedClass === cls.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                        <Users className="w-3 h-3" /> {sectionCount} sections
                      </span>
                      {cls.maxStrength && (
                        <span className={`inline-flex items-center gap-1 text-xs ${selectedClass === cls.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          Cap: {cls.maxStrength}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-colors ${selectedClass === cls.id ? 'text-white' : 'text-muted-foreground'}`} />
                </button>
              );
            })}
            {classes.length === 0 && (
              <EmptyState title="No classes" message="Create batches in the Courses page to see them here." icon={Layers} />
            )}
          </div>
        </div>

        {/* Right Side: Sections + Subjects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sections Panel */}
          <div className="glass-panel overflow-hidden" style={{ maxHeight: '280px' }}>
            <div className="p-4 border-b border-glass-border flex justify-between items-center">
              <h2 className="font-semibold text-foreground text-sm flex items-center gap-2 font-heading">
                <Users className="w-4 h-4 text-brand" /> Sections
              </h2>
              {selectedClass && (
                <span className="text-xs text-muted-foreground font-medium">{filteredSections.length} found</span>
              )}
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: '220px' }}>
              {!selectedClass ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm font-medium">
                  <span>← Select a class to view sections</span>
                </div>
              ) : filteredSections.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm font-medium">No sections configured for this class</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredSections.map(sec => (
                    <div key={sec.id} className="glass-row justify-between items-center group">
                      <span className="text-sm font-semibold text-foreground">{sec.name}</span>
                      <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subjects Panel */}
          <div className="glass-panel overflow-hidden" style={{ maxHeight: '296px' }}>
            <div className="p-4 border-b border-glass-border flex justify-between items-center">
              <h2 className="font-semibold text-foreground text-sm flex items-center gap-2 font-heading">
                <Book className="w-4 h-4 text-amber" /> Subjects
              </h2>
              {selectedClass && (
                <span className="text-xs text-muted-foreground font-medium">{filteredSubjects.length} found</span>
              )}
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
              {!selectedClass ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm font-medium">
                  <span>← Select a class to view subjects</span>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm font-medium">No subjects configured for this class</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white/20 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {filteredSubjects.map(sub => {
                      const initials = sub.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                      return (
                        <tr key={sub.id} className="hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="mini-avatar shrink-0">{initials}</div>
                              <div>
                                <span className="text-xs font-bold text-foreground font-heading">{sub.name}</span>
                                {sub.code && <span className="text-[11px] text-brand font-mono ml-2 font-semibold">{sub.code}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status="active" label={sub.type || 'Theory'} size="xs" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="secondary-button p-1.5" title="Edit subject">
                              <Edit2 className="w-3.5 h-3.5 text-brand" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border">
        <div className="px-5 py-4 border-b border-glass-border">
          <h2 className="font-semibold text-foreground text-base font-heading flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand" /> All Academic Sessions
          </h2>
        </div>
        <div className="divide-y divide-glass-border">
          {sessions.map(session => {
            const initials = session.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
            const isActive = session.isActive || session.isDefault;
            return (
              <div key={session.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer group">
                <div className="flex items-center gap-3.5">
                  <div className="mini-avatar shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-foreground font-heading">{session.name}</h3>
                      {session.status && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          session.status === 'Ongoing' ? 'bg-emerald-500/10 text-emerald-600' :
                          session.status === 'Completed' ? 'bg-gray-500/10 text-gray-500' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {session.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {session.startDate && (
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(session.startDate).toLocaleDateString()} – {new Date(session.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <StatusBadge status="active" label="Active Session" />
                  ) : (
                    <button onClick={() => handleSetActive(session.id)}
                      className="text-xs text-brand hover:underline font-semibold">Set Active</button>
                  )}
                  <button onClick={() => handleEditClick(session)} className="secondary-button p-1.5" title="Edit session">
                    <Edit2 className="w-3.5 h-3.5 text-brand" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New/Edit Session Modal */}
      <Modal isOpen={showNewSession} onClose={() => { setShowNewSession(false); setEditingSession(null); }} title={editingSession ? "Edit Academic Session" : "Create Academic Session"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Session Name <span className="text-danger-600">*</span></label>
            <input type="text" value={sessionForm.name} onChange={e => setSessionForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., 2025-26" className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Start Date <span className="text-danger-600">*</span></label>
              <input type="date" value={sessionForm.startDate} onChange={e => setSessionForm(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">End Date <span className="text-danger-600">*</span></label>
              <input type="date" value={sessionForm.endDate} onChange={e => setSessionForm(p => ({ ...p, endDate: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Status</label>
            <select value={sessionForm.status} onChange={e => setSessionForm(p => ({ ...p, status: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="setActive" checked={sessionForm.isActive} onChange={e => setSessionForm(p => ({ ...p, isActive: e.target.checked }))}
              className="rounded border-border text-brand-600 focus:ring-brand-600/20" />
            <label htmlFor="setActive" className="text-sm text-text-secondary font-medium">Is Active (only 1 session can be active at a time)</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setShowNewSession(false); setEditingSession(null); }} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleSaveSession} disabled={saving || !sessionForm.name || !sessionForm.startDate || !sessionForm.endDate}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editingSession ? 'Update Session' : 'Create Session'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
