package com.example.liferece

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import android.content.Context
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.example.liferece.ui.theme.*
import com.google.firebase.auth.FirebaseAuth

enum class Screen {
    LOGIN,
    REGISTER
}

class MainActivity : ComponentActivity() {
    private val hasNotificationAccess = mutableStateOf(false)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val sharedPrefs = getSharedPreferences("liferece_prefs", Context.MODE_PRIVATE)

        setContent {
            DrvLifeTheme {
                val auth = FirebaseAuth.getInstance()
                var currentUser by remember { mutableStateOf(auth.currentUser) }
                var currentScreen by remember { mutableStateOf(Screen.LOGIN) }

                DisposableEffect(auth) {
                    val listener = FirebaseAuth.AuthStateListener { firebaseAuth ->
                        currentUser = firebaseAuth.currentUser
                    }
                    auth.addAuthStateListener(listener)
                    onDispose {
                        auth.removeAuthStateListener(listener)
                    }
                }

                val isPermissionGranted by hasNotificationAccess

                AnimatedGradientBackground(modifier = Modifier.fillMaxSize()) {
                    val user = currentUser
                    if (user == null) {
                        if (currentScreen == Screen.LOGIN) {
                            LoginScreen(
                                onLoginSuccess = { /* Firebase auth listener will trigger switch */ },
                                onNavigateToRegister = { currentScreen = Screen.REGISTER }
                            )
                        } else {
                            RegisterScreen(
                                onRegisterSuccess = { /* Firebase auth listener will trigger switch */ },
                                onNavigateToLogin = { currentScreen = Screen.LOGIN }
                            )
                        }
                    } else {
                        val uid = user.uid
                        var showOnboarding by remember(uid) {
                            mutableStateOf(sharedPrefs.getBoolean("show_onboarding_$uid", true))
                        }
                        var isAutoSyncEnabled by remember(uid) {
                            mutableStateOf(sharedPrefs.getBoolean("auto_sync_enabled_$uid", false))
                        }

                        if (showOnboarding) {
                            OnboardingScreen(
                                isNotificationAccessEnabled = isPermissionGranted,
                                onRequestNotificationAccess = { openNotificationSettings() },
                                onFinished = { name, income, autoSync ->
                                    isAutoSyncEnabled = autoSync
                                    sharedPrefs.edit()
                                        .putString("user_name_$uid", name)
                                        .putString("user_income_$uid", income)
                                        .putBoolean("auto_sync_enabled_$uid", autoSync)
                                        .putBoolean("show_onboarding_$uid", false)
                                        .apply()
                                    showOnboarding = false
                                }
                            )
                        } else {
                            MainScreen(
                                isNotificationAccessEnabled = isPermissionGranted,
                                isAutoSyncEnabled = isAutoSyncEnabled,
                                onToggleAutoSync = { enabled ->
                                    isAutoSyncEnabled = enabled
                                    sharedPrefs.edit().putBoolean("auto_sync_enabled_$uid", enabled).apply()
                                    if (enabled && !isPermissionGranted) {
                                        openNotificationSettings()
                                    }
                                },
                                onRequestNotificationAccess = { openNotificationSettings() },
                                onLogout = {
                                    auth.signOut()
                                    currentScreen = Screen.LOGIN
                                }
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        hasNotificationAccess.value = isNotificationServiceEnabled()
    }

    private fun isNotificationServiceEnabled(): Boolean {
        val flat = android.provider.Settings.Secure.getString(contentResolver, "enabled_notification_listeners")
        return flat?.contains(packageName) == true
    }

    private fun openNotificationSettings() {
        try {
            val intent = android.content.Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
            startActivity(intent)
        } catch (e: Exception) {
            val intent = android.content.Intent(android.provider.Settings.ACTION_SETTINGS)
            startActivity(intent)
        }
    }
}
