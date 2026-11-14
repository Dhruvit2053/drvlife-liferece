package com.example.liferece

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.liferece.data.repository.BudgetRepository
import com.example.liferece.model.Budget
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class BudgetViewModel(
    private val repository: BudgetRepository = BudgetRepository()
) : ViewModel() {

    private val _budgets = MutableStateFlow<List<Budget>>(emptyList())
    val budgets: StateFlow<List<Budget>> = _budgets.asStateFlow()

    init {
        viewModelScope.launch {
            repository.getBudgetsFlow().collect {
                _budgets.value = it
            }
        }
    }

    fun saveBudget(budget: Budget, onComplete: ((Boolean) -> Unit)? = null) {
        viewModelScope.launch {
            val res = repository.saveBudget(budget)
            onComplete?.invoke(res.isSuccess)
        }
    }

    fun deleteBudget(budgetId: String, onComplete: ((Boolean) -> Unit)? = null) {
        viewModelScope.launch {
            val res = repository.deleteBudget(budgetId)
            onComplete?.invoke(res.isSuccess)
        }
    }
}

