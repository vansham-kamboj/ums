import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, CalendarDays, DollarSign, Award, Clock, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/ui/StatCard';

export default function ChildDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const res = await api.get(`/guardians/my-children/${id}`);
        setChild(res.data.data);
      } catch (err) {
        // Mock data
        setChild({
          id,
          firstName: 'Aarav',
          lastName: 'Sharma',
          admissionNumber: 'ADM-2026-001',
          course: { name: 'Class 10' },
          batch: { name: 'Section A' },
          attendancePercentage: 88,
          feeDue: 5000,
          latestGrade: 'A+'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchChildDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-ink-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="h-24 bg-ink-200 rounded-md"></div>
          <div className="h-24 bg-ink-200 rounded-md"></div>
          <div className="h-24 bg-ink-200 rounded-md"></div>
          <div className="h-24 bg-ink-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/guardian/children')} className="p-2 bg-surface border border-border rounded-md hover:bg-bg transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{child?.firstName}'s Dashboard</h2>
          <p className="text-sm text-text-secondary mt-1">{child?.course?.name} • {child?.batch?.name} (Adm No: {child?.admissionNumber})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Attendance" value={`${child?.attendancePercentage || 0}%`} icon={CalendarDays} color="blue" />
        <StatCard title="Fee Dues" value={`₹${child?.feeDue || 0}`} icon={DollarSign} color={child?.feeDue > 0 ? 'danger' : 'success'} />
        <StatCard title="Latest Grade" value={child?.latestGrade || 'N/A'} icon={Award} color="success" />
        <StatCard title="Classes Today" value="5" icon={Clock} color="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Quick Links / Tabs representation */}
         <div className="bg-surface border border-border rounded-md p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Academic Overview</h3>
            <p className="text-sm text-text-secondary mb-6">Detailed performance and schedule tracking.</p>
            <div className="space-y-3">
              <button onClick={() => navigate(`/guardian/child-attendance/${id}`)} className="w-full flex items-center justify-between p-3 bg-bg border border-border rounded-md hover:border-brand-500 transition-colors">
                <span className="font-medium text-text-primary">Detailed Attendance</span>
                <CalendarDays className="w-4 h-4 text-brand-500" />
              </button>
              <button onClick={() => navigate(`/guardian/child-results/${id}`)} className="w-full flex items-center justify-between p-3 bg-bg border border-border rounded-md hover:border-brand-500 transition-colors">
                <span className="font-medium text-text-primary">Exam Results</span>
                <Award className="w-4 h-4 text-brand-500" />
              </button>
              <button onClick={() => navigate(`/guardian/child-timetable/${id}`)} className="w-full flex items-center justify-between p-3 bg-bg border border-border rounded-md hover:border-brand-500 transition-colors">
                <span className="font-medium text-text-primary">Class Timetable</span>
                <Clock className="w-4 h-4 text-brand-500" />
              </button>
            </div>
         </div>

         <div className="bg-surface border border-border rounded-md p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Facilities & Finance</h3>
            <p className="text-sm text-text-secondary mb-6">Manage payments and check facility usage.</p>
            <div className="space-y-3">
              <button onClick={() => navigate(`/guardian/child-fees/${id}`)} className="w-full flex items-center justify-between p-3 bg-bg border border-border rounded-md hover:border-brand-500 transition-colors">
                <span className="font-medium text-text-primary">Fee Records & Payments</span>
                <DollarSign className="w-4 h-4 text-brand-500" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-bg border border-border rounded-md hover:border-brand-500 transition-colors">
                <span className="font-medium text-text-primary">Transport Details</span>
                <Clock className="w-4 h-4 text-brand-500" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
