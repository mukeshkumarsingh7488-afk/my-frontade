//#region
// event parameter add kiya taaki refresh roke aur browser signal capture kare
async function resetPassword(event) {
  if (event) event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const token = document.getElementById("token").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const btn = document.getElementById("resetBtn");

  if (!email || !token || !newPassword) {
    alert("Bhai, please enter all details!");
    return;
  }

  const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passRegex.test(newPassword)) {
    return alert("Password weak hai! Use 8+ chars & Special Character.");
  }

  btn.innerText = "Updating...";
  btn.disabled = true;

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password updated successfully! 🚀");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } else {
      alert(data.msg || data.message || "Invalid OTP or Email!");
      btn.innerText = "Update Password";
      btn.disabled = false;
    }
  } catch (err) {
    alert("Server Connection Error!");
    btn.innerText = "Update Password";
    btn.disabled = false;
  }
}

// Enter key support
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("resetBtn").click();
  }
});
//#endregion
