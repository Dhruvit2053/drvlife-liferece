import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, IndianRupee, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [income, setIncome] = useState('50000');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/\d/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(email, password, name, Number(income) || 50000);
      navigate('/app/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      if (msg.includes('email-already-in-use')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7F77DD]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1D9E75]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#190B30]/60 backdrop-blur-xl border border-white/10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1D9E75] to-[#7F77DD] shadow-lg shadow-[#1D9E75]/20 mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-[#888799]">
              One single account works across both the Web Portal and Android Mobile App!
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#E24B4A]/15 border border-[#E24B4A]/40 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E24B4A] shrink-0 mt-0.5" />
              <p className="text-sm text-[#E24B4A] leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#888799]" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dhruvit Sarvaiya"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#888799]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Monthly Income (₹)
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-[#888799]" />
                </div>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="50000"
                  required
                  min="0"
                  step="1000"
                  className="block w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#888799]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="block w-full pl-11 pr-11 py-3 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#888799] hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#888799]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1D9E75] via-[#7F77DD] to-[#534AB7] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#1D9E75]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-[#888799]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#7F77DD] hover:underline">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

