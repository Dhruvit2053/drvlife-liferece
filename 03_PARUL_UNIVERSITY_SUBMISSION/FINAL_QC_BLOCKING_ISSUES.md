# DRVLIFE (LIFERECE) — QUALITY CONTROL BLOCKING ISSUES REGISTER
**Target Package:** MCA Semester 4 Project Submission  
**Candidate:** Dhruvit Sarvaiya | **Enrollment:** 2401A00600037  
**Internal Guide:** Prof. Kinjal Ma'am | **University:** Parul University, CDOE  
**Status:** **PENDING USER AUTHORIZATION BEFORE CODE/DOC MODIFICATION**  

In accordance with strict Quality Control directives, this register outlines the **5 Blocking Issues** identified during the independent audit of `FINAL_MCA_PROJECT_REPORT_CORRECTED.docx`/`.pdf`, `PROJECT_CERTIFICATES.docx`, `DRVLIFE_MCA_PROJECT_PRESENTATION.pptx`, and `DRVLIFE_MCA_VIVA_PREPARATION.docx`.

> **Note:** As instructed, **no files have been modified or overwritten**. These issues represent actionable findings requiring explicit approval before applying final fixes.

---

## 1. BLOCKING ISSUES SUMMARY MATRIX

| Issue ID | Severity | Category | Affected Pages / Files | Summary of Technical Defect |
| :---: | :---: | :--- | :--- | :--- |
| **BLK-01** | **CRITICAL** | Technical Accuracy | Report PDF pp. 24, 27, 29, 32, 47, 54, 58 | Residual mentions of `Node.js`, `Express.js`, `Vercel`, `Render`, `JWT + bcrypt`, and `microservices` in text, tables, and viva questions. |
| **BLK-02** | **CRITICAL** | Code Discrepancy | Report (p. 15, 21), PPT (Slide 7), Viva (Q36, 64–66) | Claiming `Android Room (SQLite)` database, when the actual Android codebase uses direct `context.filesDir` for images and Firestore offline disk cache for metadata. |
| **BLK-03** | **HIGH** | Layout & Formatting | Report PDF pp. 6–7, 8–9; Certs pp. 5–6, 7–8 | Certificate spillover: Student Declaration and Code Undertaking spill signature blocks onto separate 2-line orphan pages. |
| **BLK-04** | **MEDIUM** | Layout & Pagination | Report PDF pp. 16–17, 28, 49 | Table of Contents page numbering reflects legacy draft; Table 2 caption sits orphaned on Page 28; Table 10 splits unevenly across Page 49. |
| **BLK-05** | **MEDIUM** | Testing Methodology | Report PDF pp. 30, 47, 60; PPT Slide 15 | Ambiguity between automated JVM unit tests (`testDebugUnitTest`) and manual real-device APK acceptance testing. |

---

## 2. DETAILED DEFECT SPECIFICATIONS & PROPOSED RESOLUTIONS

### BLOCKING ISSUE BLK-01 [CRITICAL]: Residual Legacy Stack Mentions

#### 1. Context & Evidence:
While major abstract paragraphs and cover tables were thoroughly cleaned, secondary narrative sections, hardware tables, and the in-report viva section still contain remnants of the obsolete MERN/microservices draft:
* **Page 24 (Section 3.2):** *"Vercel provides free hosting for the React 19 SPA... Render/Railway offers free tiers sufficient for Node.js and Python backend deployment."*
* **Page 27 (Table 2 - Software Requirements):**
  * `Backend – Primary: Node.js, Express.js | Node.js 20 LTS`
  * `Backend – AI Service: Google Gemini 2.5 Flash API | Python 3.10+`
  * `Authentication: JWT + bcryptjs + Google OAuth | JWT 9.0`
  * `Cloud Hosting: Vercel (Web) + Render (API) | Latest`
* **Page 29 (Section 5.1 & Figure 1 Caption):** *"Node.js / Express.js Main Server: Handles user authentication (JWT + Google OAuth)... Figure 1: LifeReceipts Data-Centered & Microservices Architecture Diagram."*
* **Page 32 (Figure 14 Caption):** *"Figure 14: CI/CD Pipeline — GitHub Actions to Vercel + Render"*
* **Page 47 (Section 9.2):** *"Integration Testing: Verifying that the Node.js API server correctly communicates with the Python microservice... JWT token validation, bcrypt hash..."*
* **Page 54 (Bibliography):** Reference 15 cites *"Node.js v20 Official Documentation"*; Reference 20 cites *"Expo SDK Documentation"*.
* **Page 58 (In-Report Viva Q&A):**
  * Q4 asks: *"Why use two separate backends Node.js and Python?"*
  * Answer defends Node.js asynchronous I/O and Python OCR microservice.
  * Security Q defends *"JWT with 15-minute expiry and bcrypt with salt rounds of 12"*.

