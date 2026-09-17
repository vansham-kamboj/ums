import { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, TrendingDown, Calendar, Download, Filter, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';

export default function AttendanceReports() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [view, setView] = useState('by-student'); // by-student | by-date
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    api.get('/academic/courses').then(r => setCourses(Array.isArray(r.data.data) ? r.data.data : [])).catch(() => {});
    generateDemoData();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get('/academic/batches', { params: { courseId: selectedCourse } }).then(r => setBatches(Array.isArray(r.data.data) ? r.data.data : [])).catch(() => {});
    }
  }, [selectedCourse]);

  const generateDemoData = () => {
    const students = [
      { name: 'Aarav Sharma', admNo: 'STU-001', present: 22, absent: 2, late: 1, total: 25 },
      { name: 'Priya Patel', admNo: 'STU-002', present: 24, absent: 1, late: 0, total: 25 },
      { name: 'Rohit Kumar', admNo: 'STU-003', present: 18, absent: 5, late: 2, total: 25 },
      { name: 'Sneha Gupta', admNo: 'STU-004', present: 23, absent: 1, late: 1, total: 25 },
      { name: 'Vikram Singh', admNo: 'STU-005', present: 20, absent: 3, late: 2, total: 25 },
      { name: 'Ananya Mishra', admNo: 'STU-006', present: 25, absent: 0, late: 0, total: 25 },
      { name: 'Karan Joshi', admNo: 'STU-007', present: 15, absent: 8, late: 2, total: 25 },
      { name: 'Meera Reddy', admNo: 'STU-008', present: 21, absent: 2, late: 2, total: 25 },
    ];
    setReportData(students);
  };

  const overallPct = reportData.length > 0
    ? Math.round(reportData.reduce((s, r) => s + (r.present / r.total) * 100, 0) / reportData.length)
    : 0;
  const totalPresent = reportData.reduce((s, r) => s + r.present, 0);
  const totalAbsent = reportData.reduce((s, r) => s + r.absent, 0);
  const totalLate = reportData.reduce((s, r) => s + r.late, 0);
  const chronicallyAbsent = reportData.filter(r => (r.absent / r.total) * 100 > 25).length;

  const getAttendancePctColor = (pct) => {
    if (pct >= 90) return 'text-emerald-600';
    if (pct >= 75) return 'text-amber-600';
    return 'text-rose-500';
  };

  const getBarColor = (pct) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Attendance Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analyze attendance trends and track student absenteeism</p>
        </div>
        <button className="secondary-button text-xs font-semibold px-4 py-2.5 inline-flex items-center gap-2">
          <Download className="w-4 h-4 text-brand" /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Overall Attendance</span>
            <BarChart3 className="w-4 h-4 text-brand" />
          </div>
          <p className={`text-2xl font-bold font-heading ${getAttendancePctColor(overallPct)}`}>{overallPct}%</p>
          <div className="w-full h-1.5 glass-subtle rounded-full mt-3 overflow-hidden">
            <div className={`h-full rounded-full ${getBarColor(overallPct)}`} style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Present Days</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-heading">{totalPresent}</p>
          <p className="text-xs text-muted-foreground mt-1">Across all students</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Absent Days</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-500 font-heading">{totalAbsent}</p>
          <p className="text-xs text-muted-foreground mt-1">Recorded absences</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Chronic Absenteeism</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 font-heading">{chronicallyAbsent} Students</p>
          <p className="text-xs text-muted-foreground mt-1">Attendance below 75%</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2 border-b border-glass-border">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); setSelectedBatch(''); }}
              className="px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            >
              <option value="">All Courses</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="px-3 py-2 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none"
            >
              <option value="">All Batches</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Admission No</th>
                <th className="px-5 py-3.5 text-center">Present</th>
                <th className="px-5 py-3.5 text-center">Absent</th>
                <th className="px-5 py-3.5 text-center">Late</th>
                <th className="px-5 py-3.5 text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {reportData.map((row, idx) => {
                const pct = Math.round((row.present / row.total) * 100);
                return (
                  <tr key={idx} className="glass-card-interactive hover:bg-card/80 transition-all">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-foreground">{row.name}</div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{row.admNo}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-emerald-600">{row.present}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-rose-500">{row.absent}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-amber-600">{row.late}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`font-bold font-mono text-sm ${getAttendancePctColor(pct)}`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
