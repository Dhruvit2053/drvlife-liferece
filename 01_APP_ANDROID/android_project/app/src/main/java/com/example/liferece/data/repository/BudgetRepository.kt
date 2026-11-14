package com.example.liferece.data.repository

import android.util.Log
import com.example.liferece.model.Budget
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.ListenerRegistration
import com.google.firebase.firestore.firestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class BudgetRepository {
    private val db = Firebase.firestore
    private val auth = FirebaseAuth.getInstance()

    private fun getCurrentUserId(): String? = auth.currentUser?.uid

    private fun getBudgetsRef(uid: String) =
        db.collection("users").document(uid).collection("budgets")

    fun getBudgetsFlow(): Flow<List<Budget>> = callbackFlow {
        val uid = getCurrentUserId()
        if (uid == null) {
            trySend(emptyList())
            close()
            return@callbackFlow
        }

        var listener: ListenerRegistration? = null
        try {
            listener = getBudgetsRef(uid).addSnapshotListener { snapshot, error ->
                if (error != null) {
                    Log.w("BudgetRepo", "Listen failed.", error)
                    return@addSnapshotListener
                }

                if (snapshot != null) {
                    val budgets = snapshot.documents.mapNotNull { doc ->
                        try {
                            val limitVal = when (val raw = doc.get("monthlyLimit")) {
                                is Number -> raw.toDouble()
                                is String -> raw.toDoubleOrNull() ?: 0.0
                                else -> 0.0
                            }
                            Budget(
                                id = doc.id,
                                category = doc.getString("category") ?: "Overall",
                                monthlyLimit = limitVal,
                                month = doc.getString("month") ?: "",
                                createdAt = doc.getLong("createdAt") ?: System.currentTimeMillis()
                            )
                        } catch (e: Exception) {
                            Log.e("BudgetRepo", "Error parsing budget ${doc.id}", e)
                            null
                        }
                    }

                    if (budgets.isEmpty() && !snapshot.metadata.isFromCache) {
                        seedInitialBudgets(uid)
                    } else {
                        trySend(budgets)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("BudgetRepo", "Error creating listener", e)
        }

        awaitClose {
            listener?.remove()
        }
    }

    suspend fun saveBudget(budget: Budget): Result<String> {
        val uid = getCurrentUserId() ?: return Result.failure(Exception("User not authenticated"))
        return try {
            val data = hashMapOf(
                "category" to budget.category,
                "monthlyLimit" to budget.monthlyLimit,
                "month" to budget.month,
                "createdAt" to budget.createdAt
            )
            if (budget.id.isNotBlank()) {
                getBudgetsRef(uid).document(budget.id).set(data).await()
                Result.success(budget.id)
            } else {
                val doc = getBudgetsRef(uid).add(data).await()
                Result.success(doc.id)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteBudget(budgetId: String): Result<Unit> {
        val uid = getCurrentUserId() ?: return Result.failure(Exception("User not authenticated"))
        return try {
            getBudgetsRef(uid).document(budgetId).delete().await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun seedInitialBudgets(uid: String) {
        val seed = listOf(
            Budget("", "Overall", 25000.0, "Current", System.currentTimeMillis()),
            Budget("", "Food", 6000.0, "Current", System.currentTimeMillis()),
            Budget("", "Shopping", 4000.0, "Current", System.currentTimeMillis()),
            Budget("", "Bills", 5000.0, "Current", System.currentTimeMillis()),
            Budget("", "Travel", 3000.0, "Current", System.currentTimeMillis())
        )
        for (b in seed) {
            val data = hashMapOf(
                "category" to b.category,
                "monthlyLimit" to b.monthlyLimit,
                "month" to b.month,
                "createdAt" to b.createdAt
            )
            getBudgetsRef(uid).add(data)
        }
    }
}

