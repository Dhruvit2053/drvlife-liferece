export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  timestamp: number;
  category: string;
  isExpense: boolean;
  paymentMethod: string;
  source: string;
  notes: string;
  fingerprint?: string;
  hasReceiptImage?: boolean;
  receiptImageDevice?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  monthlyIncome: number;
  currency: string;
  autoSyncEnabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  month: string;
  createdAt: number;
}

export const FINANCE_CATEGORIES = [
  'Food',
  'Shopping',
  'Travel',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Salary',
  'Business',
  'Investment',
  'Other',
] as const;

export const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
] as const;

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

