package com.example.liferece

import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.liferece.model.FinanceConstants
import com.example.liferece.model.Transaction
import com.example.liferece.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AiAdvisorScreen(
    aiAdvisorViewModel: AiAdvisorViewModel = viewModel(),
    transactionViewModel: TransactionViewModel = viewModel(),
    profileViewModel: ProfileViewModel = viewModel()
) {
    var selectedSubTab by remember { mutableIntStateOf(0) }
    val transactions by transactionViewModel.transactions.collectAsState()
    val userProfile by profileViewModel.userProfile.collectAsState()
    val insights by aiAdvisorViewModel.insights.collectAsState()
    val isAnalyzing by aiAdvisorViewModel.isAnalyzing.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "AI Financial Advisor",
                        style = Typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    if (selectedSubTab == 0) {
                        IconButton(
                            onClick = {
                                aiAdvisorViewModel.analyzeFinances(
                                    income = userProfile?.monthlyIncome ?: 50000.0,
                                    transactions = transactions
                                )
                            }
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = "Refresh Insights", tint = Color.White)
                        }
                    }
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
            // Sub-Tab Switcher (Insights, AI Chat, Receipt Scanner)
            TabRow(
                selectedTabIndex = selectedSubTab,
                containerColor = Color.Transparent,
                contentColor = DrvPrimary,
                divider = {}
            ) {
                Tab(
                    selected = selectedSubTab == 0,
                    onClick = { selectedSubTab = 0 },
                    text = { Text("Insights") },
                    icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "Insights") }
                )
                Tab(
                    selected = selectedSubTab == 1,
                    onClick = { selectedSubTab = 1 },
                    text = { Text("AI Chat") },
                    icon = { Icon(Icons.Default.Chat, contentDescription = "Chat") }
                )
                Tab(
                    selected = selectedSubTab == 2,
                    onClick = { selectedSubTab = 2 },
                    text = { Text("Receipt Scanner") },
                    icon = { Icon(Icons.Default.CameraAlt, contentDescription = "Scan") }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            when (selectedSubTab) {
                0 -> InsightsTabContent(
                    insights = insights,
                    isAnalyzing = isAnalyzing,
                    onRefresh = {
                        aiAdvisorViewModel.analyzeFinances(
                            income = userProfile?.monthlyIncome ?: 50000.0,
                            transactions = transactions
                        )
                    }
                )
                1 -> AiChatTabContent(
                    aiAdvisorViewModel = aiAdvisorViewModel,
                    transactions = transactions,
                    monthlyIncome = userProfile?.monthlyIncome ?: 50000.0
                )
                2 -> ReceiptScannerTabContent(
                    aiAdvisorViewModel = aiAdvisorViewModel,
                    transactionViewModel = transactionViewModel
                )
            }
        }
    }
}

@Composable
fun InsightsTabContent(
    insights: List<com.example.liferece.model.AiInsight>,
    isAnalyzing: Boolean,
    onRefresh: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Educational Disclaimer Notice
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(DrvPrimary.copy(alpha = 0.1f), RoundedCornerShape(14.dp))
                .border(1.dp, DrvPrimary.copy(alpha = 0.25f), RoundedCornerShape(14.dp))
                .padding(12.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Info, contentDescription = "Info", tint = DrvPrimary, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    "AI recommendations are educational guides based on your transaction patterns. They do not constitute guaranteed financial or investment advice.",
                    color = DrvText,
                    style = Typography.bodySmall
                )
            }
        }

        if (isAnalyzing) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(color = DrvPrimary)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Gemini is analyzing your spending patterns...", color = DrvMuted, style = Typography.bodyMedium)
                }
            }
        } else if (insights.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("No insights generated yet.", color = Color.White, style = Typography.titleMedium)
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(onClick = onRefresh, colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary)) {
                        Text("Analyze Spending Now", color = Color.White)
                    }
                }
            }
        } else {
            val colors = listOf(DrvPrimary, DrvIncome, DrvWarning, DrvExpense)
            insights.forEachIndexed { index, insight ->
                val col = colors[index % colors.size]
                AdvisorCardView(
                    title = insight.title,
                    description = insight.description,
                    category = insight.category,
                    color = col
                )
            }
        }

        Spacer(modifier = Modifier.height(90.dp))
    }
}

