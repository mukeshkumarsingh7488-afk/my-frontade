// 0. 🛡️ Admin Security Check (Sirf aapke liye)
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Admin";

  if (!token || role !== "admin") {
    alert("Bhai, ye sirf Admin ke liye hai!");
    window.location.href = "login.html"; // Wapas bhej do agar admin nahi hai
  } else {
    document.getElementById("user").innerText = "Welcome, " + username;
    loadStats(); // Agar admin hai toh stats load karo
  }
});

// 1. 📊 Stats Load Karne Ka Logic
async function loadStats() {
  try {
    const token = localStorage.getItem("token"); // LocalStorage se token nikalo

    if (!token) {
      console.error("Bhai, token hi nahi mila!");
      return;
    }

    const res = await fetch(`${window.API_BASE_URL}/api/auth/user-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 'Bearer ' ke baad space zaruri hai
      },
    });

    const data = await res.json();

    if (data.success) {
      document.getElementById("total-count").innerText = data.totalUsers;
      document.getElementById("vip-count").innerText = data.vipCount;
      document.getElementById("normal-count").innerText = data.normalCount;
    } else {
      console.error("Server se error aaya:", data.msg);
    }
  } catch (e) {
    console.error("Stats fetch karne mein locha:", e.message);
  }
}

// 2. ✉️ Bulk Mail Bhejne Ka Logic (BCC Target System)
async function sendBulkMail() {
  const btn = document.getElementById("send-btn");
  const target = document.getElementById("mail-target").value;
  const subject = document.getElementById("mail-subject").value;
  const htmlContent = document.getElementById("mail-body").value;

  if (!subject || !htmlContent)
    return alert("Bhai, Subject aur Message likhna zaroori hai!");

  btn.innerText = "Mails Bheji Ja Rahi Hain...";
  btn.disabled = true;

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/send-offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // Backend controller ko target (all/vip/normal) bhej rahe hain
      body: JSON.stringify({ target, subject, htmlContent }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("🚀 " + data.message);
      // Clear fields after success
      document.getElementById("mail-subject").value = "";
      document.getElementById("mail-body").value = "";
    } else {
      alert("Galti: " + data.message);
    }
  } catch (err) {
    alert("Server connection locha! Backend ON hai?");
  } finally {
    btn.innerText = "🚀 Send Blast Now";
    btn.disabled = false;
  }
}

// Logout function
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

async function cancelActiveCoupon() {
  // 1. Confirm karo pehle
  if (
    !confirm(
      "Bhai, kya aap sach mein current discount offer ko band karna chahte ho?",
    )
  )
    return;

  const btn = document.getElementById("cancel-btn");
  btn.innerText = "Processing...";
  btn.disabled = true;

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/auth/cancel-coupon`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ " + data.msg);
      location.reload(); // Page refresh karo stats update karne ke liye
    } else {
      alert("❌ Galti: " + data.msg);
    }
  } catch (err) {
    alert("Server connection mein locha hai!");
  } finally {
    btn.innerText = "🚫 Cancel Current Coupon";
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username") || "Guest";
  const userDisplay = document.getElementById("user");
  userDisplay.innerText = "Welcome, " + username;
});
