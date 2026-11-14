import React from 'react';
import { Download, UserPlus, BellRing, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Download DrvLife",
      desc: "Get the genuine Android APK directly from our verified download portal with SHA-256 integrity verification.",
      icon: <Download className="w-6 h-6 text-[#7F77DD]" />,
    },
    {
      step: "02",
      title: "Create Your Account",
      desc: "Sign up with your email, verify your account, and set your baseline monthly income in Indian Rupees (₹).",
      icon: <UserPlus className="w-6 h-6 text-[#1D9E75]" />,
    },
    {
      step: "03",
      title: "Enable Smart Sync",
      desc: "Allow DrvLife's secure local notification listener to auto-detect incoming transactions from GPay, PhonePe, Paytm, and bank alerts.",
      icon: <BellRing className="w-6 h-6 text-[#EF9F27]" />,
    },
    {
      step: "04",
      title: "Unlock AI Insights",
      desc: "Gemini AI analyzes actual spending velocity, reveals hidden subscription drains, and guides you toward financial freedom.",
      icon: <Sparkles className="w-6 h-6 text-[#7F77DD]" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#0A0716] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D9E75]/10 border border-[#1D9E75]/20 text-[#1D9E75] text-xs font-semibold">
            <span>EFFORTLESS FOUR-STEP SETUP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How DrvLife Transforms Your Finances
          </h2>
          <p className="text-base sm:text-lg text-[#888799]">
            From download to AI-powered financial clarity in under 2 minutes. No bank logins or account passwords required.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-start group">
              
              {/* Step Number & Icon */}
              <div className="flex items-center justify-between w-full mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/40">
                  {item.icon}
                </div>
                <span className="text-3xl font-black text-white/20 group-hover:text-[#7F77DD]/40 transition-colors">
                  {item.step}
                </span>
              </div>

              {/* Step Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#7F77DD] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#888799] leading-relaxed">
                {item.desc}
              </p>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7F77DD] hover:text-white transition-colors"
          >
            <span>Read the detailed setup & notification architecture guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

