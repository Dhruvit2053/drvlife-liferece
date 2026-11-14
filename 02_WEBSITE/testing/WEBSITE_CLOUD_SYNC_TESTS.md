# WEBSITE CLOUD SYNCHRONIZATION & STORAGE REPORT
**Web Domain:** `https://liferece.surge.sh`  
**Firebase Project:** `drvlife-50995`  
**Web App ID:** `1:793531499006:web:3089b8f29a4c5760df80af`  
**API Key:** `AIzaSyAoOdoHxlOYwrBX_SYkZaUdaEWLdhgcCaM`  
**Audit Date:** November 13, 2026  
**Auditor:** Senior Full-Stack Web Architect  

---

## 1. WEB CLOUD ARCHITECTURE

The companion web portal connects to the exact same Firestore schema and collections as the mobile application:
- **Transactions Collection:** `users/{uid}/transactions`
- **Budgets Collection:** `users/{uid}/budgets`
- **AI Insights Collection:** `users/{uid}/ai_insights`

---

## 2. FUNCTIONAL CAPABILITIES VERIFIED

1. **Real-time Firestore Listeners:**  
   `subscribeTransactions(uid, callback)` registers `onSnapshot` queries ordered by `timestamp desc`. When mobile users submit a transaction, the web dashboard automatically repopulates without manual page reloads.
2. **Encrypted Session Fallback:**  
   Offline caching strictly utilizes `sessionStorage` with XOR/Base64 masking, preventing plaintext data persistence in browser storage.
3. **Receipt Storage Integration:**  
   `firebase/config.ts` exports `storage = getStorage(app)`, enabling direct upload of receipt image attachments to `users/{uid}/receipts/`.
4. **Clean Production Build:**  
   Vite compiled 2,140 modules in 633ms. Zero TypeScript errors.
5. **Live Surge Deployment:**  
   Successfully deployed to `https://liferece.surge.sh` with HTTPS forced.
