import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, ArrowRight, ShieldCheck, X } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ fullName: 'Vansham Kamboj', schoolName: 'Aurora Academy', email: '', password: '' });
  const [agree, setAgree] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agree) {
      setError('You must agree to the terms to continue');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const names = form.fullName.trim().split(' ');
    const firstName = names[0] || form.fullName;
    const lastName = names.slice(1).join(' ') || form.schoolName || '';
    
    try {
      await register({ firstName, lastName, email: form.email, password: form.password });
      toast.success('Registration successful! Please verify your email.');
      navigate('/login');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen h-screen max-h-screen overflow-hidden bg-gradient-to-br from-[#DCE7F2] via-[#E6EDF5] to-[#DFEAF3] font-sans flex items-center justify-center p-4">
      {/* Background Soft Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-300/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-300/20 blur-[100px] pointer-events-none" />

      {/* Exact Lovable Form Card Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[#E8F1F8] rounded-[2rem] p-7 sm:p-9 border border-white/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] my-auto">
        
        {/* Modal Header with Title & Close Icon (matching user screenshot) */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Create your account</h2>
            <p className="text-xs text-[#526075] mt-1 font-medium">Set up an administrator workspace.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#DCE6F0] p-1 rounded-2xl flex items-center gap-1 mb-6 border border-white/60 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex-1 py-2 text-xs font-semibold rounded-xl text-[#526075] hover:text-[#0F172A] text-center transition-all cursor-pointer"
          >
            Sign in
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-[#0F172A] shadow-xs text-center transition-all cursor-pointer"
          >
            Create account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-2xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Full Name & School Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#526075] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="Vansham Kamboj"
                className="w-full px-4 py-2.5 bg-[#F4F8FD] focus:bg-white border border-[#E1EAF3] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-[#0F172A] text-xs font-medium placeholder-slate-400 shadow-[inset_0_1px_3px_rgba(15,23,42,0.06)] transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#526075] mb-1.5">
                School name
              </label>
              <input
                type="text"
                name="schoolName"
                required
                value={form.schoolName}
                onChange={handleChange}
                placeholder="Aurora Academy"
                className="w-full px-4 py-2.5 bg-[#F4F8FD] focus:bg-white border border-[#E1EAF3] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-[#0F172A] text-xs font-medium placeholder-slate-400 shadow-[inset_0_1px_3px_rgba(15,23,42,0.06)] transition-all outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#526075] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@school.edu"
              className="w-full px-4.5 py-3 bg-[#F4F8FD] focus:bg-white border border-[#E1EAF3] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-[#0F172A] text-sm font-medium placeholder-slate-400 shadow-[inset_0_1px_3px_rgba(15,23,42,0.06)] transition-all outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#526075] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full pl-4.5 pr-11 py-3 bg-[#F4F8FD] focus:bg-white border border-[#E1EAF3] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-[#0F172A] text-sm font-medium placeholder-slate-400 shadow-[inset_0_1px_3px_rgba(15,23,42,0.06)] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-[#526075] font-medium">
                I agree to the school data and acceptable use terms.
              </span>
            </label>
          </div>

          {/* Bottom Action Bar matching user image buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-[#F4F8FD] hover:bg-white text-[#0F172A] font-bold text-xs rounded-2xl border border-white/80 shadow-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Notice */}
        <div className="mt-6 pt-3 border-t border-slate-200/70 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>This is a UI demonstration. No account information is saved.</span>
        </div>
      </div>
    </div>
  );
}
