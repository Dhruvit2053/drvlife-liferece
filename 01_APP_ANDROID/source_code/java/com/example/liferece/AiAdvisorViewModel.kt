package com.example.liferece

import android.graphics.Bitmap
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.liferece.data.repository.AiAdvisorRepository
import com.example.liferece.model.AiInsight
import com.example.liferece.model.ChatMessage
import com.example.liferece.model.Transaction
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class ReceiptScanState {
    object Idle : ReceiptScanState()
    object Loading : ReceiptScanState()
    data class Success(val merchant: String, val amount: String, val date: String, val category: String) : ReceiptScanState()
    data class Error(val message: String) : ReceiptScanState()
}

class AiAdvisorViewModel(
    private val repository: AiAdvisorRepository = AiAdvisorRepository()
) : ViewModel() {

    private val _insights = MutableStateFlow<List<AiInsight>>(emptyList())
    val insights: StateFlow<List<AiInsight>> = _insights.asStateFlow()

    private val _isAnalyzing = MutableStateFlow(false)
    val isAnalyzing: StateFlow<Boolean> = _isAnalyzing.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                id = "welcome",
                sender = "gemini",
                message = "Hello! I am your DrvLife AI Financial Advisor. Ask me anything about your spending, budget goals, or how to save more this month!"
            )
        )
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isChatGenerating = MutableStateFlow(false)
    val isChatGenerating: StateFlow<Boolean> = _isChatGenerating.asStateFlow()

    private val _receiptScanState = MutableStateFlow<ReceiptScanState>(ReceiptScanState.Idle)
    val receiptScanState: StateFlow<ReceiptScanState> = _receiptScanState.asStateFlow()

    fun analyzeFinances(income: Double, transactions: List<Transaction>) {
        if (_isAnalyzing.value) return
        _isAnalyzing.value = true
        viewModelScope.launch {
            try {
                val result = repository.analyzeFinances(income, transactions)
                _insights.value = result
            } finally {
                _isAnalyzing.value = false
            }
        }
    }

    fun sendChatMessage(userText: String, contextSummary: String) {
        if (userText.isBlank() || _isChatGenerating.value) return
        val userMsg = ChatMessage(sender = "user", message = userText.trim())
        _chatMessages.value = _chatMessages.value + userMsg
        _isChatGenerating.value = true

        viewModelScope.launch {
            try {
                val reply = repository.sendChatMessage(
                    history = _chatMessages.value,
                    userMessage = userText.trim(),
                    contextSummary = contextSummary
                )
                val aiMsg = ChatMessage(sender = "gemini", message = reply)
                _chatMessages.value = _chatMessages.value + aiMsg
            } catch (e: Exception) {
                val errorMsg = ChatMessage(
                    sender = "gemini",
                    message = "I encountered an error analyzing your request. Please try again."
                )
                _chatMessages.value = _chatMessages.value + errorMsg
            } finally {
                _isChatGenerating.value = false
            }
        }
    }

    fun scanReceipt(bitmap: Bitmap) {
        _receiptScanState.value = ReceiptScanState.Loading
        viewModelScope.launch {
            val result = repository.parseReceiptImage(bitmap)
            if (result != null) {
                _receiptScanState.value = ReceiptScanState.Success(
                    merchant = result["merchant"] ?: "Store Receipt",
                    amount = result["amount"] ?: "0",
                    date = result["date"] ?: "Today",
                    category = result["category"] ?: "Shopping"
                )
            } else {
                _receiptScanState.value = ReceiptScanState.Error("Could not extract data from the receipt image. Please try a clearer photo or enter manually.")
            }
        }
    }

    fun resetReceiptScanState() {
        _receiptScanState.value = ReceiptScanState.Idle
    }
}

