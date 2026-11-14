package com.example.liferece

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.liferece.model.FinanceConstants
import com.example.liferece.model.Transaction
import com.example.liferece.ui.theme.*
import com.example.liferece.util.ValidationUtils
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    isNotificationAccessEnabled: Boolean,
    isAutoSyncEnabled: Boolean,
    onToggleAutoSync: (Boolean) -> Unit,
    onRequestNotificationAccess: () -> Unit,
    onLogout: () -> Unit,
    onNavigateToFeed: () -> Unit = {},
    transactionViewModel: TransactionViewModel = viewModel(),
    profileViewModel: ProfileViewModel = viewModel(),
    aiAdvisorViewModel: AiAdvisorViewModel = viewModel()
) {
    var showAddDialog by remember { mutableStateOf(false) }
    val transactions by transactionViewModel.transactions.collectAsState()
    val totalBalance by transactionViewModel.totalBalance.collectAsState()
    val totalIncome by transactionViewModel.totalIncome.collectAsState()
    val totalExpense by transactionViewModel.totalExpense.collectAsState()
    val categoryTotals by transactionViewModel.categoryBreakdown.collectAsState()
    val userProfile by profileViewModel.userProfile.collectAsState()
    val insights by aiAdvisorViewModel.insights.collectAsState()

    // Trigger AI analysis when transactions change
    LaunchedEffect(transactions) {
        if (transactions.isNotEmpty()) {
            aiAdvisorViewModel.analyzeFinances(
                income = userProfile?.monthlyIncome ?: 50000.0,
                transactions = transactions
            )
        }
    }

    if (showAddDialog) {
        AddTransactionDialog(
            onDismiss = { showAddDialog = false },
            onSave = { tx ->
                transactionViewModel.addTransaction(tx)
                showAddDialog = false
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Hello, ${userProfile?.name?.ifBlank { "User" } ?: "User"}",
                            style = Typography.titleLarge,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = SimpleDateFormat("MMMM yyyy", Locale.getDefault()).format(Date()),
                            style = Typography.bodySmall,
                            color = DrvMuted
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onLogout) {
                        Icon(Icons.Default.ExitToApp, contentDescription = "Log Out", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = DrvPrimary,
                contentColor = Color.White,
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.padding(bottom = 16.dp, end = 8.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Transaction")
            }
        },
        containerColor = Color.Transparent
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Notification warning banner if sync is on but permission is missing
            if (isAutoSyncEnabled && !isNotificationAccessEnabled) {
                NotificationAccessWarningCard(onRequestNotificationAccess)
            }

            // Total Balance & Net Savings Card
            BalanceCard(
                balance = totalBalance,
                income = totalIncome,
                expense = totalExpense,
                statedIncome = userProfile?.monthlyIncome ?: 50000.0
            )

            // Auto-Sync Toggle Card
            SyncSettingsCard(
                isAutoSyncEnabled = isAutoSyncEnabled,
                onToggleAutoSync = onToggleAutoSync
            )

            // Weekly Spending Bar Chart
            WeeklySpendingSection(transactions = transactions)

            // Category Breakdown Progress Bars
            CategoryBreakdownSection(categoryTotals = categoryTotals, totalExpense = totalExpense)

            // AI Insight Card
            val topInsight = insights.firstOrNull()
            AiInsightCard(
                insight = topInsight?.description ?: "Keep tracking all purchases to unlock tailored savings strategies!"
            )

            // Recent Transactions Section
            RecentTransactionsSection(
                transactions = transactions.take(5),
                onViewAll = onNavigateToFeed
            )

            Spacer(modifier = Modifier.height(90.dp))
        }
    }
}

@Composable
fun BalanceCard(
    balance: Double,
    income: Double,
    expense: Double,
    statedIncome: Double
) {
    val health = ValidationUtils.getFinancialHealthStatus(if (income > 0) income else statedIncome, expense)
    val healthBadgeColor = when {
        health.third >= 80 -> DrvIncome
        health.third >= 60 -> DrvWarning
        else -> DrvExpense
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(24.dp)
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        GlassGlowStart,
                        GlassGlowEnd
                    )
                )
            )
            .padding(20.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "TOTAL NET BALANCE",
                    style = Typography.labelSmall,
                    color = DrvPrimary.copy(alpha = 0.9f),
                    fontWeight = FontWeight.Bold
                )
                // Financial Health Badge
                Box(
                    modifier = Modifier
                        .background(healthBadgeColor.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                        .border(1.dp, healthBadgeColor.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = health.first,
                        color = healthBadgeColor,
                        style = Typography.labelSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = ValidationUtils.formatCurrency(balance),
                style = Typography.headlineLarge,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Income and Expense Dual Pill
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Income
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(DrvIncome.copy(alpha = 0.12f), RoundedCornerShape(14.dp))
                        .border(1.dp, DrvIncome.copy(alpha = 0.25f), RoundedCornerShape(14.dp))
                        .padding(12.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.TrendingUp, contentDescription = "Income", tint = DrvIncome, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Income", color = DrvIncome, style = Typography.labelSmall, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(ValidationUtils.formatCurrency(income), color = Color.White, style = Typography.labelLarge, fontWeight = FontWeight.Bold)
                    }
                }

                // Expense
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(DrvExpense.copy(alpha = 0.12f), RoundedCornerShape(14.dp))
                        .border(1.dp, DrvExpense.copy(alpha = 0.25f), RoundedCornerShape(14.dp))
                        .padding(12.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.TrendingDown, contentDescription = "Expense", tint = DrvExpense, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Expenses", color = DrvExpense, style = Typography.labelSmall, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(ValidationUtils.formatCurrency(expense), color = Color.White, style = Typography.labelLarge, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun WeeklySpendingSection(transactions: List<Transaction>) {
    val dayLabels = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
    val cal = Calendar.getInstance()
    val dayExpenses = MutableList(7) { 0.0 }

    for (tx in transactions.filter { it.isExpense }) {
        cal.timeInMillis = tx.timestamp
        val dayOfWeek = cal.get(Calendar.DAY_OF_WEEK)
        // Convert Sunday (1) -> index 6, Monday (2) -> index 0, etc.
        val idx = if (dayOfWeek == Calendar.SUNDAY) 6 else dayOfWeek - 2
        if (idx in 0..6) {
            dayExpenses[idx] += tx.amount
        }
    }

    val maxVal = (dayExpenses.maxOrNull() ?: 1.0).coerceAtLeast(100.0)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(20.dp)
            .padding(16.dp)
    ) {
        Text(
            text = "WEEKLY SPENDING TREND",
            style = Typography.labelSmall,
            color = DrvMuted,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(90.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom
        ) {
            dayLabels.forEachIndexed { index, label ->
                val ratio = (dayExpenses[index] / maxVal).toFloat().coerceIn(0.08f, 1f)
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Bottom,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.45f)
                            .fillMaxHeight(ratio)
                            .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(DrvPrimary, DrvPrimaryVariant)
                                )
                            )
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(label, style = Typography.labelSmall, color = DrvMuted, fontSize = 10.sp)
                }
            }
        }
    }
}

