import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#080512] border-t border-white/10 pt-16 pb-12 text-[#888799]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#534AB7] to-[#7F77DD] p-0.5">
                <div className="w-full h-full bg-[#0C091A] rounded-[10px] flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="DrvLife Logo" className="w-7 h-7 object-contain" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">DrvLife</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              An intelligent, privacy-first personal finance platform for Android. Automatically tracks bank and UPI alerts, calculates savings velocity, and delivers tailored Gemini AI financial wisdom.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1D9E75]/15 text-[#1D9E75] border border-[#1D9E75]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse"></span>
                v{APP_CONFIG.version} Production Build
              </span>
              <span className="text-xs text-[#888799]">Android 7.0+</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">Core Features</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/download" className="hover:text-[#7F77DD] transition-colors flex items-center gap-1">
                  <span>Download APK</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Support & Help</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <a href={`mailto:${APP_CONFIG.supportEmail}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{APP_CONFIG.supportEmail}</span>
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Trust & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D9E75]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <span className="text-xs text-[#888799]/80 block pt-1">
                  Zero OTP or credential interception. Strict local processing.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} DrvLife (LifeRece). All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#888799]">
            <span>Crafted for financial clarity & freedom</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
