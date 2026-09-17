import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, CheckCircle, ChevronRight, ChevronLeft, Save, Sparkles, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAcademic } from '../../context/AcademicContext';
import { useStudent } from '../../context/StudentContext';

export default function RegistrationWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { courses } = useAcademic();
  const { refreshStudentEntity, updateLocalStudentEntity } = useStudent();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Pre-fill state from location.state if navigated from Enquiry details
  const prefilledState = location.state || {};

  const [formData, setFormData] = useState({
    enquiryId: prefilledState.enquiryId || '',
    firstName: prefilledState.firstName || '',
    lastName: prefilledState.lastName || '',
    dateOfBirth: prefilledState.dateOfBirth || '',
    gender: prefilledState.gender || '',
    email: prefilledState.email || '',
    phone: prefilledState.phone || '',
    guardianName: prefilledState.guardianName || '',
    guardianRelation: 'Parent',
    guardianPhone: prefilledState.phone || '',
    guardianEmail: '',
    courseId: prefilledState.courseId || '',
    batchId: '',
    previousSchool: prefilledState.previousSchool || '',
    address: prefilledState.address || '',
    city: prefilledState.city || '',
    state: prefilledState.state || '',
    country: prefilledState.country || 'India',
    zipCode: prefilledState.zipCode || ''
  });

  useEffect(() => {
    if (prefilledState.enquiryId) {
      toast.info(`Pre-filled student data from Enquiry ${prefilledState.firstName}`);
    }
  }, []);

  const STEPS = [
    { id: 1, label: 'Student Details' },
    { id: 2, label: 'Guardian Details' },
    { id: 3, label: 'Academic Details' },
    { id: 4, label: 'Documents' },
    { id: 5, label: 'Review & Submit' }
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/students/registrations', formData);
      if (res.data?.data) updateLocalStudentEntity('registrations', 'ADD', res.data.data);
      // If converted from enquiry, mark enquiry converted
      if (formData.enquiryId) {
        try {
          await api.post(`/students/enquiries/${formData.enquiryId}/convert`);
        } catch (e) {}
      }
      toast.success('Registration & Admission form submitted successfully!');
      refreshStudentEntity('registrations', '/students/registrations');
      refreshStudentEntity('enquiries', '/students/enquiries');
      navigate('/students/registrations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">New Admission & Registration Form</h1>
          <p className="text-muted-foreground text-sm mt-1">Complete all steps to process and enroll student</p>
        </div>
        {prefilledState.enquiryId && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand/10 text-brand border border-brand/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Pre-filled from Enquiry
          </span>
        )}
      </div>

      {/* Stepper Glass Card */}
      <div className="glass-panel p-6 space-y-8">
        {/* Stepper Timeline Header */}
        <div className="relative px-4 py-2">
          {/* Timeline Background Line */}
          <div className="absolute top-5 left-10 right-10 h-1 bg-black/10 dark:bg-white/10 rounded-full -z-0">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between relative z-10">
            {STEPS.map(step => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  disabled={!isCompleted && !isActive}
                  className="flex flex-col items-center group focus:outline-none disabled:cursor-not-allowed"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/15'
                        : isActive
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/35 ring-4 ring-indigo-500/25 scale-110'
                        : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  <span
                    className={`text-xs mt-2.5 font-semibold transition-colors duration-200 tracking-tight ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : isCompleted
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[320px] py-4">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Relation</label>
                <input
                  type="text"
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Guardian Phone</label>
                <input
                  type="text"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Guardian Email</label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Target Course *</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Previous School / College</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-foreground mb-1.5">Address</label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-glass-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="glass-subtle p-8 text-center space-y-4 rounded-2xl border-dashed">
              <p className="text-sm text-foreground font-medium">Document Upload Section</p>
              <p className="text-xs text-muted-foreground">Upload 10th Marks Sheet, 12th Marks Sheet, Photo ID, and Transfer Certificate.</p>
              <div className="inline-block px-4 py-2 border border-glass-border bg-card/80 rounded-xl text-xs text-brand font-medium">
                Documents Ready for Verification
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-foreground">Review Admission Summary</h3>
              <div className="glass-subtle p-4 rounded-xl space-y-2">
                <p><span className="text-muted-foreground">Name:</span> <strong className="text-foreground">{formData.firstName} {formData.lastName}</strong></p>
                <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{formData.email}</span></p>
                <p><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{formData.phone}</span></p>
                <p><span className="text-muted-foreground">Course ID:</span> <span className="text-brand font-semibold">{formData.courseId || 'General'}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-border/60">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="secondary-button"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="primary-button"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="primary-button bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <UserCheck className="w-4 h-4" /> {loading ? 'Submitting...' : 'Confirm & Complete Admission'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