#### 2. Risk & Impact:
If an examiner asks the student to show the `Node.js` server, `JWT middleware`, or `bcrypt hashing` in their repository, the student will fail the defense because DrvLife uses **serverless Google Cloud Firestore and Firebase Authentication SDK**.

#### 3. Proposed Exact Resolution:
1. Replace Table 2 on Page 27 to state:
   * `Frontend – Mobile: Native Android (Kotlin Compose, SDK 35)`
   * `Frontend – Web: React 19 SPA, TypeScript, Tailwind CSS v4 (Vite 8.3)`
   * `Cloud Backend: Google Cloud Firestore (Serverless NoSQL, Spark Plan)`
   * `Authentication: Firebase Authentication (Email/Password & Token-based)`
   * `AI Integration: Google Generative AI SDK (Gemini 2.5 Flash API)`
   * `Web Hosting: Surge Global CDN (HTTPS with Custom Headers)`
2. Update Page 24, 29, 32, and 47 narratives to describe the direct serverless client-to-cloud architecture.
3. Replace In-Report Viva Q4 on Page 58 with: *"Q4. Why did you choose a serverless Firebase architecture over traditional Node.js/Express servers?"*
4. Replace Bibliography references 15 and 20 with Firebase Firestore and Google Generative AI documentation citations.

---

### BLOCKING ISSUE BLK-02 [CRITICAL]: Room SQLite Codebase Discrepancy

#### 1. Context & Evidence:
* The report (P118, P209, Table 7.4), Presentation (Slide 7), and Viva Guide (Q36, Q64–66, Q111–114) claim:
  *"Local Database: Android Room (SQLite) database for offline receipt data persistence."*
* **Codebase Reality:**
  * In `D:\Liferece\01_APP_ANDROID\android_project\app\build.gradle.kts`, Room dependencies (`androidx.room`) are **completely absent**.
  * No `@Entity`, `@Dao`, or `@Database` classes exist in the Kotlin package.
  * Android local storage is implemented by:
    1. **`LocalReceiptManager.kt`:** Writes receipt image JPEGs directly to `context.filesDir/local_receipts/<id>.jpg` via standard Java File I/O.
    2. **Cloud Firestore Android SDK:** Provides built-in offline SQLite/disk persistence for `/transactions`, `/budgets`, and `/aiInsights` subcollections automatically.
  * Web local storage is implemented by `localReceiptStore.ts` using native browser `IndexedDB` (`drvlife_local_receipts`).

#### 2. Risk & Impact:
In viva-voce, examiners frequently ask candidates to show their Room DAO interfaces and SQLite migration strategies. If the candidate points to code that doesn't exist, the project's credibility is damaged.

#### 3. Proposed Exact Resolution:
1. Reconcile the architectural description across the Report, PPT, and Viva Guide:
   * State accurately: *"Client-Side Receipt Sandboxing: Handled natively via `context.filesDir/local_receipts` on Android and browser `IndexedDB` on Web. Offline transaction metadata is seamlessly cached via Cloud Firestore's built-in offline persistence layer."*
2. In Table 7.4 of the report, rename the table to *"Android Internal Filesystem Sandbox (`context.filesDir/local_receipts`) & Firestore Offline Cache Schema"*.
3. In `DRVLIFE_MCA_VIVA_PREPARATION.docx`, update Q36, Q64–66, and Q111–114 to explain direct internal storage sandboxing and Firestore offline caching instead of Room DAO annotations.
4. In `DRVLIFE_MCA_PROJECT_PRESENTATION.pptx` (Slide 7), change *"Local Database: Android Room (SQLite)"* to *"Local Sandbox: Android filesDir & Firestore Offline Cache"*.

---

### BLOCKING ISSUE BLK-03 [HIGH]: Certificate Page Spillovers (Orphan Pages)

#### 1. Context & Evidence:
* In `FINAL_MCA_PROJECT_REPORT_CORRECTED.pdf`:
  * **Page 6:** Student Declaration body text ends, but the signature block spills onto **Page 7** (193 characters).
  * **Page 8:** Student Code Undertaking body text ends, but the signature block spills onto **Page 9** (182 characters).
* In `PROJECT_CERTIFICATES.pdf`:
  * Certificate 5 spills signature onto Page 6 (160 characters).
  * Certificate 6 spills signature onto Page 8 (131 characters).
  * Certificate 10 (Acknowledgement) spills signature onto Page 13 (162 characters).