@Composable
fun CategoryBreakdownSection(categoryTotals: Map<String, Double>, totalExpense: Double) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(24.dp)
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "CATEGORY BREAKDOWN",
            style = Typography.labelSmall,
            color = DrvMuted,
            fontWeight = FontWeight.Bold
        )

        if (categoryTotals.isEmpty()) {
            Text("No expenses logged yet.", color = DrvMuted, style = Typography.bodyMedium)
        } else {
            val colors = listOf(DrvWarning, DrvPrimary, DrvIncome, DrvPrimaryVariant, Color(0xFFE24B88), Color(0xFF4ACBE2))
            var colIndex = 0
            categoryTotals.entries.sortedByDescending { it.value }.take(5).forEach { entry ->
                val color = colors[colIndex % colors.size]
                colIndex++
                val progress = if (totalExpense > 0) (entry.value / totalExpense).toFloat() else 0f
                CategoryItemRow(name = entry.key, amount = ValidationUtils.formatCurrency(entry.value), progress = progress, color = color)
            }
        }
    }
}

@Composable
fun CategoryItemRow(name: String, amount: String, progress: Float, color: Color) {
    var animatedProgress by remember { mutableStateOf(0f) }
    val progressAnimation by animateFloatAsState(
        targetValue = animatedProgress,
        animationSpec = tween(durationMillis = 800, easing = FastOutSlowInEasing),
        label = "progress"
    )
    LaunchedEffect(progress) {
        animatedProgress = progress
    }

    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(name, style = Typography.labelLarge, color = Color.White)
            Text(amount, style = Typography.labelLarge, color = color, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = progressAnimation,
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = color,
            trackColor = Color.White.copy(alpha = 0.08f)
        )
    }
}

