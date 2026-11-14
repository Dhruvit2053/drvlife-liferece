package com.example.liferece

import android.content.Intent
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.liferece.model.FinanceConstants
import com.example.liferece.model.Transaction
import com.example.liferece.ui.theme.*
import com.example.liferece.util.LocalReceiptManager
import androidx.compose.foundation.Image
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransactionsScreen(
    transactionViewModel: TransactionViewModel = viewModel(),
    profileViewModel: ProfileViewModel = viewModel()
) {
    val context = LocalContext.current
    val transactions by transactionViewModel.filteredTransactions.collectAsState()
    val searchQuery by transactionViewModel.searchQuery.collectAsState()
    val selectedType by transactionViewModel.selectedType.collectAsState()
    val selectedDateRange by transactionViewModel.selectedDateRange.collectAsState()
    val selectedCategory by transactionViewModel.selectedCategory.collectAsState()
    val sortOption by transactionViewModel.sortOption.collectAsState()

    var selectedTxForDetails by remember { mutableStateOf<Transaction?>(null) }
    var selectedTxForEdit by remember { mutableStateOf<Transaction?>(null) }
    var txToDelete by remember { mutableStateOf<Transaction?>(null) }

    // Edit Dialog
    if (selectedTxForEdit != null) {
        AddTransactionDialog(
            initialTx = selectedTxForEdit,
            onDismiss = { selectedTxForEdit = null },
            onSave = { updated ->
                transactionViewModel.updateTransaction(updated)
                selectedTxForEdit = null
            }
        )
    }

    // Delete Confirmation Dialog
    if (txToDelete != null) {
        AlertDialog(
            onDismissRequest = { txToDelete = null },
            title = { Text("Delete Transaction", color = Color.White, fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to delete this transaction for ${txToDelete?.merchant}?", color = DrvText) },
            confirmButton = {
                Button(
                    onClick = {
                        val id = txToDelete?.id ?: ""
                        if (id.isNotBlank()) {
                            transactionViewModel.deleteTransaction(id)
                        }
                        txToDelete = null
                        selectedTxForDetails = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DrvExpense)
                ) {
                    Text("Delete", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { txToDelete = null }) {
                    Text("Cancel", color = DrvMuted)
                }
            },
            containerColor = DrvBackground,
            shape = RoundedCornerShape(20.dp)
        )
    }

    // Transaction Details Sheet / Dialog
    if (selectedTxForDetails != null) {
        val tx = selectedTxForDetails!!
        AlertDialog(
            onDismissRequest = { selectedTxForDetails = null },
            title = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(tx.merchant, color = Color.White, fontWeight = FontWeight.Bold)
                    Text(
                        tx.formattedAmount,
                        color = if (tx.isExpense) DrvExpense else DrvIncome,
                        fontWeight = FontWeight.Bold,
                        style = Typography.titleMedium
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Category: ${tx.category}", color = DrvMuted)
                    Text("Date & Time: ${tx.formattedDate}", color = DrvMuted)
                    Text("Payment Method: ${tx.paymentMethod}", color = DrvMuted)
                    Text("Source: ${tx.source}", color = DrvMuted)
                    if (tx.notes.isNotBlank()) {
                        Text("Notes: ${tx.notes}", color = DrvText)
                    }
                    if (tx.hasReceiptImage) {
                        val ctx = LocalContext.current
                        val hasLocal = remember(tx.id) { LocalReceiptManager.hasLocalReceipt(ctx, tx.id) }
                        if (hasLocal) {
                            val bmp = remember(tx.id) { LocalReceiptManager.loadLocalReceiptBitmap(ctx, tx.id) }
                            if (bmp != null) {
                                Image(
                                    bitmap = bmp.asImageBitmap(),
                                    contentDescription = "Receipt",
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(160.dp)
                                        .clip(RoundedCornerShape(12.dp)),
                                    contentScale = ContentScale.Crop
                                )
                            }
                            Text("✓ Receipt image stored locally on this device (Free Spark plan)", color = DrvIncome, style = Typography.labelSmall)
                        } else {
                            Surface(
                                color = DrvSurface2,
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                            ) {
                                Column(modifier = Modifier.padding(8.dp)) {
                                    Text(
                                        "📷 Receipt on ${tx.receiptImageDevice.ifBlank { "Original Device" }}",
                                        color = DrvText,
                                        style = Typography.labelMedium,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Text(
                                        "Image remains on the original device to protect privacy & keep your app 100% free.",
                                        color = DrvMuted,
                                        style = Typography.labelSmall
                                    )
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(
                        onClick = {
                            selectedTxForEdit = tx
                            selectedTxForDetails = null
                        }
                    ) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Edit")
                    }
                    Button(
                        onClick = {
                            txToDelete = tx
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DrvExpense.copy(alpha = 0.8f))
                    ) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Delete")
                    }
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedTxForDetails = null }) {
                    Text("Close", color = DrvMuted)
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
                        "Transactions",
                        style = Typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(
                        onClick = {
                            val uri = profileViewModel.exportToCsv(context, transactions)
                            if (uri != null) {
                                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                    type = "text/csv"
                                    putExtra(Intent.EXTRA_STREAM, uri)
                                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                }
                                context.startActivity(Intent.createChooser(shareIntent, "Share Transactions CSV"))
                            }
                        }
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Export CSV", tint = Color.White)
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
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Search Bar
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { transactionViewModel.searchQuery.value = it },
                    placeholder = { Text("Search merchant, category, notes...", color = DrvMuted) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = DrvMuted) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = GlassBorderStart
                    ),
                    singleLine = true
                )
            }

            // Filter Chips Row (Type & Date)
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(vertical = 4.dp)
                ) {
                    val types = listOf("All", "Expense", "Income")
                    items(types) { t ->
                        FilterChip(
                            selected = selectedType == t,
                            onClick = { transactionViewModel.selectedType.value = t },
                            label = { Text(t) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = DrvPrimary.copy(alpha = 0.3f),
                                selectedLabelColor = Color.White
                            )
                        )
                    }

                    val dateRanges = listOf("All Time", "Today", "This Week", "This Month")
                    items(dateRanges) { r ->
                        val code = if (r == "All Time") "All" else r
                        FilterChip(
                            selected = selectedDateRange == code,
                            onClick = { transactionViewModel.selectedDateRange.value = code },
                            label = { Text(r) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = DrvPrimaryVariant.copy(alpha = 0.4f),
                                selectedLabelColor = Color.White
                            )
                        )
                    }
                }
            }

            // Category Filter Row
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        FilterChip(
                            selected = selectedCategory == "All",
                            onClick = { transactionViewModel.selectedCategory.value = "All" },
                            label = { Text("All Categories") }
                        )
                    }
                    items(FinanceConstants.CATEGORIES) { cat ->
                        FilterChip(
                            selected = selectedCategory == cat,
                            onClick = {
                                transactionViewModel.selectedCategory.value =
                                    if (selectedCategory == cat) "All" else cat
                            },
                            label = { Text(cat) }
                        )
                    }
                }
            }

            // Header with count
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${transactions.size} TRANSACTIONS",
                        style = Typography.labelSmall,
                        color = DrvMuted,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Empty State
            if (transactions.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("No transactions found", color = Color.White, style = Typography.titleMedium, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("Try adjusting your search or filters.", color = DrvMuted, style = Typography.bodySmall)
                        }
                    }
                }
            }

            // Transaction Items
            itemsIndexed(transactions, key = { _, tx -> tx.id.ifBlank { tx.timestamp.toString() } }) { index, tx ->
                AnimatedVisibilityFeedItem(index = index) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .glassCard(16.dp)
                            .clickable { selectedTxForDetails = tx }
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(tx.merchant, style = Typography.labelLarge, color = Color.White, fontWeight = FontWeight.Bold)
                                if (tx.hasReceiptImage) {
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("📷", style = Typography.labelSmall)
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "${tx.category} · ${tx.source} · ${tx.formattedDate}",
                                style = Typography.labelMedium,
                                color = DrvMuted
                            )
                        }
                        Text(
                            text = tx.formattedAmount,
                            style = Typography.labelLarge,
                            color = if (tx.isExpense) DrvExpense else DrvIncome,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(100.dp))
            }
        }
    }
}

@Composable
fun AnimatedVisibilityFeedItem(
    index: Int,
    content: @Composable () -> Unit
) {
    var visible by remember { mutableStateOf(false) }
    val alpha by animateFloatAsState(
        targetValue = if (visible) 1f else 0f,
        animationSpec = tween(durationMillis = 350, delayMillis = (index * 40).coerceAtMost(250)),
        label = "alpha"
    )
    val translateY by animateDpAsState(
        targetValue = if (visible) 0.dp else 20.dp,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "translateY"
    )

    LaunchedEffect(Unit) {
        visible = true
    }

    Box(
        modifier = Modifier.graphicsLayer(
            alpha = alpha,
            translationY = with(LocalDensity.current) { translateY.toPx() }
        )
    ) {
        content()
    }
}
