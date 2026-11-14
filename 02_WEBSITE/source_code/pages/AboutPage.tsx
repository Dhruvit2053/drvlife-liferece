import React from 'react';
import { ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 lg:py-24 bg-[#0C091A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/15 border border-[#7F77DD]/30 text-[#7F77DD] text-xs font-semibold">
            <span>ABOUT DRVLIFE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our Mission: True Financial Autonomy
          </h1>
          <p className="text-base sm:text-lg text-[#888799] max-w-2xl mx-auto">
            DrvLife was born out of frustration with clunky expense trackers that demand manual typing or intrusive bank password sharing.
          </p>
        </div>

        {/* Core Narrative */}
        <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-white/10 space-y-6 text-[#E8E6F0] leading-relaxed text-base">
          <h2 className="text-2xl font-bold text-white">Why We Built DrvLife</h2>
          <p>
            In modern India, the average individual makes dozens of quick UPI micropayments every single week — coffee, groceries, cab rides, food deliveries, bill payments. By the end of the month, hundreds of small transactions leave you wondering: <em>"Where did all my money go?"</em>
          </p>
          <p>
            Traditional budgeting apps either require you to tediously enter every ₹50 chai manually, or force you to give away your bank credentials to third-party scraping companies. Neither approach makes sense.
          </p>
          <p>
            <strong>DrvLife takes a third path:</strong> local notification listening with zero OTP collection, combined with Google's Gemini generative AI to contextualize your spending habits, audit runaway subscriptions, and provide clear paths to financial freedom.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/30 flex items-center justify-center text-[#1D9E75]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Privacy First</h3>
            <p className="text-xs text-[#888799] leading-relaxed">
              We never collect OTPs, passwords, or personal messages. You can run DrvLife in 100% manual mode without granting any permissions.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#7F77DD]/20 border border-[#7F77DD]/30 flex items-center justify-center text-[#7F77DD]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Real AI Insights</h3>
            <p className="text-xs text-[#888799] leading-relaxed">
              Gemini AI models analyze actual spending behavior to give you customized advice, not generic textbook platitudes.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#534AB7]/20 border border-[#534AB7]/30 flex items-center justify-center text-[#7F77DD]">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Native Craftsmanship</h3>
            <p className="text-xs text-[#888799] leading-relaxed">
              Engineered with Kotlin, Jetpack Compose, Material 3, and Firebase. Blazing 60fps performance and zero bloatware.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
