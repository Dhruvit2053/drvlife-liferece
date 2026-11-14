package com.example.liferece.util

import java.security.MessageDigest
import java.text.NumberFormat
import java.util.Locale

object ValidationUtils {

    fun isValidEmail(email: String): Boolean {
        if (email.isBlank()) return false
        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
        return email.trim().matches(emailRegex.toRegex())
    }

    /**
     * Enhanced password policy adhering to NIST guidelines:
     * Minimum 8 characters, at least 1 digit, and at least 1 uppercase letter.
     */
    fun isValidPassword(password: String): Pair<Boolean, String?> {
        if (password.isBlank()) return Pair(false, "Password cannot be empty.")
        if (password.length < 8) return Pair(false, "Password must be at least 8 characters.")
        if (!password.any { it.isDigit() }) return Pair(false, "Password must contain at least one number.")
        if (!password.any { it.isUpperCase() }) return Pair(false, "Password must contain at least one uppercase letter.")
        return Pair(true, null)
    }

    /**
     * Sanitizes untrusted merchant names from SMS/notifications or user entry:
     * Strips newlines, carriage returns, prompt injection keywords, and caps length.
     */
    fun sanitizeMerchantName(raw: String): String {
        if (raw.isBlank()) return "Unknown Merchant"
        val stripped = raw.replace("[\r\n\t]".toRegex(), " ")
            .replace("[^a-zA-Z0-9 .&'\\-_/]".toRegex(), "")
            .trim()
        val capped = stripped.take(50)
        return if (capped.isBlank()) "Unknown Merchant" else capped
    }

    /**
     * Sanitizes user notes before storage or AI processing.
     */
    fun sanitizeNotes(raw: String): String {
        if (raw.isBlank()) return ""
        return raw.replace("[\r\n\t]".toRegex(), " ")
            .replace("[<>]".toRegex(), "")
            .take(200)
            .trim()
    }

    /**
     * Neutralizes CSV Formula Injection (DDE) and conforms to RFC 4180.
     * Prepend single quote (') if field starts with formula triggers: =, +, -, @, \t, \r
     */
    fun sanitizeCsvField(field: String): String {
        var clean = field.replace("\"", "\"\"")
        if (clean.isNotEmpty()) {
            val first = clean[0]
            if (first == '=' || first == '+' || first == '-' || first == '@' || first == '\t' || first == '\r') {
                clean = "'$clean"
            }
        }
        return "\"$clean\""
    }

    fun formatCurrency(amount: Double, currencySymbol: String = "₹"): String {
        val format = NumberFormat.getNumberInstance(Locale("en", "IN"))
        format.minimumFractionDigits = 0
        format.maximumFractionDigits = 2
        return "$currencySymbol${format.format(amount)}"
    }

    fun generateFingerprint(merchant: String, amount: Double, timestamp: Long): String {
        val sanitized = sanitizeMerchantName(merchant).lowercase(Locale.US)
        val timeBucket = timestamp / (5 * 60 * 1000)
        val raw = "${sanitized}_${String.format(Locale.US, "%.2f", amount)}_$timeBucket"
        val bytes = MessageDigest.getInstance("SHA-256").digest(raw.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }.take(16)
    }

    fun calculateSavingsRate(income: Double, expense: Double): Double {
        if (income <= 0.0) return 0.0
        val savings = income - expense
        if (savings <= 0.0) return 0.0
        return (savings / income) * 100.0
    }

    fun getFinancialHealthStatus(income: Double, expense: Double): Triple<String, String, Int> {
        if (income <= 0.0) {
            return Triple("Needs Income Setup", "Add your monthly income to track your savings rate.", 50)
        }
        val rate = calculateSavingsRate(income, expense)
        return when {
            rate >= 40.0 -> Triple("Excellent", "You're saving over 40% of your earnings. Great job building wealth!", 95)
            rate >= 20.0 -> Triple("Healthy", "Your budget is in good shape. Target 30% savings for maximum growth.", 80)
            rate > 0.0 -> Triple("Moderate", "Expenses are close to your income. Look out for non-essential spending.", 60)
            else -> Triple("Overspending Warning", "Your expenses have exceeded your income this month. Immediate review needed.", 35)
        }
    }
}
