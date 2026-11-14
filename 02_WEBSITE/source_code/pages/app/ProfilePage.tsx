import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, IndianRupee, Smartphone, ShieldCheck, Download, LogOut, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/firestoreService';

export const ProfilePage: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name || '');
  const [income, setIncome] = useState(profile?.monthlyIncome?.toString() || '50000');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      await updateUserProfile(user.uid, {
        name: name.trim(),
        monthlyIncome: parseFloat(income) || 50000,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account & Cloud Sync</h1>
        <p className="text-xs sm:text-sm text-[#888799] mt-1">
          Manage your personal profile and cross-device sync status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7F77DD] to-[#534AB7] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-[#7F77DD]/30">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'DL'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile?.name || 'User'}</h2>
              <p className="text-xs text-[#888799] font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>

          {success && (
            <div className="p-3 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/40 text-xs text-[#1D9E75] flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully in Cloud Firestore!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-[#888799]" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative rounded-xl bg-white/[0.02] border border-white/5 opacity-75">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#888799]" />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-slate-400 text-sm cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Monthly Target Income (₹)
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <IndianRupee className="w-4 h-4 text-[#888799]" />
                </div>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-transparent text-white font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7F77DD] to-[#534AB7] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#7F77DD]/30 transition-all flex items-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sync & Android Info */}
        <div className="space-y-6">
          
          {/* Cloud Sync Status */}
          <div className="p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 text-[#1D9E75] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Device Sync</span>
            </div>
            <h3 className="text-base font-bold text-white">Android + Web Linked</h3>
            <p className="text-xs text-[#888799] leading-relaxed">
              Any changes made on this web portal immediately reflect in your DrvLife Android application and vice versa.
            </p>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] text-[#888799] uppercase font-bold">Cloud User ID</div>
              <div className="text-xs font-mono text-white truncate">{user?.uid}</div>
            </div>
          </div>

          {/* Download App CTA */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#190B30] to-[#2B072D] border border-[#7F77DD]/30 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Smartphone className="w-4 h-4 text-[#7F77DD]" />
              <span>Install Mobile App</span>
            </div>
            <p className="text-xs text-[#888799]">
              Enable automatic UPI notification tracking for Google Pay, PhonePe, Paytm & BHIM.
            </p>
            <Link
              to="/download"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7F77DD] hover:bg-[#6c64d4] text-white font-bold text-xs shadow-md shadow-[#7F77DD]/25 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK (28.7 MB)</span>
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl bg-white/[0.03] hover:bg-[#E24B4A]/10 border border-white/10 hover:border-[#E24B4A]/40 text-[#888799] hover:text-[#E24B4A] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

        </div>

      </div>

    </div>
  );
};
