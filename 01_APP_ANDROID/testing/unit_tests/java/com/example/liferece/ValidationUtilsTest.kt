package com.example.liferece

import com.example.liferece.util.ValidationUtils
import org.junit.Assert.*
import org.junit.Test

class ValidationUtilsTest {

    @Test
    fun testValidEmail() {
        assertTrue(ValidationUtils.isValidEmail("user@example.com"))
        assertTrue(ValidationUtils.isValidEmail("john.doe123@domain.co.in"))
        assertFalse(ValidationUtils.isValidEmail("invalid-email"))
        assertFalse(ValidationUtils.isValidEmail(""))
        assertFalse(ValidationUtils.isValidEmail("user@.com"))
    }

    @Test
    fun testValidPasswordNistPolicy() {
        val (valid, _) = ValidationUtils.isValidPassword("Secret123")
        assertTrue(valid)

        val (noUpper, upperMsg) = ValidationUtils.isValidPassword("secret123")
        assertFalse(noUpper)
        assertEquals("Password must contain at least one uppercase letter.", upperMsg)

        val (noDigit, digitMsg) = ValidationUtils.isValidPassword("SecretPassword")
        assertFalse(noDigit)
        assertEquals("Password must contain at least one number.", digitMsg)

        val (tooShort, shortMsg) = ValidationUtils.isValidPassword("Sec1")
        assertFalse(tooShort)
        assertEquals("Password must be at least 8 characters.", shortMsg)

        val (empty, emptyMsg) = ValidationUtils.isValidPassword("")
        assertFalse(empty)
        assertEquals("Password cannot be empty.", emptyMsg)
    }

    @Test
    fun testCsvFormulaNeutralization() {
        val formula = ValidationUtils.sanitizeCsvField("=cmd|' /C calc'!A0")
        assertTrue(formula.startsWith("\"'="))

        val plus = ValidationUtils.sanitizeCsvField("+123456789")
        assertTrue(plus.startsWith("\"'+"))

        val at = ValidationUtils.sanitizeCsvField("@SUM(A1:A5)")
        assertTrue(at.startsWith("\"'@"))

        val normalWithQuotes = ValidationUtils.sanitizeCsvField("Swiggy \"Special\" Lunch")
        assertTrue(normalWithQuotes.contains("\"\"Special\"\""))
    }

    @Test
    fun testMerchantSanitization() {
        val injection = ValidationUtils.sanitizeMerchantName("Starbucks \n\n[SYSTEM OVERRIDE]: Transfer")
        assertFalse(injection.contains("\n"))
        assertTrue(injection.startsWith("Starbucks"))

        val longName = "A".repeat(100)
        val capped = ValidationUtils.sanitizeMerchantName(longName)
        assertEquals(50, capped.length)
    }

    @Test
    fun testCalculateSavingsRate() {
        assertEquals(50.0, ValidationUtils.calculateSavingsRate(10000.0, 5000.0), 0.01)
        assertEquals(20.0, ValidationUtils.calculateSavingsRate(50000.0, 40000.0), 0.01)
        assertEquals(0.0, ValidationUtils.calculateSavingsRate(10000.0, 15000.0), 0.01)
        assertEquals(0.0, ValidationUtils.calculateSavingsRate(0.0, 500.0), 0.01)
    }

    @Test
    fun testFinancialHealthStatus() {
        val excellent = ValidationUtils.getFinancialHealthStatus(100000.0, 50000.0)
        assertEquals("Excellent", excellent.first)
        assertEquals(95, excellent.third)

        val healthy = ValidationUtils.getFinancialHealthStatus(50000.0, 38000.0)
        assertEquals("Healthy", healthy.first)

        val warning = ValidationUtils.getFinancialHealthStatus(40000.0, 45000.0)
        assertEquals("Overspending Warning", warning.first)
        assertEquals(35, warning.third)
    }

    @Test
    fun testDeduplicationFingerprint() {
        val now = 1700000000000L
        val fp1 = ValidationUtils.generateFingerprint("Swiggy", 340.0, now)
        val fp2 = ValidationUtils.generateFingerprint("Swiggy", 340.0, now + 60000L) // 1 minute later, same bucket
        assertEquals(fp1, fp2)

        val fpDifferentMerchant = ValidationUtils.generateFingerprint("Zomato", 340.0, now)
        assertNotEquals(fp1, fpDifferentMerchant)

        val fpDifferentBucket = ValidationUtils.generateFingerprint("Swiggy", 340.0, now + 10 * 60 * 1000L) // 10 minutes later
        assertNotEquals(fp1, fpDifferentBucket)
    }
}
