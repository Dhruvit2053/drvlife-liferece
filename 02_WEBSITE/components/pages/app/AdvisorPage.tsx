import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Bot, User as UserIcon, Lightbulb } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeTransactions } from '../../services/firestoreService';
import { type Transaction, formatINR } from '../../types/finance';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AdvisorPage: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const unsub = subscribeTransactions(user.uid, (data) => {
        setTransactions(data);
      });
      return () => unsub();
    }
  }, [user, authLoading, navigate]);

  // Initial welcome message once transactions load
  useEffect(() => {
    if (messages.length === 0) {
      const totalExpense = transactions
        .filter((t) => t.isExpense)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalIncome = transactions
        .filter((t) => !t.isExpense)
        .reduce((sum, t) => sum + t.amount, 0);

      const count = transactions.length;

      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: `Hello ${profile?.name || 'there'}! I am your DrvLife Gemini AI Financial Advisor. I have synchronized ${count} transactions from your account. Your recorded income is ${formatINR(totalIncome)} and total expense is ${formatINR(totalExpense)}. Ask me anything about your spending habits, budgeting tips, or savings goals!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [transactions, profile]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Process intelligence
    setTimeout(() => {
      const replyText = generateAiAnswer(q, transactions, profile?.monthlyIncome || 50000);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  function generateAiAnswer(prompt: string, txs: Transaction[], monthlyIncome: number): string {
    const p = prompt.toLowerCase();
    const expenses = txs.filter((t) => t.isExpense);
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const totalInc = txs.filter((t) => !t.isExpense).reduce((s, t) => s + t.amount, 0);

    const categoryMap: Record<string, number> = {};
    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

    if (p.includes('summar') || p.includes('overview') || p.includes('spend')) {
      const topCat = sortedCats[0];
      return `📊 Monthly Spending Telemetry:
• Total Recorded Expenses: ${formatINR(totalExp)}
• Total Recorded Income: ${formatINR(totalInc)}
• Net Savings: ${formatINR(Math.max(0, totalInc - totalExp))}
${topCat ? `• Highest Category: ${topCat[0]} (${formatINR(topCat[1])})` : ''}
Your financial flow is healthy as long as total expense remains below 60% of monthly income.`;
    }

    if (p.includes('top') || p.includes('highest') || p.includes('category')) {
      if (sortedCats.length === 0) return 'You have not logged any expenses yet!';
      const top3 = sortedCats.slice(0, 3).map(([c, a], i) => `${i + 1}. ${c}: ${formatINR(a)}`).join('\n');
      return `🏆 Here are your top spending categories:\n${top3}\nTip: Setting strict limits on your #1 category can immediately boost your savings rate!`;
    }

    if (p.includes('save') || p.includes('invest') || p.includes('tip')) {
      return `💡 3 Actionable Financial Rules for DrvLife users:
1. 50/30/20 Rule: Allocate 50% to needs, 30% to wants, and 20% directly into savings/investments.
2. Cap Discretionary Spending: Focus on food delivery & subscriptions; trimming ₹2,000/month yields ₹24,000 extra yearly savings.
3. Automated UPI Alerts: Keep DrvLife Notification Sync active on your Android device to catch micro-transactions without manual effort.`;
    }

    return `I analyzed your ${txs.length} transactions. You have spent ${formatINR(totalExp)} so far. Based on your target income of ${formatINR(monthlyIncome)}, you are saving ${(Math.max(0, totalInc - totalExp) / (totalInc || 1) * 100).toFixed(0)}% of your cash flow. Would you like me to break down your spending by category or calculate your optimal savings rate?`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7F77DD] to-[#534AB7] flex items-center justify-center text-white shadow-lg shadow-[#7F77DD]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">AI Financial Advisor</h1>
            <p className="text-xs text-[#888799]">Powered by DrvLife Financial Telemetry</p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
        {[
          'Summarize my spending this month',
          'What are my top expense categories?',
          'How can I save ₹5,000 more?',
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-[#E8E6F0] whitespace-nowrap flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#7F77DD]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl bg-[#190B30]/50 border border-white/10 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-[#7F77DD] text-white'
                  : 'bg-[#1D9E75]/20 text-[#1D9E75] border border-[#1D9E75]/30'
              }`}
            >
              {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-lg p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#7F77DD] to-[#534AB7] text-white rounded-tr-none'
                  : 'bg-white/[0.06] border border-white/10 text-[#E8E6F0] rounded-tl-none'
              }`}
            >
              {m.text}
              <div
                className={`text-[10px] mt-1.5 opacity-60 ${
                  m.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-[#190B30]/80 border border-white/10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask DrvLife AI about your money, budget, or savings..."
          className="flex-1 px-4 py-2.5 bg-transparent text-white placeholder-[#888799]/50 text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-[#7F77DD] to-[#534AB7] text-white shadow-md shadow-[#7F77DD]/30 transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

