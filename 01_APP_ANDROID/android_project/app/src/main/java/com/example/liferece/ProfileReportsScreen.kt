package com.example.liferece

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.liferece.ui.theme.*
import com.example.liferece.util.ValidationUtils

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileReportsScreen(
    isNotificationAccessEnabled: Boolean,
    isAutoSyncEnabled: Boolean,
    onToggleAutoSync: (Boolean) -> Unit,
    onRequestNotificationAccess: () -> Unit,
    onLogout: () -> Unit,
    profileViewModel: ProfileViewModel = viewModel(),
    transactionViewModel: TransactionViewModel = viewModel()
) {
    val context = LocalContext.current
    var selectedTab by remember { mutableIntStateOf(0) }
    val userProfile by profileViewModel.userProfile.collectAsState()
    val transactions by transactionViewModel.transactions.collectAsState()

    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showLogoutDialog by remember { mutableStateOf(false) }
    var showDeleteAccountDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf<String?>(null) }

    // Edit Profile Dialog
    if (showEditProfileDialog) {
        var editName by remember { mutableStateOf(userProfile?.name ?: "") }
        var editIncome by remember { mutableStateOf(userProfile?.monthlyIncome?.toInt()?.toString() ?: "50000") }

        AlertDialog(
            onDismissRequest = { showEditProfileDialog = false },
            title = { Text("Edit Profile & Income", color = Color.White, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedTextField(
                        value = editName,
                        onValueChange = { editName = it },
                        label = { Text("Your Name") },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = DrvPrimary,
                            unfocusedBorderColor = GlassBorderStart
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = editIncome,
                        onValueChange = { editIncome = it },
                        label = { Text("Monthly Income (₹)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = DrvPrimary,
                            unfocusedBorderColor = GlassBorderStart
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val inc = editIncome.toDoubleOrNull() ?: 50000.0
                        profileViewModel.updateProfile(editName.trim(), inc) {
                            showEditProfileDialog = false
                            statusMessage = "Profile updated successfully!"
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)
                ) {
                    Text("Save", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showEditProfileDialog = false }) {
                    Text("Cancel", color = DrvMuted)
                }
            },
            containerColor = DrvBackground,
            shape = RoundedCornerShape(20.dp)
        )
    }

    // Logout Dialog
    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text("Confirm Logout", color = Color.White, fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to sign out from DrvLife?", color = DrvText) },
            confirmButton = {
                Button(
                    onClick = {
                        showLogoutDialog = false
                        onLogout()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)
                ) {
                    Text("Sign Out", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text("Cancel", color = DrvMuted)
                }
            },
            containerColor = DrvBackground,
            shape = RoundedCornerShape(20.dp)
        )
    }

    // Delete Account Dialog
    if (showDeleteAccountDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteAccountDialog = false },
            title = { Text("Delete Account Permanently", color = DrvExpense, fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "WARNING: This will permanently delete your DrvLife account and wipe all stored transactions, budgets, and insights. This action cannot be undone.",
                    color = DrvText
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        profileViewModel.deleteAccount { success, error ->
                            showDeleteAccountDialog = false
                            if (success) {
                                onLogout()
                            } else {
                                statusMessage = error ?: "Failed to delete account."
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DrvExpense)
                ) {
                    Text("Delete Everything", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteAccountDialog = false }) {
                    Text("Cancel", color = DrvMuted)
                }
            },
            containerColor = DrvBackground,
            shape = RoundedCornerShape(20.dp)
        )
    }

    // Privacy & Security Dialog
    if (showPrivacyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            title = { Text("Privacy & Security Architecture", color = Color.White, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("1. Local Notification Processing: Notification parsing runs strictly on your device. Only transaction alert text from approved banking and UPI apps is processed.", color = DrvText, style = Typography.bodySmall)
                    Text("2. Privacy Shield: OTPs, two-factor authentication codes, passwords, and personal messages are immediately discarded by our safety filters.", color = DrvText, style = Typography.bodySmall)
                    Text("3. Zero Credential Storage: Passwords and banking credentials are never requested or stored.", color = DrvText, style = Typography.bodySmall)
                    Text("4. User-Isolated Cloud: All your transactions are isolated to your private Firebase account path: users/{uid}/* with strict database security rules.", color = DrvText, style = Typography.bodySmall)
                }
            },
            confirmButton = {
                Button(onClick = { showPrivacyDialog = false }, colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)) {
                    Text("Got It", color = Color.White)
                }
            },
            containerColor = DrvBackground,
            shape = RoundedCornerShape(20.dp)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        if (selectedTab == 0) "Reports & Export" else "Profile & Settings",
                        style = Typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
            )
        },
        containerColor = Color.Transparent
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = Color.Transparent,
                contentColor = DrvPrimary,
                divider = {}
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Reports") },
                    icon = { Icon(Icons.Default.Assessment, contentDescription = "Reports") }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Settings") },
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (selectedTab == 0) {
                ReportsTabContent(
                    transactions = transactions,
                    userProfile = userProfile,
                    onExportCsv = {
                        val uri = profileViewModel.exportToCsv(context, transactions)
                        if (uri != null) {
                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/csv"
                                putExtra(Intent.EXTRA_STREAM, uri)
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                            context.startActivity(Intent.createChooser(intent, "Share Transactions CSV"))
                        }
                    },
                    onExportPdf = {
                        val uri = profileViewModel.exportToPdf(context, userProfile, transactions)
                        if (uri != null) {
                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "application/pdf"
                                putExtra(Intent.EXTRA_STREAM, uri)
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                            context.startActivity(Intent.createChooser(intent, "Share Financial Report PDF"))
                        }
                    }
                )
            } else {
                SettingsTabContent(
                    userProfile = userProfile,
                    isNotificationAccessEnabled = isNotificationAccessEnabled,
                    isAutoSyncEnabled = isAutoSyncEnabled,
                    onToggleAutoSync = onToggleAutoSync,
                    onRequestNotificationAccess = onRequestNotificationAccess,
                    onEditProfile = { showEditProfileDialog = true },
                    onResetPassword = {
                        val email = userProfile?.email ?: ""
                        if (email.isNotBlank()) {
                            profileViewModel.sendPasswordReset(email) { success, msg ->
                                statusMessage = msg
                            }
                        }
                    },
                    onPrivacyNotice = { showPrivacyDialog = true },
                    onLogout = { showLogoutDialog = true },
                    onDeleteAccount = { showDeleteAccountDialog = true }
                )
            }

            if (statusMessage != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .background(DrvPrimary.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Text(statusMessage ?: "", color = Color.White, style = Typography.bodyMedium)
                }
            }
        }
    }
}

