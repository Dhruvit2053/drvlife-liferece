package com.example.liferece

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.liferece.model.Budget
import com.example.liferece.model.FinanceConstants
import com.example.liferece.ui.theme.*
import com.example.liferece.util.ValidationUtils

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BudgetScreen(
    budgetViewModel: BudgetViewModel = viewModel(),
    transactionViewModel: TransactionViewModel = viewModel()
) {
    val budgets by budgetViewModel.budgets.collectAsState()
    val transactions by transactionViewModel.transactions.collectAsState()
    val totalExpense by transactionViewModel.totalExpense.collectAsState()
    val categoryTotals by transactionViewModel.categoryBreakdown.collectAsState()

    var showSetBudgetDialog by remember { mutableStateOf(false) }
    var budgetToDelete by remember { mutableStateOf<Budget?>(null) }

    // Overall Budget calculation
    val overallBudget = budgets.find { it.category.equals("Overall", ignoreCase = true) }
    val overallLimit = overallBudget?.monthlyLimit ?: 30000.0
    val overallProgress = if (overallLimit > 0) (totalExpense / overallLimit).toFloat() else 0f
    val remainingBudget = (overallLimit - totalExpense).coerceAtLeast(0.0)

    // Delete Confirmation Dialog
    if (budgetToDelete != null) {
        AlertDialog(
            onDismissRequest = { budgetToDelete = null },
            title = { Text("Delete Budget", color = Color.White, fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to delete the budget for ${budgetToDelete?.category}?", color = DrvText) },
            confirmButton = {
                Button(
                    onClick = {
                        val id = budgetToDelete?.id ?: ""
                        if (id.isNotBlank()) {
                            budgetViewModel.deleteBudget(id)
                        }
                        budgetToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DrvExpense)
                ) {
                    Text("Delete", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { budgetToDelete = null }) {
                    Text("Cancel", color = DrvMuted)
                }
            },
            containerColor = DrvBackground,
            shape = RoundedCornerShape(20.dp)
        )
    }

    if (showSetBudgetDialog) {
        SetBudgetDialog(
            onDismiss = { showSetBudgetDialog = false },
            onSave = { category, limit ->
                val newBudget = Budget(
                    category = category,
                    monthlyLimit = limit,
                    month = "Current",
                    createdAt = System.currentTimeMillis()
                )
                budgetViewModel.saveBudget(newBudget)
                showSetBudgetDialog = false
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Budget Management",
                        style = Typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(onClick = { showSetBudgetDialog = true }) {
                        Icon(Icons.Default.Add, contentDescription = "Add Budget", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
            )
        },
        containerColor = Color.Transparent
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Overall Budget Card
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .glassCard(24.dp)
                        .background(GlassGlowStart)
                        .padding(20.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "MONTHLY OVERALL BUDGET",
                                style = Typography.labelSmall,
                                color = DrvPrimary,
                                fontWeight = FontWeight.Bold
                            )
                            val statusColor = when {
                                overallProgress > 1f -> DrvExpense
                                overallProgress > 0.8f -> DrvWarning
                                else -> DrvIncome
                            }
                            Text(
                                if (overallProgress > 1f) "Over Budget!" else "${(overallProgress * 100).toInt()}% Used",
                                color = statusColor,
                                style = Typography.labelSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Bottom
                        ) {
                            Text(
                                text = ValidationUtils.formatCurrency(totalExpense),
                                style = Typography.headlineMedium,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "of ${ValidationUtils.formatCurrency(overallLimit)}",
                                style = Typography.bodyMedium,
                                color = DrvMuted
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Progress Bar
                        LinearProgressIndicator(
                            progress = overallProgress.coerceIn(0f, 1f),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = if (overallProgress > 1f) DrvExpense else if (overallProgress > 0.8f) DrvWarning else DrvIncome,
                            trackColor = Color.White.copy(alpha = 0.1f)
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Remaining to spend: ${ValidationUtils.formatCurrency(remainingBudget)}",
                            style = Typography.bodySmall,
                            color = DrvIncome
                        )
                    }
                }
            }

            // Category Budgets Title
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "CATEGORY BUDGETS",
                        style = Typography.labelSmall,
                        color = DrvMuted,
                        fontWeight = FontWeight.Bold
                    )
                    TextButton(onClick = { showSetBudgetDialog = true }) {
                        Text("+ Set New Budget", color = DrvPrimary, style = Typography.labelSmall)
                    }
                }
            }

            // Category Budget List
            val categoryBudgets = budgets.filter { !it.category.equals("Overall", ignoreCase = true) }
            if (categoryBudgets.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .glassCard(16.dp)
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("No category budgets set.", color = Color.White, style = Typography.titleMedium)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("Tap '+ Set New Budget' above to allocate limits per category.", color = DrvMuted, style = Typography.bodySmall)
                        }
                    }
                }
            } else {
                items(categoryBudgets) { b ->
                    val spent = categoryTotals[b.category] ?: 0.0
                    val prog = if (b.monthlyLimit > 0) (spent / b.monthlyLimit).toFloat() else 0f
                    val progColor = when {
                        prog > 1f -> DrvExpense
                        prog > 0.75f -> DrvWarning
                        else -> DrvIncome
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .glassCard(18.dp)
                            .padding(16.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(b.category, color = Color.White, style = Typography.labelLarge, fontWeight = FontWeight.Bold)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        "${ValidationUtils.formatCurrency(spent)} / ${ValidationUtils.formatCurrency(b.monthlyLimit)}",
                                        color = progColor,
                                        style = Typography.labelMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    IconButton(
                                        onClick = { budgetToDelete = b },
                                        modifier = Modifier.size(24.dp).padding(start = 6.dp)
                                    ) {
                                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = DrvMuted, modifier = Modifier.size(16.dp))
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            LinearProgressIndicator(
                                progress = prog.coerceIn(0f, 1f),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(6.dp)
                                    .clip(RoundedCornerShape(3.dp)),
                                color = progColor,
                                trackColor = Color.White.copy(alpha = 0.08f)
                            )

                            if (prog > 1f) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("⚠️ Budget exceeded by ${ValidationUtils.formatCurrency(spent - b.monthlyLimit)}!", color = DrvExpense, style = Typography.bodySmall, fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(100.dp))
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SetBudgetDialog(
    onDismiss: () -> Unit,
    onSave: (String, Double) -> Unit
) {
    var category by remember { mutableStateOf("Food") }
    var limitStr by remember { mutableStateOf("") }
    var categoryExpanded by remember { mutableStateOf(false) }

    val options = listOf("Overall") + FinanceConstants.CATEGORIES

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .glassCard(28.dp)
                .background(
                    androidx.compose.ui.graphics.Brush.verticalGradient(
                        colors = listOf(
                            GradientBg2.copy(alpha = 0.95f),
                            GradientBg1.copy(alpha = 0.98f)
                        )
                    )
                )
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text("Set Budget Limit", style = Typography.titleLarge, color = Color.White, fontWeight = FontWeight.Bold)

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
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = categoryExpanded,
                        onDismissRequest = { categoryExpanded = false }
                    ) {
                        options.forEach { opt ->
                            DropdownMenuItem(
                                text = { Text(opt) },
                                onClick = {
                                    category = opt
                                    categoryExpanded = false
                                }
                            )
                        }
                    }
                }

                OutlinedTextField(
                    value = limitStr,
                    onValueChange = { limitStr = it },
                    label = { Text("Monthly Limit (₹ INR)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
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
                            val limit = limitStr.toDoubleOrNull() ?: 0.0
                            if (limit > 0.0) {
                                onSave(category, limit)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)
                    ) {
                        Text("Save Budget", color = Color.White)
                    }
                }
            }
        }
    }
}

