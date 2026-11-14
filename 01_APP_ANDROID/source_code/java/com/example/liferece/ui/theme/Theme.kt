package com.example.liferece.ui.theme

import android.app.Activity
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = DrvPrimary,
    secondary = DrvPrimaryVariant,
    tertiary = DrvAccentLight,
    background = Color.Transparent, // Let the background gradient shine through
    surface = GlassBg,
    onPrimary = DrvText,
    onSecondary = DrvText,
    onTertiary = DrvText,
    onBackground = DrvText,
    onSurface = DrvText,
    error = DrvExpense
)

// Glassmorphism modifier applying transparent backdrops and vertical gradient borders
fun Modifier.glassCard(cornerRadius: Dp = 24.dp): Modifier = this
    .clip(RoundedCornerShape(cornerRadius))
    .background(GlassBg)
    .border(
        width = 1.dp,
        brush = Brush.verticalGradient(
            colors = listOf(
                GlassBorderStart,
                GlassBorderEnd
            )
        ),
        shape = RoundedCornerShape(cornerRadius)
    )

fun Modifier.glassCardInteractive(cornerRadius: Dp = 24.dp, isPressed: Boolean = false): Modifier = this
    .clip(RoundedCornerShape(cornerRadius))
    .background(if (isPressed) GlassBgPressed else GlassBg)
    .border(
        width = 1.dp,
        brush = Brush.verticalGradient(
            colors = listOf(
                GlassBorderStart,
                GlassBorderEnd
            )
        ),
        shape = RoundedCornerShape(cornerRadius)
    )

@Composable
fun AnimatedGradientBackground(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "backdrop")
    
    val xOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1200f,
        animationSpec = infiniteRepeatable(
            animation = tween(25000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "x"
    )
    
    val yOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1200f,
        animationSpec = infiniteRepeatable(
            animation = tween(20000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "y"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(
                        GradientBg1,
                        GradientBg2,
                        GradientBg3,
                        GradientBg4
                    ),
                    start = Offset(xOffset - 400f, yOffset - 400f),
                    end = Offset(xOffset + 800f, yOffset + 800f)
                )
            )
    ) {
        content()
    }
}

@Composable
fun DrvLifeTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // Use obsidian color for status bar to blend with gradient top edge
            window.statusBarColor = GradientBg1.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
