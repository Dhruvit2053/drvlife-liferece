import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginAnonymous } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in';
      if (msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        setError('Invalid email or password. Please check your credentials or create an account.');
      } else if (msg.includes('too-many-requests')) {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      // Secure, isolated guest demo session without hardcoded shared passwords
      await loginAnonymous();
      navigate('/app/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initialize demo session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7F77DD]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1D9E75]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#190B30]/60 backdrop-blur-xl border border-white/10 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7F77DD] to-[#534AB7] shadow-lg shadow-[#7F77DD]/30 mb-4">
              <span className="text-white font-extrabold text-2xl tracking-tighter">DL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to DrvLife Web
            </h2>
            <p className="mt-2 text-sm text-[#888799]">
              Manage your finances online. Synced seamlessly with your Android App.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#E24B4A]/15 border border-[#E24B4A]/40 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E24B4A] shrink-0 mt-0.5" />
              <p className="text-sm text-[#E24B4A] leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-2">
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
                  placeholder="name@example.com"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#888799]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-11 pr-11 py-3.5 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7F77DD] to-[#534AB7] hover:from-[#6c64d4] hover:to-[#463ea3] text-white font-bold text-sm shadow-lg shadow-[#7F77DD]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-[#888799] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7F77DD]" />
              <span>Quick Test with Demo Account</span>
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#888799]">
            <Shield className="w-4 h-4 text-[#1D9E75]" />
            <span>End-to-End Firebase Encrypted & Verified</span>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-[#888799]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#7F77DD] hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

