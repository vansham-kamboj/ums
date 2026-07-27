import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function MarksEntry() {
  const toast = useToast();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState({});
  const [maxMarks, setMaxMarks] = useState(100);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/exams').then(r => setExams(Array.isArray(r.data.data) ? r.data.data : [])).catch(() => {});
    api.get('/academic/subjects').then(r => setSubjects(Array.isArray(r.data.data) ? r.data.data : [])).catch(() => {});
  }, []);

  const loadStudents = async () => {
    if (!selectedExam || !selectedSubject) return;
    setLoading(true);
    try {
      const res = await api.get('/students', { params: { limit: 200 } });
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setStudents(list);
      const init = {};
      list.forEach(s => { init[s.id] = ''; });
      setMarks(init);
    } catch { setStudents([]); }
    finally { setLoading(false); }
  };

  const handleMarkChange = (studentId, value) => {
    const num = value === '' ? '' : Math.min(Math.max(0, Number(value)), maxMarks);
    setMarks(prev => ({ ...prev, [studentId]: num }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = Object.entries(marks).filter(([, v]) => v !== '').map(([studentId, obtained]) => ({
        studentId, examId: selectedExam, subjectId: selectedSubject, obtainedMarks: Number(obtained), maxMarks,
      }));
      await api.post('/exams/records', { records });
      toast.success('Marks saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save marks');
    } finally { setSaving(false); }
  };

  const getGrade = (obtained) => {
    if (obtained === '' || obtained === undefined) return '';
    const pct = (Number(obtained) / maxMarks) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  const gradeColor = (grade) => {
    const colors = { 'A+': 'text-success-600', 'A': 'text-success-600', 'B+': 'text-brand-600', 'B': 'text-brand-600', 'C': 'text-warning-600', 'D': 'text-orange-600', 'F': 'text-danger-600' };
    return colors[grade] || 'text-text-secondary';
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Marks Entry</h2>
        <p className="text-sm text-text-secondary mt-0.5">Select exam and subject to enter student marks</p>
      </div>

      <div className="bg-surface rounded-md border border-border p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Exam</label>
            <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Exam</option>
              {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Subject</label>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500">
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Marks</label>
            <input type="number" value={maxMarks} onChange={e => setMaxMarks(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
          <div className="flex items-end">
            <button onClick={loadStudents} disabled={!selectedExam || !selectedSubject}
              className="w-full px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md text-sm disabled:opacity-50 transition-colors">
              Load Students
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : students.length > 0 && (
        <>
          <div className="bg-surface rounded-md border border-border overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg border-b border-border">
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase w-12">#</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Student</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase">Adm. No</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase w-32">Marks (/{maxMarks})</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase w-20">%</th>
                  <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase w-20">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, idx) => {
                  const obtained = marks[student.id];
                  const pct = obtained !== '' && obtained !== undefined ? ((Number(obtained) / maxMarks) * 100).toFixed(1) : '';
                  const grade = getGrade(obtained);
                  return (
                    <tr key={student.id} className="hover:bg-bg">
                      <td className="px-5 py-3 text-sm text-text-disabled">{idx + 1}</td>
                      <td className="px-5 py-3 text-sm font-medium text-text-primary">{student.firstName} {student.lastName}</td>
                      <td className="px-5 py-3 text-sm text-text-secondary">{student.admissionNumber || '—'}</td>
                      <td className="px-5 py-3">
                        <input type="number" min={0} max={maxMarks} value={obtained} onChange={e => handleMarkChange(student.id, e.target.value)}
                          className="w-24 px-3 py-1.5 border border-border rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-text-secondary">{pct ? `${pct}%` : '—'}</td>
                      <td className={`px-5 py-3 text-sm font-bold ${gradeColor(grade)}`}>{grade || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md shadow-sm disabled:opacity-50 transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Marks'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
