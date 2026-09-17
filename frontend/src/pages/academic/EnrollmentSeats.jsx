import { useState, useEffect } from 'react';
import { GraduationCap, Users, TrendingUp, TrendingDown, Minus, Loader2, Plus, Edit2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';

import { useAcademic } from '../../context/AcademicContext';

export default function EnrollmentSeats() {
  const toast = useToast();
  const { courses, divisions, batches, sessions, enrollmentSeats: seats, refreshEntity, updateLocalEntity, loading } = useAcademic();
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seatForm, setSeatForm] = useState({
    divisionId: '', batchId: '', academicSessionId: '', totalSeats: 60, reservedSeats: 10
  });

  useEffect(() => {
    if (!selectedSession && sessions.length > 0) {
      const active = sessions.find(s => s.isActive || s.isDefault);
      if (active) setSelectedSession(active.id);
    }
  }, [sessions, selectedSession]);

  const handleSaveSeat = async () => {
    setSaving(true);
    try {
      const payload = {
        divisionId: seatForm.divisionId || null,
        batchId: seatForm.batchId || null,
        academicSessionId: seatForm.academicSessionId || selectedSession || null,
        totalSeats: parseInt(seatForm.totalSeats) || 60,
        reservedSeats: parseInt(seatForm.reservedSeats) || 0,
      };
      const res = await api.post('/academic/enrollment-seats', payload);
      toast.success('Seat allocation configured successfully');
      setModal(false);
      setSeatForm({ divisionId: '', batchId: '', academicSessionId: '', totalSeats: 60, reservedSeats: 10 });
      if (res.data?.data) updateLocalEntity('enrollmentSeats', 'ADD', res.data.data);
      refreshEntity('enrollmentSeats', '/academic/enrollment-seats');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to configure seats'); }
    finally { setSaving(false); }
  };

  const filteredBatches = batches.filter(b => !selectedCourse || b.courseId === selectedCourse);
  const totalCapacity = filteredBatches.reduce((sum, b) => sum + (b.maxStrength || 60), 0);
  const filledSeats = 0;
  const availableSeats = totalCapacity - filledSeats;
  const fillPercentage = totalCapacity > 0 ? Math.round((filledSeats / totalCapacity) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 bg-bg rounded-md animate-shimmer" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-bg rounded-md animate-shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Enrollment Seats</h1>
          <p className="text-sm text-muted-foreground mt-1">Capacity control and seat reservation tied to Branch/Stream + Batch + Academic Session</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)}
            className="px-4 py-2.5 glass-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium">
            <option value="" className="bg-white text-foreground">All Sessions</option>
            {sessions.map(s => <option key={s.id} value={s.id} className="bg-white text-foreground">{s.name} {s.isActive ? '(Active)' : ''}</option>)}
          </select>
          <button onClick={() => setModal(true)} className="primary-button">
            <Plus className="w-4 h-4" /> Configure Quota
          </button>
        </div>
      </div>

      <AcademicFlowNav currentStepKey="enrollment-seats" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel glass-card-interactive p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Capacity</p>
              <p className="text-3xl font-bold text-foreground font-heading mt-1">{totalCapacity}</p>
            </div>
            <div className="brand-mark w-12 h-12 rounded-2xl flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="glass-panel glass-card-interactive p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seats Filled</p>
              <p className="text-3xl font-bold text-foreground font-heading mt-1">{filledSeats}</p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{fillPercentage}% of total capacity</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="glass-panel glass-card-interactive p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Seats</p>
              <p className="text-3xl font-bold text-foreground font-heading mt-1">{availableSeats}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Grid */}
      <div className="glass-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-glass-border flex justify-between items-center">
          <h2 className="font-semibold text-foreground text-base font-heading">Seats by Branch & Batch</h2>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 glass-subtle rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium">
            <option value="" className="bg-white text-foreground">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id} className="bg-white text-foreground">{c.name}</option>)}
          </select>
        </div>

        {filteredBatches.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm font-medium">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No batches found for the selected filters
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {filteredBatches.map(batch => {
              const div = divisions.find(d => d.id === batch.divisionId);
              const crs = courses.find(c => c.id === batch.courseId);
              const total = batch.maxStrength || div?.seatCapacity || 60;
              const filled = 0;
              const remaining = total - filled;
              const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

              return (
                <div key={batch.id} className="glass-panel p-4 rounded-2xl border border-glass-border hover:border-brand/40 hover:bg-brand/5 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground font-heading">{batch.name}</h3>
                        {crs && <p className="text-xs text-brand font-medium mt-0.5">{crs.name}</p>}
                        {div && <p className="text-[11px] text-muted-foreground font-medium">Branch: {div.name}</p>}
                      </div>
                      <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600">
                        {remaining} Available
                      </span>
                    </div>

                    <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden my-3">
                      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground font-medium pt-2 border-t border-glass-border">
                    <span>{filled} Enrolled</span>
                    <span>Reserved: 10</span>
                    <span>Capacity: {total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Seat Config Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Configure Enrollment Seat Quota">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Academic Session</label>
            <select value={seatForm.academicSessionId || selectedSession} onChange={e => setSeatForm(p => ({ ...p, academicSessionId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Session</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.name} {s.isActive ? '(Active)' : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Branch / Stream</label>
            <select value={seatForm.divisionId} onChange={e => setSeatForm(p => ({ ...p, divisionId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Branch / Stream</option>
              {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Batch / Section</label>
            <select value={seatForm.batchId} onChange={e => setSeatForm(p => ({ ...p, batchId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Batch</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Total Capacity</label>
              <input type="number" value={seatForm.totalSeats} onChange={e => setSeatForm(p => ({ ...p, totalSeats: e.target.value }))} placeholder="60"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Reserved Seats</label>
              <input type="number" value={seatForm.reservedSeats} onChange={e => setSeatForm(p => ({ ...p, reservedSeats: e.target.value }))} placeholder="10"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleSaveSeat} disabled={saving}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md disabled:opacity-50 inline-flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Quota
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
