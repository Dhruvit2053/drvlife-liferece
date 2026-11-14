package com.example.liferece

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.liferece.ui.theme.*
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.firestore

@Composable
fun OnboardingScreen(
    isNotificationAccessEnabled: Boolean,
    onRequestNotificationAccess: () -> Unit,
    onFinished: (String, String, Boolean) -> Unit
) {
    var step by remember { mutableIntStateOf(1) }
    var name by remember { mutableStateOf("") }
    var income by remember { mutableStateOf("") }
    var autoSyncChoice by remember { mutableStateOf(true) }
    var showConfirmationDialog by remember { mutableStateOf(false) }

    val auth = FirebaseAuth.getInstance()
    val db = Firebase.firestore

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DrvBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Step $step of 3",
            style = Typography.labelSmall,
            color = DrvPrimary
        )

        Spacer(modifier = Modifier.height(16.dp))

        when (step) {
            1 -> {
                Text(
                    "Welcome to DrvLife",
                    style = Typography.titleLarge,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                Text(
                    "Your personal AI financial advisor.",
                    style = Typography.bodyMedium,
                    color = DrvMuted,
                    modifier = Modifier.padding(top = 8.dp)
                )
                Spacer(modifier = Modifier.height(40.dp))
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Your Full Name") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = DrvBorder
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }
            2 -> {
                Text(
                    "Monthly Income",
                    style = Typography.titleLarge,
                    color = Color.White
                )
                Text(
                    "This helps us establish your personalized budget and savings goals.",
                    style = Typography.bodyMedium,
                    color = DrvMuted,
                    modifier = Modifier.padding(top = 8.dp),
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(40.dp))
                OutlinedTextField(
                    value = income,
                    onValueChange = { income = it },
                    label = { Text("Monthly Income (₹ INR)") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = DrvBorder
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }
            3 -> {
                Text(
                    "Smart Sync",
                    style = Typography.titleLarge,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    "Automatically track transactions by securely parsing bank and UPI notification alerts on your device.",
                    style = Typography.bodyMedium,
                    color = DrvMuted,
                    modifier = Modifier.padding(top = 8.dp),
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(24.dp))

                if (showConfirmationDialog) {
                    AlertDialog(
                        onDismissRequest = { showConfirmationDialog = false },
                        title = { Text("Enable Notification Access", color = Color.White, fontWeight = FontWeight.Bold) },
                        text = {
                            Text(
                                "Android system settings will open. Select 'DrvLife Transaction Tracker' and toggle to enable access.\n\n" +
                                "Privacy Guarantee: This permission is strictly used to parse transaction SMS and notification alerts locally. We never read OTPs, personal messages, or credentials.",
                                color = DrvText,
                                style = Typography.bodyMedium
                            )
                        },
                        confirmButton = {
                            Button(
                                onClick = {
                                    showConfirmationDialog = false
                                    onRequestNotificationAccess()
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)
                            ) {
                                Text("Open Settings", color = Color.White)
                            }
                        },
                        dismissButton = {
                            TextButton(onClick = { showConfirmationDialog = false }) {
                                Text("Cancel", color = DrvMuted)
                            }
                        },
                        containerColor = DrvBackground,
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier.border(1.dp, GlassBorderStart, RoundedCornerShape(20.dp))
                    )
                }

                // Option 1: Auto-Sync Card
                Card(
                    onClick = { autoSyncChoice = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .border(
                            width = 1.dp,
                            color = if (autoSyncChoice) DrvPrimary else GlassBorderStart,
                            shape = RoundedCornerShape(16.dp)
                        ),
                    colors = CardDefaults.cardColors(
                        containerColor = if (autoSyncChoice) DrvPrimary.copy(alpha = 0.15f) else Color.Transparent
                    ),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = autoSyncChoice,
                            onClick = { autoSyncChoice = true },
                            colors = RadioButtonDefaults.colors(selectedColor = DrvPrimary, unselectedColor = DrvMuted)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("Automatic Sync (Recommended)", color = Color.White, fontWeight = FontWeight.Bold, style = Typography.bodyMedium)
                            Text("Auto-track UPI & bank transactions seamlessly.", color = DrvMuted, style = Typography.bodySmall)
                        }
                    }
                }

                // Option 2: Manual Sync Card
                Card(
                    onClick = { autoSyncChoice = false },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .border(
                            width = 1.dp,
                            color = if (!autoSyncChoice) DrvPrimary else GlassBorderStart,
                            shape = RoundedCornerShape(16.dp)
                        ),
                    colors = CardDefaults.cardColors(
                        containerColor = if (!autoSyncChoice) DrvPrimary.copy(alpha = 0.15f) else Color.Transparent
                    ),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = !autoSyncChoice,
                            onClick = { autoSyncChoice = false },
                            colors = RadioButtonDefaults.colors(selectedColor = DrvPrimary, unselectedColor = DrvMuted)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("Manual Entry Only", color = Color.White, fontWeight = FontWeight.Bold, style = Typography.bodyMedium)
                            Text("No permissions needed. Enter transactions manually or via receipt scans.", color = DrvMuted, style = Typography.bodySmall)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                if (autoSyncChoice) {
                    if (isNotificationAccessEnabled) {
                        Text(
                            "✅ Notification Access enabled! Auto-sync is active.",
                            style = Typography.bodyMedium,
                            color = DrvIncome,
                            textAlign = TextAlign.Center,
                            fontWeight = FontWeight.Bold
                        )
                    } else {
                        Button(
                            onClick = { showConfirmationDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = DrvPrimaryVariant),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Grant Notification Access", color = Color.White)
                        }
                    }
                } else {
                    Text(
                        "Manual Mode Active. No notification permissions requested.",
                        style = Typography.bodyMedium,
                        color = DrvMuted,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(40.dp))

        Button(
            onClick = {
                if (step < 3) {
                    step++
                } else {
                    val uid = auth.currentUser?.uid
                    if (uid != null) {
                        val incomeDouble = income.toDoubleOrNull() ?: 50000.0
                        val updateMap = hashMapOf<String, Any>(
                            "name" to name.trim(),
                            "monthlyIncome" to incomeDouble,
                            "autoSyncEnabled" to autoSyncChoice,
                            "updatedAt" to System.currentTimeMillis()
                        )
                        db.collection("users").document(uid).update(updateMap)
                    }
                    onFinished(name, income, autoSyncChoice)
                }
            },
            enabled = (step == 1 && name.isNotBlank()) || (step == 2 && income.isNotBlank()) || step == 3,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary),
            shape = RoundedCornerShape(12.dp),
            contentPadding = PaddingValues(16.dp)
        ) {
            Text(if (step == 3) "Get Started" else "Next", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
    }
}
