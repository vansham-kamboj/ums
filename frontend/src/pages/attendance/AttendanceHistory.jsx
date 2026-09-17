import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AttendanceHistory({ studentId, studentName, embedded = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    generateDemoData();
  }, [currentDate]);

  const generateDemoData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};
    const today = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date > today) continue;
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0) continue; // Sunday off

      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rand = Math.random();
      if (rand < 0.75) data[key] = 'present';
      else if (rand < 0.88) data[key] = 'absent';
      else if (rand < 0.95) data[key] = 'late';
      else data[key] = 'holiday';
    }
    setAttendanceData(data);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const totalDays = Object.keys(attendanceData).filter(k => attendanceData[k] !== 'holiday').length;
  const presentDays = Object.values(attendanceData).filter(v => v === 'present').length;
  const absentDays = Object.values(attendanceData).filter(v => v === 'absent').length;
  const lateDays = Object.values(attendanceData).filter(v => v === 'late').length;
  const pct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const getCellColor = (status) => {
    switch (status) {
      case 'present': return 'bg-emerald-500 text-white font-bold shadow-sm';
      case 'absent': return 'bg-rose-500 text-white font-bold shadow-sm';
      case 'late': return 'bg-amber-500 text-white font-bold shadow-sm';
      case 'holiday': return 'glass-subtle text-muted-foreground/60';
      default: return 'glass-subtle text-muted-foreground';
    }
  };

  return (
    <div className={`space-y-6 ${embedded ? '' : 'animate-fade-in pb-12'}`}>
      {!embedded && (
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">
            {studentName ? `${studentName}'s Attendance` : 'Attendance History'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Visual calendar showing daily attendance records</p>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-muted-foreground">Present</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-heading">{presentDays}</p>
        </div>

        <div className="glass-panel p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-muted-foreground">Absent</span>
          </div>
          <p className="text-2xl font-bold text-rose-500 font-heading">{absentDays}</p>
        </div>

        <div className="glass-panel p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-muted-foreground">Late</span>
          </div>
          <p className="text-2xl font-bold text-amber-600 font-heading">{lateDays}</p>
        </div>

        <div className="glass-panel p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4 text-brand" />
            <span className="text-xs font-semibold text-muted-foreground">Attendance Rate</span>
          </div>
          <p className="text-2xl font-bold text-brand font-heading">{pct}%</p>
        </div>
      </div>

      {/* Interactive Calendar Panel */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-glass-border pb-4">
          <h2 className="text-lg font-bold text-foreground font-heading">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="secondary-button p-2" title="Previous Month">
              <ChevronLeft className="w-4 h-4 text-brand" />
            </button>
            <button onClick={nextMonth} className="secondary-button p-2" title="Next Month">
              <ChevronRight className="w-4 h-4 text-brand" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground">
          {DAYS_OF_WEEK.map(day => <div key={day} className="py-1.5">{day}</div>)}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="h-12 rounded-xl" />;
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const status = attendanceData[key];

            return (
              <div
                key={day}
                className={`h-12 rounded-xl p-2 flex flex-col justify-between items-center transition-all ${getCellColor(status)}`}
              >
                <span className="text-xs font-bold font-mono">{day}</span>
                {status && status !== 'holiday' && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90">{status}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
