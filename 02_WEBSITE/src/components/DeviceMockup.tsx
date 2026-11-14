import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  PieChart, 
  Home,
  List,
  Bell
} from 'lucide-react';

export const DeviceMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'ai' | 'budget'>('dashboard');

  return (
    <div className="relative mx-auto flex flex-col items-center justify-center">
      
      {/* Background Ambient Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#534AB7]/40 via-[#7F77DD]/30 to-[#1D9E75]/20 rounded-[50px] blur-3xl opacity-70 -z-10 animate-pulse"></div>

      {/* Floating Badges (Desktop) */}
      <div className="hidden lg:block absolute -left-20 top-24 z-20 animate-bounce duration-1000">
        <div className="glass-panel rounded-2xl p-3.5 border border-[#1D9E75]/30 shadow-xl shadow-black/40 flex items-center gap-3 bg-[#0C091A]/90">
          <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center text-[#1D9E75]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#888799] font-medium">Auto-Sync Alert</div>
            <div className="text-xs font-bold text-white">Salary Credit · +₹45,000</div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute -right-16 top-48 z-20">
        <div className="glass-panel rounded-2xl p-3.5 border border-[#7F77DD]/40 shadow-xl shadow-black/40 flex items-center gap-3 bg-[#0C091A]/90">
          <div className="w-10 h-10 rounded-xl bg-[#7F77DD]/20 border border-[#7F77DD]/40 flex items-center justify-center text-[#7F77DD]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#7F77DD] font-semibold">Gemini AI Advisor</div>
            <div className="text-xs font-bold text-white">"Save ₹1,200 this month"</div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute -left-12 bottom-28 z-20">
        <div className="glass-panel rounded-2xl p-3 border border-[#E24B4A]/30 shadow-xl shadow-black/40 flex items-center gap-3 bg-[#0C091A]/90">
          <div className="w-9 h-9 rounded-xl bg-[#E24B4A]/20 border border-[#E24B4A]/40 flex items-center justify-center text-[#E24B4A]">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#888799]">Swiggy UPI Auto-Track</div>
            <div className="text-xs font-bold text-white">-₹340.00 · Food</div>
          </div>
        </div>
      </div>

      {/* Screen Selector Chips */}
      <div className="flex items-center gap-2 mb-6 bg-white/[0.04] p-1.5 rounded-full border border-white/10 z-10 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-[#7F77DD] text-white shadow-md' : 'text-[#888799] hover:text-white'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'transactions' ? 'bg-[#7F77DD] text-white shadow-md' : 'text-[#888799] hover:text-white'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ai' ? 'bg-[#7F77DD] text-white shadow-md' : 'text-[#888799] hover:text-white'
          }`}
        >
          AI Advisor
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'budget' ? 'bg-[#7F77DD] text-white shadow-md' : 'text-[#888799] hover:text-white'
          }`}
        >
          Budgets
        </button>
      </div>

      {/* Smartphone Chassis */}
      <div className="relative w-[320px] sm:w-[340px] h-[660px] bg-[#0A0716] rounded-[48px] p-3.5 border-4 border-[#2B234D] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#140E2A] rounded-full z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#0C091A] mr-2"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]/80 animate-pulse"></div>
        </div>

        {/* Screen Display Container */}
        <div className="w-full h-full bg-gradient-to-b from-[#0C091A] via-[#140C2E] to-[#0A0716] rounded-[38px] pt-8 px-4 pb-4 overflow-y-auto overflow-x-hidden text-white flex flex-col justify-between scrollbar-none">

          {/* Top Status Bar Mockup */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#888799] pt-2 pb-3">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2 border border-[#888799] rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-[#1D9E75] rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* SCREEN CONTENT CONDITIONAL */}
          <div className="flex-1 space-y-4">

            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-3.5 animate-in fade-in duration-300">
                {/* Header Greeting */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Hello, Dhruvit 👋</h4>
                    <span className="text-[10px] text-[#888799]">November 2026</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5 text-[#7F77DD]" />
                  </div>
                </div>

                {/* Net Balance Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#534AB7]/40 via-white/[0.04] to-[#7F77DD]/20 border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#7F77DD]">
                    <span>TOTAL NET BALANCE</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#1D9E75]/20 text-[#1D9E75] border border-[#1D9E75]/30">
                      Healthy 80
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white mt-1">₹34,720.00</div>

                  {/* Dual Pills */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/5">
                    <div className="p-2 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/20">
                      <div className="text-[9px] text-[#1D9E75] font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Income
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">₹50,000</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#E24B4A]/10 border border-[#E24B4A]/20">
                      <div className="text-[9px] text-[#E24B4A] font-bold flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> Spent
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">₹15,280</div>
                    </div>
                  </div>
                </div>

                {/* AI Insight Snippet */}
                <div className="p-3 rounded-xl bg-[#7F77DD]/10 border border-[#7F77DD]/25 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#7F77DD] shrink-0 mt-0.5" />
                  <div className="text-[10px] leading-tight text-[#E8E6F0]">
                    <span className="font-bold text-[#7F77DD]">AI Insight:</span> Cooking dinner at home on Thursdays could save ₹1,200 this billing cycle!
                  </div>
                </div>

                {/* Weekly Trend Bars */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[9px] font-bold text-[#888799] uppercase tracking-wider mb-2">Weekly Trend</div>
                  <div className="flex items-end justify-between h-14 pt-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                      const heights = [45, 60, 30, 80, 50, 95, 70];
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 w-6">
                          <div 
                            className="w-3 rounded-t-sm bg-gradient-to-t from-[#534AB7] to-[#7F77DD]"
                            style={{ height: `${heights[idx]}%` }}
                          ></div>
                          <span className="text-[8px] text-[#888799]">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TRANSACTIONS FEED */}
            {activeTab === 'transactions' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-sm font-bold text-white">Live Feed</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7F77DD]/20 text-[#7F77DD]">Auto-Sync On</span>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[9px]">
                  <span className="px-2.5 py-1 rounded-full bg-[#7F77DD] text-white font-bold">All (24)</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-[#888799]">Expense</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-[#888799]">Income</span>
                </div>

                {/* Mock List */}
                <div className="space-y-2">
                  {[
                    { name: "Swiggy Delivery", cat: "Food · UPI", time: "1:15 PM", amt: "- ₹340.00", isExp: true },
                    { name: "Salary Credit", cat: "Income · NEFT", time: "10:00 AM", amt: "+ ₹45,000", isExp: false },
                    { name: "Amazon India", cat: "Shopping · GPay", time: "Yesterday", amt: "- ₹1,299", isExp: true },
                    { name: "D-Mart Groceries", cat: "Groceries · Card", time: "Yesterday", amt: "- ₹2,180", isExp: true },
                    { name: "BSNL Fiber Bill", cat: "Bills · Auto", time: "2 days ago", amt: "- ₹599", isExp: true }
                  ].map((tx, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{tx.name}</div>
                        <div className="text-[9px] text-[#888799]">{tx.cat} · {tx.time}</div>
                      </div>
                      <div className={`text-xs font-bold ${tx.isExp ? 'text-[#E24B4A]' : 'text-[#1D9E75]'}`}>
                        {tx.amt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: AI ADVISOR */}
            {activeTab === 'ai' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7F77DD]">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini Financial Intelligence</span>
                </div>

                <div className="p-3 rounded-xl bg-[#534AB7]/20 border border-[#7F77DD]/30 space-y-1.5">
                  <div className="text-[11px] font-bold text-[#7F77DD]">💡 Save ~₹1,200/mo on Dining</div>
                  <p className="text-[10px] text-[#E8E6F0] leading-relaxed">
                    12 food delivery orders detected this month. Preparing home meals 2 extra days weekly can save ₹1,200.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/30 space-y-1.5">
                  <div className="text-[11px] font-bold text-[#1D9E75]">🔁 Subscription Audit</div>
                  <p className="text-[10px] text-[#E8E6F0] leading-relaxed">
                    Netflix, Hotstar, and Spotify renewals detected. Cancel 1 unused OTT to save ₹499/mo automatically.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#EF9F27]/10 border border-[#EF9F27]/30 space-y-1.5">
                  <div className="text-[11px] font-bold text-[#EF9F27]">📊 Weekend Spending Pattern</div>
                  <p className="text-[10px] text-[#E8E6F0] leading-relaxed">
                    Weekend spending averages 2.8x higher than weekdays. Setting a ₹1,500 weekend cap maintains target velocity.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: BUDGETS */}
            {activeTab === 'budget' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Monthly Budgets</h4>
                  <span className="text-[10px] text-[#1D9E75] font-bold">₹14,720 Left</span>
                </div>

                {/* Overall Gauge */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Overall: ₹15,280 / ₹30,000</span>
                    <span className="text-[#1D9E75]">51%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[51%] h-full bg-[#1D9E75] rounded-full"></div>
                  </div>
                </div>

                {/* Category Budgets */}
                {[
                  { cat: "🍔 Food & Dining", spent: "₹4,800", limit: "₹6,000", pct: "80%", col: "#EF9F27" },
                  { cat: "🛍️ Shopping", spent: "₹1,800", limit: "₹4,000", pct: "45%", col: "#7F77DD" },
                  { cat: "💡 Utility Bills", spent: "₹3,100", limit: "₹5,000", pct: "62%", col: "#1D9E75" },
                  { cat: "🚗 Fuel & Travel", spent: "₹2,200", limit: "₹3,000", pct: "73%", col: "#534AB7" }
                ].map((b, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-semibold text-white">{b.cat}</span>
                      <span className="text-[#888799] font-bold">{b.spent} / {b.limit}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: b.pct, backgroundColor: b.col }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Bottom App Navigation Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-around text-[#888799]">
            <button onClick={() => setActiveTab('dashboard')} className={`p-1.5 rounded-lg flex flex-col items-center cursor-pointer ${activeTab === 'dashboard' ? 'text-white' : 'hover:text-white'}`}>
              <Home className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Home</span>
            </button>
            <button onClick={() => setActiveTab('transactions')} className={`p-1.5 rounded-lg flex flex-col items-center cursor-pointer ${activeTab === 'transactions' ? 'text-white' : 'hover:text-white'}`}>
              <List className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Feed</span>
            </button>
            <button onClick={() => setActiveTab('ai')} className={`p-1.5 rounded-lg flex flex-col items-center cursor-pointer ${activeTab === 'ai' ? 'text-white' : 'hover:text-white'}`}>
              <Sparkles className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">AI</span>
            </button>
            <button onClick={() => setActiveTab('budget')} className={`p-1.5 rounded-lg flex flex-col items-center cursor-pointer ${activeTab === 'budget' ? 'text-white' : 'hover:text-white'}`}>
              <PieChart className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Budgets</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
