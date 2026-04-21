/**
 * BR30ᴛʀᴀᴅᴇʀ - BULK ANNOUNCEMENT MODULE
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
    e.preventDefault(); // Safety first

    const subject = emailSub.value.trim();
    const message = emailMsg.value.trim();

    // localStorage se admin token nikalna zaroori hai authentication ke liye
    const authToken = localStorage.getItem("token");

    // Validation: Empty inputs check
    if (!subject || !message) {
      return alert("Bhai, Subject aur Message dono likhna zaroori hai! ⚠️");
    }

    // Validation: Admin session check
    if (!authToken) {
      alert("Admin token nahi mila! Pehle login karein. 🔑");
      window.location.href = "login.html";
      return;
    }

    // --- Visual Loading States ---
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
            "x-auth-token": authToken, // Backend 'auth' middleware isse check karega
          },
          body: JSON.stringify({ subject, message }),
        },
      );

      const data = await response.json();

      // SUCCESS HANDLING
      if (response.ok) {
        statusMsg.innerHTML = `<span class="success" style="color: #00ff88; font-weight: bold;">✅ ${data.msg}</span>`;
        emailSub.value = "";
        emailMsg.value = "";

        // 4 second baad success message hide kar do
        setTimeout(() => {
          statusMsg.innerHTML = "";
        }, 4000);
      }
      // ERROR HANDLING (Server Side)
      else {
        statusMsg.innerHTML = `<span class="error" style="color: #ff4d4d;">❌ Error: ${data.msg || "Server issue"}</span>`;
      }
    } catch (err) {
      // ERROR HANDLING (Network/Connection)
      console.error("Fetch Error:", err);
      statusMsg.innerHTML =
        '<span class="error" style="color: #ff4d4d;">❌ Server se connect nahi ho paya! URL ya CORS check karo.</span>';
    } finally {
      // RESET BUTTON STATE
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
