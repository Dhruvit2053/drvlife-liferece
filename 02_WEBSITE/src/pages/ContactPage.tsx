import React from 'react';
import { ContactForm } from '../components/ContactForm';
import { Mail, Clock, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-16 lg:py-24 bg-[#0C091A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/15 border border-[#7F77DD]/30 text-[#7F77DD] text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>DIRECT SUPPORT PORTAL</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-base text-[#888799]">
            Have inquiries, encounter an issue with notification auto-sync, or want to suggest a feature? Drop us a note below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-white">Direct Support Channels</h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#7F77DD]/20 border border-[#7F77DD]/30 flex items-center justify-center text-[#7F77DD] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#888799] block">Official Email</span>
                    <a href={`mailto:${APP_CONFIG.supportEmail}`} className="font-semibold text-white hover:text-[#7F77DD] transition-colors">
                      {APP_CONFIG.supportEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/30 flex items-center justify-center text-[#1D9E75] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#888799] block">Response Turnaround</span>
                    <span className="font-semibold text-white">Within 24 business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#534AB7]/20 border border-[#534AB7]/30 flex items-center justify-center text-[#7F77DD] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#888799] block">Security Inquiries</span>
                    <span className="font-semibold text-white">Handled with top confidentiality</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#534AB7]/10 border border-[#7F77DD]/20 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-[#7F77DD]" />
                <span>Feature Requests & Contributions</span>
              </div>
              <p className="text-xs text-[#888799] leading-relaxed">
                DrvLife evolves based on real user feedback from Indian UPI users. Let us know which bank notification formats or budget widgets you'd like added next!
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
};

