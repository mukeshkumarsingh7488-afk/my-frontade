const API_BASE = `${window.API_BASE_URL}/api/reviews`;

let allReviews = []; // Global data for searching

// 1. Fetch Reviews
async function fetchReviews() {
  try {
    const res = await fetch(`${API_BASE}/all`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    allReviews = await res.json();
    renderReviews(allReviews);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("review-list").innerHTML =
      `<p style='color:red; text-align:center;'>Error: Backend connection failed.</p>`;
  }
}

// 2. Render Function
function renderReviews(data) {
  const list = document.getElementById("review-list");
  list.innerHTML =
    data.length === 0
      ? "<p style='text-align:center;'>No reviews found!</p>"
      : "";

  data.forEach((rev) => {
    const card = document.createElement("div");
    card.className = "review-card";
    const currentStatus = rev.status || "approved";

    card.innerHTML = `
              <div class="header">
                  <div class="user-info">${rev.username} <span class="stars">${"★".repeat(rev.rating)}</span></div>
                  <span class="status-tag ${currentStatus === "approved" ? "status-approved" : "status-hidden"}">${currentStatus.toUpperCase()}</span>
              </div>
              <p class="comment">${rev.comment}</p>
              <div class="admin-reply-text">
                  ${rev.adminReply ? `<span style="color:#00ffa3; font-size:0.9rem"><strong>Admin:</strong> ${rev.adminReply}</span>` : ""}
              </div>

              <div class="actions">
                  <button class="btn-reply" onclick="toggleReplyBox(event, '${rev._id}')">Reply</button>
                  <button class="btn-hide" onclick="toggleStatus('${rev._id}')">${currentStatus === "approved" ? "Hide" : "Show"}</button>
                  <button class="btn-delete" onclick="deleteReview('${rev._id}')">Delete</button>
              </div>

              <div class="reply-box" id="reply-box-${rev._id}" onclick="event.stopPropagation()">
                  <textarea id="input-${rev._id}" placeholder="Apna jawab likho..."></textarea>
                  <button class="btn-reply" style="margin-top:8px; width:100%; background:var(--primary); color:black" onclick="submitReply('${rev._id}')">Send Reply</button>
              </div>
          `;
    list.appendChild(card);
  });
}

// 3. Search Logic
function searchReviews() {
  const searchTerm = document.getElementById("searchUser").value.toLowerCase();
  const filtered = allReviews.filter((rev) =>
    rev.username.toLowerCase().includes(searchTerm),
  );
  renderReviews(filtered);
}

// 4. Hide/Show Logic (Click Fix)
async function toggleStatus(id) {
  try {
    const res = await fetch(`${API_BASE}/status/${id}`, {
      method: "PATCH",
    });
    if (res.ok) fetchReviews();
    else alert("Backend route not working!");
  } catch (err) {
    alert("Error connecting to server!");
  }
}

// 5. Delete Logic
async function deleteReview(id) {
  if (confirm("Pakka delete karna hai bhai?")) {
    await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
    fetchReviews();
  }
}

// 6. Pro Reply Box Logic (Toggle & Auto-Close)
function toggleReplyBox(event, id) {
  event.stopPropagation(); // Page click ko rokne ke liye
  const box = document.getElementById(`reply-box-${id}`);
  const isAlreadyOpen = box.style.display === "block";

  closeAllReplyBoxes(); // Pehle baaki sab band karo

  if (!isAlreadyOpen) {
    box.style.display = "block";
  }
}

function closeAllReplyBoxes(event) {
  document.querySelectorAll(".reply-box").forEach((box) => {
    box.style.display = "none";
  });
}

async function submitReply(id) {
  const replyText = document.getElementById(`input-${id}`).value;
  if (!replyText) return alert("Bhai kuch likho to!");

  try {
    await fetch(`${API_BASE}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminReply: replyText }),
    });
    alert("Reply Saved! ✅");
    fetchReviews();
  } catch (err) {
    alert("Reply failed!");
  }
}

fetchReviews();