@Composable
fun AdvisorCardView(title: String, description: String, category: String, color: Color) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .glassCard(18.dp)
            .background(color.copy(alpha = 0.05f))
            .border(1.dp, color.copy(alpha = 0.25f), RoundedCornerShape(18.dp))
            .padding(18.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, style = Typography.labelLarge, color = color, fontWeight = FontWeight.Bold)
                Box(
                    modifier = Modifier
                        .background(color.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(category, color = color, style = Typography.labelSmall, fontSize = 10.sp)
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(description, style = Typography.bodyMedium, color = DrvText.copy(alpha = 0.9f), lineHeight = 20.sp)
        }
    }
}

@Composable
fun AiChatTabContent(
    aiAdvisorViewModel: AiAdvisorViewModel,
    transactions: List<Transaction>,
    monthlyIncome: Double
) {
    val messages by aiAdvisorViewModel.chatMessages.collectAsState()
    val isGenerating by aiAdvisorViewModel.isChatGenerating.collectAsState()
    var inputText by remember { mutableStateOf("") }
    val listState = rememberLazyListState()

    val totalSpent = transactions.filter { it.isExpense }.sumOf { it.amount }
    val contextSummary = "Monthly Income: ₹${monthlyIncome.toInt()}, Total Spent: ₹${totalSpent.toInt()}, Logged Transactions: ${transactions.size}"

    val suggestedQuestions = listOf(
        "How can I save ₹2,000 this month?",
        "Analyze my dining vs grocery spending",
        "Am I spending too much on weekends?",
        "Suggestions to build my emergency fund"
    )

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        // Suggested Chips
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.padding(vertical = 8.dp)
        ) {
            items(suggestedQuestions) { question ->
                SuggestionChip(
                    onClick = {
                        aiAdvisorViewModel.sendChatMessage(question, contextSummary)
                    },
                    label = { Text(question, fontSize = 12.sp) },
                    colors = SuggestionChipDefaults.suggestionChipColors(
                        containerColor = GlassBg,
                        labelColor = DrvText
                    ),
                    border = SuggestionChipDefaults.suggestionChipBorder(
                        enabled = true,
                        borderColor = GlassBorderStart
                    )
                )
            }
        }

        // Messages List
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages) { msg ->
                val isUser = msg.sender == "user"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.85f)
                            .background(
                                color = if (isUser) DrvPrimary.copy(alpha = 0.25f) else GlassBg,
                                shape = RoundedCornerShape(16.dp)
                            )
                            .border(
                                width = 1.dp,
                                color = if (isUser) DrvPrimary else GlassBorderStart,
                                shape = RoundedCornerShape(16.dp)
                            )
                            .padding(14.dp)
                    ) {
                        Column {
                            Text(
                                text = if (isUser) "You" else "DrvLife AI",
                                color = if (isUser) DrvPrimary else DrvIncome,
                                style = Typography.labelSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = msg.message,
                                color = Color.White,
                                style = Typography.bodyMedium,
                                lineHeight = 20.sp
                            )
                        }
                    }
                }
            }

            if (isGenerating) {
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = DrvPrimary, strokeWidth = 2.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("DrvLife AI is thinking...", color = DrvMuted, style = Typography.bodySmall)
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(10.dp))
            }
        }

        // Input Field
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                placeholder = { Text("Ask about your budget, savings...", color = DrvMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = DrvPrimary,
                    unfocusedBorderColor = GlassBorderStart
                ),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.weight(1f),
                singleLine = true,
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(
                    onSend = {
                        if (inputText.isNotBlank()) {
                            aiAdvisorViewModel.sendChatMessage(inputText, contextSummary)
                            inputText = ""
                        }
                    }
                )
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    if (inputText.isNotBlank()) {
                        aiAdvisorViewModel.sendChatMessage(inputText, contextSummary)
                        inputText = ""
                    }
                },
                modifier = Modifier
                    .background(DrvPrimary, RoundedCornerShape(16.dp))
                    .size(48.dp)
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White)
            }
        }
    }
}