#### 2. Risk & Impact:
Academic certificates must appear as single-page standalone legal declarations. Having a certificate where only the signature line sits on a blank second page violates formal university document standards.

#### 3. Proposed Exact Resolution:
Adjust line spacing from `1.15` to `1.0` (Single) and reduce paragraph spacing (`space_after = Pt(4)`) specifically for Certificate 5, Certificate 6, and Certificate 10 so that each certificate, its official heading, declaration body, seal placeholder, and signature block fit cleanly on a single page.

---

### BLOCKING ISSUE BLK-04 [MEDIUM]: Table of Contents Page Desync & Orphan Captions

#### 1. Context & Evidence:
* **Table of Contents (Page 16–17):**
  * Lists Chapter 1 starting on Page 1, but in the actual PDF Chapter 1 begins on **Page 20** (due to 13 prepended certificate and cover pages).
  * Chapters 2 through 12 have legacy page numbers (e.g., Chapter 10 listed as page 58 instead of page 50).
* **Page 28 Orphan Caption:**
  * Page 27 holds Table 2 (Software Requirements), but its caption *"Table 2: Software Requirements — Technology Stack"* got separated and placed alone on Page 28.
* **Page 49 Table Split:**
  * Table 10 (Test Cases) header and first row are cut awkwardly across page 48 and 49.

#### 2. Risk & Impact:
Reflects automated document compilation artifacts. Examiners checking the Table of Contents will find that chapter page references do not match the PDF viewer page numbers.

#### 3. Proposed Exact Resolution:
1. Update Table 10 (Table of Contents) in the DOCX to reflect exact PDF page coordinates:
   * Front Matter & Certificates: Pages i–xiii (PDF pp. 1–13)
   * Abstract: Page xiv (PDF pp. 14–15)
   * Chapter 1 (Introduction): Page 20
   * Chapter 2 (Literature Review): Page 22
   * Chapter 3 (Feasibility Study): Page 24
   * Chapter 4 (Requirement Analysis): Page 26
   * Chapter 5 (System Design): Page 29
   * Chapter 6 (Database Design): Page 33
   * Chapter 7 (Data Dictionary): Page 35
   * Chapter 8 (System Diagrams): Page 38
   * Chapter 9 (Testing): Page 47
   * Chapter 10 (Results and Screenshots): Page 50
   * Chapter 11 (Advantages and Limitations): Page 52
   * Chapter 12 (Conclusion): Page 53
   * Bibliography: Page 54
   * Appendices: Page 55
   * Viva Questions: Page 58
   * Chapter 9B (Empirical Production Testing): Page 60
2. Set `cantSplit` and `keep_with_next = True` on Table 2 and Table 10 rows so captions never detach from tables.

---

### BLOCKING ISSUE BLK-05 [MEDIUM]: Testing Rigor & Environment Clarification

#### 1. Context & Evidence:
* The report highlights "10/10 PASS automated tests" and "100% test success rate".
* **Audit Verification:**
  * Automated tests executed: `./gradlew.bat testDebugUnitTest` (JVM Unit Tests).
  * Unit tests verified: Total calculation, expense calculation, net balance, and budget utilization threshold logic.
  * Real-device testing was performed manually by installing `drvlife-v1.0.apk` on Android 15.

#### 2. Risk & Impact:
If the report claims automated device-farm testing or UI instrumentation coverage without logs, external examiners may challenge the test methodology.

#### 3. Proposed Exact Resolution:
Clearly distinguish test levels in Section 9.3 and Chapter 9B:
* **Tier 1 (Automated):** JVM-based Gradle Unit Tests (10/10 PASS).
* **Tier 2 (Automated):** Web Production Build & Type Checking (Vite/TypeScript: 0 Errors).
* **Tier 3 (Automated):** Cloud Firestore Security Rules Verification (Deny-All Root, Authenticated UID Match).
* **Tier 4 (Manual):** Real-Device Physical Acceptance Testing (APK Installation, Camera Capture, Navigation).

---

## 3. PROPOSED RECONCILIATION PLAN

Once approved, a single automated script will apply these 5 targeted fixes:
1. Remove all residual Node/Vercel/JWT text and harmonize with Firebase Spark.
2. Replace Room SQLite claims with direct `context.filesDir` image sandboxing and Firestore offline cache.
3. Fix certificate paragraph line spacing so each certificate occupies exactly one page.
4. Resynchronize Table of Contents page numbers with the 61-page PDF layout.
5. Clarify test methodology across Report, PPT, and Viva Guide.

---
*Register certified by Antigravity Independent Quality Control Specialist.*