@Composable
fun RecentTransactionsSection(
    transactions: List<Transaction>,
    onViewAll: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(20.dp)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "RECENT TRANSACTIONS",
                style = Typography.labelSmall,
                color = DrvMuted,
                fontWeight = FontWeight.Bold
            )
            Text(
                "View All →",
                style = Typography.labelSmall,
                color = DrvPrimary,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.clickable { onViewAll() }
            )
        }

        if (transactions.isEmpty()) {
            Text("No transactions logged yet.", color = DrvMuted, style = Typography.bodyMedium)
        } else {
            transactions.forEach { tx ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(tx.merchant, color = Color.White, style = Typography.labelLarge, fontWeight = FontWeight.Bold)
                        Text("${tx.category} · ${tx.source} · ${tx.timeOnly}", color = DrvMuted, style = Typography.bodySmall)
                    }
                    Text(
                        tx.formattedAmount,
                        color = if (tx.isExpense) DrvExpense else DrvIncome,
                        style = Typography.labelLarge,
                        fontWeight = FontWeight.Bold
                    )
                }
                Divider(color = GlassBorderEnd, thickness = 0.5.dp)
            }
        }
    }
}

@Composable
fun SyncSettingsCard(
    isAutoSyncEnabled: Boolean,
    onToggleAutoSync: (Boolean) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(20.dp)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    "🔄 Auto-Sync Transactions",
                    style = Typography.labelLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "Parse incoming alerts from GPay, PhonePe, Paytm, & Banks locally",
                    style = Typography.bodySmall,
                    color = DrvMuted
                )
            }
            Switch(
                checked = isAutoSyncEnabled,
                onCheckedChange = onToggleAutoSync,
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color.White,
                    checkedTrackColor = DrvPrimary,
                    uncheckedThumbColor = DrvMuted,
                    uncheckedTrackColor = Color.Transparent
                )
            )
        }
    }
}

@Composable
fun AiInsightCard(insight: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(20.dp)
            .background(GlassGlowStart)
            .padding(16.dp)
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "🧠 AI Financial Insight",
                    style = Typography.labelLarge,
                    color = DrvPrimary,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = insight,
                style = Typography.bodyMedium,
                color = DrvText.copy(alpha = 0.9f),
                lineHeight = 20.sp
            )
        }
    }
}

