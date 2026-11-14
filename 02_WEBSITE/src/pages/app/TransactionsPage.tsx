import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  Smartphone,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Receipt,
  X,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeTransactions, deleteTransaction } from '../../services/firestoreService';
import { getLocalReceipt } from '../../services/localReceiptStore';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { type Transaction, FINANCE_CATEGORIES, formatINR } from '../../types/finance';

export const TransactionsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [checkingReceipt, setCheckingReceipt] = useState(false);

  const handleViewReceipt = async (tx: Transaction) => {
    setViewingTx(tx);
    setCheckingReceipt(true);
    const url = await getLocalReceipt(tx.id);
    setReceiptUrl(url);
    setCheckingReceipt(false);
  };

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

  // Filtered list
  const filtered = transactions.filter((t) => {
    // Type filter
    if (typeFilter === 'EXPENSE' && !t.isExpense) return false;
    if (typeFilter === 'INCOME' && t.isExpense) return false;

    // Category filter
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMerchant = t.merchant.toLowerCase().includes(q);
      const matchCategory = t.category.toLowerCase().includes(q);
      const matchNotes = t.notes.toLowerCase().includes(q);
      const matchAmount = t.amount.toString().includes(q);
      return matchMerchant || matchCategory || matchNotes || matchAmount;
    }

    return true;
  });

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      setDeletingId(id);
      await deleteTransaction(user.uid, id);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loadingTxs) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#7F77DD]/30 border-t-[#7F77DD] rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#888799]">Loading live transactions from Firestore...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Transaction Ledger</h1>
          <p className="text-xs sm:text-sm text-[#888799] mt-1">
            Real-time feed synced across Mobile UPI notifications & Web entries ({filtered.length} shown)
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#7F77DD] to-[#534AB7] hover:from-[#6c64d4] hover:to-[#463ea3] text-white font-bold text-sm shadow-lg shadow-[#7F77DD]/30 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#888799]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, category, notes, or amount..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#888799]/50 text-sm focus:outline-none focus:border-[#7F77DD]"
          />
        </div>

        {/* Type Toggle Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'ALL'
                ? 'bg-[#7F77DD] text-white shadow-sm'
                : 'text-[#888799] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('EXPENSE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              typeFilter === 'EXPENSE'
                ? 'bg-[#E24B4A] text-white shadow-sm'
                : 'text-[#888799] hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Expenses
          </button>
          <button
            onClick={() => setTypeFilter('INCOME')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              typeFilter === 'INCOME'
                ? 'bg-[#1D9E75] text-white shadow-sm'
                : 'text-[#888799] hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Income
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-48">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#190B30] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7F77DD]"
            >
              <option value="ALL">All Categories</option>
              {FINANCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#190B30] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Transactions Table / List */}
      <div className="rounded-3xl bg-[#190B30]/60 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#888799] space-y-3">
            <Filter className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-base font-semibold text-white">No transactions match your criteria.</p>
            <p className="text-xs">Try adjusting your search query, or add a new transaction above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-[#888799] uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-3.5 pl-6">Merchant & Notes</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Method & Source</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-base">{tx.merchant}</span>
                        {tx.hasReceiptImage && (
                          <button
                            type="button"
                            onClick={() => handleViewReceipt(tx)}
                            className="px-2 py-0.5 rounded-md bg-[#7F77DD]/20 border border-[#7F77DD]/30 text-[10px] font-bold text-[#7F77DD] hover:bg-[#7F77DD]/30 flex items-center gap-1 transition-colors"
                            title="View Attached Receipt"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </div>
                      {tx.notes && (
                        <div className="text-xs text-[#888799] mt-0.5 line-clamp-1">{tx.notes}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-white/[0.06] text-[#E8E6F0] border border-white/5">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs font-mono font-medium text-white">{tx.paymentMethod}</div>
                      <div className="text-[10px] text-[#888799] flex items-center gap-1 mt-0.5">
                        <Smartphone className="w-3 h-3 opacity-60" />
                        <span>{tx.source}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#888799]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                        <span>
                          {new Date(tx.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-base font-extrabold">
                      <span className={tx.isExpense ? 'text-[#E24B4A]' : 'text-[#1D9E75]'}>
                        {tx.isExpense ? '-' : '+'} {formatINR(tx.amount)}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        className="p-2 rounded-xl text-[#888799] hover:text-[#E24B4A] hover:bg-[#E24B4A]/10 transition-colors"
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

      {/* Receipt Viewer Modal (Spark Free Tier) */}
      {viewingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#190B30] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#7F77DD]" />
                <h3 className="text-lg font-bold text-white">Receipt Details</h3>
              </div>
              <button
                onClick={() => { setViewingTx(null); setReceiptUrl(null); }}
                className="p-1.5 rounded-xl text-[#888799] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-base font-semibold text-white">{viewingTx.merchant}</p>
                <p className="text-xs text-[#888799]">
                  {formatINR(viewingTx.amount)} · {new Date(viewingTx.timestamp).toLocaleDateString('en-IN')}
                </p>
              </div>

              {checkingReceipt ? (
                <div className="py-8 flex justify-center">
                  <div className="w-8 h-8 border-2 border-[#7F77DD]/30 border-t-[#7F77DD] rounded-full animate-spin" />
                </div>
              ) : receiptUrl ? (
                <div className="space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-white/10 max-h-72 bg-black/40">
                    <img src={receiptUrl} alt="Local Receipt" className="w-full h-full object-contain" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/20 flex items-center gap-2 text-xs text-[#1D9E75]">
                    <span className="font-bold">✓ Local IndexedDB</span>
                    <span className="text-[11px] text-[#1D9E75]/80">Stored privately on this browser (0 Cloud Storage cost)</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Info className="w-4 h-4 text-[#7F77DD]" />
                    <span>Captured on {viewingTx.receiptImageDevice || 'Original Device'}</span>
                  </div>
                  <p className="text-xs text-[#888799] leading-relaxed">
                    Under DrvLife's 100% Free Firebase Spark Architecture, receipt photo files remain stored strictly on the local device where they were originally photographed or uploaded. This keeps your data private and avoids expensive paid cloud storage subscriptions.
                  </p>
                </div>
              )}

              <button
                onClick={() => { setViewingTx(null); setReceiptUrl(null); }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
