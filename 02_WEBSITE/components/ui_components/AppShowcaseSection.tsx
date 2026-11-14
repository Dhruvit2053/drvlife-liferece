import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Sparkles, 
  PieChart, 
  Camera, 
  CheckCircle2
} from 'lucide-react';

export const AppShowcaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const screens = [
    {
      id: "dashboard",
      title: "Financial Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      tagline: "Total Net Worth & Daily Pulse",
      description: "Get immediate clarity on your monthly cashflow, savings velocity, interactive weekly spending bars, and AI health score rating.",
      highlights: [
        "Dynamic Net Balance with live calculations",
        "Color-coded Income vs Expense breakdown pills",
        "Interactive 7-day weekly spending trend chart",
        "Contextual AI Insight preview banner"
      ]
    },
    {
      id: "transactions",
      title: "Live Feed & Search",
      icon: <Receipt className="w-5 h-5" />,
      tagline: "Every Rupee Categorized & Filtered",
      description: "Search and filter through all transactions with real-time merchant querying, category chips, and date-range filters.",
      highlights: [
        "Filter by Expense, Income, or All time periods",
        "Click any transaction to view source, notes, and details",
        "Full in-place editing and deletion with confirmation",
        "One-tap CSV export of filtered records"
      ]
    },
    {
      id: "advisor",
      title: "Gemini AI Advisor",
      icon: <Sparkles className="w-5 h-5" />,
      tagline: "Personalized Wealth Strategy",
      description: "Engage with Gemini AI to audit active subscriptions, understand dining vs grocery spending, and receive tailored savings advice.",
      highlights: [
        "Real-time spending pattern detection",
        "Suggested prompt chips for instant financial questions",
        "Subscription audit identifying overlapping OTT services",
        "100% educational, transparent advisory"
      ]
    },
    {
      id: "budgets",
      title: "Budget Management",
      icon: <PieChart className="w-5 h-5" />,
      tagline: "Enforce Spending Discipline",
      description: "Set overall monthly budgets alongside individual category thresholds for Food, Shopping, Bills, Fuel, and Entertainment.",
      highlights: [
        "Utilization progress bars (<70% Green, 70-90% Amber, >90% Red)",
        "Remaining spendable amount calculations",
        "Category-specific limit management",
        "Overspending warning notifications"
      ]
    },
    {
      id: "scanner",
      title: "Receipt Scanner",
      icon: <Camera className="w-5 h-5" />,
      tagline: "Paper Bills to Digital Records",
      description: "Photograph physical supermarket slips or restaurant receipts. Gemini Multimodal extracts merchant, total, and suggested category.",
      highlights: [
        "Supports Camera photo capture & Gallery image picker",
        "Gemini Multimodal AI OCR extraction",
        "Editable confirmation fields before saving",
        "Saves directly to your Firestore transactions collection"
      ]
    }
  ];

  return (
    <section className="py-24 bg-[#0C091A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/10 border border-[#7F77DD]/20 text-[#7F77DD] text-xs font-semibold">
            <span>APP TOUR & SCREEN GALLERY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Simplicity. Powered by AI.
          </h2>
          <p className="text-base sm:text-lg text-[#888799]">
            Explore each functional module implemented natively in the DrvLife application.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {screens.map((screen, idx) => (
            <button
              key={screen.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#7F77DD] text-white shadow-lg shadow-[#7F77DD]/30 scale-105'
                  : 'bg-white/[0.04] text-[#888799] hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {screen.icon}
              <span>{screen.title}</span>
            </button>
          ))}
        </div>

        {/* Showcase Detail Card */}
        <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3 py-1 rounded-lg bg-[#534AB7]/20 text-[#7F77DD] text-xs font-bold uppercase tracking-wider border border-[#7F77DD]/30">
                {screens[activeTab].tagline}
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {screens[activeTab].title}
              </h3>
              <p className="text-base text-[#888799] leading-relaxed">
                {screens[activeTab].description}
              </p>

              <div className="space-y-3 pt-2">
                {screens[activeTab].highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1D9E75] shrink-0" />
                    <span className="text-sm text-[#E8E6F0] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Screen Visual Preview Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b from-[#140C2E] to-[#0A0716] border border-white/10 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E24B4A]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF9F27]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]"></div>
                  </div>
                  <span className="text-xs font-mono text-[#888799]">DrvLife Screen Preview</span>
                </div>

                <div className="pt-6 space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="text-[11px] text-[#7F77DD] font-bold uppercase">{screens[activeTab].title} Module</div>
                    <div className="text-xl font-bold text-white mt-1">Native Jetpack Compose</div>
                    <div className="text-xs text-[#888799] mt-2">
                      Connected to real Firebase Auth & Cloud Firestore `users/&#123;uid&#125;/*` subcollections.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/25 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Status</span>
                    <span className="text-xs font-bold text-[#1D9E75]">✅ Verified in v1.0 APK</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
