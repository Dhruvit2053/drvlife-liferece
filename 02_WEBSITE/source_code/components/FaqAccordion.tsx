import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../config/appConfig';

interface FaqAccordionProps {
  limit?: number;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ limit }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const displayedFaqs = limit ? FAQS.slice(0, limit) : FAQS;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {displayedFaqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`glass-panel rounded-2xl transition-all duration-200 border ${
              isOpen ? 'border-[#7F77DD]/40 bg-white/[0.06]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-base font-bold text-white pr-4">
                {faq.question}
              </span>
              <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#7F77DD]/20 text-[#7F77DD]' : 'text-[#888799]'}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-sm text-[#888799] leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
