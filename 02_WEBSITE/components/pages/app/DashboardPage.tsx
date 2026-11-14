import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Trash2,
  PieChart,
  Calendar,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeTransactions, deleteTransaction } from '../../services/firestoreService';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { type Transaction, formatINR } from '../../types/finance';

export const DashboardPage: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const unsub = subscribeTransactions(user.uid, (data) => {
        setTransactions(data);
        setLoadingTxs(false);
      });
      return () => unsub();
    }
  }, [user, authLoading, navigate]);

  // Financial Calculations
  const totalIncome = transactions
    .filter((t) => !t.isExpense)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.isExpense)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savings = Math.max(0, totalIncome - totalExpense);
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  // Financial Health Score Calculation (0 to 100)
  const healthScore = totalIncome > 0
    ? Math.min(100, Math.max(10, Math.round((savingsRate * 0.7) + 30)))
    : 75;

  // Category breakdown
  const categoryExpenses: Record<string, number> = {};
  transactions
    .filter((t) => t.isExpense)
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryExpenses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      setDeletingId(id);
      await deleteTransaction(user.uid, id);
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loadingTxs) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#7F77DD]/30 border-t-[#7F77DD] rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#888799]">Syncing with Cloud Firestore...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#190B30] to-[#0C091A] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7F77DD]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D9E75]/20 text-[#1D9E75] text-xs font-bold border border-[#1D9E75]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Live Cloud Firestore Connected
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/20 text-[#7F77DD] text-xs font-bold border border-[#7F77DD]/30">
              <Smartphone className="w-3.5 h-3.5" />
              Android App Sync Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {profile?.name || user?.email?.split('@')[0] || 'User'} 👋
          </h1>
          <p className="text-sm text-[#888799] mt-1">
            Real-time financial telemetry across your web browser and mobile device.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#7F77DD] to-[#534AB7] hover:from-[#6c64d4] hover:to-[#463ea3] text-white font-bold text-sm shadow-lg shadow-[#7F77DD]/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Net Balance */}
        <div className="p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl hover:border-[#7F77DD]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#888799] uppercase tracking-wider">Net Balance</span>
            <div className="w-9 h-9 rounded-xl bg-[#7F77DD]/20 flex items-center justify-center text-[#7F77DD]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatINR(netBalance)}
          </div>
          <div className="mt-2 text-xs text-[#888799] flex items-center gap-1">
            <span>Income minus all expenses</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl hover:border-[#1D9E75]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#888799] uppercase tracking-wider">Total Income</span>
            <div className="w-9 h-9 rounded-xl bg-[#1D9E75]/20 flex items-center justify-center text-[#1D9E75]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1D9E75] font-mono">
            {formatINR(totalIncome)}
          </div>
          <div className="mt-2 text-xs text-[#888799]">
            Target budget: {formatINR(profile?.monthlyIncome || 50000)}
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl hover:border-[#E24B4A]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#888799] uppercase tracking-wider">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-[#E24B4A]/20 flex items-center justify-center text-[#E24B4A]">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#E24B4A] font-mono">
            {formatINR(totalExpense)}
          </div>
          <div className="mt-2 text-xs text-[#888799]">
            {transactions.filter((t) => t.isExpense).length} logged expenses
          </div>
        </div>

        {/* Savings & Health Score */}
        <div className="p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#888799] uppercase tracking-wider">Financial Health</span>
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{healthScore}</span>
            <span className="text-xs font-bold text-amber-400">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-[#888799]">
            Savings Rate: <strong className="text-white">{savingsRate}%</strong>
          </div>
        </div>

      </div>

      {/* AI Insights & Spending Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gemini AI Advisor Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-[#190B30] to-[#2B072D] border border-[#7F77DD]/30 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#7F77DD] font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>AI Telemetry Insight</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {savingsRate >= 30
                ? 'Excellent Wealth Velocity 🚀'
                : savingsRate >= 15
                ? 'Stable Financial Trajectory 📈'
                : 'Expense Optimization Needed 💡'}
            </h3>
            <p className="text-sm text-[#E8E6F0]/80 leading-relaxed">
              {totalIncome === 0
                ? 'Start by recording your monthly salary or deposits to unlock smart predictive forecasting.'
                : savingsRate >= 30
                ? `You saved ${formatINR(savings)} (${savingsRate}%). Consider putting extra reserves into fixed-yield investments or an emergency fund.`
                : `Your monthly expenses (${formatINR(totalExpense)}) take up ${100 - savingsRate}% of income. Review your top spending categories below to optimize cashflow.`}
            </p>
          </div>
          
          <div className="pt-6 relative z-10">
            <Link
              to="/app/advisor"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#7F77DD] hover:text-white transition-colors"
            >
              <span>Chat with AI Financial Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#7F77DD]" />
              <h3 className="text-lg font-bold text-white">Top Spending Breakdown</h3>
            </div>
            <Link to="/app/transactions" className="text-xs font-bold text-[#7F77DD] hover:underline">
              View All
            </Link>
          </div>

          {sortedCategories.length === 0 ? (
            <div className="py-12 text-center text-[#888799] text-sm">
              No expenses recorded yet. Click "Add Transaction" to begin!
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map(([cat, amt]) => {
                const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-white">{cat}</span>
                      <span className="font-mono text-[#888799]">
                        {formatINR(amt)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7F77DD] to-[#534AB7] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Recent Live Transactions */}
      <div className="p-6 rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-[#888799] mt-0.5">
              Live updates directly from Firestore (synced with mobile UPI notifications)
            </p>
          </div>
          <Link
            to="/app/transactions"
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white border border-white/10 transition-colors"
          >
            Open Full Ledger
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-[#888799] text-sm">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
            <p>No transactions found in this account.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-[#7F77DD] text-white text-xs font-bold"
            >
              Add First Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-[#888799] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Merchant</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {transactions.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 pl-2">
                      <div className="font-semibold text-white">{tx.merchant}</div>
                      {tx.notes && <div className="text-xs text-[#888799] truncate max-w-xs">{tx.notes}</div>}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] text-[#E8E6F0]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-[#888799]">
                      <span className="font-mono">{tx.paymentMethod}</span>
                    </td>
                    <td className="py-3.5 text-xs text-[#888799]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                        <span>{new Date(tx.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold">
                      <span className={tx.isExpense ? 'text-[#E24B4A]' : 'text-[#1D9E75]'}>
                        {tx.isExpense ? '-' : '+'} {formatINR(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        className="p-1.5 rounded-lg text-[#888799] hover:text-[#E24B4A] hover:bg-[#E24B4A]/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {user && (
        <AddTransactionModal
          uid={user.uid}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

    </div>
  );
};

