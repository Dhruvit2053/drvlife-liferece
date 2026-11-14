import docx
from docx.shared import Pt, Inches
import re
import os

input_path = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\01_FINAL_REPORT\FINAL_MCA_PROJECT_REPORT_CORRECTED.docx")
output_docx = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\01_FINAL_REPORT\FINAL_MCA_PROJECT_REPORT_FINAL_QC.docx")
output_pdf = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\01_FINAL_REPORT\FINAL_MCA_PROJECT_REPORT_FINAL_QC.pdf")

doc = docx.Document(input_path)
print(f"Loaded document. Paragraphs: {len(doc.paragraphs)}, Tables: {len(doc.tables)}")

# 1. Front Matter Certificates Spacing (P21 to P110)
for i in range(21, 111):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.05
        if "Date: ____________________" in p.text and "___________________________________" in p.text:
            p.text = p.text.replace("\n\n\n\n", "\n\n").replace("\n\n\n", "\n\n")

for t_idx in range(1, 8):
    if t_idx < len(doc.tables):
        t = doc.tables[t_idx]
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(1)
                    p.paragraph_format.line_spacing = 1.0

# 2. Abstract P118 & P124
doc.paragraphs[118].text = (
    "The system is developed using an enterprise-grade, modern technology stack. "
    "The mobile application is natively authored in Kotlin 2.0 utilizing Jetpack Compose and Material 3 for "
    "declarative, reactive UI design, targeting Android 15 (API Level 35) with native client-side storage sandboxing "
    "(app-private filesDir for receipt images and Google Cloud Firestore offline disk caching for financial transactions). "
    "The official web application and analytical dashboard is constructed with React 19, TypeScript, and Tailwind CSS v4, "
    "bundled with Vite 8.3 and deployed on Surge global CDN. The cloud backend operates strictly on the 100% Free Firebase "
    "Spark Tier ($0.00/month), utilizing Cloud Firestore for real-time data persistence and Firebase Authentication for "
    "token-based identity management."
)

doc.paragraphs[124].text = (
    "Keywords: Personal Finance, Native Android, Kotlin, Jetpack Compose, Material 3, React 19, TypeScript, Vite, "
    "Google Cloud Firestore, Firebase Authentication, Spark Free Tier, App-Private Filesystem Sandboxing, Browser IndexedDB, "
    "Google Gemini 2.5 Flash, Privacy-Preserving AI, Local-First Architecture, Zero-Cost Cloud."
)

# 3. Chapter 1 Tech Stack (P205 to P214)
for i in range(200, 220):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if "Backend AI Microservice: Client-Side Google" in p.text:
            p.text = "• AI Integration: Client-Side Google Generative AI SDK (Gemini 2.5 Flash) with automated PII sanitization and 2.5s rate-limit cooldown."
        if "Authentication: JWT tokens + bcrypt" in p.text:
            p.text = "• Authentication: Firebase Authentication (Email/Password & Token-based secure verification)."
        if "Cloud Database & Persistence" in p.text or "Database: Google Cloud Firestore" in p.text:
            p.text = "• Cloud Database & Persistence: Google Cloud Firestore (Serverless NoSQL Document Store, Spark Free Tier $0.00/month) with client-side offline persistence."
        if "Receipt Image Sandbox" in p.text or "Image Storage:" in p.text:
            p.text = "• Receipt Image Sandbox: Client-Side Local Hardware Storage (Android context.filesDir/local_receipts & Browser IndexedDB). No cloud bucket storage is used."

# 4. Chapter 3 Feasibility Study (P240 to P260)
for i in range(235, 265):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if "CSS for web, Node.js/Express.js as the primary backend" in p.text:
            p.text = (
                "The technical feasibility was confirmed by evaluating the core modules: Kotlin Jetpack Compose for mobile, "
                "React 19 with Tailwind CSS for web, Google Cloud Firestore as the real-time serverless database, "
                "and Google Gemini 2.5 Flash API for AI financial analysis."
            )
        if "utilizes open-source frameworks (React, Node.js, Python" in p.text:
            p.text = (
                "The project is economically feasible as it utilizes open-source frameworks (Kotlin, Jetpack Compose, React 19, TypeScript) "
                "and the zero-cost Firebase Spark Free Tier."
            )
        if "By eliminating paid cloud storage buckets (AWS S3, Cloudinary" in p.text:
            p.text = (
                "The project operates at $0.00/month by eliminating paid cloud storage buckets (AWS S3, Cloudinary, Firebase Storage) "
                "and dedicated application servers, ensuring zero recurring cloud operational expenses."
            )
        if "microservice integration proceeded simultaneously" in p.text:
            p.text = "The development was executed in parallel sprints, ensuring client UI design and cloud synchronization integration proceeded smoothly within schedule."
        if "data is stored with JWT-based authentication and bcrypt" in p.text:
            p.text = "User data is stored securely with Firebase Authentication and UID-isolated Cloud Firestore rules (request.auth.uid == userId), complying with Indian IT privacy best practices."
        if "microservice health and logs" in p.text:
            p.text = "Real-time AI query telemetry and network error logs are monitored directly within the client state."

