package com.example.liferece.data.repository

import android.util.Log
import com.example.liferece.model.Transaction
import com.example.liferece.util.ValidationUtils
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.ListenerRegistration
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.firestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class TransactionRepository {
    private val db = Firebase.firestore
    private val auth = FirebaseAuth.getInstance()

    private fun getCurrentUserId(): String? = auth.currentUser?.uid

    private fun getTransactionsRef(uid: String) =
        db.collection("users").document(uid).collection("transactions")

    fun getTransactionsFlow(): Flow<List<Transaction>> = callbackFlow {
        val uid = getCurrentUserId()
        if (uid == null) {
            trySend(emptyList())
            close()
            return@callbackFlow
        }

        var listener: ListenerRegistration? = null
        try {
            listener = getTransactionsRef(uid)
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .addSnapshotListener { snapshot, error ->
                    if (error != null) {
                        Log.w("TransactionRepo", "Listen failed.", error)
                        return@addSnapshotListener
                    }

                    if (snapshot != null) {
                        val transactions = snapshot.documents.mapNotNull { doc ->
                            try {
                                val amountVal = when (val raw = doc.get("amount")) {
                                    is Number -> raw.toDouble()
                                    is String -> raw.replace("[^0-9.]".toRegex(), "").toDoubleOrNull() ?: 0.0
                                    else -> 0.0
                                }
                                val isExp = doc.getBoolean("isExpense") ?: (doc.getString("type") != "Income")

                                Transaction(
                                    id = doc.id,
                                    merchant = doc.getString("merchant") ?: doc.getString("name") ?: "Unknown",
                                    amount = amountVal,
                                    timestamp = doc.getLong("timestamp") ?: System.currentTimeMillis(),
                                    category = doc.getString("category") ?: "Other",
                                    isExpense = isExp,
                                    paymentMethod = doc.getString("paymentMethod") ?: "UPI",
                                    source = doc.getString("source") ?: "Manual",
                                    notes = doc.getString("notes") ?: "",
                                    fingerprint = doc.getString("fingerprint") ?: "",
                                    hasReceiptImage = doc.getBoolean("hasReceiptImage") ?: false,
                                    receiptImageDevice = doc.getString("receiptImageDevice") ?: ""
                                )
                            } catch (e: Exception) {
                                Log.e("TransactionRepo", "Error parsing transaction ${doc.id}", e)
                                null
                            }
                        }

                        // Seed initial demo/starter transactions if completely fresh
                        if (transactions.isEmpty() && !snapshot.metadata.isFromCache) {
                            seedInitialTransactions(uid)
                        } else {
                            trySend(transactions)
                        }
                    }
                }
        } catch (e: Exception) {
            Log.e("TransactionRepo", "Error creating listener", e)
        }

        awaitClose {
            listener?.remove()
        }
    }

    suspend fun addTransaction(tx: Transaction): Result<String> {
        val uid = getCurrentUserId() ?: return Result.failure(Exception("User not authenticated"))
        return try {
            val cleanMerchant = ValidationUtils.sanitizeMerchantName(tx.merchant)
            val cleanNotes = ValidationUtils.sanitizeNotes(tx.notes)
            val fingerprint = if (tx.fingerprint.isNotBlank()) tx.fingerprint 
                else ValidationUtils.generateFingerprint(cleanMerchant, tx.amount, tx.timestamp)

            val data = hashMapOf(
                "merchant" to cleanMerchant,
                "amount" to tx.amount,
                "timestamp" to tx.timestamp,
                "category" to tx.category,
                "isExpense" to tx.isExpense,
                "type" to if (tx.isExpense) "Expense" else "Income",
                "paymentMethod" to tx.paymentMethod,
                "source" to tx.source,
                "notes" to cleanNotes,
                "fingerprint" to fingerprint,
                "hasReceiptImage" to tx.hasReceiptImage,
                "receiptImageDevice" to (if (tx.hasReceiptImage) tx.receiptImageDevice.ifBlank { "${android.os.Build.MANUFACTURER} ${android.os.Build.MODEL}" } else "")
            )
            val docRef = getTransactionsRef(uid).add(data).await()
            Result.success(docRef.id)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateTransaction(tx: Transaction): Result<Unit> {
        val uid = getCurrentUserId() ?: return Result.failure(Exception("User not authenticated"))
        if (tx.id.isBlank()) return Result.failure(Exception("Invalid transaction ID"))
        return try {
            val cleanMerchant = ValidationUtils.sanitizeMerchantName(tx.merchant)
            val cleanNotes = ValidationUtils.sanitizeNotes(tx.notes)
            val data = hashMapOf(
                "merchant" to cleanMerchant,
                "amount" to tx.amount,
                "timestamp" to tx.timestamp,
                "category" to tx.category,
                "isExpense" to tx.isExpense,
                "type" to if (tx.isExpense) "Expense" else "Income",
                "paymentMethod" to tx.paymentMethod,
                "source" to tx.source,
                "notes" to cleanNotes
            )
            getTransactionsRef(uid).document(tx.id).update(data as Map<String, Any>).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteTransaction(transactionId: String): Result<Unit> {
        val uid = getCurrentUserId() ?: return Result.failure(Exception("User not authenticated"))
        return try {
            getTransactionsRef(uid).document(transactionId).delete().await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun isDuplicate(fingerprint: String): Boolean {
        val uid = getCurrentUserId() ?: return false
        if (fingerprint.isBlank()) return false
        return try {
            val fiveMinutesAgo = System.currentTimeMillis() - (5 * 60 * 1000)
            val query = getTransactionsRef(uid)
                .whereEqualTo("fingerprint", fingerprint)
                .whereGreaterThanOrEqualTo("timestamp", fiveMinutesAgo)
                .limit(1)
                .get()
                .await()
            !query.isEmpty
        } catch (e: Exception) {
            Log.e("TransactionRepo", "Error checking duplicate", e)
            false
        }
    }

    private fun seedInitialTransactions(uid: String) {
        val now = System.currentTimeMillis()
        val seed = listOf(
            Transaction("", "Monthly Salary Credit", 45000.0, now - 4 * 86400000L, "Salary", false, "Net Banking", "Bank SMS", "Monthly salary credited"),
            Transaction("", "Swiggy Food Delivery", 340.0, now - 3 * 3600000L, "Food", true, "UPI", "Auto-Sync", "Dinner order"),
            Transaction("", "Amazon Shopping", 1299.0, now - 1 * 86400000L, "Shopping", true, "UPI", "Auto-Sync", "Earphones"),
            Transaction("", "D-Mart Supermarket", 2180.0, now - 2 * 86400000L, "Food", true, "Debit Card", "Manual", "Weekly groceries"),
            Transaction("", "BSNL Fiber Internet", 599.0, now - 3 * 86400000L, "Bills", true, "UPI", "Auto-Sync", "Broadband bill"),
            Transaction("", "Uber Ride to Office", 280.0, now - 8 * 3600000L, "Travel", true, "UPI", "Auto-Sync", "Commute")
        )
        for (tx in seed) {
            val fp = ValidationUtils.generateFingerprint(tx.merchant, tx.amount, tx.timestamp)
            val data = hashMapOf(
                "merchant" to tx.merchant,
                "amount" to tx.amount,
                "timestamp" to tx.timestamp,
                "category" to tx.category,
                "isExpense" to tx.isExpense,
                "type" to if (tx.isExpense) "Expense" else "Income",
                "paymentMethod" to tx.paymentMethod,
                "source" to tx.source,
                "notes" to tx.notes,
                "fingerprint" to fp
            )
            getTransactionsRef(uid).add(data)
        }
    }
}

