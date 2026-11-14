import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, Clock } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    // Prepare simulated API delivery with turnaround notice
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus({
        type: 'success',
        message: 'Thank you! Your inquiry has been dispatched to our engineering team. We typically respond within 24 business hours.'
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="glass-panel rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-2">Send Us a Message</h3>
      <p className="text-sm text-[#888799] mb-8">
        Have feedback, feature requests, or technical questions about DrvLife? Our team is here to assist.
      </p>

      {status && (
        <div
          className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
            status.type === 'success'
              ? 'bg-[#1D9E75]/15 border-[#1D9E75]/30 text-[#1D9E75]'
              : 'bg-[#E24B4A]/15 border-[#E24B4A]/30 text-[#E24B4A]'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#E8E6F0] mb-2 uppercase tracking-wider">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dhruvit Patel"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#888799] focus:outline-none focus:border-[#7F77DD] transition-colors text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E8E6F0] mb-2 uppercase tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#888799] focus:outline-none focus:border-[#7F77DD] transition-colors text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#E8E6F0] mb-2 uppercase tracking-wider">
            Subject *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Question regarding UPI notification sync"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#888799] focus:outline-none focus:border-[#7F77DD] transition-colors text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#E8E6F0] mb-2 uppercase tracking-wider">
            Message *
          </label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your question, issue, or feature request in detail..."
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#888799] focus:outline-none focus:border-[#7F77DD] transition-colors text-sm resize-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] hover:from-[#6259cb] hover:to-[#8f88e8] shadow-lg shadow-[#7F77DD]/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Sending Message...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </>
          )}
        </button>
      </form>

      {/* Alternative Support Info */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888799]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7F77DD]" />
          <span>Average reply time: Under 24 hours</span>
        </div>
        <a 
          href={`mailto:${APP_CONFIG.supportEmail}`} 
          className="text-[#7F77DD] hover:text-white transition-colors flex items-center gap-1 font-semibold"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Direct Email: {APP_CONFIG.supportEmail}</span>
        </a>
      </div>
    </div>
  );
};
