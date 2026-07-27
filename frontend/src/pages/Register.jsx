import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, Mail, Lock, User, GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
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
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-700 via-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-surface/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-surface/15 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-md bg-surface/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">UMS</h1>
              <p className="text-sm text-white/70 font-medium">University Management System</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Join Your<br />Institution Today
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Create your account to access the complete suite of management tools for your institution.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-surface">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">UMS</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Create your account</h2>
            <p className="text-sm text-text-secondary mt-1.5">Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
                  <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} placeholder="John"
                    className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 focus:bg-surface transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Last Name</label>
                <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} placeholder="Doe"
                  className="w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 focus:bg-surface transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 focus:bg-surface transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
                <input type={showPassword ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-2.5 bg-bg border border-border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 focus:bg-surface transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
                <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 bg-bg border border-border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 focus:bg-surface transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md shadow-sm shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 disabled:opacity-50 transition-all text-sm mt-6">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
