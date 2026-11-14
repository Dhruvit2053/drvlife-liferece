import React, { useState } from 'react';
import { X, Plus, Check, ArrowDownLeft, ArrowUpRight, Camera } from 'lucide-react';
import { addTransaction } from '../services/firestoreService';
import { saveLocalReceipt } from '../services/localReceiptStore';
import { FINANCE_CATEGORIES, PAYMENT_METHODS } from '../types/finance';

interface AddTransactionModalProps {
  uid: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  uid,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState<string>('Food');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (!merchant.trim() || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid merchant and positive amount.');
      return;
    }

    try {
      setLoading(true);
      const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const txId = await addTransaction(uid, {
        merchant: merchant.trim(),
        amount: numAmount,
        timestamp: Date.now(),
        category,
        isExpense,
        paymentMethod,
        source: 'Web App',
        notes: notes.trim(),
        hasReceiptImage: Boolean(receiptFile),
        receiptImageDevice: receiptFile ? (isMobile ? 'Mobile Web' : 'Desktop Web') : undefined,
      });

      if (receiptFile && txId) {
        await saveLocalReceipt(txId, receiptFile);
      }

      // Reset
      setMerchant('');
      setAmount('');
      setNotes('');
      setReceiptFile(null);
      setReceiptPreview(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#190B30] border border-white/15 p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7F77DD] to-[#534AB7] flex items-center justify-center text-white">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Add New Transaction</h3>
              <p className="text-xs text-[#888799]">Direct cloud sync to Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#888799] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#E24B4A]/20 border border-[#E24B4A]/40 text-xs text-[#E24B4A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Income vs Expense Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <button
              type="button"
              onClick={() => { setIsExpense(true); if (category === 'Salary') setCategory('Food'); }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isExpense
                  ? 'bg-[#E24B4A] text-white shadow-lg shadow-[#E24B4A]/30'
                  : 'text-[#888799] hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsExpense(false); setCategory('Salary'); }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                !isExpense
                  ? 'bg-[#1D9E75] text-white shadow-lg shadow-[#1D9E75]/30'
                  : 'text-[#888799] hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Income</span>
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative rounded-xl bg-white/[0.04] border border-white/10 focus-within:border-[#7F77DD]">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-lg font-bold text-[#7F77DD]">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="block w-full pl-9 pr-4 py-3 bg-transparent text-white font-mono text-lg font-bold placeholder-[#888799]/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Merchant / Description */}
          <div>
            <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
              Merchant / Title
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Swiggy, Netflix, Amazon, D-Mart"
              required
              className="block w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#7F77DD] text-white placeholder-[#888799]/50 text-sm focus:outline-none"
            />
          </div>

          {/* Category & Payment Method Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3 py-3 rounded-xl bg-[#190B30] border border-white/10 focus:border-[#7F77DD] text-white text-sm focus:outline-none"
              >
                {FINANCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#190B30] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block w-full px-3 py-3 rounded-xl bg-[#190B30] border border-white/10 focus:border-[#7F77DD] text-white text-sm focus:outline-none"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} className="bg-[#190B30] text-white">
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#888799] uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dinner with team"
              className="block w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#7F77DD] text-white placeholder-[#888799]/50 text-xs focus:outline-none"
            />
          </div>

          {/* Receipt Photo Attachment (Spark Free Tier - Local IndexedDB Only) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#7F77DD]" />
                <span>Attach Receipt Photo</span>
              </label>
              <span className="text-[10px] text-[#1D9E75] font-semibold bg-[#1D9E75]/10 px-2 py-0.5 rounded-md border border-[#1D9E75]/20">
                Spark Free (Local Only)
              </span>
            </div>
            <p className="text-[11px] text-[#888799]">
              Photo is compressed and stored strictly in your local device's IndexedDB. Never uploaded to paid cloud storage.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-[#888799] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#7F77DD]/20 file:text-[#7F77DD] hover:file:bg-[#7F77DD]/30 cursor-pointer"
            />
            {receiptPreview && (
              <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-white/20">
                <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setReceiptFile(null); setReceiptPreview(null); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white text-xs"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-[#888799] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7F77DD] to-[#534AB7] hover:from-[#6c64d4] hover:to-[#463ea3] text-white font-bold text-sm shadow-lg shadow-[#7F77DD]/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save to Firestore</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

