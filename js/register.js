const API_URL = window.API_BASE_URL + "/api/auth";

function togglePassword() {
  const pass = document.getElementById("password");
  const btn = document.getElementById("toggleBtn");
  pass.type = pass.type === "password" ? "text" : "password";
  btn.textContent = pass.type === "password" ? "👁️" : "🙈";
}

function validateInput(name, email, pass) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  if (name.length < 3) return "Name too short!";
  if (!emailRegex.test(email)) return "Invalid Email!";
  if (!passRegex.test(pass)) return "Use 8+ chars with 1 Special Character!";
  return null;
}

let timerInterval;
function startTimer() {
  let timeLeft = 30;
  const resendBtn = document.getElementById("resendBtn");
  const timerText = document.getElementById("timerText");
  const timerDisplay = document.getElementById("timer");

  resendBtn.style.display = "none";
  timerText.style.display = "block";

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      resendBtn.style.display = "block";
      timerText.style.display = "none";
    } else {
      timerDisplay.innerText = timeLeft;
    }
    timeLeft--;
  }, 1000);
}

// Change: Added 'e' to handle form submit signal
async function handleRegister(e) {
  if (e) e.preventDefault(); // Browser ko signal milega ki 'Submit' hua hai

  regBtn.disabled = true;
  regBtn.innerText = "Sending OTP... ⏳";

  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const error = validateInput(name, email, password);
  if (error) return alert(error);

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/me`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("OTP Sent!");
      document.getElementById("register-section").style.display = "none";
      document.getElementById("otp-section").style.display = "block";
      startTimer();
    } else {
      alert(data.msg || "Registration Failed!");
    }
  } catch (err) {
    alert("Server Error!");
  }
}

async function handleVerify(e) {
  if (e) e.preventDefault(); // 1. Refresh roka

  const verifyBtn = document.getElementById("verifyBtn");

  // 2. Button ko turant freeze karo taaki double click na ho
  verifyBtn.disabled = true;
  verifyBtn.innerText = "Verifying... ⏳";

  const otpInput = document.getElementById("otpInput"); // Check if ID matches HTML
  const emailInput = document.getElementById("email");

  const otp = otpInput ? otpInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";

  if (otp.length < 6) {
    alert("Enter 6-digit OTP!");
    verifyBtn.disabled = false;
    verifyBtn.innerText = "Verify & Register";
    return;
  }

  try {
    const res = await fetch(window.API_BASE_URL + "/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ SUCCESS: Sirf ek hara (Green) alert
      alert("✅ Account Verified Successfully!");
      // Redirect se pehle thoda sa 100ms ka gap taaki alert clear ho jaye
      setTimeout(() => {
        window.location.replace("login.html");
      }, 100);
    } else {
      // ❌ ERROR: Galat OTP pe yahan aayega
      alert("❌ " + (data.msg || "Verification Failed!"));
      verifyBtn.disabled = false;
      verifyBtn.innerText = "Verify & Register";
    }
  } catch (err) {
    // 🔥 Catch block ka alert: Sirf tab dikhao jab network fail ho
    console.error("Fetch Error:", err);
    alert("❌ Server Error! Please check your connection.");
    verifyBtn.disabled = false;
    verifyBtn.innerText = "Verify & Register";
  }
}

// Resend logic helper
function resendOTP() {
  handleRegister();
}

// Global Enter logic (Now triggers the active form's submit)
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const isOtpVisible =
      document.getElementById("otp-section").style.display === "block";
    if (isOtpVisible) handleVerify();
    else handleRegister();
  }
});
