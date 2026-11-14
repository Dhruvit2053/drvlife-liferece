import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Download, Sparkles, User, LayoutDashboard, ReceiptText, Target, Bot } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Support', path: '/contact' },
  ];

  const appLinks = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Ledger', path: '/app/transactions', icon: ReceiptText },
    { name: 'Budgets', path: '/app/budgets', icon: Target },
    { name: 'AI Advisor', path: '/app/advisor', icon: Bot },
  ];

  const navLinks = user ? appLinks : publicLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0C091A]/85 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#534AB7] to-[#7F77DD] p-0.5 shadow-lg shadow-[#7F77DD]/25">
              <div className="w-full h-full bg-[#0C091A] rounded-[10px] flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="DrvLife Logo" 
                  className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Sparkles className="w-5 h-5 text-[#7F77DD] absolute" style={{ display: 'none' }} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#7F77DD] transition-colors">
                DrvLife
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#888799] font-semibold">
                AI Finance Manager
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-4 py-1.5 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-[#7F77DD] text-white shadow-md shadow-[#7F77DD]/30'
                    : 'text-[#888799] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/app/profile"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#7F77DD] flex items-center justify-center text-white text-[11px] font-bold">
                    {profile?.name ? profile.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <span>{profile?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <Link
                  to="/download"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] shadow-md shadow-[#7F77DD]/25 hover:opacity-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>APK</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#888799] hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-all"
                >
                  Sign Up
                </Link>
                <Link
                  to="/download"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] shadow-lg shadow-[#7F77DD]/25 hover:opacity-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download App</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-[#888799] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0C091A] border-b border-white/10 px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-[#7F77DD]/20 text-[#7F77DD] border border-[#7F77DD]/30'
                  : 'text-[#888799] hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10 space-y-2">
            {user ? (
              <Link
                to="/app/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.05] text-white text-sm font-semibold border border-white/10"
              >
                <User className="w-4 h-4 text-[#7F77DD]" />
                <span>My Profile ({profile?.name || user.email})</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-white/[0.05] text-white text-xs font-bold border border-white/10"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-[#7F77DD] text-white text-xs font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link
              to="/download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] shadow-lg shadow-[#7F77DD]/25"
            >
              <Download className="w-5 h-5" />
              <span>Download DrvLife APK (v{APP_CONFIG.version})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
