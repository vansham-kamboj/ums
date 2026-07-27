import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Activity, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function MyProfile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/students/my-profile');
        setData(res.data.data);
      } catch (err) {
        // Mock data
        setData({
          firstName: user?.firstName || 'Student',
          lastName: user?.lastName || 'Name',
          email: user?.email || 'student@example.com',
          phone: '+91 9876543210',
          admissionNumber: 'ADM-2026-001',
          dateOfBirth: '2010-05-15',
          bloodGroup: 'O+',
          address: '123, Education Lane, Knowledge City',
          course: { name: 'Class 10' },
          batch: { name: 'Section A' }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-ink-200 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-ink-200 rounded-md"></div>
          <div className="h-64 bg-ink-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">My Profile</h2>
        <button className="px-4 py-2 bg-surface border border-border text-text-primary rounded-md text-sm font-medium hover:bg-bg transition-colors flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Request Update
        </button>
      </div>

      <div className="bg-surface border border-border rounded-md p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold border-4 border-surface shadow-sm">
          {data?.firstName?.charAt(0)}{data?.lastName?.charAt(0)}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary">{data?.firstName} {data?.lastName}</h3>
          <p className="text-text-secondary mt-1">{data?.course?.name} • {data?.batch?.name}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm font-medium text-text-primary">
            <span className="px-3 py-1 bg-ink-100 dark:bg-ink-800 rounded-full">Adm No: {data?.admissionNumber}</span>
            <span className="px-3 py-1 bg-ink-100 dark:bg-ink-800 rounded-full">Blood Group: {data?.bloodGroup}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2 bg-ink-800">
            <User className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-text-primary">Personal Details</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-text-disabled mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-secondary">Email Address</p>
                <p className="text-sm text-text-primary">{data?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-text-disabled mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-secondary">Phone Number</p>
                <p className="text-sm text-text-primary">{data?.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-text-disabled mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-secondary">Date of Birth</p>
                <p className="text-sm text-text-primary">
                  {data?.dateOfBirth ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(new Date(data.dateOfBirth)) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-text-disabled mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-secondary">Residential Address</p>
                <p className="text-sm text-text-primary">{data?.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2 bg-ink-800">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-semibold text-text-primary">Academic Info</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-text-disabled mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-secondary">Current Status</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-success-500/10 text-success-500 text-xs font-medium rounded-full">Active</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-text-disabled mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-secondary">Enrolled Course</p>
                <p className="text-sm text-text-primary">{data?.course?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
