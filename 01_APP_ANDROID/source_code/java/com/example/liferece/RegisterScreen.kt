package com.example.liferece

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.liferece.ui.theme.*
import com.example.liferece.util.ValidationUtils
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.firestore

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    onRegisterSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    var isPasswordVisible by remember { mutableStateOf(false) }
    var isConfirmPasswordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf<String?>(null) }
    var isSuccessMessage by remember { mutableStateOf(false) }

    val focusManager = LocalFocusManager.current
    val auth = FirebaseAuth.getInstance()
    val db = Firebase.firestore

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .glassCard(28.dp)
                .padding(28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Create Account",
                style = Typography.titleLarge,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Text(
                text = "Sign up to track, budget & grow your wealth with AI",
                style = Typography.bodyMedium,
                color = DrvMuted,
                modifier = Modifier.padding(top = 8.dp, bottom = 28.dp),
                textAlign = TextAlign.Center
            )

            if (statusMessage != null) {
                val boxBg = if (isSuccessMessage) DrvIncome.copy(alpha = 0.15f) else DrvExpense.copy(alpha = 0.15f)
                val borderCol = if (isSuccessMessage) DrvIncome.copy(alpha = 0.3f) else DrvExpense.copy(alpha = 0.3f)
                val textCol = if (isSuccessMessage) DrvIncome else DrvExpense

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp)
                        .background(boxBg, RoundedCornerShape(12.dp))
                        .border(1.dp, borderCol, RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text(
                        text = statusMessage ?: "",
                        color = textCol,
                        style = Typography.bodyMedium,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Email Field
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                leadingIcon = { Icon(Icons.Default.Email, contentDescription = "Email", tint = DrvMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = DrvPrimary,
                    unfocusedBorderColor = GlassBorderStart
                ),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email,
                    imeAction = ImeAction.Next
                ),
                keyboardActions = KeyboardActions(
                    onNext = { focusManager.moveFocus(FocusDirection.Down) }
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Password Field
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password (min 6 characters)") },
                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = "Password", tint = DrvMuted) },
                trailingIcon = {
                    val icon = if (isPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    IconButton(onClick = { isPasswordVisible = !isPasswordVisible }) {
                        Icon(icon, contentDescription = "Toggle password visibility", tint = DrvMuted)
                    }
                },
                visualTransformation = if (isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = DrvPrimary,
                    unfocusedBorderColor = GlassBorderStart
                ),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Next
                ),
                keyboardActions = KeyboardActions(
                    onNext = { focusManager.moveFocus(FocusDirection.Down) }
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Confirm Password Field
            OutlinedTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = { Text("Confirm Password") },
                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = "Confirm Password", tint = DrvMuted) },
                trailingIcon = {
                    val icon = if (isConfirmPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    IconButton(onClick = { isConfirmPasswordVisible = !isConfirmPasswordVisible }) {
                        Icon(icon, contentDescription = "Toggle password visibility", tint = DrvMuted)
                    }
                },
                visualTransformation = if (isConfirmPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = DrvPrimary,
                    unfocusedBorderColor = GlassBorderStart
                ),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Done
                ),
                keyboardActions = KeyboardActions(
                    onDone = { focusManager.clearFocus() }
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Register Button
            Button(
                onClick = {
                    if (email.isBlank() || password.isBlank() || confirmPassword.isBlank()) {
                        statusMessage = "Please fill in all fields."
                        isSuccessMessage = false
                        return@Button
                    }
                    if (!ValidationUtils.isValidEmail(email)) {
                        statusMessage = "Please enter a valid email address."
                        isSuccessMessage = false
                        return@Button
                    }
                    val passVal = ValidationUtils.isValidPassword(password)
                    if (!passVal.first) {
                        statusMessage = passVal.second
                        isSuccessMessage = false
                        return@Button
                    }
                    if (password != confirmPassword) {
                        statusMessage = "Passwords do not match."
                        isSuccessMessage = false
                        return@Button
                    }

                    isLoading = true
                    statusMessage = null

                    auth.createUserWithEmailAndPassword(email.trim(), password)
                        .addOnCompleteListener { task ->
                            if (task.isSuccessful) {
                                val user = auth.currentUser
                                val uid = user?.uid ?: ""

                                // Initialize user doc in Firestore
                                val userData = hashMapOf(
                                    "name" to "User",
                                    "email" to email.trim(),
                                    "monthlyIncome" to 50000.0,
                                    "currency" to "₹",
                                    "autoSyncEnabled" to false,
                                    "createdAt" to System.currentTimeMillis(),
                                    "updatedAt" to System.currentTimeMillis()
                                )
                                db.collection("users").document(uid).set(userData)

                                user?.sendEmailVerification()
                                    ?.addOnCompleteListener { emailTask ->
                                        isLoading = false
                                        if (emailTask.isSuccessful) {
                                            statusMessage = "Verification link sent! Check your email inbox to verify your account before logging in."
                                            isSuccessMessage = true
                                            auth.signOut()
                                        } else {
                                            statusMessage = emailTask.exception?.localizedMessage ?: "Failed to send verification email."
                                            isSuccessMessage = false
                                        }
                                    }
                            } else {
                                isLoading = false
                                statusMessage = task.exception?.localizedMessage ?: "Registration failed."
                                isSuccessMessage = false
                            }
                        }
                },
                enabled = !isLoading,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary),
                shape = RoundedCornerShape(14.dp),
                contentPadding = PaddingValues(16.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Sign Up", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Navigation to Login
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Already have an account? ", color = DrvMuted, style = Typography.bodyMedium)
                TextButton(
                    onClick = onNavigateToLogin,
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Text("Sign In", color = DrvPrimary, fontWeight = FontWeight.Bold, style = Typography.bodyMedium)
                }
            }
        }
    }
}
