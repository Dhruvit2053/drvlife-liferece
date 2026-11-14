package com.example.liferece.util

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import java.io.File
import java.io.FileOutputStream
import kotlin.math.roundToInt

/**
 * Manages local receipt image storage on device.
 * 100% Free Firebase Spark Tier Architecture.
 *
 * - Images are stored strictly on-device in app-private storage.
 * - ZERO Firebase Cloud Storage dependencies or billing upgrades.
 * - ZERO Base64 strings sent to Firestore documents.
 * - High-resolution images are scaled to max 1200px and compressed to JPEG under 1 MB.
 */
object LocalReceiptManager {

    private const val MAX_DIMENSION = 1200
    private const val JPEG_QUALITY = 80
    private const val RECEIPTS_DIR = "local_receipts"

    private fun getReceiptsDir(context: Context): File {
        val dir = File(context.filesDir, RECEIPTS_DIR)
        if (!dir.exists()) {
            dir.mkdirs()
        }
        return dir
    }

    /**
     * Resizes and saves a receipt bitmap to app-private storage.
     * Returns the absolute path of the saved file.
     */
    fun saveReceiptBitmap(context: Context, transactionId: String, bitmap: Bitmap): String? {
        return try {
            val dir = getReceiptsDir(context)
            val file = File(dir, "${transactionId}.jpg")

            var width = bitmap.width
            var height = bitmap.height
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width > height) {
                    height = (height.toFloat() * MAX_DIMENSION / width).roundToInt()
                    width = MAX_DIMENSION
                } else {
                    width = (width.toFloat() * MAX_DIMENSION / height).roundToInt()
                    height = MAX_DIMENSION
                }
            }

            val scaledBitmap = if (width != bitmap.width || height != bitmap.height) {
                Bitmap.createScaledBitmap(bitmap, width, height, true)
            } else {
                bitmap
            }

            FileOutputStream(file).use { out ->
                scaledBitmap.compress(Bitmap.CompressFormat.JPEG, JPEG_QUALITY, out)
            }

            file.absolutePath
        } catch (e: Exception) {
            Log.e("LocalReceiptManager", "Error saving receipt bitmap locally", e)
            null
        }
    }

    /**
     * Checks if a receipt image exists locally on this specific physical device.
     */
    fun hasLocalReceipt(context: Context, transactionId: String): Boolean {
        val file = File(getReceiptsDir(context), "${transactionId}.jpg")
        return file.exists() && file.length() > 0
    }

    /**
     * Returns the local File if it exists on this device, or null if captured on another device.
     */
    fun getLocalReceiptFile(context: Context, transactionId: String): File? {
        val file = File(getReceiptsDir(context), "${transactionId}.jpg")
        return if (file.exists() && file.length() > 0) file else null
    }

    /**
     * Loads the bitmap from local storage if available.
     */
    fun loadLocalReceiptBitmap(context: Context, transactionId: String): Bitmap? {
        val file = getLocalReceiptFile(context, transactionId) ?: return null
        return try {
            BitmapFactory.decodeFile(file.absolutePath)
        } catch (e: Exception) {
            Log.e("LocalReceiptManager", "Error loading local receipt bitmap", e)
            null
        }
    }

    /**
     * Deletes local receipt image when transaction is deleted.
     */
    fun deleteLocalReceipt(context: Context, transactionId: String): Boolean {
        val file = File(getReceiptsDir(context), "${transactionId}.jpg")
        return if (file.exists()) file.delete() else false
    }
}

