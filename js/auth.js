// ==========================================
// EDGE AI CYBER TERMINAL AUTHENTICATION
// v2: SHA-256 Hashing, Rate Limiting, Smart Hints
// ==========================================

// --- Storage Keys ---
const STORAGE_AUTH_SESSION = "mr_thai_auth_session_v1";
const STORAGE_AUTH_PASSCODE = "mr_thai_auth_passcode_v2"; // v2 = SHA-256 hashed
const STORAGE_AUTH_USERNAME = "mr_thai_auth_username_v1";
const STORAGE_AUTH_CUSTOM_PWD = "mr_thai_auth_custom_pwd_v1";

const DEFAULT_AUTH_PASSCODE = "123456";
const DEFAULT_AUTH_USERNAME = "Mr. Thai";

// --- Rate Limiting Config ---
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;
let failedLoginAttempts = 0;
let lockoutEndTime = 0;
let lockoutInterval = null;

// ==========================================
// SHA-256 Password Hashing (Web Crypto API)
// ==========================================
async function hashPasscode(passcode) {
    const encoder = new TextEncoder();
    const data = encoder.encode(passcode);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ==========================================
// Migration: v1 (plain-text) → v2 (SHA-256)
// Chạy 1 lần duy nhất khi user đã có dữ liệu cũ
// ==========================================
async function migratePasscodeIfNeeded() {
    const OLD_KEY = "mr_thai_auth_passcode_v1";
    const oldPlainText = localStorage.getItem(OLD_KEY);
    const alreadyMigrated = localStorage.getItem(STORAGE_AUTH_PASSCODE);

    if (oldPlainText && !alreadyMigrated) {
        // Hash mật khẩu cũ (plain-text) sang SHA-256
        const hashed = await hashPasscode(oldPlainText);
        localStorage.setItem(STORAGE_AUTH_PASSCODE, hashed);
        localStorage.setItem(STORAGE_AUTH_CUSTOM_PWD, "true");
        localStorage.removeItem(OLD_KEY);
    }
}

// ==========================================
// Passcode Storage Helpers
// ==========================================
async function getStoredPasscodeHash() {
    const stored = localStorage.getItem(STORAGE_AUTH_PASSCODE);
    if (stored) return stored;
    // Lần đầu tiên: hash mật khẩu mặc định và lưu
    const defaultHash = await hashPasscode(DEFAULT_AUTH_PASSCODE);
    localStorage.setItem(STORAGE_AUTH_PASSCODE, defaultHash);
    return defaultHash;
}

function hasCustomPassword() {
    return localStorage.getItem(STORAGE_AUTH_CUSTOM_PWD) === "true";
}

function isUserAuthenticated() {
    return localStorage.getItem(STORAGE_AUTH_SESSION) === "true" ||
           sessionStorage.getItem(STORAGE_AUTH_SESSION) === "true";
}

function getStoredUsername() {
    return localStorage.getItem(STORAGE_AUTH_USERNAME) || DEFAULT_AUTH_USERNAME;
}

// ==========================================
// Rate Limiting — Chống Brute-force
// ==========================================
function isLockedOut() {
    return lockoutEndTime > Date.now();
}

function getRemainingLockoutSec() {
    return Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000));
}

