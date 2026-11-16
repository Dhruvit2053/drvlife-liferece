# DrvLife Website — Firebase, Firestore & Data Integrity Audit

**Audit Date:** November 15, 2026  
**Auditor:** Senior Database & Cloud Architecture Specialist  
**Target:** Firebase Project `drvlife-50995` (Spark Free Tier)  
**Local Persistence:** Browser IndexedDB `drvlife_local_receipts` & SessionStorage  

---

## 1. Firebase Spark Free Tier Architectural Conformance

The DrvLife system operates strictly under the **Firebase Spark Free Plan**:
- **Cloud Firestore Limits:** 50,000 reads/day, 20,000 writes/day, 1 GiB total storage.
- **Firebase Cloud Storage:** **DISABLED / NOT UTILIZED**. (Prevents activating paid Blaze billing).
- **Firebase Authentication:** Unlimited free email/password and anonymous authentication.

### Compliance Verification Table

| Architecture Rule | Implementation Detail | Status | Evidence |
|---|---|---|---|
| **Zero Cloud Storage Usage** | No `firebase/storage` imports; receipt photos are stored strictly in browser IndexedDB. | **COMPLIANT (PASS)** | `src/services/localReceiptStore.ts:1-25` |
| **No Base64 Bloat in Firestore** | Firestore transaction docs store only lightweight metadata (`hasReceiptImage: boolean`, `receiptImageDevice: string`). | **COMPLIANT (PASS)** | `src/types/finance.ts:1-14` |
| **User Quarantined Firestore Path** | All reads/writes routed to `users/{uid}/*`. | **COMPLIANT (PASS)** | `src/services/firestoreService.ts` |
| **Efficient Firestore Querying** | Transactions queried using single composite order `query(col, orderBy('timestamp', 'desc'))`. | **COMPLIANT (PASS)** | `src/services/firestoreService.ts:133` |
| **Offline Cache Fallback** | `sessionStorage` with XOR obfuscation caches live snapshots to preserve data between reloads. | **COMPLIANT (PASS)** | `src/services/firestoreService.ts:98-106` |

---

## 2. Firestore Document Schemas & Collections

### Collection 1: `users/{uid}`
- **Purpose:** Stores root user configuration and profile metadata.
- **Document ID:** Firebase User UID.
- **Schema:**
  ```typescript
  {
    uid: string;              // Firebase Authentication UID
    name: string;             // User display name
    email: string;            // Registered email address
    monthlyIncome: number;    // Monthly target income in INR (default: 50,000)
    currency: string;         // '₹' (Indian Rupee)
    autoSyncEnabled: boolean; // Sync toggle flag
    createdAt: number;        // Epoch timestamp (ms)
    updatedAt: number;        // Epoch timestamp (ms)
  }
  ```

### Collection 2: `users/{uid}/transactions/{transactionId}`
- **Purpose:** Central ledger synchronizing across Web and Android mobile.
- **Document ID:** Auto-generated Firestore ID or `tx_epoch_rand`.
- **Schema:**
  ```typescript
  {
    merchant: string;             // Merchant or payee name
    amount: number;               // Monetary amount in INR
    timestamp: number;            // Transaction epoch timestamp (ms)
    category: string;             // Category (Food, Shopping, Travel, Bills, etc.)
    isExpense: boolean;           // True for expense, False for income
    paymentMethod: string;        // 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash'
    source: string;               // 'Web App' | 'Auto Sync' | 'Android Manual'
    notes: string;                // User or auto notes
    hasReceiptImage: boolean;     // Flag indicating whether receipt photo exists locally
    receiptImageDevice?: string;  // e.g. 'Desktop Web' | 'Mobile Web' | 'Android Device'
    fingerprint?: string;         // 5-min deduplication hash
  }
  ```

### Collection 3: `users/{uid}/budgets/{budgetId}`
- **Purpose:** Category monthly budget limits.
- **Document ID:** `{YYYY-MM}_{category}` (e.g. `2026-11_food`).
- **Schema:**
  ```typescript
  {
    id: string;               // Budget identifier
    category: string;         // Target category
    monthlyLimit: number;     // Maximum budget limit in INR
    month: string;            // 'YYYY-MM'
    createdAt: number;        // Epoch timestamp (ms)
  }
  ```

---

## 3. IndexedDB Local Receipt Storage Deep Dive

### Database Specifications
- **Database Name:** `drvlife_local_receipts`
- **Version:** `1`
- **Object Store:** `receipt_images`
- **Key Path:** `transactionId` (matches Firestore transaction ID)
- **Record Structure:**
  ```typescript
  interface StoredReceipt {
    transactionId: string; // Foreign key referencing Firestore transaction
    blob: Blob;            // Compressed JPEG binary
    mimeType: string;      // 'image/jpeg'
    sizeBytes: number;     // File size in bytes (< 1.5 MB)
    createdAt: number;     // Epoch timestamp (ms)
  }
  ```

### Client Compression Pipeline
1. Reads `File` object from `<input type="file">`.
2. Creates temporary canvas element.
3. Scales down dimensions if width or height exceeds 1200 pixels while maintaining aspect ratio.
4. Exports canvas to Blob with JPEG quality 0.8.
5. If blob exceeds 1.5 MB, executes secondary compression pass with quality 0.6.
6. Stores final Blob in IndexedDB object store via `store.put(record)`.

*Evaluation:* **PASS**. Efficient, private, and ensures high performance without exceeding browser storage quotas.

---

## 4. Data Integrity Findings & Edge Cases

| Issue ID | Severity | Area | Finding | Suggested Fix |
|---|---|---|---|---|
| **DAT-01** | **LOW** | Seed Data Reappearance | In `firestoreService.ts:150`, if Firestore returns an empty snapshot, it calls `getStoredTransactions(uid)`. If local cache is also empty, it re-injects 4 seed transactions. Users who intentionally clear all transactions will see seed data reappear after cache reset. | Set an account initialized flag in `users/{uid}` so empty ledger does not revert to seed data. |
| **DAT-02** | **LOW** | Memory Leak on Object URLs | `getLocalReceipt()` creates Object URLs via `URL.createObjectURL(blob)`. When modals close, `URL.revokeObjectURL()` is not invoked. | Add `URL.revokeObjectURL(receiptUrl)` in `onClose` handlers. |
| **DAT-03** | **INFO** | Cross-Device Photo Isolation | Receipt images saved on Android are not visible on Web and vice versa (by Spark Free Tier design). | The UI accurately explains this architectural constraint via informative badges. |