@Composable
fun ReportsTabContent(
    transactions: List<com.example.liferece.model.Transaction>,
    userProfile: com.example.liferece.model.UserProfile?,
    onExportCsv: () -> Unit,
    onExportPdf: () -> Unit
) {
    val totalIncome = transactions.filter { !it.isExpense }.sumOf { it.amount }
    val totalExpense = transactions.filter { it.isExpense }.sumOf { it.amount }
    val netSavings = totalIncome - totalExpense
    val savingsRate = if (totalIncome > 0) (netSavings / totalIncome) * 100 else 0.0

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Executive Summary Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .glassCard(20.dp)
                .background(GlassGlowStart)
                .padding(20.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("FINANCIAL EXECUTIVE STATEMENT", color = DrvPrimary, style = Typography.labelSmall, fontWeight = FontWeight.Bold)

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total Income", color = DrvMuted)
                    Text(ValidationUtils.formatCurrency(totalIncome), color = DrvIncome, fontWeight = FontWeight.Bold)
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total Expenses", color = DrvMuted)
                    Text(ValidationUtils.formatCurrency(totalExpense), color = DrvExpense, fontWeight = FontWeight.Bold)
                }
                Divider(color = GlassBorderEnd)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Net Savings", color = Color.White, fontWeight = FontWeight.Bold)
                    Text(
                        ValidationUtils.formatCurrency(netSavings),
                        color = if (netSavings >= 0) DrvIncome else DrvExpense,
                        fontWeight = FontWeight.Bold,
                        style = Typography.titleMedium
                    )
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Savings Rate", color = DrvMuted)
                    Text("${savingsRate.toInt()}%", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Export Actions Row
        Text("EXPORT STATEMENTS", style = Typography.labelSmall, color = DrvMuted, fontWeight = FontWeight.Bold)

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(
                onClick = onExportPdf,
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(Icons.Default.PictureAsPdf, contentDescription = "PDF", modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Export PDF")
            }

            OutlinedButton(
                onClick = onExportCsv,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(Icons.Default.TableChart, contentDescription = "CSV", modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Export CSV")
            }
        }

        Spacer(modifier = Modifier.height(100.dp))
    }
}

@Composable
fun SettingsTabContent(
    userProfile: com.example.liferece.model.UserProfile?,
    isNotificationAccessEnabled: Boolean,
    isAutoSyncEnabled: Boolean,
    onToggleAutoSync: (Boolean) -> Unit,
    onRequestNotificationAccess: () -> Unit,
    onEditProfile: () -> Unit,
    onResetPassword: () -> Unit,
    onPrivacyNotice: () -> Unit,
    onLogout: () -> Unit,
    onDeleteAccount: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // User Info Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .glassCard(20.dp)
                .padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(userProfile?.name ?: "Valued User", color = Color.White, style = Typography.titleMedium, fontWeight = FontWeight.Bold)
                    Text(userProfile?.email ?: "", color = DrvMuted, style = Typography.bodySmall)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Income: ${ValidationUtils.formatCurrency(userProfile?.monthlyIncome ?: 50000.0)}/mo", color = DrvIncome, style = Typography.labelSmall)
                }
                OutlinedButton(onClick = onEditProfile, shape = RoundedCornerShape(12.dp)) {
                    Text("Edit")
                }
            }
        }

        // Auto Sync Setting Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .glassCard(18.dp)
                .padding(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Auto-Sync Transactions", color = Color.White, fontWeight = FontWeight.Bold)
                        Text("Capture incoming alerts from GPay, PhonePe, Paytm, etc.", color = DrvMuted, style = Typography.bodySmall)
                    }
                    Switch(
                        checked = isAutoSyncEnabled,
                        onCheckedChange = onToggleAutoSync,
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = DrvPrimary)
                    )
                }

                if (isAutoSyncEnabled && !isNotificationAccessEnabled) {
                    Button(
                        onClick = onRequestNotificationAccess,
                        colors = ButtonDefaults.buttonColors(containerColor = DrvExpense.copy(alpha = 0.8f)),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Grant Notification Listener Permission")
                    }
                }
            }
        }

        // Account Actions
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .glassCard(18.dp)
                .padding(8.dp)
        ) {
            Column {
                ListItem(
                    headlineContent = { Text("Reset Password Link", color = Color.White) },
                    supportingContent = { Text("Send password reset instructions to your email", color = DrvMuted) },
                    leadingContent = { Icon(Icons.Default.LockReset, contentDescription = "Password", tint = DrvPrimary) },
                    modifier = Modifier.clickable { onResetPassword() },
                    colors = ListItemDefaults.colors(containerColor = Color.Transparent)
                )
                Divider(color = GlassBorderEnd)
                ListItem(
                    headlineContent = { Text("Privacy & Security Architecture", color = Color.White) },
                    supportingContent = { Text("Read our local notification parsing guarantees", color = DrvMuted) },
                    leadingContent = { Icon(Icons.Default.Security, contentDescription = "Privacy", tint = DrvIncome) },
                    modifier = Modifier.clickable { onPrivacyNotice() },
                    colors = ListItemDefaults.colors(containerColor = Color.Transparent)
                )
                Divider(color = GlassBorderEnd)
                ListItem(
                    headlineContent = { Text("Sign Out", color = Color.White) },
                    leadingContent = { Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = DrvWarning) },
                    modifier = Modifier.clickable { onLogout() },
                    colors = ListItemDefaults.colors(containerColor = Color.Transparent)
                )
                Divider(color = GlassBorderEnd)
                ListItem(
                    headlineContent = { Text("Delete Account", color = DrvExpense) },
                    supportingContent = { Text("Permanently wipe your data from DrvLife", color = DrvMuted) },
                    leadingContent = { Icon(Icons.Default.DeleteForever, contentDescription = "Delete", tint = DrvExpense) },
                    modifier = Modifier.clickable { onDeleteAccount() },
                    colors = ListItemDefaults.colors(containerColor = Color.Transparent)
                )
            }
        }

        Spacer(modifier = Modifier.height(100.dp))
    }
}

