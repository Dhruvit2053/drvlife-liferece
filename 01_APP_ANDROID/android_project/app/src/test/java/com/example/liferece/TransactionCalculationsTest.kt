package com.example.liferece

import com.example.liferece.model.Transaction
import org.junit.Assert.*
import org.junit.Test

class TransactionCalculationsTest {

    @Test
    fun testTransactionTotalsCalculation() {
        val transactions = listOf(
            Transaction("1", "Salary", 50000.0, 1000L, "Salary", isExpense = false),
            Transaction("2", "Rent", 12000.0, 2000L, "Bills", isExpense = true),
            Transaction("3", "Groceries", 3500.0, 3000L, "Food", isExpense = true),
            Transaction("4", "Freelance", 8000.0, 4000L, "Income", isExpense = false),
            Transaction("5", "Dinner", 850.0, 5000L, "Food", isExpense = true)
        )

        val totalIncome = transactions.filter { !it.isExpense }.sumOf { it.amount }
        val totalExpense = transactions.filter { it.isExpense }.sumOf { it.amount }
        val netBalance = totalIncome - totalExpense

        assertEquals(58000.0, totalIncome, 0.01)
        assertEquals(16350.0, totalExpense, 0.01)
        assertEquals(41650.0, netBalance, 0.01)

        val categoryFood = transactions.filter { it.category == "Food" }.sumOf { it.amount }
        assertEquals(4350.0, categoryFood, 0.01)
    }

    @Test
    fun testBudgetUtilization() {
        val limit = 5000.0
        val spent = 4250.0
        val utilization = (spent / limit) * 100.0
        val remaining = limit - spent

        assertEquals(85.0, utilization, 0.01)
        assertEquals(750.0, remaining, 0.01)
        assertTrue(utilization > 80.0)
    }
}

