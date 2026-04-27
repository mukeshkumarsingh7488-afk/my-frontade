//#region
/**
 * BR30Trader - BULK ANNOUNCEMENT MODULE
 * Logic for sending Neon Green Mails to all users via Admin Panel
 */

// 1. SELECTORS
const sendBulkBtn = document.getElementById("send-bulk-btn");
const statusMsg = document.getElementById("status-msg");
const emailSub = document.getElementById("email-subject");
const emailMsg = document.getElementById("email-message");

/**
 * @description: Function to trigger the Bulk Email API
 */
if (sendBulkBtn) {
  sendBulkBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const subject = emailSub.value.trim();
    const message = emailMsg.value.trim();

    const authToken = localStorage.getItem("token");

    if (!subject || !message) {
      return alert("Bhai, Subject aur Message dono likhna zaroori hai! ⚠️");
    }

    if (!authToken) {
      alert("Admin token nahi mila! Pehle login karein. 🔑");
      window.location.href = "login.html";
      return;
    }

    sendBulkBtn.innerText = "⏳ BHEJ RAHA HOON...";
    sendBulkBtn.disabled = true;
    statusMsg.innerHTML =
      '<span class="loader" style="color: #00ff88;">Database se users nikaal kar mail bhej raha hoon...</span>';

    try {
      /**
       * API CALL: Sending broadcast to /api/admin/email/send-all-email
       */
      const response = await fetch(
        `${window.API_BASE_URL}/api/admin/email/send-all-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": authToken,
          },
          body: JSON.stringify({ subject, message }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        statusMsg.innerHTML = `<span class="success" style="color: #00ff88; font-weight: bold;">✅ ${data.msg}</span>`;
        emailSub.value = "";
        emailMsg.value = "";

        setTimeout(() => {
          statusMsg.innerHTML = "";
        }, 4000);
      } else {
        statusMsg.innerHTML = `<span class="error" style="color: #ff4d4d;">❌ Error: ${data.msg || "Server issue"}</span>`;
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      statusMsg.innerHTML =
        '<span class="error" style="color: #ff4d4d;">❌ Server se connect nahi ho paya! URL ya CORS check karo.</span>';
    } finally {
      sendBulkBtn.innerText = "SABKO MAIL BHEJO 🚀";
      sendBulkBtn.disabled = false;
    }
  });
}

/**
 * ENTER KEY NAVIGATION (Subject -> Message)
 */
if (emailSub) {
  emailSub.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      emailMsg.focus();
    }
  });
}

console.log("📢 Bulk Mail Module Initialized.");
//#endregion
