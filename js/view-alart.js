//#region
async function fetchAllAlerts() {
  const token = localStorage.getItem("token");
  const list = document.getElementById("all-notif-list");

  try {
    const response = await fetch(
      `${window.API_BASE_URL}/api/notifications/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      },
    );

    if (response.status === 401) {
      list.innerHTML =
        "<p style='color:orange; text-align:center;'>Plese login Frist!</p>";
      return;
    }

    const alerts = await response.json();
    list.innerHTML = "";

    if (!Array.isArray(alerts) || alerts.length === 0) {
      list.innerHTML =
        "<p style='text-align:center; color:gray;'>Koi alert record nahi mila.</p>";
      return;
    }

    alerts.forEach((data) => {
      const name = data.senderName || "Admin Mukesh Raj Raj";
      const card = `
          <div class="notif-card" style="padding:15px; border-bottom:1px solid #444; margin-bottom:10px;">
              <p>🚀 <b>${name}:</b> ${data.message}</p>
              <small>📅 ${new Date(data.date).toLocaleDateString()} | ⏰ ${new Date(data.date).toLocaleTimeString()}</small>
          </div>
      `;
      list.insertAdjacentHTML("beforeend", card);
    });
  } catch (err) {
    console.error("Error:", err);
    list.innerHTML =
      "<p style='color:red; text-align:center;'>Server connect nahi ho pa raha!</p>";
  }
}

// Page load hote hi run karo
document.addEventListener("DOMContentLoaded", fetchAllAlerts);
//#endregion
