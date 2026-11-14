package com.example.liferece.data.repository

import android.util.Log
import com.example.liferece.model.UserProfile
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.ListenerRegistration
import com.google.firebase.firestore.firestore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class UserRepository {
    private val db = Firebase.firestore
    private val auth = FirebaseAuth.getInstance()
    private val repositoryScope = CoroutineScope(Dispatchers.IO)

    private fun getCurrentUserId(): String? = auth.currentUser?.uid

    fun getUserProfileFlow(): Flow<UserProfile?> = callbackFlow {
        val uid = getCurrentUserId()
        if (uid == null) {
            trySend(null)
            close()
            return@callbackFlow
        }

        var listener: ListenerRegistration? = null
        try {
            listener = db.collection("users").document(uid).addSnapshotListener { snapshot, error ->
                if (error != null) {
                    Log.w("UserRepo", "Listen failed.", error)
                    return@addSnapshotListener
                }

                if (snapshot != null && snapshot.exists()) {
                    val incomeVal = when (val raw = snapshot.get("monthlyIncome")) {
                        is Number -> raw.toDouble()
                        is String -> raw.toDoubleOrNull() ?: 0.0
                        else -> 0.0
                    }
                    val profile = UserProfile(
                        uid = uid,
                        name = snapshot.getString("name") ?: "",
                        email = snapshot.getString("email") ?: (auth.currentUser?.email ?: ""),
                        monthlyIncome = incomeVal,
                        currency = snapshot.getString("currency") ?: "₹",
                        autoSyncEnabled = snapshot.getBoolean("autoSyncEnabled") ?: false,
                        createdAt = snapshot.getLong("createdAt") ?: System.currentTimeMillis(),
                        updatedAt = snapshot.getLong("updatedAt") ?: System.currentTimeMillis()
                    )
                    trySend(profile)
                } else {
                    // Create default profile if not yet created in Firestore
                    val defaultProfile = UserProfile(
                        uid = uid,
                        name = auth.currentUser?.displayName ?: "User",
                        email = auth.currentUser?.email ?: "",
                        monthlyIncome = 50000.0,
                        currency = "₹",
                        autoSyncEnabled = false
                    )
                    repositoryScope.launch {
                        saveUserProfile(defaultProfile)
                    }
                    trySend(defaultProfile)
                }
            }
        } catch (e: Exception) {
            Log.e("UserRepo", "Error listening to profile", e)
        }

        awaitClose {
            listener?.remove()
        }
    }

    suspend fun saveUserProfile(profile: UserProfile): Result<Unit> {
        val uid = profile.uid.ifBlank { getCurrentUserId() } ?: return Result.failure(Exception("Not authenticated"))
        return try {
            val data = hashMapOf(
                "name" to profile.name,
                "email" to profile.email,
                "monthlyIncome" to profile.monthlyIncome,
                "currency" to profile.currency,
                "autoSyncEnabled" to profile.autoSyncEnabled,
                "updatedAt" to System.currentTimeMillis(),
                "createdAt" to profile.createdAt
            )
            db.collection("users").document(uid).set(data).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun logout() {
        auth.signOut()
    }

    suspend fun sendPasswordResetEmail(email: String): Result<Unit> {
        return try {
            auth.sendPasswordResetEmail(email.trim()).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteAccount(): Result<Unit> {
        val uid = getCurrentUserId() ?: return Result.failure(Exception("Not authenticated"))
        val user = auth.currentUser ?: return Result.failure(Exception("Not authenticated"))

        return try {
            // Delete subcollections
            val txDocs = db.collection("users").document(uid).collection("transactions").get().await()
            for (doc in txDocs.documents) {
                doc.reference.delete()
            }
            val budgetDocs = db.collection("users").document(uid).collection("budgets").get().await()
            for (doc in budgetDocs.documents) {
                doc.reference.delete()
            }
            // Delete user doc
            db.collection("users").document(uid).delete().await()
            // Delete Firebase Auth user
            user.delete().await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
