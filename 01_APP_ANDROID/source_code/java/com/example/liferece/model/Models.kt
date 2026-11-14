package com.example.liferece.model

import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class Transaction(
    val id: String = "",
    val merchant: String = "",
    val amount: Double = 0.0,
    val timestamp: Long = System.currentTimeMillis(),
    val category: String = "Other",
    val isExpense: Boolean = true,
    val paymentMethod: String = "UPI",
    val source: String = "Manual",
    val notes: String = "",
    val fingerprint: String = "",
    val hasReceiptImage: Boolean = false,
    val receiptImageDevice: String = "",
    val localReceiptPath: String = ""
) {
    val formattedAmount: String
        get() {
            val formatter = NumberFormat.getCurrencyInstance(Locale("en", "IN"))
            val formatted = formatter.format(amount)
            val prefix = if (isExpense) "- " else "+ "
            return "$prefix$formatted"
        }

    val formattedDate: String
        get() {
            val sdf = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault())
            return sdf.format(Date(timestamp))
        }

    val dateOnly: String
        get() {
            val sdf = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
            return sdf.format(Date(timestamp))
        }

    val timeOnly: String
        get() {
            val sdf = SimpleDateFormat("hh:mm a", Locale.getDefault())
            return sdf.format(Date(timestamp))
        }
}

data class Budget(
    val id: String = "",
    val category: String = "",
    val monthlyLimit: Double = 0.0,
    val month: String = "", // e.g. "2026-11"
    val createdAt: Long = System.currentTimeMillis()
)

data class UserProfile(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val monthlyIncome: Double = 0.0,
    val currency: String = "₹",
    val autoSyncEnabled: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

data class AiInsight(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val category: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

data class ChatMessage(
    val id: String = System.currentTimeMillis().toString(),
    val sender: String = "user", // "user" or "gemini"
    val message: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

object FinanceConstants {
    val CATEGORIES = listOf(
        "Food",
        "Shopping",
        "Travel",
        "Bills",
        "Entertainment",
        "Healthcare",
        "Education",
        "Salary",
        "Business",
        "Investment",
        "Other"
    )

    val PAYMENT_METHODS = listOf(
        "UPI",
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "Cash",
        "Other"
    )

    val TRANSACTION_SOURCES = listOf(
        "Manual",
        "Auto-Sync",
        "Receipt Scan",
        "Bank SMS"
    )
}

