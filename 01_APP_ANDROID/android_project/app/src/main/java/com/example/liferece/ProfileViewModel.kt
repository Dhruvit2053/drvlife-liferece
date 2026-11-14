package com.example.liferece

import android.content.Context
import android.graphics.Color as AndroidColor
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.util.Log
import androidx.core.content.FileProvider
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.liferece.data.repository.UserRepository
import com.example.liferece.model.Transaction
import com.example.liferece.model.UserProfile
import com.example.liferece.util.ValidationUtils
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ProfileViewModel(
    private val repository: UserRepository = UserRepository()
) : ViewModel() {

    private val _userProfile = MutableStateFlow<UserProfile?>(null)
    val userProfile: StateFlow<UserProfile?> = _userProfile.asStateFlow()

    init {
        viewModelScope.launch {
            repository.getUserProfileFlow().collect {
                _userProfile.value = it
            }
        }
    }

    fun updateProfile(name: String, income: Double, onComplete: ((Boolean) -> Unit)? = null) {
        val current = _userProfile.value ?: return
        val updated = current.copy(name = name, monthlyIncome = income)
        viewModelScope.launch {
            val res = repository.saveUserProfile(updated)
            onComplete?.invoke(res.isSuccess)
        }
    }

    fun toggleAutoSync(enabled: Boolean, onComplete: ((Boolean) -> Unit)? = null) {
        val current = _userProfile.value ?: return
        val updated = current.copy(autoSyncEnabled = enabled)
        viewModelScope.launch {
            val res = repository.saveUserProfile(updated)
            onComplete?.invoke(res.isSuccess)
        }
    }

    fun sendPasswordReset(email: String, onResult: (Boolean, String?) -> Unit) {
        viewModelScope.launch {
            val res = repository.sendPasswordResetEmail(email)
            if (res.isSuccess) {
                onResult(true, "Password reset link sent to your email.")
            } else {
                onResult(false, res.exceptionOrNull()?.localizedMessage ?: "Failed to send reset link.")
            }
        }
    }

    fun deleteAccount(onResult: (Boolean, String?) -> Unit) {
        viewModelScope.launch {
            val res = repository.deleteAccount()
            if (res.isSuccess) {
                onResult(true, null)
            } else {
                onResult(false, res.exceptionOrNull()?.localizedMessage ?: "Failed to delete account.")
            }
        }
    }

    fun exportToCsv(context: Context, transactions: List<Transaction>): Uri? {
        return try {
            val reportsDir = File(context.cacheDir, "reports")
            if (!reportsDir.exists()) reportsDir.mkdirs()
            val file = File(reportsDir, "drvlife_transactions_${System.currentTimeMillis()}.csv")

            file.bufferedWriter().use { writer ->
                writer.write("Transaction ID,Date & Time,Merchant,Amount (INR),Type,Category,Payment Method,Source,Notes\n")
                for (tx in transactions) {
                    val type = if (tx.isExpense) "Expense" else "Income"
                    val idEsc = ValidationUtils.sanitizeCsvField(tx.id)
                    val dateEsc = ValidationUtils.sanitizeCsvField(tx.formattedDate)
                    val merchantEsc = ValidationUtils.sanitizeCsvField(tx.merchant)
                    val typeEsc = ValidationUtils.sanitizeCsvField(type)
                    val catEsc = ValidationUtils.sanitizeCsvField(tx.category)
                    val methodEsc = ValidationUtils.sanitizeCsvField(tx.paymentMethod)
                    val sourceEsc = ValidationUtils.sanitizeCsvField(tx.source)
                    val notesEsc = ValidationUtils.sanitizeCsvField(tx.notes)
                    writer.write("$idEsc,$dateEsc,$merchantEsc,${tx.amount},$typeEsc,$catEsc,$methodEsc,$sourceEsc,$notesEsc\n")
                }
            }
            FileProvider.getUriForFile(context, "com.example.liferece.fileprovider", file)
        } catch (e: Exception) {
            Log.e("ProfileViewModel", "Error exporting CSV", e)
            null
        }
    }

    fun exportToPdf(context: Context, profile: UserProfile?, transactions: List<Transaction>): Uri? {
        return try {
            val reportsDir = File(context.cacheDir, "reports")
            if (!reportsDir.exists()) reportsDir.mkdirs()
            val file = File(reportsDir, "drvlife_financial_report_${System.currentTimeMillis()}.pdf")

            val document = PdfDocument()
            val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // A4 dimensions
            val page = document.startPage(pageInfo)
            val canvas = page.canvas

            // Paints
            val titlePaint = Paint().apply {
                color = AndroidColor.parseColor("#534AB7")
                textSize = 24f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                isAntiAlias = true
            }
            val subtitlePaint = Paint().apply {
                color = AndroidColor.parseColor("#444444")
                textSize = 12f
                isAntiAlias = true
            }
            val headerPaint = Paint().apply {
                color = AndroidColor.parseColor("#14141C")
                textSize = 14f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                isAntiAlias = true
            }
            val textPaint = Paint().apply {
                color = AndroidColor.parseColor("#222222")
                textSize = 11f
                isAntiAlias = true
            }
            val greenPaint = Paint().apply {
                color = AndroidColor.parseColor("#1D9E75")
                textSize = 11f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                isAntiAlias = true
            }
            val redPaint = Paint().apply {
                color = AndroidColor.parseColor("#E24B4A")
                textSize = 11f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                isAntiAlias = true
            }
            val linePaint = Paint().apply {
                color = AndroidColor.parseColor("#E0E0E0")
                strokeWidth = 1f
            }

            var y = 50f

            // Document Header
            canvas.drawText("DrvLife — Financial Statement", 40f, y, titlePaint)
            y += 20f
            val dateStr = SimpleDateFormat("dd MMMM yyyy, hh:mm a", Locale.getDefault()).format(Date())
            canvas.drawText("Generated on: $dateStr | User: ${profile?.name ?: "Valued User"}", 40f, y, subtitlePaint)
            y += 24f
            canvas.drawLine(40f, y, 555f, y, linePaint)
            y += 28f

            // Summary Metrics
            val totalInc = transactions.filter { !it.isExpense }.sumOf { it.amount }
            val totalExp = transactions.filter { it.isExpense }.sumOf { it.amount }
            val netSavings = totalInc - totalExp
            val savingsRate = if (totalInc > 0) (netSavings / totalInc) * 100 else 0.0

            canvas.drawText("EXECUTIVE FINANCIAL SUMMARY", 40f, y, headerPaint)
            y += 20f
            canvas.drawText("Monthly Income Stated: ${ValidationUtils.formatCurrency(profile?.monthlyIncome ?: 0.0)}", 40f, y, textPaint)
            canvas.drawText("Recorded Income: ${ValidationUtils.formatCurrency(totalInc)}", 300f, y, textPaint)
            y += 18f
            canvas.drawText("Total Recorded Expenses: ${ValidationUtils.formatCurrency(totalExp)}", 40f, y, textPaint)
            canvas.drawText("Net Monthly Savings: ${ValidationUtils.formatCurrency(netSavings)} (${savingsRate.toInt()}%)", 300f, y, if (netSavings >= 0) greenPaint else redPaint)
            y += 24f
            canvas.drawLine(40f, y, 555f, y, linePaint)
            y += 28f

            // Transactions Table Header
            canvas.drawText("RECENT TRANSACTIONS BREAKDOWN", 40f, y, headerPaint)
            y += 20f
            canvas.drawText("Date", 40f, y, headerPaint)
            canvas.drawText("Merchant / Description", 130f, y, headerPaint)
            canvas.drawText("Category", 320f, y, headerPaint)
            canvas.drawText("Payment", 410f, y, headerPaint)
            canvas.drawText("Amount", 490f, y, headerPaint)
            y += 10f
            canvas.drawLine(40f, y, 555f, y, linePaint)
            y += 18f

            // Table Rows
            val sampleToDraw = transactions.take(25)
            for (tx in sampleToDraw) {
                if (y > 800f) break
                canvas.drawText(tx.dateOnly, 40f, y, textPaint)
                val merchantName = if (tx.merchant.length > 24) tx.merchant.take(22) + ".." else tx.merchant
                canvas.drawText(merchantName, 130f, y, textPaint)
                canvas.drawText(tx.category, 320f, y, textPaint)
                canvas.drawText(tx.paymentMethod, 410f, y, textPaint)
                val amtPaint = if (tx.isExpense) redPaint else greenPaint
                canvas.drawText(tx.formattedAmount, 490f, y, amtPaint)
                y += 18f
            }

            document.finishPage(page)
            val outputStream = FileOutputStream(file)
            document.writeTo(outputStream)
            outputStream.close()
            document.close()

            FileProvider.getUriForFile(context, "com.example.liferece.fileprovider", file)
        } catch (e: Exception) {
            Log.e("ProfileViewModel", "Error generating PDF", e)
            null
        }
    }
}

