import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, AlertTriangle, TrendingUp, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeTransactions, subscribeBudgets, saveBudget } from '../../services/firestoreService';
import { type Transaction, type Budget, FINANCE_CATEGORIES, formatINR } from '../../types/finance';

export const BudgetsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form state to add/edit budget
  const [selectedCategory, setSelectedCategory] = useState<string>('Food');
  const [budgetLimit, setBudgetLimit] = useState<string>('5000');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const unsubTxs = subscribeTransactions(user.uid, (data) => {
        setTransactions(data);
      });

      const unsubBudgets = subscribeBudgets(user.uid, (data) => {
        setBudgets(data);
        setLoadingData(false);
      });

      return () => {
        unsubTxs();
        unsubBudgets();
      };
    }
  }, [user, authLoading, navigate]);

  // Calculate current month's expenses per category
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses: Record<string, number> = {};

  transactions
    .filter((t) => t.isExpense && new Date(t.timestamp).toISOString().slice(0, 7) === currentMonth)
    .forEach((t) => {
      currentMonthExpenses[t.category] = (currentMonthExpenses[t.category] || 0) + t.amount;
    });

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const limitNum = parseFloat(budgetLimit);
    if (isNaN(limitNum) || limitNum <= 0) return;

    try {
      setSaving(true);
      await saveBudget(user.uid, selectedCategory, limitNum);
      setBudgetLimit('');
    } catch (err) {
      console.error('Error saving budget:', err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#7F77DD]/30 border-t-[#7F77DD] rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#888799]">Loading budget telemetry from Firestore...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Smart Category Budgets</h1>
          <p className="text-xs sm:text-sm text-[#888799] mt-1">
            Real-time spend boundaries for {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Set Budget Form */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#7F77DD]" />
            <h2 className="text-lg font-bold text-white">Set / Update Limit</h2>
          </div>
          <p className="text-xs text-[#888799] mb-6">
            Configure monthly category limits. Data is synced with the Android app in real-time.
          </p>

          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#190B30] border border-white/10 text-white text-sm focus:border-[#7F77DD] focus:outline-none"
              >
                {FINANCE_CATEGORIES.filter((c) => c !== 'Salary').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Monthly Limit (₹)
              </label>
              <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD]">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm font-bold text-[#7F77DD]">
                  ₹
                </span>
                <input
                  type="number"
                  step="100"
                  min="100"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="5000"
                  required
                  className="w-full pl-8 pr-4 py-2.5 bg-transparent text-white font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7F77DD] to-[#534AB7] hover:from-[#6c64d4] hover:to-[#463ea3] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#7F77DD]/30 transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Limit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Budgets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-bold text-white">Active Limits vs Spend</h3>
            <span className="text-xs text-[#888799]">{budgets.length} monitored categories</span>
          </div>

          {budgets.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#190B30]/40 border border-white/10 text-center text-[#888799] space-y-2">
              <TrendingUp className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="text-sm font-semibold text-white">No active budgets set for this month.</p>
              <p className="text-xs">Select a category on the left to set your first spending limit!</p>
            </div>
          ) : (
            budgets.map((b) => {
              const spent = currentMonthExpenses[b.category] || 0;
              const pct = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
              const isOver = spent > b.monthlyLimit;

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-white">{b.category}</span>
                      <div className="text-xs text-[#888799] mt-0.5">
                        Spent {formatINR(spent)} of {formatINR(b.monthlyLimit)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono text-sm font-extrabold ${
                          isOver ? 'text-[#E24B4A]' : pct >= 80 ? 'text-amber-400' : 'text-[#1D9E75]'
                        }`}
                      >
                        {pct}%
                      </span>
                      {isOver && (
                        <div className="text-[10px] text-[#E24B4A] flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Exceeded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? 'bg-[#E24B4A]'
                          : pct >= 80
                          ? 'bg-amber-400'
                          : 'bg-gradient-to-r from-[#1D9E75] to-[#7F77DD]'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
