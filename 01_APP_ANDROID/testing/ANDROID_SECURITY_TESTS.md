# DRVLIFE (LIFERECE) — ANDROID SECURITY TEST REPORT

**Test Execution Date**: November 13, 2026  
**Auditor**: Lead Android Security Engineer & QA Lead  
**Package Under Test**: `com.example.liferece`  
**Test Target**: Android 16 / VanillaIceCream (API 36) on AVD `Medium_Phone`  
**Binary Tested**: `app-debug.apk` (Size: `30,055,659 bytes`, SHA-256: `D976EAD8A0669EE5A3E196DCD77F70EE835D9DD78C01345DA99AF5C4370C47D6`)  

---

## 1. AUTOMATED UNIT & SECURITY TEST RESULTS

All security-related unit tests were executed via `./gradlew testDebugUnitTest`.

```
BUILD SUCCESSFUL in 37s
25 actionable tasks: 2 executed, 23 up-to-date
```

### Detailed Test Results: `com.example.liferece.ValidationUtilsTest`

| Test Case Name | Target Security Vector | Status | Verification Evidence |
| :--- | :--- | :---: | :--- |
| `testValidPasswordNistPolicy` | Password Complexity (8+ chars, digit, uppercase) | **PASS** | Blocked `secret123`, `SecretPassword`, `Sec1`, `""`; allowed `Secret123`. |
| `testCsvFormulaNeutralization` | CSV Formula / DDE Injection Neutralization | **PASS** | Inputs `=cmd|...`, `+123...`, `@SUM(...)` prepended with `'`; quotes escaped. |
| `testMerchantSanitization` | Notification & Merchant Prompt Injection | **PASS** | Stripped `\n`, `\r`, `\t` from injection strings; capped at 50 chars. |
| `testDeduplicationFingerprint` | Transaction Deduplication Integrity | **PASS** | SHA-256 fingerprint generated correctly across time windows. |
| `testValidEmail` | Email Format Validation | **PASS** | RFC-compliant email regex validated. |
| `testCalculateSavingsRate` | Financial Math Integrity | **PASS** | Zero-division protected, math verified. |
| `testFinancialHealthStatus` | Budget Scoring Integrity | **PASS** | Categorized into Excellent, Healthy, Warning thresholds. |

---

## 2. MANIFEST & OS-LEVEL PERMISSION AUDIT

### 2.1 Manifest Security Flags Inspection
Inspected via `D:/Liferece/app/src/main/AndroidManifest.xml`:
* `android:allowBackup`: Verified **`false`**. ADB backups disabled.
* `android:exported="false"` on `androidx.core.content.FileProvider`.
* `android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"` enforced on `UpiNotificationListenerService`.

### 2.2 Live Emulator Process Verification
* **Device**: AVD `Medium_Phone` (Android 16, API 36)
* **Boot Completion**: Verified `sys.boot_completed = 1`
* **Process Metrics**:
  - `PID`: `26458`
  - `User`: `u0_a226`
  - `RSS Memory`: `56,080 KB` (~56 MB)
  - `Process State`: `R (Running)`
* **Crash Verification**: Zero uncaught exceptions; zero `AndroidRuntime:E` fatal crashes during lifecycle tests (fresh launch, force-stop, relaunch).

### 2.3 Notification Listener Security
* Verified via `dumpsys notification --listeners`:
  `ComponentInfo{com.example.liferece/com.example.liferece.service.UpiNotificationListenerService}` is an active bound listener authorized by Android Notification Manager.
* Privacy shield in `UpiNotificationListenerService.kt` drops all notifications matching:
  `["otp", "one time password", "verification code", "secret code", "security pin", "do not share", "login alert", "password reset", "two-factor"]`.

