import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS } from '../config/appConfig';

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-16 lg:py-24 bg-[#0C091A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/15 border border-[#7F77DD]/30 text-[#7F77DD] text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE & SUPPORT</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#888799] max-w-xl mx-auto">
            Find answers to common questions about installing the DrvLife APK, automated UPI tracking, and Gemini AI.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#888799] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., UPI, APK install, privacy, backup)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-[#888799] focus:outline-none focus:border-[#7F77DD] transition-colors text-sm shadow-xl"
          />
        </div>

        {/* FAQ List */}
        <div>
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-2">
                  <h3 className="text-base font-bold text-white">{faq.question}</h3>
                  <p className="text-sm text-[#888799] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/5 space-y-2">
              <p className="text-white font-bold">No matching answers found</p>
              <p className="text-xs text-[#888799]">Try another search term or contact our support team directly.</p>
            </div>
          )}
        </div>

        {/* Contact Support CTA Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#534AB7]/20 to-[#7F77DD]/20 border border-[#7F77DD]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Still have questions?</h3>
            <p className="text-xs text-[#888799]">Our engineering and support team is ready to help you.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#7F77DD] hover:bg-[#6e66cf] shadow-lg shadow-[#7F77DD]/25 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Support</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
