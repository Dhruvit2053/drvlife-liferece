import docx
import os
import re

input_path = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\04_VIVA_PREPARATION\DRVLIFE_MCA_VIVA_PREPARATION.docx")
output_path = os.path.abspath(r"D:\Liferece\03_PARUL_UNIVERSITY_SUBMISSION\04_VIVA_PREPARATION\DRVLIFE_MCA_VIVA_PREPARATION_FINAL_QC.docx")

doc = docx.Document(input_path)
print(f"Loaded viva document: {len(doc.paragraphs)} paragraphs.")

# 1. Update Defense Script (P6)
for i, p in enumerate(doc.paragraphs[:10]):
    if "Room" in p.text:
        p.text = p.text.replace("Room SQLite", "Android filesDir and Firestore Offline Persistence").replace("Room", "Firestore Offline Persistence")

# 2. Update specific question replacements
q_replacements = {
    "Q36 [Technical]: What is the role of Room Database?": (
        "Q36 [Technical]: How does DrvLife handle local persistence and offline resilience?",
        "English: DrvLife utilizes Android's internal app-private filesystem (context.filesDir/local_receipts) for receipt image sandboxing, and leverages Google Cloud Firestore SDK's built-in offline persistence layer for local transaction and budget caching.",
        "Hinglish: App-private filesDir me receipt images save hoti hain aur Firestore offline persistence transaction data ko automatically cache karta hai."
    ),
    "Q64 [Android]: What Room DAO methods exist in DrvLife?": (
        "Q64 [Android]: How does LocalReceiptManager save receipt images on device?",
        "English: It uses Java File I/O (FileOutputStream) to write compressed JPEG bitmaps (80% quality, max 1200px dimension) directly to context.filesDir/local_receipts/<id>.jpg, strictly isolating files from other apps.",
        "Hinglish: Image ko scale aur compress karke app-private filesDir folder me store karta hai."
    ),
    "Q65 [Android]: What is a Room Entity?": (
        "Q65 [Android]: What is the Transaction data model in Android Kotlin?",
        "English: A Kotlin data class representing a financial record with fields: id, title, amount, date, category, isExpense, hasReceiptImage, and receiptImageUri.",
        "Hinglish: Transaction model class jo har transaction ke fields hold karti hai."
    ),
    "Q66 [Android]: What is a Room TypeConverter?": (
        "Q66 [Android]: How are timestamps and amounts formatted in the Android UI?",
        "English: Using standard Java/Kotlin formatting utilities (SimpleDateFormat, Locale.getDefault(), NumberFormat.getCurrencyInstance(Locale(\"en\", \"IN\"))) to format dates and INR currency values.",
        "Hinglish: Currency aur dates ko format karne ke liye helper utilities use ki hain."
    ),
    "Q111 [Database]: What SQLite version is used by Room on Android?": (
        "Q111 [Database]: How does Cloud Firestore offline persistence work on Android?",
        "English: The Firebase Firestore SDK automatically maintains an on-disk cache of queried documents. When offline, reads are served from this cache and writes are queued and synced upon reconnection.",
        "Hinglish: Firestore automatically local disk cache me data store karta hai aur network aane par sync kar deta hai."
    ),
    "Q112 [Database]: What is an SQLite index in Room?": (
        "Q112 [Database]: How are Firestore subcollections structured for indexing?",
        "English: Subcollections /users/{userId}/transactions are indexed by composite fields (userId + date descending) to allow rapid real-time queries.",
        "Hinglish: Fast querying ke liye composite indexes banaye gaye hain."
    ),
    "Q113 [Database]: How is database migration handled in Room?": (
        "Q113 [Database]: How do you handle schema changes in a serverless NoSQL database?",
        "English: Cloud Firestore is schema-less at the database engine level, allowing flexible document expansion with default fallback values in Kotlin data classes and TypeScript interfaces without complex table migrations.",
        "Hinglish: NoSQL me new fields easily add ho jate hain bina SQL table migration ke."
    ),
    "Q114 [Database]: What is atomicity in Room transactions?": (
        "Q114 [Database]: How does DrvLife ensure atomicity across financial updates?",
        "English: Using Firestore atomic batch writes (WriteBatch / runBatch()) and client-side validation so that adding a transaction and updating budget utilization succeed or fail as an indivisible unit.",
        "Hinglish: Batch writes use karke transaction aur budget ko ek sath update karte hain."
    )
}

for i, p in enumerate(doc.paragraphs):
    for target_q, (new_q, new_eng, new_hing) in q_replacements.items():
        if target_q in p.text:
            p.text = new_q
            if i + 1 < len(doc.paragraphs):
                doc.paragraphs[i+1].text = new_eng
            if i + 2 < len(doc.paragraphs):
                doc.paragraphs[i+2].text = new_hing
            print(f"Replaced {target_q[:30]}...")

# General cleanup of any lingering Room mentions in other answers
general_replacements = [
    (r"Room queries filter strictly by user ID", "Firestore security rules filter strictly by user ID"),
    (r"Model \(Room/Firestore\)", "Model (Kotlin Data Models / Firestore Documents)"),
    (r"Room database compiler", "Kotlin symbol processing (KSP) / compiler"),
    (r"used by Room for generating", "used for generating"),
    (r"Room 2\.6\.1", "Cloud Firestore SDK 25.0+"),
    (r"\bRoom\b", "Firestore Persistence"),
    (r"\bSQLite\b", "Local Filesystem & Firestore Cache")
]

for p in doc.paragraphs:
    for pat, rep in general_replacements:
        if re.search(pat, p.text):
            p.text = re.sub(pat, rep, p.text)

doc.save(output_path)
print(f"SUCCESS: Saved remediated viva guide to: {output_path}")

# Verify questions count and zero Room keywords
doc_check = docx.Document(output_path)
q_count = sum(1 for p in doc_check.paragraphs if re.match(r"^Q\d+\s*\[", p.text.strip()))
room_matches = sum(1 for p in doc_check.paragraphs if re.search(r"\broom\b", p.text, re.IGNORECASE))
sqlite_matches = sum(1 for p in doc_check.paragraphs if re.search(r"\bsqlite\b", p.text, re.IGNORECASE))

print(f"Total structured questions: {q_count}")
print(f"Lingering 'room' occurrences: {room_matches}")
print(f"Lingering 'sqlite' occurrences: {sqlite_matches}")

