import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users, Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function MarkAttendance() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/academic/courses').then(res => setCourses(Array.isArray(res.data.data) ? res.data.data : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get('/academic/batches', { params: { courseId: selectedCourse } }).then(res => setBatches(Array.isArray(res.data.data) ? res.data.data : [])).catch(() => {});
    }
  }, [selectedCourse]);

  const fetchStudents = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const res = await api.get('/students', { params: { batchId: selectedBatch, limit: 200 } });
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setStudents(list);
      const init = {};
      list.forEach(s => { init[s.id] = 'present'; });
      setAttendance(init);
    } catch { setStudents([]); }
    finally { setLoading(false); }
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status, date }));
      await api.post('/attendance/students/mark', { batchId: selectedBatch, date, records });
      toast.success('Attendance saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally { setSaving(false); }
  };

  const statusColors = {
    present: 'bg-success-50 border-success-500 text-success-700',
    absent: 'bg-danger-50 border-danger-500 text-danger-700',
    late: 'bg-warning-50 border-warning-500 text-warning-600',
    half_day: 'bg-brand-100 border-primary-500 text-brand-600',
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Mark Attendance</h2>
        <p className="text-sm text-text-secondary mt-0.5">Select course, batch and date to mark student attendance</p>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-md border border-border p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Course</label>
            <select value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setSelectedBatch(''); setStudents([]); }}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Batch</label>
            <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Batch</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="flex items-end">
            <button onClick={fetchStudents} disabled={!selectedBatch}
              className="w-full px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md text-sm disabled:opacity-50 transition-colors">
              Load Students
            </button>
          </div>
        </div>
      </div>

      {/* Student List */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : students.length > 0 && (
        <>
          {/* Summary & Bulk Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-text-disabled" />
                <span className="font-medium">{students.length} Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-success-600">
                <CheckCircle className="w-4 h-4" />
                {presentCount} Present
              </div>
              <div className="flex items-center gap-2 text-sm text-danger-600">
                <XCircle className="w-4 h-4" />
                {absentCount} Absent
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => markAll('present')} className="px-3 py-1.5 bg-success-50 text-success-700 rounded-md text-sm font-medium hover:bg-success-100">Mark All Present</button>
              <button onClick={() => markAll('absent')} className="px-3 py-1.5 bg-danger-50 text-danger-700 rounded-md text-sm font-medium hover:bg-danger-100">Mark All Absent</button>
            </div>
          </div>

          <div className="bg-surface rounded-md border border-border overflow-hidden">
            <div className="divide-y divide-gray-100">
              {students.map((student, idx) => (
                <div key={student.id} className="flex items-center justify-between px-5 py-3 hover:bg-bg">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-text-disabled w-6">{idx + 1}</span>
                    <div className="w-9 h-9 rounded-md bg-brand-100 flex items-center justify-center text-brand-600 font-medium text-sm">
                      {(student.firstName?.[0] || '') + (student.lastName?.[0] || '')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-text-disabled">{student.admissionNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['present', 'absent', 'late', 'half_day'].map(status => (
                      <button
                        key={status}
                        onClick={() => setAttendance(prev => ({ ...prev, [student.id]: status }))}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all capitalize ${
                          attendance[student.id] === status ? statusColors[status] : 'border-border text-text-disabled hover:border-border'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md shadow-sm disabled:opacity-50 transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