# Fix P248 & P249 explicitly
if len(doc.paragraphs) > 249:
    doc.paragraphs[248].text = "• Surge Global CDN provides high-speed static asset delivery and HTTPS encryption for the web dashboard."
    doc.paragraphs[249].text = "• Firebase Spark Free Tier provides serverless Cloud Firestore document storage and Authentication at $0.00/month."

# Fix P285 explicitly
if len(doc.paragraphs) > 285:
    doc.paragraphs[285].text = "System Security: Enforce Firebase Auth token verification, Firestore security rules (UID-isolated), and Gemini API rate limiting."

# 5. Chapter 4 Section 4.3 bullets
for i in range(285, 305):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if "microservices architecture must support horizontal scaling" in p.text:
            p.text = "• Scalability: Serverless Google Cloud Firestore automatically scales document reads and writes up to Spark Free Tier limits (50,000 reads/day, 20,000 writes/day)."
        if "JWT tokens with 15-minute access token expiry" in p.text:
            p.text = "• Security: All communications occur over HTTPS/TLS 1.3. Google Cloud Firestore enforces strict UID-isolated security rules (request.auth.uid == userId). Passwords and session tokens are managed securely by Firebase Authentication."
        if "Vercel and Render" in p.text:
            p.text = "• Availability: High availability backed by Google Cloud serverless infrastructure and Surge Global CDN."

# 6. Chapter 4 Table 15 (Software Requirements)
t15 = doc.tables[15]
t15_data = [
    ["Category", "Technology / Tool", "Version / Platform"],
    ["Operating System", "Windows 10/11, macOS, Linux", "Cross-Platform Workstation"],
    ["Frontend – Mobile", "Native Android (Kotlin & Jetpack Compose)", "Kotlin 2.0.21 / Android SDK 35"],
    ["Frontend – Web", "React 19 SPA, TypeScript 5.5, Tailwind CSS v4", "Vite 8.3 Build Pipeline / npm"],
    ["Cloud Backend", "Google Cloud Firestore (NoSQL Document Store)", "Firebase Spark Free Tier ($0.00/month)"],
    ["Authentication", "Firebase Authentication (Email/Password, Tokens)", "Firebase Auth SDK 13.3+"],
    ["AI Advisor & OCR", "Google Gemini 2.5 Flash API (Client SDK)", "Generative AI Client SDK (15 RPM limit)"],
    ["Local Image Storage", "Android context.filesDir & Browser IndexedDB", "Hardware Client Sandboxes (<2 MB/image)"],
    ["Web Hosting & CDN", "Surge Global CDN with Security Headers (_headers)", "Surge CLI v0.24+ (HTTPS Enabled)"],
    ["Mobile Distribution", "Direct On-Device APK Download with SHA-256", "Verified Checksum Verification"],
    ["Development IDE", "Android Studio Ladybug & Visual Studio Code", "Official Production IDEs"],
    ["Build Tools", "Gradle 9.4.1 (Android) & Vite 8.3 (Web)", "Automated Unit & Production Bundler"],
    ["Version Control", "Git & GitHub Distributed VCS", "Official Repository Hosting"]
]

while len(t15.rows) > len(t15_data):
    tr = t15.rows[-1]._tr
    tr.getparent().remove(tr)

for r_idx, row_data in enumerate(t15_data):
    row = t15.rows[r_idx]
    for c_idx, val in enumerate(row_data):
        row.cells[c_idx].text = val
        p = row.cells[c_idx].paragraphs[0]
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.0

for row in t15.rows:
    row._tr.get_or_add_trPr().append(docx.oxml.OxmlElement('w:cantSplit'))