function triggerLockout() {
    lockoutEndTime = Date.now() + LOCKOUT_SECONDS * 1000;
    const submitBtn = document.getElementById("auth-btn-submit");

    if (lockoutInterval) clearInterval(lockoutInterval);
    lockoutInterval = setInterval(() => {
        const sec = getRemainingLockoutSec();
        if (sec <= 0) {
            clearInterval(lockoutInterval);
            lockoutInterval = null;
            failedLoginAttempts = 0;
            lockoutEndTime = 0;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>⚡ XÁC THỰC &amp; MỞ KHÓA // UNLOCK</span>`;
            }
            showAuthAlert("🔓 Đã mở khóa. Bạn có thể thử lại.", "info");
            return;
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>🔒 Đã khóa — thử lại sau ${sec}s</span>`;
        }
    }, 1000);

    showAuthAlert(`🚫 Quá ${MAX_LOGIN_ATTEMPTS} lần sai! Khóa ${LOCKOUT_SECONDS} giây.`, "error");
}

// ==========================================
// Initialize Auth Gate
// ==========================================
async function initAuthGate() {
    // Migrate mật khẩu cũ (plain-text → hashed) nếu cần
    await migratePasscodeIfNeeded();

    const overlay = document.getElementById("auth-overlay");
    if (!overlay) return;

    // Ẩn hint mật khẩu mặc định nếu user đã đổi
    const hint = document.getElementById("auth-default-hint");
    if (hint && hasCustomPassword()) {
        hint.style.display = "none";
    }

    if (isUserAuthenticated()) {
        overlay.classList.add("auth-hidden");
    } else {
        overlay.classList.remove("auth-hidden");
        const userInput = document.getElementById("auth-username");
        const pwdInput = document.getElementById("auth-passcode");
        if (userInput) userInput.value = getStoredUsername();
        if (pwdInput) {
            pwdInput.value = "";
            setTimeout(() => pwdInput.focus(), 200);
        }
    }
}

// ==========================================
// Handle Form Submission (Async + Hashed)
// ==========================================
async function handleAuthSubmit(event) {
    if (event) event.preventDefault();

    // Kiểm tra rate limit
    if (isLockedOut()) {
        showAuthAlert(`🔒 Hệ thống đang khóa. Đợi ${getRemainingLockoutSec()}s.`, "error");
        return;
    }

    const userInput = document.getElementById("auth-username");
    const pwdInput = document.getElementById("auth-passcode");
    const rememberCheckbox = document.getElementById("auth-remember");
    const authCard = document.querySelector(".auth-card");
    const submitBtn = document.getElementById("auth-btn-submit");

    const username = (userInput ? userInput.value.trim() : "") || DEFAULT_AUTH_USERNAME;
    const passcode = pwdInput ? pwdInput.value : "";

    // Reset UI trạng thái trước
    if (authCard) authCard.classList.remove("auth-shake", "auth-success");

    if (!passcode) {
        showAuthAlert("⚠️ Vui lòng nhập mật khẩu truy cập!", "error");
        if (authCard) authCard.classList.add("auth-shake");
        if (pwdInput) pwdInput.focus();
        return;
    }

    // Hash input và so sánh với hash đã lưu
    const inputHash = await hashPasscode(passcode);
    const storedHash = await getStoredPasscodeHash();

    if (inputHash === storedHash) {
        // ✅ Xác thực thành công
        failedLoginAttempts = 0;
        const rememberMe = rememberCheckbox ? rememberCheckbox.checked : true;
        if (rememberMe) {
            localStorage.setItem(STORAGE_AUTH_SESSION, "true");
        } else {
            sessionStorage.setItem(STORAGE_AUTH_SESSION, "true");
            localStorage.removeItem(STORAGE_AUTH_SESSION);
        }

        localStorage.setItem(STORAGE_AUTH_USERNAME, username);

        // Cập nhật UI
        if (authCard) authCard.classList.add("auth-success");
        if (submitBtn) {
            submitBtn.innerHTML = `<span>⚡ ĐÃ XÁC THỰC // ĐANG MỞ HỆ THỐNG...</span>`;
            submitBtn.style.background = "linear-gradient(135deg, #00ff9d 0%, #00b06f 100%)";
            submitBtn.disabled = true;
        }

        showAuthAlert(`✅ ACCESS GRANTED // Chào mừng Kỹ sư ${username}!`, "success");
        // Play system boot SFX on successful auth
        if (typeof AudioEngine !== 'undefined') AudioEngine.playSFX('boot');

        // Cập nhật brand telemetry
        const telemetry = document.querySelector(".brand-telemetry");
        if (telemetry) {
            telemetry.textContent = `SYSTEM ONLINE • ESP32-S3 CORE • ${username.toUpperCase()}`;
        }

        setTimeout(() => {
            const overlay = document.getElementById("auth-overlay");
            if (overlay) overlay.classList.add("auth-hidden");
            if (submitBtn) {
                submitBtn.innerHTML = `<span>⚡ XÁC THỰC &amp; MỞ KHÓA // UNLOCK</span>`;
                submitBtn.style.background = "";
                submitBtn.disabled = false;
            }
        }, 600);
    } else {
        // ❌ Sai mật khẩu
        failedLoginAttempts++;

        if (authCard) {
            authCard.classList.add("auth-shake");
            setTimeout(() => authCard.classList.remove("auth-shake"), 500);
        }

        const remaining = MAX_LOGIN_ATTEMPTS - failedLoginAttempts;
        if (failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
            triggerLockout();
        } else {
            showAuthAlert(`❌ Mật khẩu không đúng! Còn ${remaining} lần thử trước khi bị khóa.`, "error");
        }

        if (pwdInput) {
            pwdInput.select();
            pwdInput.focus();
        }
    }
}

