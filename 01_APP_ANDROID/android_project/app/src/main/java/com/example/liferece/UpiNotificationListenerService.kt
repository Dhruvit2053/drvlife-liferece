package com.example.liferece

import android.content.Context
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.example.liferece.model.Transaction
import com.example.liferece.util.ValidationUtils
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.firestore
import java.util.Locale
import java.util.regex.Pattern

class UpiNotificationListenerService : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val auth = FirebaseAuth.getInstance()
        val currentUser = auth.currentUser
        if (currentUser == null) {
            // No authenticated user, do not process
            return
        }
        val uid = currentUser.uid
        val sharedPrefs = getSharedPreferences("liferece_prefs", Context.MODE_PRIVATE)
        val isAutoSyncEnabled = sharedPrefs.getBoolean("auto_sync_enabled_$uid", false)
        if (!isAutoSyncEnabled) {
            return
        }

        val packageName = sbn.packageName
        val extras = sbn.notification.extras
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""
        val timestamp = sbn.postTime

        // PRIVACY SHIELD: Strictly filter out OTPs, PINs, Passwords, and Authentication messages
        if (isPrivacySensitive(title, text)) {
            Log.d("UpiNotification", "Ignored privacy-sensitive / OTP notification.")
            return
        }

        // Verify it is from a financial app or contains transaction indicators
        if (!isFinancialApp(packageName) && !isTransactionalText(title, text)) {
            return
        }

        val transaction = parseTransaction(title, text, packageName, timestamp)
        if (transaction != null) {
            saveTransactionSafely(uid, transaction, timestamp)
        }
    }

    private fun isPrivacySensitive(title: String, text: String): Boolean {
        val sensitiveKeywords = listOf("otp", "one time password", "verification code", "secret code", "security pin", "do not share", "login alert", "password reset", "two-factor")
        val combined = "$title $text".lowercase(Locale.getDefault())
        return sensitiveKeywords.any { combined.contains(it) }
    }

    private fun isFinancialApp(packageName: String): Boolean {
        val financialPackages = listOf(
            "com.google.android.apps.nbu.paisa.user", // Google Pay
            "com.phonepe.app",                        // PhonePe
            "net.one97.paytm",                        // Paytm
            "in.org.npci.upiapp",                      // BHIM
            "com.sbi.upi", "com.sbi.sbifreedom",       // SBI
            "com.hdfcbank.smartbuy", "com.hdfcbank.mobilebanking", // HDFC
            "com.icicibank.mobilebanking",            // ICICI
            "com.axis.mobile"                         // Axis
        )
        return financialPackages.any { packageName.contains(it, ignoreCase = true) }
    }

    private fun isTransactionalText(title: String, text: String): Boolean {
        val keywords = listOf("Rs.", "₹", "INR", "debited", "credited", "sent", "received", "paid", "spent", "transfer")
        val combined = "$title $text"
        return keywords.any { combined.contains(it, ignoreCase = true) }
    }

    private fun parseTransaction(title: String, text: String, packageName: String, timestamp: Long): Transaction? {
        val combinedText = "$title $text"

        // Amount extraction regex (₹, Rs., INR)
        val amountRegex = "(?:Rs\\.?|₹|INR)\\s*([\\d,]+(?:\\.\\d{2})?)"
        val pattern = Pattern.compile(amountRegex, Pattern.CASE_INSENSITIVE)
        val matcher = pattern.matcher(combinedText)
        if (!matcher.find()) return null

        val amountStr = matcher.group(1)?.replace(",", "") ?: return null
        val amountVal = amountStr.toDoubleOrNull() ?: return null

        // Determine Type (Debit vs Credit)
        val debitKeywords = listOf("sent", "paid", "debited", "transferred", "spent", "payment", "withdrawn")
        val creditKeywords = listOf("received", "credited", "refunded", "added", "received from")

        val isDebit = when {
            debitKeywords.any { combinedText.contains(it, ignoreCase = true) } -> true
            creditKeywords.any { combinedText.contains(it, ignoreCase = true) } -> false
            else -> true
        }

        // Extract Merchant / Counterparty
        var merchant = getAppNameFromPackage(packageName)
        val toPattern = Pattern.compile("to\\s+([^,\\.]+)", Pattern.CASE_INSENSITIVE)
        val fromPattern = Pattern.compile("from\\s+([^,\\.]+)", Pattern.CASE_INSENSITIVE)

        val toMatcher = toPattern.matcher(combinedText)
        val fromMatcher = fromPattern.matcher(combinedText)

        if (isDebit && toMatcher.find()) {
            merchant = toMatcher.group(1)?.trim() ?: merchant
        } else if (!isDebit && fromMatcher.find()) {
            merchant = fromMatcher.group(1)?.trim() ?: merchant
        }

        merchant = ValidationUtils.sanitizeMerchantName(cleanMerchantName(merchant))
        val category = mapCategory(merchant)
        val source = getAppNameFromPackage(packageName)
        val fingerprint = ValidationUtils.generateFingerprint(merchant, amountVal, timestamp)

        return Transaction(
            id = "",
            merchant = merchant,
            amount = amountVal,
            timestamp = timestamp,
            category = category,
            isExpense = isDebit,
            paymentMethod = "UPI",
            source = source,
            notes = "Auto-synced via notification",
            fingerprint = fingerprint
        )
    }

    private fun getAppNameFromPackage(packageName: String): String {
        return when {
            packageName.contains("paisa.user") -> "Google Pay"
            packageName.contains("phonepe") -> "PhonePe"
            packageName.contains("paytm") -> "Paytm"
            packageName.contains("npci.upiapp") -> "BHIM"
            packageName.contains("sbi") -> "YONO SBI"
            packageName.contains("hdfc") -> "HDFC Bank"
            packageName.contains("icici") -> "iMobile ICICI"
            packageName.contains("axis") -> "Axis Mobile"
            else -> "Bank Notification"
        }
    }

    private fun cleanMerchantName(rawName: String): String {
        var clean = rawName.trim()
        val suffixesToRemove = listOf("via", "using", "on", "from", "at", "ref", "txn", "using upi", "successfully")
        for (suffix in suffixesToRemove) {
            val pattern = Pattern.compile("\\s+$suffix\\s+.*$", Pattern.CASE_INSENSITIVE)
            clean = pattern.matcher(clean).replaceAll("")
        }

        clean = clean.split(" ")
            .filter { it.isNotBlank() }
            .joinToString(" ") { word ->
                word.lowercase().replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
            }

        if (clean.length > 30) {
            clean = clean.take(27) + "..."
        }
        return clean.ifBlank { "Unknown Merchant" }
    }

    private fun mapCategory(merchant: String): String {
        val m = merchant.lowercase()
        return when {
            m.contains("swiggy") || m.contains("zomato") || m.contains("food") || m.contains("restaurant") || m.contains("hotel") || m.contains("cafe") || m.contains("canteen") || m.contains("mcdonald") -> "Food"
            m.contains("uber") || m.contains("ola") || m.contains("travel") || m.contains("irctc") || m.contains("metro") || m.contains("cab") || m.contains("fuel") || m.contains("petrol") -> "Travel"
            m.contains("bsnl") || m.contains("jio") || m.contains("airtel") || m.contains("electricity") || m.contains("recharge") || m.contains("bill") || m.contains("water") || m.contains("gas") -> "Bills"
            m.contains("amazon") || m.contains("flipkart") || m.contains("myntra") || m.contains("nykaa") || m.contains("shopping") || m.contains("mart") || m.contains("grocery") -> "Shopping"
            m.contains("netflix") || m.contains("spotify") || m.contains("prime") || m.contains("hotstar") || m.contains("movie") || m.contains("cinema") -> "Entertainment"
            m.contains("pharmacy") || m.contains("hospital") || m.contains("clinic") || m.contains("medical") || m.contains("apollo") -> "Healthcare"
            m.contains("salary") || m.contains("payroll") -> "Salary"
            else -> "Other"
        }
    }

    private fun saveTransactionSafely(uid: String, tx: Transaction, timestamp: Long) {
        val db = Firebase.firestore
        val fiveMinutesAgo = System.currentTimeMillis() - 300000

        // Deduplication check via stable SHA-256 5-minute bucketed fingerprint
        db.collection("users").document(uid).collection("transactions")
            .whereEqualTo("fingerprint", tx.fingerprint)
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                if (documents != null && !documents.isEmpty) {
                    Log.d("UpiNotification", "Deduplicated transaction. Already saved.")
                    return@addOnSuccessListener
                }

                val data = hashMapOf(
                    "merchant" to tx.merchant,
                    "amount" to tx.amount,
                    "timestamp" to timestamp,
                    "category" to tx.category,
                    "isExpense" to tx.isExpense,
                    "type" to if (tx.isExpense) "Expense" else "Income",
                    "paymentMethod" to tx.paymentMethod,
                    "source" to tx.source,
                    "notes" to tx.notes,
                    "fingerprint" to tx.fingerprint
                )

                db.collection("users").document(uid).collection("transactions")
                    .add(data)
                    .addOnSuccessListener { docRef ->
                        Log.d("UpiNotification", "Auto-synced transaction saved ID: ${docRef.id}")
                    }
                    .addOnFailureListener { e ->
                        Log.e("UpiNotification", "Error saving auto-sync transaction", e)
                    }
            }
            .addOnFailureListener { e ->
                Log.e("UpiNotification", "Error checking duplicate query", e)
            }
    }
}
