import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, User, Building2, Download } from 'lucide-react';
import api from '../../services/api';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default function TimetableGrid() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [timetableRecords, setTimetableRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/academic/courses')
      .then(res => setCourses(Array.isArray(res.data.data) ? res.data.data : []))
      .catch(() => {
        setCourses([
          { id: '1', name: 'B.Tech Computer Science' },
          { id: '2', name: 'B.Tech Electronics' },
        ]);
      });
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get('/academic/batches', { params: { courseId: selectedCourse } })
        .then(res => setBatches(Array.isArray(res.data.data) ? res.data.data : []))
        .catch(() => {
          setBatches([
            { id: '101', name: '2026-A' },
            { id: '102', name: '2026-B' },
          ]);
        });
    } else {
      setBatches([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedBatch) {
      fetchTimetable();
    } else {
      setTimetableRecords([]);
    }
  }, [selectedBatch]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/timetables/batch/${selectedBatch}`);
      setTimetableRecords(res.data.data || res.data || []);
    } catch (err) {
      // Demo timetable records
      setTimetableRecords([
        { day: 'MONDAY', startTime: '08:00', endTime: '08:45', subject: { name: 'Data Structures' }, teacher: { name: 'Dr. Anand' }, room: 'Lab 3' },
        { day: 'MONDAY', startTime: '08:45', endTime: '09:30', subject: { name: 'Algorithms' }, teacher: { name: 'Prof. Sharma' }, room: 'Hall 101' },
        { day: 'TUESDAY', startTime: '09:30', endTime: '10:15', subject: { name: 'Database Systems' }, teacher: { name: 'Dr. Singh' }, room: 'Lab 1' },
        { day: 'WEDNESDAY', startTime: '10:30', endTime: '11:15', subject: { name: 'Web Dev' }, teacher: { name: 'Ms. Gupta' }, room: 'Hall 202' },
        { day: 'THURSDAY', startTime: '11:15', endTime: '12:00', subject: { name: 'Operating Systems' }, teacher: { name: 'Dr. Anand' }, room: 'Hall 105' },
        { day: 'FRIDAY', startTime: '12:00', endTime: '12:45', subject: { name: 'Computer Networks' }, teacher: { name: 'Prof. Sharma' }, room: 'Lab 2' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    { start: '08:00', end: '08:45' },
    { start: '08:45', end: '09:30' },
    { start: '09:30', end: '10:15' },
    { start: '10:15', end: '10:30', isBreak: true },
    { start: '10:30', end: '11:15' },
    { start: '11:15', end: '12:00' },
    { start: '12:00', end: '12:45' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Class Timetable Grid</h1>
          <p className="text-sm text-muted-foreground mt-1">View weekly class schedules, faculty assignments, and rooms</p>
        </div>
        {selectedBatch && (
          <button className="secondary-button text-xs font-semibold px-4 py-2.5 inline-flex items-center gap-2">
            <Download className="w-4 h-4 text-brand" /> Export Schedule
          </button>
        )}
      </div>

      {/* Course & Batch Selection Panel */}
      <div className="glass-panel p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => { setSelectedCourse(e.target.value); setSelectedBatch(''); }}
              className="w-full px-3 py-2.5 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="">— Select Course —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={!selectedCourse}
              className="w-full px-3 py-2.5 glass-subtle border border-glass-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50"
            >
              <option value="">— Select Batch —</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Grid Schedule */}
      {selectedBatch && (
        <div className="glass-panel p-0 overflow-hidden">
          <div className="p-4 border-b border-glass-border flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground font-heading">Weekly Schedule Matrix</h3>
            <span className="text-xs text-muted-foreground font-semibold">6 Days • 7 Time Slots</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <table className="w-full text-center border-collapse text-sm">
                <thead>
                  <tr className="border-b border-glass-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                    <th className="p-3.5 border-r border-glass-border w-28 bg-card/40">Day</th>
                    {timeSlots.map((slot, i) => (
                      <th key={i} className={`p-3.5 border-r border-glass-border font-mono text-xs ${slot.isBreak ? 'bg-amber-500/10 text-amber-600 font-bold' : ''}`}>
                        {slot.start} - {slot.end}
                        {slot.isBreak && <div className="text-[10px] text-amber-600 font-normal">Break</div>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {DAYS.map((day) => (
                    <tr key={day} className="glass-card-interactive hover:bg-card/80 transition-all">
                      <td className="p-3.5 border-r border-glass-border font-bold text-xs text-foreground uppercase tracking-wider bg-card/30">
                        {day.slice(0, 3)}
                      </td>
                      {timeSlots.map((slot, idx) => {
                        if (slot.isBreak) {
                          return (
                            <td key={idx} className="p-3 border-r border-glass-border bg-amber-500/5 text-amber-600 font-semibold text-xs italic">
                              Tea / Lunch Break
                            </td>
                          );
                        }

                        const match = timetableRecords.find(
                          r => r.day === day && r.startTime === slot.start
                        );

                        return (
                          <td key={idx} className="p-2 border-r border-glass-border">
                            {match ? (
                              <div className="glass-subtle p-2.5 rounded-xl border border-glass-border space-y-1 text-left shadow-sm">
                                <p className="text-xs font-bold text-foreground truncate">{match.subject?.name || 'Subject'}</p>
                                <p className="text-[11px] text-brand flex items-center gap-1 font-medium truncate">
                                  <User className="w-3 h-3 flex-shrink-0" />
                                  {match.teacher?.name || 'Faculty'}
                                </p>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                                  <Building2 className="w-3 h-3 flex-shrink-0" />
                                  {match.room || 'Room'}
                                </p>
                              </div>
                            ) : (
                              <div className="text-muted-foreground/30 text-xs py-3">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}