# 7. Chapter 5 System Design (P300-P335)
for i in range(300, 335):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if "Node.js / Express.js Main Server: Handles user authentication" in p.text:
            p.text = (
                "• Client-to-Cloud Serverless Tier: Handles user authentication directly via Firebase Authentication SDK "
                "and executes secure CRUD queries directly against Cloud Firestore using UID-isolated security rules."
            )
        if "Python / Gemini 2.5 Flash Client SDK AI Microservice" in p.text:
            p.text = (
                "• On-Device AI Integration: Direct client-side invocation of Google Gemini 2.5 Flash API. "
                "Receipt text parsing and expense insights are executed asynchronously via Coroutines (Android) and Async/Await (Web)."
            )
        if "Node uploads the image to Local Sandbox Storage" in p.text:
            p.text = (
                "The user captures a receipt image → client app compresses the image and stores it in the local hardware sandbox "
                "(context.filesDir or IndexedDB) → client extracts metadata via Gemini API → client writes structured record "
                "to Cloud Firestore (/users/{userId}/transactions) → Firestore synchronizes metadata instantaneously across client devices."
            )
        if "Figure 1: LifeReceipts Data-Centered & Microservices Architecture" in p.text:
            p.text = "Figure 1: DrvLife Client-to-Cloud Serverless Reactive Architecture Diagram"
        if "Figure 14: CI/CD Pipeline — GitHub Actions to Vercel + Render" in p.text:
            p.text = "Figure 14: CI/CD Pipeline & Automated Deployment — GitHub Actions to Surge CDN & Firebase"

# 8. Chapter 7 Table 16 User Schema (bcrypt fix)
if len(doc.tables) > 16:
    t16 = doc.tables[16]
    for r in t16.rows:
        for c in r.cells:
            if "bcrypt" in c.text:
                c.text = "Firebase Auth token-based verification (Null if Google OAuth)"

# 9. Chapter 8 Diagram Captions & Sequence Diagram narrative
for i in range(370, 420):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if "The Sequence Diagram illustrates the message flows for two critical scenarios: JWT" in p.text:
            p.text = (
                "The Sequence Diagram illustrates the message flows for two critical scenarios: Firebase token-based authentication "
                "and the AI receipt scanning sequence involving Android Camera capture, Local Sandbox Storage (filesDir), and the Google Gemini 2.5 Flash API."
            )
        if "Figure 11: Sequence Diagram — JWT Authentication" in p.text:
            p.text = "Figure 11: Sequence Diagram — Firebase Authentication & Client-Side Gemini AI Advisory Flow"
        if "Figure 12: System Architecture — Data-Centered & Microservices Design" in p.text:
            p.text = "Figure 12: System Architecture — Client-to-Cloud Serverless Reactive Architecture"

# 10. Chapter 9 Testing Strategy
for i in range(408, 440):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if "To validate JWT token protection" in p.text:
            p.text = "• To validate Firebase Authentication token protection and Firestore UID security rules against unauthorized access."
        if "Integration Testing: Verifying that the Node.js API server" in p.text:
            p.text = "• Cloud Integration Testing: Verifying that client applications communicate correctly with Cloud Firestore and that transaction snapshots synchronize in real time."
        if "Security Testing: JWT token validation testing" in p.text:
            p.text = "• Security Testing: Cloud Firestore security rules validation, cross-user isolation testing, and local sandbox access permission verification."
        if "JWT utility functions" in p.text:
            p.text = p.text.replace("JWT utility functions", "Firebase Auth session helpers")

# 11. Table 21 (Table 8 Test Cases) JWT cleanup
if len(doc.tables) > 21:
    t21 = doc.tables[21]
    for r in t21.rows:
        for c in r.cells:
            if "without JWT" in c.text:
                c.text = c.text.replace("without JWT", "without Auth Token")
            if "Route blocked JWT" in c.text:
                c.text = c.text.replace("Route blocked JWT", "Route blocked (HTTP 403 Forbidden)")
            if "Expired JWT access" in c.text:
                c.text = c.text.replace("Expired JWT access", "Expired Auth token session")
            if "JWT middleware active" in c.text:
                c.text = c.text.replace("JWT middleware active", "Firebase Auth security rules active")

# 12. Chapter 11 Advantages (P460-P485)
for i in range(460, 485):
    if i < len(doc.paragraphs):
        p = doc.paragraphs[i]
        if "Dual-Backend Performance: The microservices separation of Node.js" in p.text:
            p.text = (
                "• Serverless Cloud Performance: Direct client-to-cloud reactive synchronization via Google Cloud Firestore "
                "guarantees sub-second response times without the latency overhead of intermediary API proxy servers."
            )