@Composable
fun NotificationAccessWarningCard(onGrant: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(20.dp)
            .background(DrvExpense.copy(alpha = 0.12f))
            .border(1.dp, DrvExpense.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
            .padding(16.dp)
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                "⚠️ Auto-Sync is Inactive",
                style = Typography.labelLarge,
                color = DrvExpense,
                fontWeight = FontWeight.Bold
            )
            Text(
                "DrvLife requires Notification Access to automatically capture transactions from UPI apps and bank alerts.",
                style = Typography.bodyMedium,
                color = DrvText.copy(alpha = 0.9f),
                lineHeight = 18.sp
            )
            Button(
                onClick = onGrant,
                colors = ButtonDefaults.buttonColors(containerColor = DrvExpense.copy(alpha = 0.8f)),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.align(Alignment.End)
            ) {
                Text("Enable Access", color = Color.White, style = Typography.labelMedium)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddTransactionDialog(
    onDismiss: () -> Unit,
    onSave: (Transaction) -> Unit,
    initialTx: Transaction? = null
) {
    var merchant by remember { mutableStateOf(initialTx?.merchant ?: "") }
    var amountStr by remember { mutableStateOf(initialTx?.amount?.toString() ?: "") }
    var category by remember { mutableStateOf(initialTx?.category ?: "Food") }
    var isExpense by remember { mutableStateOf(initialTx?.isExpense ?: true) }
    var paymentMethod by remember { mutableStateOf(initialTx?.paymentMethod ?: "UPI") }
    var notes by remember { mutableStateOf(initialTx?.notes ?: "") }
    var categoryExpanded by remember { mutableStateOf(false) }
    var paymentExpanded by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .glassCard(28.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            GradientBg2.copy(alpha = 0.95f),
                            GradientBg1.copy(alpha = 0.98f)
                        )
                    )
                )
                .padding(24.dp)
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(14.dp),
                horizontalAlignment = Alignment.Start
            ) {
                Text(
                    if (initialTx != null) "Edit Transaction" else "Add Transaction",
                    style = Typography.titleLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )

                // Type Toggle: Expense vs Income
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = isExpense,
                        onClick = { isExpense = true },
                        label = { Text("Expense") },
                        modifier = Modifier.weight(1f),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = DrvExpense.copy(alpha = 0.3f),
                            selectedLabelColor = Color.White
                        )
                    )
                    FilterChip(
                        selected = !isExpense,
                        onClick = { isExpense = false },
                        label = { Text("Income") },
                        modifier = Modifier.weight(1f),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = DrvIncome.copy(alpha = 0.3f),
                            selectedLabelColor = Color.White
                        )
                    )
                }

                OutlinedTextField(
                    value = merchant,
                    onValueChange = { merchant = it },
                    label = { Text("Merchant / Description") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = GlassBorderStart
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = amountStr,
                    onValueChange = { amountStr = it },
                    label = { Text("Amount (₹ INR)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = GlassBorderStart
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                // Category Dropdown
                ExposedDropdownMenuBox(
                    expanded = categoryExpanded,
                    onExpandedChange = { categoryExpanded = it }
                ) {
                    OutlinedTextField(
                        value = category,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Category") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoryExpanded) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = DrvPrimary,
                            unfocusedBorderColor = GlassBorderStart
                        ),
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = categoryExpanded,
                        onDismissRequest = { categoryExpanded = false }
                    ) {
                        FinanceConstants.CATEGORIES.forEach { cat ->
                            DropdownMenuItem(
                                text = { Text(cat) },
                                onClick = {
                                    category = cat
                                    categoryExpanded = false
                                }
                            )
                        }
                    }
                }

                // Notes Field
                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Notes (optional)") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = GlassBorderStart
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Cancel", color = DrvMuted)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            val amt = amountStr.toDoubleOrNull() ?: 0.0
                            if (merchant.isNotBlank() && amt > 0.0) {
                                val tx = Transaction(
                                    id = initialTx?.id ?: "",
                                    merchant = merchant.trim(),
                                    amount = amt,
                                    timestamp = initialTx?.timestamp ?: System.currentTimeMillis(),
                                    category = category,
                                    isExpense = isExpense,
                                    paymentMethod = paymentMethod,
                                    source = initialTx?.source ?: "Manual",
                                    notes = notes.trim()
                                )
                                onSave(tx)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)
                    ) {
                        Text("Save", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
