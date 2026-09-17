import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, DollarSign, BookOpen, CalendarDays, TrendingUp, Clock, Cake, Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const endpoint = user?.scope === 'STUDENT' ? '/dashboard/student' : user?.scope === 'GUARDIAN' ? '/dashboard/guardian' : '/dashboard/admin';
        const res = await api.get(endpoint);
        setStats(res.data.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/40 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (user?.scope === 'GUARDIAN') {
    return <Navigate to="/guardian/children" replace />;
  }

  const isStudent = user?.scope === 'STUDENT';
  const isTeacher = user?.scope === 'EMPLOYEE' && user?.role === 'TEACHER';

  // Stats definition based on role
  const statsItems = isStudent
    ? [
        { label: "Attendance this month", value: "94.2%", detail: "2 days absent", status: 0 },
        { label: "Fee due", value: "₹12,500", detail: "Due 30 Sep", status: 1 },
        { label: "Latest result", value: "A−", detail: "Mathematics · 86/100", status: 2 },
        { label: "Class rank", value: "08", detail: "of 42 students", status: 3 },
      ]
    : isTeacher
    ? [
        { label: "Assigned classes", value: "4", detail: "142 students", status: 0 },
        { label: "Today's periods", value: "5", detail: "Next at 10:20 AM", status: 1 },
        { label: "Attendance", value: "92.8%", detail: "Across your classes", status: 2 },
        { label: "Marks pending", value: "2", detail: "Due this Friday", status: 3 },
      ]
    : [
        { label: "Enrolled students", value: stats?.totalStudents?.toLocaleString() || "1,284", detail: "+38 this term", status: 0 },
        { label: "Active teachers", value: stats?.totalEmployees?.toLocaleString() || "64", detail: "3 on leave", status: 1 },
        { label: "Attendance today", value: "94.2%", detail: "17 absences", status: 2 },
        { label: "Pending fees", value: `₹${stats?.revenue ? (stats.revenue / 100000).toFixed(1) + 'L' : '12.2L'}`, detail: "78% collected", status: 3 },
      ];

  const todayClasses = isStudent
    ? [
        { title: "Mathematics", detail: "10:20 AM · Ms. Rao", room: "Room 204", badge: "1A", classIdx: 0 },
        { title: "English", detail: "11:15 AM · Ms. Kapoor", room: "Room 108", badge: "2B", classIdx: 1 },
        { title: "Physics", detail: "01:00 PM · Mr. Iyer", room: "Lab 2", badge: "3C", classIdx: 2 },
      ]
    : [
        { title: "Grade 10 · Mathematics", detail: "28 present · 2 absent", stat: "93%", statSub: "93%", badge: "1A", classIdx: 0 },
        { title: "Grade 9 · English", detail: "31 present · 1 absent", stat: "97%", statSub: "97%", badge: "2B", classIdx: 1 },
        { title: "Grade 11 · Chemistry", detail: "24 present · 5 absent", stat: "83%", statSub: "83%", badge: "3C", classIdx: 2 },
      ];

  const notices = [
    { title: "Mid-term exams begin Monday", meta: "Academics · 2h ago" },
    { title: "Fee deadline extended to 30 Sep", meta: "Finance office · 6h ago" },
    { title: "Science fair venue moved", meta: "Activities · 1d ago" },
  ];

  const enrollmentData = stats?.enrollmentData?.length > 0 ? stats.enrollmentData : [
    { month: 'Jan', students: 120 }, { month: 'Feb', students: 135 }, { month: 'Mar', students: 160 },
    { month: 'Apr', students: 145 }, { month: 'May', students: 180 }, { month: 'Jun', students: 210 },
    { month: 'Jul', students: 195 }, { month: 'Aug', students: 250 }, { month: 'Sep', students: 280 },
    { month: 'Oct', students: 260 }, { month: 'Nov', students: 240 }, { month: 'Dec', students: 220 },
  ];

  const feeData = stats?.feeData?.length > 0 ? stats.feeData : [
    { name: 'Tuition', value: 45 }, { name: 'Lab', value: 15 }, { name: 'Library', value: 10 },
    { name: 'Transport', value: 15 }, { name: 'Hostel', value: 10 }, { name: 'Other', value: 5 },
  ];

  const recentActivity = stats?.recentActivity?.length > 0 ? stats.recentActivity : [
    { action: 'New student registered', time: '2 hours ago', type: 'student' },
    { action: 'Fee payment received — ₹15,000', time: '3 hours ago', type: 'fee' },
    { action: 'Leave request approved', time: '4 hours ago', type: 'hr' },
    { action: 'Exam schedule published', time: '5 hours ago', type: 'exam' },
    { action: 'New announcement posted', time: '6 hours ago', type: 'comm' },
  ];

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Section Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isStudent ? "My dashboard" : isTeacher ? "Teaching overview" : "School overview"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent ? "Your academic snapshot for Grade 10 · Section A" : isTeacher ? "Your classes, schedule, and pending academic tasks" : "A live summary of Aurora Academy today"}
          </p>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <section className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {statsItems.map((item, index) => (
          <div key={item.label} className="glass-panel rounded-2xl p-4 sm:p-5 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
              <span className={`status-light status-${item.status}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold sm:text-3xl text-foreground tracking-tight">{item.value}</p>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </section>

      {/* Main Grid: Today's Attendance / Timetable & Latest Notices */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Left Section: Today's Attendance or Timetable */}
        <section className="glass-panel rounded-2xl p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="panel-title font-bold text-foreground">
              {isStudent ? "Today's timetable" : isTeacher ? "My class attendance" : "Today's attendance"}
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground">16 September</span>
          </div>
          <div className="space-y-2.5">
            {todayClasses.map((item) => (
              <div key={item.title} className="glass-row">
                <div className={`class-icon class-${item.classIdx}`}>
                  {isStudent ? <Clock className="w-4 h-4 text-white" /> : item.badge}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
                {item.stat ? (
                  <div className="ml-auto text-right shrink-0">
                    <p className="text-xs font-bold text-emerald-500">{item.stat}</p>
                    <p className="text-[10px] text-muted-foreground">{item.statSub}</p>
                  </div>
                ) : item.room ? (
                  <div className="ml-auto text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                      {item.room}
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Right Section: Latest Notices */}
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="panel-title font-bold text-foreground">Latest notices</h2>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice.title} className="glass-row block hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer">
                <p className="text-sm font-bold text-foreground">{notice.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{notice.meta}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Analytics Charts & Activity Section */}
      {!isStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-5 lg:col-span-2 border border-white/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="panel-title font-bold text-foreground">Enrollment Trends</h3>
              <span className="text-xs text-muted-foreground">Academic Year 2026</span>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.15)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.6)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="students" fill="url(#brandGradient)" radius={[6, 6, 0, 0]} barSize={24} />
                  <defs>
                    <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/60">
            <h3 className="panel-title font-bold text-foreground mb-4">Fee Distribution</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={feeData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {feeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-y-2 mt-2">
              {feeData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span className="text-xs font-semibold text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity & Birthdays Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 lg:col-span-2 border border-white/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="panel-title font-bold text-foreground">Recent Activity</h3>
            <button className="text-xs font-semibold text-brand hover:underline">View All Logs</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3.5 p-2.5 rounded-xl glass-subtle">
                <div className={`p-2 rounded-xl text-white ${
                  activity.type === 'student' ? 'bg-blue-500' :
                  activity.type === 'fee' ? 'bg-emerald-500' :
                  activity.type === 'hr' ? 'bg-purple-500' : 'bg-amber-500'
                }`}>
                  {activity.type === 'student' && <Users className="w-4 h-4" />}
                  {activity.type === 'fee' && <DollarSign className="w-4 h-4" />}
                  {activity.type === 'hr' && <TrendingUp className="w-4 h-4" />}
                  {activity.type === 'exam' && <BookOpen className="w-4 h-4" />}
                  {activity.type === 'comm' && <CalendarDays className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{activity.action}</p>
                  <p className="text-[11px] text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="panel-title font-bold text-foreground">Today's Birthdays</h3>
            <Cake className="w-4 h-4 text-brand" />
          </div>
          <div className="text-center py-6 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand/20 to-purple-500/20 text-brand font-bold flex items-center justify-center mx-auto text-2xl shadow-inner border border-brand/20">
              🎂
            </div>
            <p className="text-sm font-bold text-foreground">No birthdays today</p>
            <p className="text-xs text-muted-foreground">Check back tomorrow for campus celebrations.</p>
          </div>
          <div className="p-3 rounded-xl glass-subtle text-center text-xs text-muted-foreground font-medium">
            Term 1 · Week 8
          </div>
        </div>
      </div>
    </div>
  );
}

