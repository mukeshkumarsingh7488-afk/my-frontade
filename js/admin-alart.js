async function sendAlert() {
  const title = document.getElementById("admin-title").value.trim();
  const msg = document.getElementById("admin-msg").value.trim();
  const status = document.getElementById("status");
  const btn = document.getElementById("sendBtn");

  if (!title || !msg) return alert("Title और Message दोनों लिखो भाई!");

  btn.innerText = "Sending... ⏳";
  btn.disabled = true;

  try {
    // 1. Purana System (Database mein save karne ke liye)
    // DHAYAN SE DEKHO: Yahan sirf URL hona chahiye
    await fetch(`${window.API_BASE_URL}/api/notifications/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, senderName: "Admin" }),
    });

    // 2. Naya Firebase Push System (Phone par bhejne ke liye)
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
      // Agar server 500 error deta hai toh yahan aayega
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

// 1. Title में Enter दबाने पर 'Message' बॉक्स पर फोकस होगा
document
  .getElementById("admin-title")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // पेज रिफ्रेश या सबमिट होने से रोकेगा
      document.getElementById("admin-msg").focus(); // अगले बॉक्स में कर्सर भेज देगा
    }
  });

// 2. Message में Enter दबाने पर 'Alert' सेंड हो जाएगा
document
  .getElementById("admin-msg")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendAlert(); // फाइनल मैसेज भेज देगा
    }
  });
