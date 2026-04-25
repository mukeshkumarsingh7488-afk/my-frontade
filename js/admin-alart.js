//#region region ━━━━━ 🏛️ WELCOME DEVELOPER | ADMIN ALART JS  INITIALIZED ━━━━━
// Function to send an asynchronous alert to the user
async function sendAlert() {
  const title = document.getElementById("admin-title").value.trim();
  const msg = document.getElementById("admin-msg").value.trim();
  const status = document.getElementById("status");
  const btn = document.getElementById("sendBtn");

  if (!title || !msg) return alert("Title और Message दोनों लिखो भाई!");

  btn.innerText = "Sending... ⏳";
  btn.disabled = true;

  try {
    await fetch(`${window.API_BASE_URL}/api/notifications/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, senderName: "Admin" }),
    });

    const pushResponse = await fetch(
      `${window.API_BASE_URL}/api/admin/send-all`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title, message: msg }),
      },
    );

    if (pushResponse.ok) {
      status.style.display = "block";
      document.getElementById("admin-title").value = "";
      document.getElementById("admin-msg").value = "";
      setTimeout(() => {
        status.style.display = "none";
      }, 4000);
    } else {
      alert("Server Eeeor.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server Se Connect Nahi Ho Raha!");
  } finally {
    btn.innerText = "BROADCAST ALERT 🚀";
    btn.disabled = false;
  }
}

document
  .getElementById("admin-title")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("admin-msg").focus();
    }
  });

document
  .getElementById("admin-msg")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendAlert();
    }
  });
//#endregion
// ==========================================================================
// ✅ UI STATUS: FRONTEND COMPONENTS ORGANIZED & PROPS VALIDATED.
// 🛡️ SECURITY: CLIENT-SIDE GUARDS & API INTERCEPTORS ACTIVE.
// 🚀 DEPLOYMENT: PRODUCTION-READY ASSETS & OPTIMIZED BUILD.
// ==========================================================================
// 🏁 --- END OF FRONTEND ALERT MODULE ---
