import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, Calendar, BookOpen, FileText, 
  Award, Clock, ArrowRight, Save, Edit3, UserCheck, Plus, CheckCircle2, MessageSquare, ChevronLeft, Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [enquiry, setEnquiry] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    courseId: '',
    source: '',
    stage: 'New',
    priority: 'Medium',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    previousSchool: '',
    marks10th: '',
    marks12th: '',
    graduationMarks: '',
    fatherName: '',
    motherName: '',
    remarks: ''
  });

  // Follow-up state
  const [followupModal, setFollowupModal] = useState(false);
  const [newFollowup, setNewFollowup] = useState({
    remarks: '',
    status: 'Followed',
    nextFollowup: ''
  });

  useEffect(() => {
    fetchEnquiry();
    fetchCourses();
  }, [id]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/academic/courses');
      setCourses(res.data.data || []);
    } catch (err) {
      console.error('Failed to load courses', err);
    }
  };

  const fetchEnquiry = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/students/enquiries/${id}`);
      const data = res.data.data;
      setEnquiry(data);
      if (data) {
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || 'Male',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          courseId: data.records?.[0]?.courseId || '',
          source: data.source || '',
          stage: data.stage || 'New',
          priority: data.priority || 'Medium',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || 'India',
          zipCode: data.zipCode || '',
          previousSchool: data.previousSchool || '',
          marks10th: data.marks10th || '',
          marks12th: data.marks12th || '',
          graduationMarks: data.graduationMarks || '',
          fatherName: data.fatherName || '',
          motherName: data.motherName || '',
          remarks: data.remarks || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load enquiry details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEnquiry = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/students/enquiries/${id}`, formData);
      toast.success('Enquiry updated successfully');
      fetchEnquiry();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFollowup = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/students/enquiries/${id}/followups`, newFollowup);
      toast.success('Follow-up logged');
      setFollowupModal(false);
      setNewFollowup({ remarks: '', status: 'Followed', nextFollowup: '' });
      fetchEnquiry();
    } catch (err) {
      toast.error('Failed to add follow-up');
    }
  };

  const handleConvertToAdmission = () => {
    // Navigate to registration form pre-filled with enquiry state
    navigate('/students/registrations/new', {
      state: {
        enquiryId: enquiry.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        courseId: formData.courseId,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        guardianName: formData.fatherName || formData.motherName,
        previousSchool: formData.previousSchool
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <div className="w-10 h-10 border-3 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading Enquiry Details...</p>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="glass-panel p-8 text-center max-w-lg mx-auto mt-12">
        <h2 className="text-xl font-bold text-foreground">Enquiry Not Found</h2>
        <p className="text-muted-foreground text-sm mt-2">The requested enquiry could not be found or has been deleted.</p>
        <Link to="/students/enquiries" className="secondary-button mt-6">
          <ChevronLeft className="w-4 h-4 mr-1" /> Return to Enquiries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/students/enquiries" className="secondary-button p-2.5">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand px-2.5 py-0.5 rounded-full bg-brand/10 border border-brand/20">
                {enquiry.enquiryNumber || 'ENQ'}
              </span>
              {enquiry.isConverted && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Admitted / Converted
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground font-heading mt-1">
              {enquiry.firstName} {enquiry.lastName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button 
            type="button" 
            onClick={() => setFollowupModal(true)}
            className="secondary-button"
          >
            <MessageSquare className="w-4 h-4 text-brand" /> Log Follow-up
          </button>

          <button
            type="button"
            onClick={handleConvertToAdmission}
            className="primary-button text-sm px-4 py-2"
          >
            <UserCheck className="w-4 h-4" /> Add Enquiry to Admission
            <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
          </button>
        </div>
      </div>

      {/* Main Glass Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Fast Stats & Overview */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-soft text-white flex items-center justify-center font-heading font-bold text-2xl shadow-lg shadow-brand/20">
                {enquiry.firstName?.charAt(0)}{enquiry.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">{enquiry.firstName} {enquiry.lastName}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand" /> 
                  {enquiry.records?.[0]?.course?.name || 'General Query'}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Contact
                </span>
                <span className="font-semibold text-foreground">{enquiry.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <span className="font-semibold text-foreground truncate max-w-[170px]">{enquiry.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Date Added
                </span>
                <span className="font-semibold text-foreground">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Pipeline Stage
                </span>
                <span className="font-semibold px-2 py-0.5 rounded-md bg-brand/10 text-brand text-[11px]">
                  {enquiry.stage || 'New'}
                </span>
              </div>
            </div>
          </div>

          {/* Follow-up Timeline Summary */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" /> Follow-up History ({enquiry.followups?.length || 0})
              </h3>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {(!enquiry.followups || enquiry.followups.length === 0) ? (
                <p className="text-xs text-muted-foreground text-center py-4">No follow-ups recorded yet.</p>
              ) : (
                enquiry.followups.map((item) => (
                  <div key={item.id} className="glass-subtle p-3 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-brand font-semibold">{item.status}</span>
                      <span className="text-muted-foreground">{new Date(item.followupDate).toLocaleDateString()}</span>
                    </div>
                    {item.remarks && <p className="text-foreground/90">{item.remarks}</p>}
                    {item.nextFollowup && (
                      <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        Next: <span className="font-medium">{new Date(item.nextFollowup).toLocaleDateString()}</span>
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Comprehensive Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveEnquiry} className="glass-panel p-6 space-y-6">
            
            {/* Form Section Header & Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand" />
                <h2 className="font-bold text-lg text-foreground font-heading">Enquiry Edit & Details Form</h2>
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="primary-button"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="space-y-6">
              
              {/* 1. Basic & Personal Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  1. Personal & Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Course & Pipeline Status */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  2. Academic Interest & Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Interested Course</label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Pipeline Stage</label>
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    >
                      <option value="New">New Lead</option>
                      <option value="Followed Up">Followed Up</option>
                      <option value="Interested">Interested</option>
                      <option value="Offer Sent">Offer Sent</option>
                      <option value="Converted">Converted to Admission</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Lead Source</label>
                    <input
                      type="text"
                      name="source"
                      placeholder="e.g. Website, Walk-in, Social Media"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Educational Marks & Documents Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  3. Academic Marks & Qualifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Previous School/College</label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">10th Grade Marks (%)</label>
                    <input
                      type="text"
                      name="marks10th"
                      placeholder="e.g. 88.5%"
                      value={formData.marks10th}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">12th Grade Marks (%)</label>
                    <input
                      type="text"
                      name="marks12th"
                      placeholder="e.g. 91.2%"
                      value={formData.marks12th}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Graduation Marks (if any)</label>
                    <input
                      type="text"
                      name="graduationMarks"
                      placeholder="e.g. 7.8 CGPA"
                      value={formData.graduationMarks}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Guardian Details & Remarks */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  4. Guardian Info & Counsel Remarks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Father's Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Mother's Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-foreground mb-1">Counselor Remarks</label>
                    <textarea
                      name="remarks"
                      rows={3}
                      placeholder="Enter counselor observation notes, document verification status, etc..."
                      value={formData.remarks}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Form Footer Action */}
            <div className="pt-4 border-t border-border/60 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleConvertToAdmission}
                className="primary-button"
              >
                <UserCheck className="w-4 h-4" /> Transfer to Student Admission Form
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Log Followup Modal */}
      {followupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-sm">
          <div className="glass-dialog w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Log Counselor Follow-up</h3>
            <form onSubmit={handleAddFollowup} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Status</label>
                <select
                  value={newFollowup.status}
                  onChange={(e) => setNewFollowup({ ...newFollowup, status: e.target.value })}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="Followed">Followed Up</option>
                  <option value="Called">Called - No Answer</option>
                  <option value="Interested">Interested</option>
                  <option value="Campus Visit Scheduled">Campus Visit Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={newFollowup.nextFollowup}
                  onChange={(e) => setNewFollowup({ ...newFollowup, nextFollowup: e.target.value })}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Remarks</label>
                <textarea
                  rows={3}
                  value={newFollowup.remarks}
                  onChange={(e) => setNewFollowup({ ...newFollowup, remarks: e.target.value })}
                  required
                  placeholder="Enter call notes..."
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFollowupModal(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