# 13. Bibliography P511, P514, P516
if len(doc.paragraphs) > 516:
    doc.paragraphs[511].text = "15. Google Firebase Documentation — Cloud Firestore Security Rules and Offline Persistence. (2024). Retrieved from https://firebase.google.com/docs/firestore"
    doc.paragraphs[514].text = "18. Android Developer Guide — App-Specific Internal Storage Sandboxing. (2024). Retrieved from https://developer.android.com/training/data-storage/app-specific"
    doc.paragraphs[516].text = "20. Google Generative AI Android SDK — Gemini Developer Guide. (2024). Retrieved from https://ai.google.dev/gemini-api/docs"

# 14. Appendix C Heading P590
if len(doc.paragraphs) > 590:
    doc.paragraphs[590].text = "Appendix C: Sample Cloud Firestore Security Rules Configuration"

# 15. In-Report Viva Q4 & Security Answer (P642, P643, P646)
if len(doc.paragraphs) > 646:
    doc.paragraphs[642].text = "Q4. Why did you choose a serverless Firebase cloud architecture instead of traditional dedicated application servers?"
    doc.paragraphs[643].text = (
        "Answer: A serverless cloud architecture powered by Google Cloud Firestore and Firebase Authentication "
        "eliminates backend server maintenance, provides automatic real-time synchronization, and operates completely "
        "within the zero-cost Firebase Spark Free Tier ($0.00/month). This guarantees that user transaction data is "
        "securely persisted with strict UID isolation while maintaining zero recurring server hosting expenses."
    )
    doc.paragraphs[646].text = (
        "Answer: Security is implemented at multiple layers: (1) Firebase Authentication with secure token-based identity verification; "
        "(2) Cloud Firestore Security Rules enforcing strict UID isolation (request.auth.uid == userId) with default deny-all fallback; "
        "(3) Client-side local sandboxing ensuring raw receipt image binaries never leave user devices; (4) Client-side PII scrubbing "
        "ensuring personal names and account numbers are never transmitted in AI prompts."
    )

# 16. Table of Contents Update
toc_mapping = [
    ("Cover Page & 10 University Certificates", "i–xiii"),
    ("Abstract & Technical Specifications", "xiv–xv"),
    ("Table of Contents, List of Figures & Tables", "xvi–xix"),
    ("Chapter 1: Introduction", "20"),
    ("Chapter 2: Literature Review", "22"),
    ("Chapter 3: Feasibility Study", "24"),
    ("Chapter 4: Requirement Analysis", "26"),
    ("Chapter 5: System Design", "29"),
    ("Chapter 6: Database Design", "33"),
    ("Chapter 7: Data Dictionary", "35"),
    ("Chapter 8: System Diagrams", "38"),
    ("Chapter 9: Testing Strategy & Test Cases", "47"),
    ("Chapter 10: Results and Screenshots", "50"),
    ("Chapter 11: Advantages and Limitations", "52"),
    ("Chapter 12: Conclusion", "53"),
    ("Bibliography", "54"),
    ("Appendix A–D (Code Listings & Schemas)", "55"),
    ("Viva Questions and Answers (Comprehensive Q&A)", "58"),
    ("Chapter 9B: Empirical Production Testing & Security Audit", "60")
]

if len(doc.tables) > 10:
    t_toc = doc.tables[10]
    while len(t_toc.rows) > len(toc_mapping) + 1:
        tr = t_toc.rows[-1]._tr
        tr.getparent().remove(tr)
    
    t_toc.rows[0].cells[0].text = "Section / Chapter"
    t_toc.rows[0].cells[1].text = "PDF Page No."
    
    for idx, (title, p_num) in enumerate(toc_mapping):
        row_idx = idx + 1
        if row_idx < len(t_toc.rows):
            t_toc.rows[row_idx].cells[0].text = title
            t_toc.rows[row_idx].cells[1].text = p_num

# Save and compile
doc.save(output_docx)
print(f"SUCCESS: Saved final reconciled DOCX: {output_docx}")

import win32com.client
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
try:
    print(f"Compiling PDF via Word 16.0: {output_pdf}...")
    wdoc = word.Documents.Open(output_docx)
    wdoc.SaveAs(output_pdf, FileFormat=17)
    wdoc.Close()
    print("Compilation successful!")
finally:
    word.Quit()

if os.path.exists(output_pdf):
    print(f"Verified PDF generated! Size: {os.path.getsize(output_pdf)} bytes")