@Composable
fun ReceiptScannerTabContent(
    aiAdvisorViewModel: AiAdvisorViewModel,
    transactionViewModel: TransactionViewModel
) {
    val context = LocalContext.current
    val scanState by aiAdvisorViewModel.receiptScanState.collectAsState()
    var previewBitmap by remember { mutableStateOf<Bitmap?>(null) }

    // Editable fields for extracted data confirmation
    var merchant by remember { mutableStateOf("") }
    var amount by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Food") }
    var notes by remember { mutableStateOf("Scanned from receipt") }
    var saveSuccessMessage by remember { mutableStateOf<String?>(null) }

    // Gallery Picker
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            try {
                val bitmap = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    ImageDecoder.decodeBitmap(ImageDecoder.createSource(context.contentResolver, uri))
                } else {
                    @Suppress("DEPRECATION")
                    MediaStore.Images.Media.getBitmap(context.contentResolver, uri)
                }
                previewBitmap = bitmap
                saveSuccessMessage = null
                aiAdvisorViewModel.scanReceipt(bitmap)
            } catch (e: Exception) {
                // error decoding
            }
        }
    }

    // Camera Capture Preview
    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap: Bitmap? ->
        if (bitmap != null) {
            previewBitmap = bitmap
            saveSuccessMessage = null
            aiAdvisorViewModel.scanReceipt(bitmap)
        }
    }

    LaunchedEffect(scanState) {
        if (scanState is ReceiptScanState.Success) {
            val s = scanState as ReceiptScanState.Success
            merchant = s.merchant
            amount = s.amount
            category = s.category
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            "Scan & Extract Receipts",
            style = Typography.titleMedium,
            color = Color.White,
            fontWeight = FontWeight.Bold
        )
        Text(
            "Take a picture or pick a receipt from your gallery. Gemini AI will automatically detect the merchant, amount, and category for your confirmation.",
            style = Typography.bodyMedium,
            color = DrvMuted
        )

        // Action Buttons Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = { cameraLauncher.launch(null) },
                colors = ButtonDefaults.buttonColors(containerColor = DrvPrimary),
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.CameraAlt, contentDescription = "Camera", modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Take Photo")
            }

            OutlinedButton(
                onClick = { galleryLauncher.launch("image/*") },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Image, contentDescription = "Gallery", modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Pick Image")
            }
        }

        // Image Preview if captured
        if (previewBitmap != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(GlassBg)
                    .border(1.dp, GlassBorderStart, RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    bitmap = previewBitmap!!.asImageBitmap(),
                    contentDescription = "Receipt Preview",
                    modifier = Modifier.fillMaxSize()
                )
            }
        }

        // Scan Status
        when (val state = scanState) {
            is ReceiptScanState.Loading -> {
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator(color = DrvPrimary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Extracting receipt data with Gemini AI...", color = DrvMuted, style = Typography.bodySmall)
                    }
                }
            }
            is ReceiptScanState.Error -> {
                Text(state.message, color = DrvExpense, style = Typography.bodyMedium)
            }
            is ReceiptScanState.Success -> {
                Text("✅ Receipt data extracted! Verify and save below:", color = DrvIncome, fontWeight = FontWeight.Bold, style = Typography.bodyMedium)

                OutlinedTextField(
                    value = merchant,
                    onValueChange = { merchant = it },
                    label = { Text("Merchant / Store Name") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = GlassBorderStart
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = amount,
                    onValueChange = { amount = it },
                    label = { Text("Total Amount (₹)") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = GlassBorderStart
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = category,
                    onValueChange = { category = it },
                    label = { Text("Category") },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = DrvPrimary,
                        unfocusedBorderColor = GlassBorderStart
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Button(
                    onClick = {
                        val amt = amount.toDoubleOrNull() ?: 0.0
                        if (merchant.isNotBlank() && amt > 0.0) {
                            transactionViewModel.addTransaction(
                                Transaction(
                                    merchant = merchant.trim(),
                                    amount = amt,
                                    category = category.trim(),
                                    isExpense = true,
                                    source = "Receipt Scan",
                                    notes = notes
                                )
                            )
                            saveSuccessMessage = "Transaction for $merchant saved successfully!"
                            aiAdvisorViewModel.resetReceiptScanState()
                            previewBitmap = null
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = DrvIncome),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Check, contentDescription = "Save", modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Save to Transactions", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
            else -> {}
        }

        if (saveSuccessMessage != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DrvIncome.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Text(saveSuccessMessage ?: "", color = DrvIncome, style = Typography.bodyMedium)
            }
        }

        Spacer(modifier = Modifier.height(90.dp))
    }
}
