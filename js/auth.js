// ==========================================
// EDGE AI CYBER TERMINAL AUTHENTICATION
// ==========================================
const STORAGE_AUTH_SESSION = "mr_thai_auth_session_v1";
const STORAGE_AUTH_PASSCODE = "mr_thai_auth_passcode_v1";
const STORAGE_AUTH_USERNAME = "mr_thai_auth_username_v1";

const DEFAULT_AUTH_PASSCODE = "123456";
const DEFAULT_AUTH_USERNAME = "Mr. Thai";

// Check authentication state
function isUserAuthenticated() {
    return localStorage.getItem(STORAGE_AUTH_SESSION) === "true" ||
           sessionStorage.getItem(STORAGE_AUTH_SESSION) === "true";
}

function getStoredPasscode() {
    return localStorage.getItem(STORAGE_AUTH_PASSCODE) || DEFAULT_AUTH_PASSCODE;
}

function getStoredUsername() {
    return localStorage.getItem(STORAGE_AUTH_USERNAME) || DEFAULT_AUTH_USERNAME;
}

// Initialize Auth Gate
function initAuthGate() {
    const overlay = document.getElementById("auth-overlay");
    if (!overlay) return;

    if (isUserAuthenticated()) {
        overlay.classList.add("auth-hidden");
    } else {
        overlay.classList.remove("auth-hidden");
        // Prefill call sign
        const userInput = document.getElementById("auth-username");
        const pwdInput = document.getElementById("auth-passcode");
        if (userInput) userInput.value = getStoredUsername();
        if (pwdInput) {
            pwdInput.value = "";
            setTimeout(() => pwdInput.focus(), 200);
        }
    }
}

// Handle Form Submission
function handleAuthSubmit(event) {
    if (event) event.preventDefault();

    const userInput = document.getElementById("auth-username");
    const pwdInput = document.getElementById("auth-passcode");
    const rememberCheckbox = document.getElementById("auth-remember");
    const alertBox = document.getElementById("auth-alert");
    const authCard = document.querySelector(".auth-card");
    const submitBtn = document.getElementById("auth-btn-submit");

    const username = (userInput ? userInput.value.trim() : "") || DEFAULT_AUTH_USERNAME;
    const passcode = pwdInput ? pwdInput.value : "";
    const expectedPasscode = getStoredPasscode();

    // Reset previous alerts
    if (alertBox) {
        alertBox.className = "auth-alert";
        alertBox.textContent = "";
    }
    if (authCard) {
        authCard.classList.remove("auth-shake", "auth-success");
    }

    if (!passcode) {
        showAuthAlert("⚠️ Vui lòng nhập mật khẩu truy cập!", "error");
        if (authCard) authCard.classList.add("auth-shake");
        if (pwdInput) pwdInput.focus();
        return false;
    }

    if (passcode === expectedPasscode) {
        // Authenticated successfully!
        const rememberMe = rememberCheckbox ? rememberCheckbox.checked : true;
        if (rememberMe) {
            localStorage.setItem(STORAGE_AUTH_SESSION, "true");
        } else {
            sessionStorage.setItem(STORAGE_AUTH_SESSION, "true");
            localStorage.removeItem(STORAGE_AUTH_SESSION);
        }

        localStorage.setItem(STORAGE_AUTH_USERNAME, username);

        // Update UI status
        if (authCard) authCard.classList.add("auth-success");
        if (submitBtn) {
            submitBtn.innerHTML = `<span>⚡ ĐÃ XÁC THỰC // ĐANG MỞ HỆ THỐNG...</span>`;
            submitBtn.style.background = "linear-gradient(135deg, #00ff9d 0%, #00b06f 100%)";
            submitBtn.disabled = true;
        }

        showAuthAlert(`✅ ACCESS GRANTED // Chào mừng Kỹ sư ${username}!`, "success");

        // Update brand telemetry if element exists
        const telemetry = document.querySelector(".brand-telemetry");
        if (telemetry) {
            telemetry.textContent = `SYSTEM ONLINE • ESP32-S3 CORE • ${username.toUpperCase()}`;
        }

        setTimeout(() => {
            const overlay = document.getElementById("auth-overlay");
            if (overlay) overlay.classList.add("auth-hidden");
            if (submitBtn) {
                submitBtn.innerHTML = `<span>⚡ XÁC THỰC & MỞ KHÓA // UNLOCK</span>`;
                submitBtn.style.background = "";
                submitBtn.disabled = false;
            }
        }, 600);

        return true;
    } else {
        // Access Denied
        if (authCard) {
            authCard.classList.add("auth-shake");
            setTimeout(() => authCard.classList.remove("auth-shake"), 500);
        }
        showAuthAlert("❌ MẬT KHẨU KHÔNG CHÍNH XÁC (Mặc định: 123456)", "error");
        if (pwdInput) {
            pwdInput.select();
            pwdInput.focus();
        }
        return false;
    }
}

// Show alert message
function showAuthAlert(msg, type) {
    const alertBox = document.getElementById("auth-alert");
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `auth-alert show auth-alert-${type}`;
}

// Toggle password text visibility
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

// Change passcode prompt
function promptChangePasscode() {
    const currentStored = getStoredPasscode();
    const oldInput = prompt("Nhập mật khẩu hiện tại (Mặc định là 123456):");
    if (oldInput === null) return;

    if (oldInput !== currentStored) {
        alert("❌ Mật khẩu hiện tại không đúng!");
        return;
    }

    const newPasscode = prompt("Nhập mật khẩu mới bạn muốn đặt (tối thiểu 4 ký tự):");
    if (!newPasscode) {
        alert("⚠️ Mật khẩu không được để trống!");
        return;
    }

    if (newPasscode.trim().length < 4) {
        alert("⚠️ Mật khẩu quá ngắn, vui lòng nhập ít nhất 4 ký tự!");
        return;
    }

    localStorage.setItem(STORAGE_AUTH_PASSCODE, newPasscode.trim());
    alert("✅ Đổi mật khẩu thành công! Mật khẩu mới đã được lưu trên trình duyệt của bạn.");
}

// Logout / Lock Hub
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

// Self-initialize on DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuthGate);
} else {
    initAuthGate();
}
