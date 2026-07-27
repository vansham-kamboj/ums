import React, { useState, useEffect } from 'react';
import { Clock, CalendarDays, Monitor } from 'lucide-react';
import api from '../../services/api';

export default function MyTimetable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await api.get('/timetables/my');
        setData(res.data.data);
      } catch (err) {
        // Mock data for development
        setData({
          schedule: {
            'Monday': [
              { time: '09:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'John Doe', room: 'Room 101' },
              { time: '10:00 AM - 11:00 AM', subject: 'Physics', teacher: 'Jane Smith', room: 'Lab 2' },
              { time: '11:15 AM - 12:15 PM', subject: 'English', teacher: 'Emily Davis', room: 'Room 102' }
            ],
            'Tuesday': [
              { time: '09:00 AM - 10:00 AM', subject: 'Chemistry', teacher: 'Alan Walker', room: 'Lab 1' },
              { time: '10:00 AM - 11:00 AM', subject: 'Mathematics', teacher: 'John Doe', room: 'Room 101' }
            ]
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-ink-200 rounded"></div>
        <div className="h-96 bg-ink-200 rounded-md"></div>
      </div>
    );
  }

  const todaySchedule = data?.schedule?.[selectedDay] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Timetable</h2>
          <p className="text-sm text-text-secondary mt-1">View your daily class schedule and subjects.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="border-b border-border flex overflow-x-auto no-scrollbar">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                selectedDay === day 
                  ? 'border-brand-500 text-brand-500 bg-brand-500/5' 
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        
        <div className="p-5">
          {todaySchedule.length > 0 ? (
            <div className="space-y-4">
              {todaySchedule.map((slot, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-md border border-border hover:border-brand-500/30 hover:bg-brand-500/5 transition-all">
                  <div className="flex items-center gap-2 text-brand-500 min-w-[180px]">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold text-sm">{slot.time}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-text-primary">{slot.subject}</h4>
                    <p className="text-sm text-text-secondary mt-0.5">Teacher: {slot.teacher}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-text-disabled">
                    <Monitor className="w-4 h-4" />
                    <span className="text-sm font-medium">{slot.room}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <CalendarDays className="w-12 h-12 text-text-disabled mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-1">No Classes Scheduled</h3>
              <p className="text-sm text-text-secondary">Enjoy your day off!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
