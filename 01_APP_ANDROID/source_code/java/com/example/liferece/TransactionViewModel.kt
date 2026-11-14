package com.example.liferece

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.liferece.data.repository.TransactionRepository
import com.example.liferece.model.Transaction
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Calendar

data class TransactionFilter(
    val query: String = "",
    val category: String = "All",
    val type: String = "All",
    val dateRange: String = "All",
    val sortOption: String = "Newest"
)

class TransactionViewModel(
    private val repository: TransactionRepository = TransactionRepository()
) : ViewModel() {

    private val _rawTransactions = MutableStateFlow<List<Transaction>>(emptyList())
    val transactions: StateFlow<List<Transaction>> = _rawTransactions.asStateFlow()

    val searchQuery = MutableStateFlow("")
    val selectedCategory = MutableStateFlow("All")
    val selectedType = MutableStateFlow("All") // "All", "Expense", "Income"
    val selectedDateRange = MutableStateFlow("All") // "All", "Today", "This Week", "This Month"
    val sortOption = MutableStateFlow("Newest") // "Newest", "Oldest", "Highest", "Lowest"

    private val filterCriteria: Flow<TransactionFilter> = combine(
        searchQuery,
        selectedCategory,
        selectedType,
        combine(selectedDateRange, sortOption) { range, sort -> Pair(range, sort) }
    ) { query, cat, type, rangeSortPair ->
        TransactionFilter(
            query = query,
            category = cat,
            type = type,
            dateRange = rangeSortPair.first,
            sortOption = rangeSortPair.second
        )
    }

    val filteredTransactions: StateFlow<List<Transaction>> = combine(
        _rawTransactions,
        filterCriteria
    ) { txList, filter ->
        var list = txList

        // Search query filter
        if (filter.query.isNotBlank()) {
            val q = filter.query.trim().lowercase()
            list = list.filter {
                it.merchant.lowercase().contains(q) ||
                it.category.lowercase().contains(q) ||
                it.notes.lowercase().contains(q)
            }
        }

        // Category filter
        if (filter.category != "All") {
            list = list.filter { it.category.equals(filter.category, ignoreCase = true) }
        }

        // Type filter
        when (filter.type) {
            "Expense" -> list = list.filter { it.isExpense }
            "Income" -> list = list.filter { !it.isExpense }
        }

        // Date range filter
        val now = Calendar.getInstance()
        when (filter.dateRange) {
            "Today" -> {
                val startOfDay = now.apply {
                    set(Calendar.HOUR_OF_DAY, 0)
                    set(Calendar.MINUTE, 0)
                    set(Calendar.SECOND, 0)
                    set(Calendar.MILLISECOND, 0)
                }.timeInMillis
                list = list.filter { it.timestamp >= startOfDay }
            }
            "This Week" -> {
                val startOfWeek = now.apply {
                    set(Calendar.DAY_OF_WEEK, firstDayOfWeek)
                    set(Calendar.HOUR_OF_DAY, 0)
                    set(Calendar.MINUTE, 0)
                    set(Calendar.SECOND, 0)
                    set(Calendar.MILLISECOND, 0)
                }.timeInMillis
                list = list.filter { it.timestamp >= startOfWeek }
            }
            "This Month" -> {
                val startOfMonth = now.apply {
                    set(Calendar.DAY_OF_MONTH, 1)
                    set(Calendar.HOUR_OF_DAY, 0)
                    set(Calendar.MINUTE, 0)
                    set(Calendar.SECOND, 0)
                    set(Calendar.MILLISECOND, 0)
                }.timeInMillis
                list = list.filter { it.timestamp >= startOfMonth }
            }
        }

        // Sort option
        when (filter.sortOption) {
            "Newest" -> list.sortedByDescending { it.timestamp }
            "Oldest" -> list.sortedBy { it.timestamp }
            "Highest" -> list.sortedByDescending { it.amount }
            "Lowest" -> list.sortedBy { it.amount }
            else -> list
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Metrics for Home Dashboard
    val totalExpense: StateFlow<Double> = _rawTransactions.map { list ->
        list.filter { it.isExpense }.sumOf { it.amount }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val totalIncome: StateFlow<Double> = _rawTransactions.map { list ->
        list.filter { !it.isExpense }.sumOf { it.amount }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val totalBalance: StateFlow<Double> = combine(totalIncome, totalExpense) { inc, exp ->
        inc - exp
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    val categoryBreakdown: StateFlow<Map<String, Double>> = _rawTransactions.map { list ->
        list.filter { it.isExpense }
            .groupBy { it.category }
            .mapValues { entry -> entry.value.sumOf { it.amount } }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyMap())

    init {
        viewModelScope.launch {
            repository.getTransactionsFlow().collect { list ->
                _rawTransactions.value = list
            }
        }
    }

    fun addTransaction(tx: Transaction, onComplete: ((Boolean) -> Unit)? = null) {
        viewModelScope.launch {
            val result = repository.addTransaction(tx)
            onComplete?.invoke(result.isSuccess)
        }
    }

    fun updateTransaction(tx: Transaction, onComplete: ((Boolean) -> Unit)? = null) {
        viewModelScope.launch {
            val result = repository.updateTransaction(tx)
            onComplete?.invoke(result.isSuccess)
        }
    }

    fun deleteTransaction(transactionId: String, onComplete: ((Boolean) -> Unit)? = null) {
        viewModelScope.launch {
            val result = repository.deleteTransaction(transactionId)
            onComplete?.invoke(result.isSuccess)
        }
    }
}
