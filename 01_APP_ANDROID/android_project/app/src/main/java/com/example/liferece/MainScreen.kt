package com.example.liferece

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.liferece.ui.theme.*

@Composable
fun MainScreen(
    isNotificationAccessEnabled: Boolean,
    isAutoSyncEnabled: Boolean,
    onToggleAutoSync: (Boolean) -> Unit,
    onRequestNotificationAccess: () -> Unit,
    onLogout: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        bottomBar = {
            NavigationBar(
                modifier = Modifier
                    .padding(horizontal = 16.dp, vertical = 12.dp)
                    .glassCard(24.dp),
                containerColor = Color.Transparent,
                contentColor = DrvMuted,
                tonalElevation = 0.dp
            ) {
                // Tab 0: Home
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        unselectedIconColor = DrvMuted,
                        unselectedTextColor = DrvMuted,
                        indicatorColor = DrvPrimary.copy(alpha = 0.25f)
                    )
                )

                // Tab 1: Feed (Transactions)
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.List, contentDescription = "Transactions") },
                    label = { Text("Feed") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        unselectedIconColor = DrvMuted,
                        unselectedTextColor = DrvMuted,
                        indicatorColor = DrvPrimary.copy(alpha = 0.25f)
                    )
                )

                // Tab 2: AI Advisor
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "AI Advisor") },
                    label = { Text("AI") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        unselectedIconColor = DrvMuted,
                        unselectedTextColor = DrvMuted,
                        indicatorColor = DrvPrimary.copy(alpha = 0.25f)
                    )
                )

                // Tab 3: Budgets
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.AccountBalanceWallet, contentDescription = "Budgets") },
                    label = { Text("Budgets") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        unselectedIconColor = DrvMuted,
                        unselectedTextColor = DrvMuted,
                        indicatorColor = DrvPrimary.copy(alpha = 0.25f)
                    )
                )

                // Tab 4: Profile & Reports
                NavigationBarItem(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = Color.White,
                        unselectedIconColor = DrvMuted,
                        unselectedTextColor = DrvMuted,
                        indicatorColor = DrvPrimary.copy(alpha = 0.25f)
                    )
                )
            }
        },
        containerColor = Color.Transparent
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedTab) {
                0 -> DashboardScreen(
                    isNotificationAccessEnabled = isNotificationAccessEnabled,
                    isAutoSyncEnabled = isAutoSyncEnabled,
                    onToggleAutoSync = onToggleAutoSync,
                    onRequestNotificationAccess = onRequestNotificationAccess,
                    onLogout = onLogout,
                    onNavigateToFeed = { selectedTab = 1 }
                )
                1 -> TransactionsScreen()
                2 -> AiAdvisorScreen()
                3 -> BudgetScreen()
                4 -> ProfileReportsScreen(
                    isNotificationAccessEnabled = isNotificationAccessEnabled,
                    isAutoSyncEnabled = isAutoSyncEnabled,
                    onToggleAutoSync = onToggleAutoSync,
                    onRequestNotificationAccess = onRequestNotificationAccess,
                    onLogout = onLogout
                )
            }
        }
    }
}
