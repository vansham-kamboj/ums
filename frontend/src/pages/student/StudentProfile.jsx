import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Phone, MapPin, Calendar, FileText, Activity, CreditCard, Award, BookOpen, ChevronLeft, Mail, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'fees' && fees.length === 0) fetchFees();
    if (activeTab === 'attendance' && attendance.length === 0) fetchAttendance();
    if (activeTab === 'exams' && exams.length === 0) fetchExams();
    if (activeTab === 'documents' && documents.length === 0) fetchDocuments();
  }, [activeTab]);

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/students/${id}`);
      setStudent(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try { const res = await api.get(`/students/${id}/fees`); setFees(res.data.data); } catch (e) {}
  };
  const fetchAttendance = async () => {
    try { const res = await api.get(`/students/${id}/attendance`); setAttendance(res.data.data); } catch (e) {}
  };
  const fetchExams = async () => {
    try { const res = await api.get(`/students/${id}/exam-records`); setExams(res.data.data); } catch (e) {}
  };
  const fetchDocuments = async () => {
    try { const res = await api.get(`/students/${id}/documents`); setDocuments(res.data.data); } catch (e) {}
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
      <div className="w-10 h-10 border-3 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">Loading Student Profile...</p>
    </div>
  );

  if (!student) return (
    <div className="glass-panel p-8 text-center max-w-lg mx-auto mt-12">
      <h2 className="text-xl font-bold text-foreground">Student Not Found</h2>
      <Link to="/students" className="secondary-button mt-6">
        <ChevronLeft className="w-4 h-4 mr-1" /> Return to Directory
      </Link>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'fees', label: 'Fees & Ledger', icon: CreditCard },
    { id: 'exams', label: 'Exams/Results', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header Profile Glass Card */}
      <div className="glass-panel overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-brand via-brand-soft to-accent opacity-90"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end -mt-12 mb-6 gap-4">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 rounded-2xl bg-card p-1.5 shadow-xl border border-glass-border">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-brand to-brand-soft text-white flex items-center justify-center text-3xl font-bold font-heading shadow-inner">
                  {student.firstName.charAt(0)}{student.lastName?.charAt(0)}
                </div>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Active Enrolled
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground font-heading mt-1">{student.firstName} {student.lastName}</h1>
                <p className="text-muted-foreground text-xs mt-0.5">{student.email || 'No email specified'}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link to="/students" className="secondary-button text-xs">
                <ChevronLeft className="w-4 h-4" /> Back to Directory
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/60">
            <div className="glass-subtle p-3 rounded-xl">
              <p className="text-[11px] text-muted-foreground mb-0.5">Roll / Admission No</p>
              <p className="font-bold text-sm text-foreground">{student.admissionNumber || 'N/A'}</p>
            </div>
            <div className="glass-subtle p-3 rounded-xl">
              <p className="text-[11px] text-muted-foreground mb-0.5">Phone Number</p>
              <p className="font-bold text-sm text-foreground">{student.phone || 'N/A'}</p>
            </div>
            <div className="glass-subtle p-3 rounded-xl">
              <p className="text-[11px] text-muted-foreground mb-0.5">Gender / DOB</p>
              <p className="font-bold text-sm text-foreground">{student.gender || 'N/A'} • {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="glass-subtle p-3 rounded-xl">
              <p className="text-[11px] text-muted-foreground mb-0.5">Academic Status</p>
              <p className="font-bold text-sm text-brand">{student.enrollmentStatus || 'Active'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'glass-subtle text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="glass-panel p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-foreground font-heading">Personal Information</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Full Name:</strong> {student.firstName} {student.lastName}</p>
                <p><strong className="text-foreground">Email:</strong> {student.email || 'N/A'}</p>
                <p><strong className="text-foreground">Phone:</strong> {student.phone || 'N/A'}</p>
                <p><strong className="text-foreground">Address:</strong> {student.address || 'N/A'}</p>
                <p><strong className="text-foreground">City/State:</strong> {student.city} {student.state}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-foreground font-heading">Academic Record</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Admission No:</strong> {student.admissionNumber || 'N/A'}</p>
                <p><strong className="text-foreground">Enrollment Date:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
                <p><strong className="text-foreground">Current Status:</strong> {student.enrollmentStatus || 'Active'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Fee Accounts & Transactions</h3>
            {fees.length === 0 ? (
              <p className="text-xs text-muted-foreground">No fee records found for this student.</p>
            ) : (
              <div className="space-y-2">
                {fees.map(f => (
                  <div key={f.id} className="glass-subtle p-3 rounded-xl flex justify-between text-xs">
                    <span>{f.feeStructure?.name || 'Academic Fee'}</span>
                    <span className="font-bold text-brand">₹{f.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Attendance Logs</h3>
            <p className="text-xs text-muted-foreground">Attendance records will be calculated automatically.</p>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Exam Marks & Transcripts</h3>
            <p className="text-xs text-muted-foreground">No examination records updated yet.</p>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Submitted Documents</h3>
            <p className="text-xs text-muted-foreground">No digital documents attached.</p>
          </div>
        )}
      </div>

    </div>
  );
}
