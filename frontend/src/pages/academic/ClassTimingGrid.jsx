import { useState, useEffect } from 'react';
import { Clock, Plus, Edit2, Loader2, Save } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import AcademicFlowNav from '../../components/academic/AcademicFlowNav';
import { useAcademic } from '../../context/AcademicContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SUBJECT_COLORS = [
  'bg-brand-100 text-brand-600 border-brand-100',
  'bg-success-100 text-success-600 border-success-100',
  'bg-warning-100 text-warning-600 border-warning-100',
  'bg-danger-100 text-danger-600 border-danger-100',
  'bg-purple-100 text-purple-600 border-purple-100',
  'bg-cyan-100 text-cyan-600 border-cyan-100',
  'bg-amber-100 text-amber-600 border-amber-100',
  'bg-indigo-100 text-indigo-600 border-indigo-100',
];

export default function ClassTimingGrid() {
  const toast = useToast();
  const { batches, subjects, employees, classTimings, refreshEntity, updateLocalEntity, loading } = useAcademic();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [slots, setSlots] = useState([
    { label: 'Period 1', start: '08:00', end: '08:45' },
    { label: 'Period 2', start: '08:45', end: '09:30' },
    { label: 'Period 3', start: '09:30', end: '10:15' },
    { label: 'Break', start: '10:15', end: '10:30', isBreak: true },
    { label: 'Period 4', start: '10:30', end: '11:15' },
    { label: 'Period 5', start: '11:15', end: '12:00' },
    { label: 'Lunch', start: '12:00', end: '12:45', isBreak: true },
    { label: 'Period 6', start: '12:45', end: '13:30' },
    { label: 'Period 7', start: '13:30', end: '14:15' },
  ]);
  const [periodModal, setPeriodModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState({ label: '', start: '14:15', end: '15:00', isBreak: false });
  const [editModal, setEditModal] = useState({ open: false, day: null, slotIdx: null });
  const [editData, setEditData] = useState({ subjectId: '', employeeId: '' });

  const handleAddPeriod = () => {
    if (!newPeriod.label || !newPeriod.start || !newPeriod.end) {
      toast.error('Please fill in all period details');
      return;
    }
    setSlots(prev => [...prev, { ...newPeriod }]);
    setPeriodModal(false);
    setNewPeriod({ label: '', start: '15:00', end: '15:45', isBreak: false });
    toast.success('Period added to timing schedule');
  };

  // Grid data: [slotIdx][dayIdx] = { subjectId, employeeId, subjectName, teacherName }
  const [gridData, setGridData] = useState({});

  const getCell = (slotIdx, dayIdx) => {
    const key = `${slotIdx}-${dayIdx}`;
    return gridData[key] || null;
  };

  const handleCellClick = (slotIdx, dayIdx) => {
    if (slots[slotIdx]?.isBreak) return;
    setEditData(getCell(slotIdx, dayIdx) || { subjectId: '', employeeId: '' });
    setEditModal({ open: true, day: dayIdx, slotIdx });
  };

  const handleAssign = () => {
    const key = `${editModal.slotIdx}-${editModal.day}`;
    const subject = subjects.find(s => s.id === editData.subjectId);
    const teacher = employees.find(e => e.id === editData.employeeId);
    setGridData(prev => ({
      ...prev,
      [key]: {
        subjectId: editData.subjectId,
        employeeId: editData.employeeId,
        subjectName: subject?.name || '',
        teacherName: teacher ? `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() : '',
      }
    }));
    setEditModal({ open: false, day: null, slotIdx: null });
    toast.success('Slot assigned');
  };

  const subjectColorMap = {};
  subjects.forEach((s, i) => { subjectColorMap[s.id] = SUBJECT_COLORS[i % SUBJECT_COLORS.length]; });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Class Timing Grid</h1>
          <p className="text-sm text-muted-foreground mt-1">Assign subjects and teachers to time slots for each batch</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setPeriodModal(true)} className="secondary-button">
            <Plus className="w-4 h-4" /> Add Period / Break
          </button>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}
            className="px-4 py-2.5 glass-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all text-foreground font-medium min-w-[200px]">
            <option value="" className="bg-white text-foreground">Select Batch</option>
            {batches.map(b => <option key={b.id} value={b.id} className="bg-white text-foreground">{b.name}</option>)}
          </select>
        </div>
      </div>

      <AcademicFlowNav currentStepKey="class-timings" />

      {!selectedBatch ? (
        <EmptyState
          title="Select a Batch"
          message="Choose a batch from the dropdown above to view and configure the class timing grid."
          icon={Clock}
        />
      ) : (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/20">
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border w-32">Period</th>
                  {DAY_SHORT.map((d, i) => (
                    <th key={d} className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-glass-border">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, slotIdx) => (
                  <tr key={slotIdx} className={slot.isBreak ? 'bg-white/10' : ''}>
                    <td className="p-3 border-b border-glass-border">
                      <div className="text-sm font-bold text-foreground font-heading">{slot.label}</div>
                      <div className="text-xs text-muted-foreground font-medium">{slot.start} - {slot.end}</div>
                    </td>
                    {DAYS.map((_, dayIdx) => {
                      if (slot.isBreak) {
                        return (
                          <td key={dayIdx} className="p-2 border-b border-glass-border text-center">
                            <span className="text-xs text-muted-foreground italic font-medium">{slot.label}</span>
                          </td>
                        );
                      }
                      const cell = getCell(slotIdx, dayIdx);
                      return (
                        <td key={dayIdx} className="p-2 border-b border-glass-border">
                          <button
                            onClick={() => handleCellClick(slotIdx, dayIdx)}
                            className={`w-full rounded-xl p-2.5 text-left transition-all min-h-[60px] ${
                              cell
                                ? `${subjectColorMap[cell.subjectId] || 'glass-row text-foreground'} shadow-sm`
                                : 'border border-dashed border-glass-border/80 hover:border-brand/50 hover:bg-white/20'
                            }`}
                          >
                            {cell ? (
                              <>
                                <div className="text-xs font-medium truncate">{cell.subjectName}</div>
                                {cell.teacherName && <div className="text-[10px] mt-0.5 opacity-70 truncate">{cell.teacherName}</div>}
                              </>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Plus className="w-4 h-4 text-text-disabled" />
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Period Modal */}
      <Modal isOpen={periodModal} onClose={() => setPeriodModal(false)} title="Add Period / Timing Slot">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Period Name (e.g., Period 8, Short Recess) <span className="text-danger-600">*</span></label>
            <input type="text" value={newPeriod.label} onChange={e => setNewPeriod(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Period 8"
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Start Time <span className="text-danger-600">*</span></label>
              <input type="time" value={newPeriod.start} onChange={e => setNewPeriod(p => ({ ...p, start: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">End Time <span className="text-danger-600">*</span></label>
              <input type="time" value={newPeriod.end} onChange={e => setNewPeriod(p => ({ ...p, end: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isBreak" checked={newPeriod.isBreak} onChange={e => setNewPeriod(p => ({ ...p, isBreak: e.target.checked }))}
              className="rounded border-border text-brand-600 focus:ring-brand-600/20" />
            <label htmlFor="isBreak" className="text-sm text-text-secondary font-medium">Is Break (Lunch/Recess)</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setPeriodModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleAddPeriod} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> Add Period
            </button>
          </div>
        </div>
      </Modal>

      {/* Assignment Modal */}
      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, day: null, slotIdx: null })}
        title={`Assign ${editModal.slotIdx !== null ? slots[editModal.slotIdx]?.label : ''} — ${editModal.day !== null ? DAYS[editModal.day] : ''}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Subject</label>
            <select value={editData.subjectId} onChange={e => setEditData(p => ({ ...p, subjectId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Teacher</label>
            <select value={editData.employeeId} onChange={e => setEditData(p => ({ ...p, employeeId: e.target.value }))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Assign Later</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name || (e.firstName + ' ' + (e.lastName || ''))}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditModal({ open: false, day: null, slotIdx: null })}
              className="px-4 py-2 text-sm text-text-secondary hover:bg-bg rounded-md">Cancel</button>
            <button onClick={handleAssign}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md inline-flex items-center gap-2">
              <Save className="w-4 h-4" /> Assign
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
