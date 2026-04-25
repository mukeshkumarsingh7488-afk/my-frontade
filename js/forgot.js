//#region
const API_URL = `${window.API_BASE_URL}/api/auth`;

function togglePassword() {
  const pass = document.getElementById("newPassword");
  const btn = document.getElementById("toggleBtn");
  pass.type = pass.type === "password" ? "text" : "password";
  btn.textContent = pass.type === "password" ? "👁️" : "🙈";
}

// 1. Request OTP Logic
async function handleRequestOTP(e) {
  if (e) e.preventDefault();

  const email = document.getElementById("resetEmail").value.trim();
  const btn = document.getElementById("reqBtn");

  if (!email.includes("@")) return alert("Please enter valid email!");

  btn.innerText = "Sending...";
  btn.disabled = true;

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("OTP Sent Successfully✅ !");
      document.getElementById("request-section").style.display = "none";
      document.getElementById("reset-section").style.display = "block";
      startTimer();
    } else {
      alert(data.msg || "Error sending OTP!");
      btn.innerText = "Send Reset OTP";
      btn.disabled = false;
    }
  } catch (err) {
    alert("Server connection failed❌!");
    btn.innerText = "Send Reset OTP";
    btn.disabled = false;
  }
}

// 2. Reset Password Logic
async function handleResetPassword(e) {
  if (e) e.preventDefault();

  const email = document.getElementById("resetEmail").value;
  const otp = document.getElementById("resetOtp").value;
  const newPassword = document.getElementById("newPassword").value;
  const btn = document.getElementById("resetBtn");

  const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passRegex.test(newPassword))
    return alert("Use 8+ chars & Special Char.");
  if (otp.length < 6) return alert("Enter 6-digit OTP!");

  btn.innerText = "Updating...";
  btn.disabled = true;

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("Password Changed Successfully! 🚀");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    } else {
      alert(data.msg || "Wrong OTP or Session Expired!");
      btn.innerText = "Update Password";
      btn.disabled = false;
    }
  } catch (err) {
    alert("Server Connection Error!");
    btn.innerText = "Update Password";
    btn.disabled = false;
  }
}

// Timer Logic
let timerId;
function startTimer() {
  let timeLeft = 30;
  const resendBtn = document.getElementById("resendBtn");
  const timerText = document.getElementById("timerText");
  resendBtn.style.display = "none";
  timerText.style.display = "block";

  clearInterval(timerId);
  timerId = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerId);
      resendBtn.style.display = "block";
      timerText.style.display = "none";
    } else {
      document.getElementById("timer").innerText = timeLeft;
    }
    timeLeft--;
  }, 1000);
}

// Global Enter Support
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const isResetVisible =
      document.getElementById("reset-section").style.display === "block";
    if (isResetVisible) document.getElementById("resetBtn").click();
    else document.getElementById("reqBtn").click();
  }
});
//#endregion
