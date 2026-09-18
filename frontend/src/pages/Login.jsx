import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, ArrowRight, ShieldCheck, X } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setEmail('admin@aurora.edu');
    setPassword('Aurora@2026');
    toast.info('Demo credentials populated!');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
      <div className="relative z-10 w-full max-w-md bg-[#E8F1F8] rounded-[2rem] p-7 sm:p-9 border border-white/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] my-auto">
        
        {/* Modal Header with Title & Close Icon (matching user screenshot) */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Sign in</h2>
            <p className="text-xs text-[#526075] mt-1 font-medium">Enter your details to access Aurora UMS.</p>
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
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-[#0F172A] shadow-xs text-center transition-all cursor-pointer"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex-1 py-2 text-xs font-semibold rounded-xl text-[#526075] hover:text-[#0F172A] text-center transition-all cursor-pointer"
          >
            Create account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-2xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#526075] mb-2">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aurora.edu"
              className="w-full px-4.5 py-3 bg-[#F4F8FD] focus:bg-white border border-[#E1EAF3] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-[#0F172A] text-sm font-medium placeholder-slate-400 shadow-[inset_0_1px_3px_rgba(15,23,42,0.06)] transition-all outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#526075] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          {/* Bottom Action Bar matching user image buttons (Cancel + Save style) */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={fillDemo}
              className="px-5 py-2.5 bg-[#F4F8FD] hover:bg-white text-[#0F172A] font-bold text-xs rounded-2xl border border-white/80 shadow-xs transition-all cursor-pointer"
            >
              Demo credentials
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
                  Sign in <ArrowRight className="w-3.5 h-3.5" />
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
