# DRVLIFE — PROGRESSIVE WEB PORTAL
## React 18, TypeScript, Tailwind CSS, Vite & IndexedDB

**Live Production URL**: [https://liferece.surge.sh](https://liferece.surge.sh)  
**Hosted APK Download**: [https://liferece.surge.sh/downloads/drvlife-v1.0.apk](https://liferece.surge.sh/downloads/drvlife-v1.0.apk)  
**CDN Infrastructure**: Surge Global Anycast Edge Routing  
**Security Policy**: Strict Content-Security-Policy (CSP) meta tag active  
**Local Storage Engine**: Browser IndexedDB (`drvlife_offline_db`)  

---

## 1. Directory Structure

```text
02_WEBSITE/
├── src/                        # React 18 / TypeScript application source tree
├── public/                     # Public static files, downloads, robots.txt, CNAME
├── source_code/                # Clean mirror of TypeScript components & services
├── public_assets/              # Clean mirror of public distribution assets
├── components/                 # UI components and routed application pages
├── configuration/              # vite.config.ts, tsconfig.json, tailwind, package.json
├── firebase_integration/       # Firebase auth, config, and firestoreService.ts
├── api_integration/            # Gemini AI integration and localReceiptStore.ts
├── screenshots/                # Responsive desktop & mobile web layouts
├── deployment/                 # Surge CNAME, redirects, and compiled dist/ bundle
├── testing/                    # Web acceptance test suites & reports
├── technical_documentation/    # Web architecture & IndexedDB design specs
├── package.json                # NPM dependency management & scripts
├── vite.config.ts              # Vite 8.3 build pipeline configuration
└── README.md                   # This master documentation
```

---

## 2. Development & Production Build Instructions

1. **System Requirements**:
   - Node.js: v18.0.0 or higher (v20+ recommended)
   - Package Manager: npm or pnpm
2. **Install Dependencies**:
   ```powershell
   cd D:\Liferece\02_WEBSITE
   npm install
   ```
3. **Run Local Development Server**:
   ```powershell
   npm run dev
   ```
   *Local Server*: `http://localhost:5173`
4. **Compile Production Bundle**:
   ```powershell
   npm run build
   ```
   *Output*: `02_WEBSITE/dist/` (HTML, CSS, JS, APK download)

---

## 3. Web Architecture & Privacy Standards

- **IndexedDB Receipt Store**: Receipt images uploaded via the browser are downscaled using offscreen HTML5 `<canvas>` and saved as Blobs into IndexedDB (`drvlife_local_receipts`). Keys are scoped as `${userId}_${transactionId}` to prevent cross-account leakage.
- **Zero Cloud Storage Cost**: `firebase/storage` imports are completely removed from `firebase/config.ts`.
- **Live Deployment Parity**: The hosted APK binary at `/downloads/drvlife-v1.0.apk` matches byte-for-byte with the Android build (`SHA-256: A420F818FF0DBDD0D6FC36DB220283709956E3025D5C4949C831C8870907018E`).
