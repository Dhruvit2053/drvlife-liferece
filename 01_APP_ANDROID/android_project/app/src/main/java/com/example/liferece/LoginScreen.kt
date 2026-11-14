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
import com.google.firebase.auth.FirebaseAuth

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isPasswordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successMessage by remember { mutableStateOf<String?>(null) }
    var showForgotPasswordDialog by remember { mutableStateOf(false) }
    var resetEmail by remember { mutableStateOf("") }
    var resetEmailStatus by remember { mutableStateOf<String?>(null) }

    val focusManager = LocalFocusManager.current
    val auth = FirebaseAuth.getInstance()

    // Forgot Password Dialog
    if (showForgotPasswordDialog) {
        AlertDialog(
            onDismissRequest = {
                showForgotPasswordDialog = false
                resetEmailStatus = null
            },
            title = {
                Text("Reset Password", color = Color.White, fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "Enter your account email to receive a password reset link.",
                        style = Typography.bodyMedium,
                        color = DrvMuted
                    )
                    OutlinedTextField(
                        value = resetEmail,
                        onValueChange = { resetEmail = it },
                        label = { Text("Email Address") },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = DrvPrimary,
                            unfocusedBorderColor = GlassBorderStart
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (resetEmailStatus != null) {
                        Text(
                            text = resetEmailStatus ?: "",
                            color = DrvPrimary,
                            style = Typography.bodySmall
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (ValidationUtils.isValidEmail(resetEmail)) {
                            auth.sendPasswordResetEmail(resetEmail.trim())
                                .addOnSuccessListener {
                                    resetEmailStatus = "Reset link sent! Please check your inbox."
                                }
                                .addOnFailureListener {
                                    resetEmailStatus = it.localizedMessage ?: "Failed to send reset link."
                                }
                        } else {
                            resetEmailStatus = "Please enter a valid email."
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)
                ) {
                    Text("Send Link", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    showForgotPasswordDialog = false
                    resetEmailStatus = null
                }) {
                    Text("Close", color = DrvMuted)
                }
            },
            containerColor = DrvBackground,
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.border(1.dp, GlassBorderStart, RoundedCornerShape(20.dp))
        )
    }

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
                text = "Welcome to DrvLife",
                style = Typography.titleLarge,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Text(
                text = "Your financial life, automatically understood.",
                style = Typography.bodyMedium,
                color = DrvMuted,
                modifier = Modifier.padding(top = 8.dp, bottom = 28.dp),
                textAlign = TextAlign.Center
            )

            if (errorMessage != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp)
                        .background(DrvExpense.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                        .border(1.dp, DrvExpense.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text(
                        text = errorMessage ?: "",
                        color = DrvExpense,
                        style = Typography.bodyMedium,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                }
            }

            if (successMessage != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp)
                        .background(DrvIncome.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                        .border(1.dp, DrvIncome.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text(
                        text = successMessage ?: "",
                        color = DrvIncome,
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
                label = { Text("Password") },
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
                    imeAction = ImeAction.Done
                ),
                keyboardActions = KeyboardActions(
                    onDone = { focusManager.clearFocus() }
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            )

            // Forgot Password Link
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(
                    onClick = {
                        resetEmail = email.trim()
                        showForgotPasswordDialog = true
                    },
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Text("Forgot Password?", color = DrvPrimary, style = Typography.bodySmall)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Login Button
            Button(
                onClick = {
                    if (email.isBlank() || password.isBlank()) {
                        errorMessage = "Please enter both email and password."
                        return@Button
                    }
                    if (!ValidationUtils.isValidEmail(email)) {
                        errorMessage = "Please enter a valid email address."
                        return@Button
                    }

                    isLoading = true
                    errorMessage = null
                    successMessage = null

                    auth.signInWithEmailAndPassword(email.trim(), password)
                        .addOnCompleteListener { task ->
                            isLoading = false
                            if (task.isSuccessful) {
                                val user = auth.currentUser
                                if (user != null && user.isEmailVerified) {
                                    onLoginSuccess()
                                } else {
                                    user?.sendEmailVerification()
                                    auth.signOut()
                                    errorMessage = "Please verify your email address. A fresh verification link has been sent to your inbox."
                                }
                            } else {
                                errorMessage = task.exception?.localizedMessage ?: "Authentication failed. Please check your credentials."
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
                    Text("Sign In", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Navigation to Register
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Don't have an account? ", color = DrvMuted, style = Typography.bodyMedium)
                TextButton(
                    onClick = onNavigateToRegister,
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Text("Sign Up", color = DrvPrimary, fontWeight = FontWeight.Bold, style = Typography.bodyMedium)
                }
            }
        }
    }
}
