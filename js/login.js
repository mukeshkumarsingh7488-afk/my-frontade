//#region
const API_URL = `${window.API_BASE_URL}/api/auth`;

// 2. Toggle Password Visibility
function togglePassword() {
  const pass = document.getElementById("password");
  const btn = document.getElementById("toggleBtn");
  pass.type = pass.type === "password" ? "text" : "password";
  btn.textContent = pass.type === "password" ? "👁️" : "🙈";
}

// 3. Email Validation logic
function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

// 4. Main Login Logic
async function handleLogin(e) {
  if (e) e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");

  if (!email || !validateEmail(email)) return alert("Invalid Email!");
  if (!password) return alert("Password Required!");

  btn.innerText = "Processing...";
  btn.disabled = true;

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.clear();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("username", data.user.name);

      if (data.user.role === "admin") {
        alert("Welcome Admin! 🚀 Dashboard Access Granted.");
      } else {
        alert("Login Success! 🚀 Redirecting to Home.");
      }

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "index.html";
        }
      }, 800);
    } else {
      alert(data.msg || "Login Failed!");
      btn.innerText = "Login to Account";
      btn.disabled = false;
    }
  } catch (err) {
    alert("Server Connection Error!");
    btn.innerText = "Login to Account";
    btn.disabled = false;
  }
}

// 5. Enter Key Support
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const activeElem = document.activeElement;
    if (activeElem.id === "email" || activeElem.id === "password") {
      handleLogin();
    }
  }
});
//#endregion