// ==========================================
// Show Alert Message
// ==========================================
function showAuthAlert(msg, type) {
    const alertBox = document.getElementById("auth-alert");
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `auth-alert show auth-alert-${type}`;
}

// ==========================================
// Toggle Password Visibility
// ==========================================
function toggleAuthPasswordVisibility() {
    const pwdInput = document.getElementById("auth-passcode");
    const toggleBtn = document.getElementById("auth-toggle-pwd-btn");
    if (!pwdInput) return;

    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        if (toggleBtn) toggleBtn.textContent = "🔒";
    } else {
        pwdInput.type = "password";
        if (toggleBtn) toggleBtn.textContent = "👁️";
    }
}

// ==========================================
// Change Passcode (Async + SHA-256 Hashed)
// ==========================================
async function promptChangePasscode() {
    const oldInput = prompt("Nhập mật khẩu hiện tại:");
    if (oldInput === null) return;

    const oldHash = await hashPasscode(oldInput);
    const storedHash = await getStoredPasscodeHash();

    if (oldHash !== storedHash) {
        alert("❌ Mật khẩu hiện tại không đúng!");
        return;
    }

    const newPasscode = prompt("Nhập mật khẩu mới (tối thiểu 4 ký tự):");
    if (!newPasscode) {
        alert("⚠️ Mật khẩu không được để trống!");
        return;
    }

    if (newPasscode.trim().length < 4) {
        alert("⚠️ Mật khẩu quá ngắn, vui lòng nhập ít nhất 4 ký tự!");
        return;
    }

    const newHash = await hashPasscode(newPasscode.trim());
    localStorage.setItem(STORAGE_AUTH_PASSCODE, newHash);
    localStorage.setItem(STORAGE_AUTH_CUSTOM_PWD, "true");

    // Ẩn hint mật khẩu mặc định
    const hint = document.getElementById("auth-default-hint");
    if (hint) hint.style.display = "none";

    alert("✅ Đổi mật khẩu thành công!\nMật khẩu đã được mã hóa SHA-256 và lưu an toàn.");
}

// ==========================================
// Logout / Lock Hub
// ==========================================
function handleLogout() {
    localStorage.removeItem(STORAGE_AUTH_SESSION);
    sessionStorage.removeItem(STORAGE_AUTH_SESSION);

    const overlay = document.getElementById("auth-overlay");
    if (overlay) {
        overlay.classList.remove("auth-hidden");
        const pwdInput = document.getElementById("auth-passcode");
        const alertBox = document.getElementById("auth-alert");
        const authCard = document.querySelector(".auth-card");
        if (alertBox) alertBox.className = "auth-alert";
        if (authCard) authCard.classList.remove("auth-success", "auth-shake");
        if (pwdInput) {
            pwdInput.value = "";
            setTimeout(() => pwdInput.focus(), 250);
        }
    }
}

// ==========================================
// Self-initialize on DOM Ready
// ==========================================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuthGate);
} else {
    initAuthGate();
}
