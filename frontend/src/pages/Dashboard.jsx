import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, DollarSign, BookOpen, CalendarDays, TrendingUp, Clock, Cake } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/ui/StatCard';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

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
        // Use fallback data if backend is not connected
        setStats({
          totalStudents: 0,
          totalEmployees: 0,
          totalCourses: 0,
          revenue: 0,
          recentActivity: [],
          enrollmentData: [],
          feeData: [],
          birthdays: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-ink-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-ink-200 rounded-md p-5 h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (user?.scope === 'STUDENT') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Welcome back, {user?.firstName || 'Student'}!</h2>
          <p className="text-sm text-text-secondary mt-0.5">Here is an overview of your academic progress.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Attendance" value="85%" icon={CalendarDays} color="blue" />
          <StatCard title="Upcoming Exams" value="2" icon={BookOpen} color="purple" />
          <StatCard title="Assignments Pending" value="3" icon={Clock} color="orange" />
          <StatCard title="Pending Fees" value="₹0" icon={DollarSign} color="success" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-md border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand-500" /> Today's Schedule
            </h3>
            <div className="text-sm text-text-secondary py-4 text-center">No classes scheduled for today.</div>
          </div>
          <div className="bg-surface rounded-md border border-border p-5">
            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" /> Recent Activity
            </h3>
            <div className="text-sm text-text-secondary py-4 text-center">You are all caught up!</div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.scope === 'GUARDIAN') {
    return <Navigate to="/guardian/children" replace />;
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
        <p className="text-sm text-text-secondary mt-0.5">Welcome back! Here's an overview of your institution.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Students" value={stats?.totalStudents?.toLocaleString() || 1250} trend="+5%" icon={Users} color="blue" />
        <StatCard title="Total Employees" value={stats?.totalEmployees?.toLocaleString() || 145} trend="+2%" icon={GraduationCap} color="purple" />
        <StatCard title="Active Courses" value={stats?.totalCourses?.toLocaleString() || 42} icon={BookOpen} color="orange" />
        <StatCard title="Today's Collection" value={`₹${stats?.revenue?.toLocaleString() || '1,25,000'}`} trend="+12%" icon={DollarSign} color="success" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-md border border-border p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-text-primary mb-6">Enrollment Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b949e', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '6px' }} />
                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface rounded-md border border-border p-5">
          <h3 className="text-base font-semibold text-text-primary mb-6">Fee Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={feeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9', borderRadius: '6px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-3 mt-4">
            {feeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                <span className="text-xs text-text-secondary">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-md border border-border p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Recent Activity</h3>
            <button className="text-sm text-brand-500 hover:text-brand-400 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  activity.type === 'student' ? 'bg-blue-500/10 text-blue-500' :
                  activity.type === 'fee' ? 'bg-green-500/10 text-green-500' :
                  activity.type === 'hr' ? 'bg-purple-500/10 text-purple-500' :
                  'bg-orange-500/10 text-orange-500'
                }`}>
                  {activity.type === 'student' && <Users className="w-4 h-4" />}
                  {activity.type === 'fee' && <DollarSign className="w-4 h-4" />}
                  {activity.type === 'hr' && <TrendingUp className="w-4 h-4" />}
                  {activity.type === 'exam' && <BookOpen className="w-4 h-4" />}
                  {activity.type === 'comm' && <CalendarDays className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-md border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">Today's Birthdays</h3>
            <Cake className="w-5 h-5 text-brand-500" />
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              🎉
            </div>
            <p className="text-sm font-medium text-text-primary">No birthdays today!</p>
            <p className="text-xs text-text-secondary mt-1">Check back tomorrow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
