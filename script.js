//#region MyCode
/* =========================rev================
   1. TYPED.JS ANIMATION (Hero Section)
========================================= */
console.log("Bhai, Script Load Ho Gayi! 🔥");
var typed = new Typed("#element", {
  strings: ["Web. Developer.", "Trader.", "Investor.", "Content Creator."],
  typeSpeed: 80,
  backSpeed: 40,
  loop: true,
});

window.toggleNotifications = function () {
  console.log("🔔 Notification toggle");
};

// Page load hote hi synchronization shuru karo
document.addEventListener("DOMContentLoaded", syncAdminData);

// मोबाइल मेनू और लिंक्स को सेलेक्ट करें
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links'); // अपने मेनू लिस्ट की क्लास यहाँ लिखें

mobileMenu.addEventListener('click', () => {
  // 1. मेनू बटन को 'X' में बदलें
  mobileMenu.classList.toggle('active');

  // 2. मेनू लिस्ट को दिखाएं या छुपाएं
  navLinks.classList.toggle('show');
});

// अगर किसी लिंक पर क्लिक करें तो मेनू बंद हो जाए (Optional)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    navLinks.classList.remove('show');
  });
});

/* ====================================
   2. Firebess function start 
  ================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getMessaging,
  getToken,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4wnSAZ3VLlAMyHhPt5WjULihejoKuLoY",
  authDomain: "br30trader.firebaseapp.com",
  projectId: "br30trader",
  storageBucket: "br30trader.firebasestorage.app",
  messagingSenderId: "32865565434",
  appId: "1:32865565434:web:4d620d3cb41a19c5582743",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function saveTokenToDatabase(token) {
  try {
    const rawUserData = localStorage.getItem("userData");
    if (!rawUserData) {
      console.log("❌ User data nahi mila, login karo pehle!");
      return;
    }

    const userData = JSON.parse(rawUserData);

    const userId =
      userData._id || userData.id || (userData.user && userData.user._id);

    if (!userId) {
      console.log(
        "❌ User ID nahi mili! LocalStorage mein 'userData' check karo.",
      );
      console.log("Debug Data:", userData);
      return;
    }

    // 3. Backend ko Request
    const response = await fetch(window.API_BASE_URL + '/api/save-fcm-token', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        token: token,
      }),
    });

    const result = await response.json();
    console.log("✅ Database Status:", result.msg);
  } catch (err) {
    console.error("❌ Token save karne mein dikkat:", err);
  }
}

// --- Function Permision ---
window.finalTest = async function () {
  try {
    console.log("🚀 Firebase Process Start...");
    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      console.log("✅ Notification Permission Granted!");

      const token = await getToken(messaging, {
        vapidKey:
          "BFLsdCUiLyRoANZPGP8MNwvCh1SBkpOevl2PzD-wwwRPIdJgkMr857_2UkhbyCnO3iOj_DyqhfyHkbx0ezbx2B4",
      });

      if (token) {
        console.log("🔥 TOKEN MIL GAYA:", token);

        const oldToken = localStorage.getItem("last_fcm_token");
        if (oldToken !== token) {
          await saveTokenToDatabase(token);
          localStorage.setItem("last_fcm_token", token);
        } else {
          console.log("ℹ️ Token pehle se DB mein hai, skip kar raha hoon.");
        }
      } else {
        console.log("❌ Token NULL (Check Service Worker)");
      }
    } else {
      console.log("❌ Notification Permission Denied/Blocked");
    }
  } catch (err) {
    console.error("ERROR:", err);
  }
};
finalTest();

// 🔥 Service Worker register (background notification ke liye)
navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then(() => console.log("✅ Service Worker Registered"))
  .catch((err) => console.log("❌ SW Error:", err)); // firebess end

/* =========================================
   3.  Review submil & LOADING LOGIC   
========================================= */
// 2. Main Submit Event
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Latest User Data nikaalo
  const storedData = localStorage.getItem("userData");
  if (!storedData) {
    alert("Please, Login first!");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(storedData);

  // 2. Clear IDs nikaalo (Multiple checks for safety)
  const finalUserId = user._id || user.id || (user.user && (user.user._id || user.user.id));

  // 3. 🚨 PROFILE PIC FIX: Direct Cloudinary URL uthao
  // Agar profile page par update hua hai, toh wahi url yahan use hoga
  const latestProfilePic = user.profilePic || (user.user && user.user.profilePic) || "";

  const data = {
    username: document.getElementById("userName").value.trim(),
    rating: document.getElementById("userRating").value,
    comment: document.getElementById("userComment").value.trim(),
    userId: finalUserId,
    profilePic: latestProfilePic, // Ye ab Cloudinary ka direct link (http...) bhejega
  };

  console.log("📝 Posting Review with Data:", data); // Debugging ke liye

  try {
    const response = await fetch(window.API_BASE_URL + '/api/reviews/add', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Thanks for your review! ✅");
      document.getElementById("reviewForm").reset();
      // Yahan function ka naam check kar lena (loadTopReviews ya fetchReviews)
      if (typeof loadTopReviews === 'function') loadTopReviews();
    } else {
      alert(result.message || "Error while posting review!");
    }
  } catch (err) {
    console.error("🚨 Review Error:", err);
    alert("Server Error! Check console for details.");
  }
});


// ✅ 1. Updated loadTopReviews function (Inside logic updated for outside-click)
async function loadTopReviews() {
  try {
    const response = await fetch(window.API_BASE_URL + '/api/reviews/top10');
    const reviews = await response.json();
    const displayArea = document.getElementById("reviewDisplay");

    if (!reviews || reviews.length === 0) {
      displayArea.innerHTML = "<p style='color:gray; font-size:12px;'>No reviews yet.</p>";
      return;
    }

    const BASE_URL = window.API_BASE_URL + '/';
    displayArea.innerHTML = reviews.map((r) => {
      // 1. Path nikaalo (Check multiple fields for safety)
      const userName = (r.userId && r.userId.name) || r.username || "User";
      let rawPath = (r.userId && r.userId.profilePic) || r.profilePic || "";
      let profileImg;

      // 2. CHECK LOGIC (Modern & Simple)
      if (rawPath && typeof rawPath === "string" && rawPath.length > 5) {

        if (rawPath.startsWith("http")) {
          // ✅ Case A: Cloudinary ya external URL (Seedha use karo)
          profileImg = rawPath;
        } else {
          // ✅ Case B: Purana Local Path (e.g., 'uploads/image.jpg')
          // Isme split logic chalega taaki sirf filename mile
          const fileName = rawPath.split(/[\\/]/).pop();
          profileImg = `${window.API_BASE_URL}/uploads/${fileName}`;
        }

      } else {
        // ❌ Case C: Photo nahi hai
        profileImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=00ff88&color=000&bold=true&size=128`;
      }

      // ADMIN REPLY UI LOGIC (Added 'event' in onclick for pro features)
      const adminReplyBtn = r.adminReply ?
        `<span onclick="window.toggleReplyBox(event, '${r._id}')" style="color:#00ff88; font-size:10px; cursor:pointer; text-decoration:underline; margin-left:8px; font-weight:normal;">View Reply</span>` : '';

      // Added 'reply-box-item' class to identify boxes for closing
      const adminReplyContent = r.adminReply ?
        `<div id="reply-box-${r._id}" class="reply-box-item" style="display:none; margin-top:8px; padding:8px; background:rgba(0,255,136,0.1); border-left:2px solid #00ff88; border-radius:4px; font-size:12px; color:#00ff88;">
              <strong style="color:#fff;">Admin:</strong> ${r.adminReply}
           </div>` : '';

      return `
        <div class="review-card" style="background: rgba(255,255,255,0.05); padding: 15px; margin-bottom: 12px; border-radius: 15px; border-left: 4px solid #00ff88; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${profileImg}" 
                     onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=333&color=fff&size=128';"
                     style="width:45px; height:45px; border-radius:50%; border:2px solid #00ff88; object-fit:cover; background:#111;">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color: #00ff88; font-size:15px; letter-spacing:0.5px;">${userName}</strong> 
                        <div style="display:flex; align-items:center;">
                            <span style="color:gold; font-size:11px;">${"★".repeat(r.rating || 0)}</span>
                            ${adminReplyBtn}
                        </div>
                    </div>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #e2e8f0; line-height:1.5;">${r.comment}</p>
                    ${adminReplyContent}
                </div>
            </div>
        </div>`;
    }).join("");
  } catch (err) {
    console.error("Error:", err);
  }
}

// ✅ 2. Pro Toggle Logic (Outside Click Support)
window.toggleReplyBox = function (event, id) {
  event.stopPropagation(); // Stop click from reaching window listener immediately
  const box = document.getElementById(`reply-box-${id}`);
  const allBoxes = document.querySelectorAll('.reply-box-item');

  // Close all other open boxes first
  allBoxes.forEach(b => { if (b.id !== `reply-box-${id}`) b.style.display = "none"; });

  if (box) {
    box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
  }
};

// ✅ 3. Global Click Listener to close box when clicking outside
window.addEventListener('click', function (event) {
  const allBoxes = document.querySelectorAll('.reply-box-item');
  allBoxes.forEach(box => {
    // If click is outside the box and not on a 'View Reply' button, close it
    if (box.style.display === "block" && !box.contains(event.target)) {
      box.style.display = "none";
    }
  });
});

// Baki ka Enter Key logic
const commentBox = document.getElementById("userComment");
if (commentBox) {
  commentBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("reviewForm").requestSubmit();
    }
  });
}
loadTopReviews();

//Review Logic end..

/* ============================================
      scroll bar function 
  ===========================================*/
window.onscroll = function () {
  let winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  let scrolled = (winScroll / height) * 100;

  let progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
}; // scroll bar function end.

/* ============================================
     Calculatore
  ===========================================*/
function calculateRisk() {
  let capital = parseFloat(document.getElementById("capital").value);
  let riskPercent = parseFloat(document.getElementById("risk-percent").value);
  let entry = parseFloat(document.getElementById("entry-price").value);
  let sl = parseFloat(document.getElementById("sl-price").value);

  if (capital > 0 && riskPercent > 0 && entry > 0 && sl > 0) {
    let totalRiskAmount = capital * (riskPercent / 100);

    let riskPerShare = Math.abs(entry - sl);

    if (riskPerShare === 0) {
      alert("Entry and SL cannot be same!");
      return;
    }

    let quantity = Math.floor(totalRiskAmount / riskPerShare);

    // Results
    document.getElementById("risk-amt").innerText =
      "₹" + totalRiskAmount.toLocaleString();
    document.getElementById("qty-result").innerText = quantity;
    document.getElementById("risk-per-share").innerText = riskPerShare;
  } else {
    alert("Please enter valid numbers in all fields!");
  }
}
window.submitDailyCheck = submitDailyCheck;
window.calculateRisk = calculateRisk;

// Calculater function end.

/* ============================================
   disiplean card submit logic
  ===========================================*/
function submitDailyCheck() {
  // Sabse pehle saare checkboxes pakdo (Tool Card ke andar se)
  const checkboxes = document.querySelectorAll(
    '.tool-card input[type="checkbox"]',
  );

  // Check karo ki koi bhi ek tick hai ya nahi
  const isAnyChecked = Array.from(checkboxes).some((box) => box.checked);

  if (!isAnyChecked) {
    alert("Please select at least one discipline to proceed.! 🛑");
    return;
  }

  const successMsg = document.getElementById("success-msg");
  const submitBtn = document.querySelector(".submit-discipline-btn");

  // Animation Start
  submitBtn.innerText = "Reporting...";
  submitBtn.style.opacity = "0.7";

  setTimeout(() => {
    submitBtn.innerText = "Submitted ✅";
    submitBtn.style.background = "#22c55e";
    if (successMsg) successMsg.style.display = "block";

    setTimeout(() => {
      // 3 second baad wapas normal kar do
      submitBtn.innerText = "Submit Daily Report 📝";
      submitBtn.style.background =
        "linear-gradient(135deg, #a020f0 0%, #6d28d9 100%)";
      submitBtn.style.opacity = "1";
      if (successMsg) successMsg.style.display = "none";

      // Saare boxes khali kar do
      checkboxes.forEach((box) => (box.checked = false));
    }, 3000);
  }, 1000);
}
window.submitDailyCheck = submitDailyCheck;

// desiplean card submit logic end.

/* ============================================
   trade jarnel automation
  ===========================================*/
function setStatus(status) {
  document.getElementById("trade-status").value = status;
  const pBtn = document.getElementById("btn-prof");
  const lBtn = document.getElementById("btn-loss");
  if (pBtn && lBtn) {
    pBtn.classList.toggle("active-prof", status === "Profit");
    lBtn.classList.toggle("active-loss", status === "Loss");
  }
}

// --- 2. Save Trade to Backend ---
async function saveTrade() {
  const name = document.getElementById("trade-name").value.trim();
  const type = document.getElementById("trade-type").value;
  const status = document.getElementById("trade-status").value;
  const pnl = parseFloat(document.getElementById("trade-pnl").value);
  const note = document.getElementById("trade-note").value.trim();
  const token = localStorage.getItem("token"); // लॉगिन के समय वाला टोकन

  if (!token) {
    alert("⚠️ Please Login first to save trades!");
    return;
  }

  if (!name || isNaN(pnl) || pnl <= 0) {
    alert("⚠️ Please enter a valid name and amount.");
    return;
  }

  const tradeData = { name, type, status, pnl, note, brokerage: 45 };

  try {
    const response = await fetch(window.API_BASE_URL + '/api/trades/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token, // आपका बैकएंड यही हेडर मांग रहा है
      },
      body: JSON.stringify(tradeData),
    });

    if (response.ok) {
      showPopup(`✅ Saved: ${name}`);
      resetForm();
      fetchUserTrades(); // ताजा डेटा मंगाएं
    } else {
      const err = await response.json();
      alert("❌ Error: " + err.msg);
    }
  } catch (err) {
    console.error("Backend Connection Error:", err);
  }
}
// connect js
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveTradeBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Form reload hone se rokega
      saveTrade();
    });
  }
});

window.setStatus = setStatus;
window.saveTrade = saveTrade;
window.filterTradesByDate = filterTradesByDate;
window.resetHistory = resetHistory; // seved trade backend fuction end

// --- 3. Fetch User's Trades from Backend ---
async function fetchUserTrades() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(window.API_BASE_URL + '/api/trades/my-trades', {
      headers: { "x-auth-token": token },
    });
    const trades = await response.json();

    if (response.ok) {
      displayTrades(trades);
      calculateAnalytics(trades);
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

// --- 4. Analytics & UI Render ---
function calculateAnalytics(trades) {
  let gross = 0,
    tax = 0;
  trades.forEach((t) => {
    gross += t.status === "Profit" ? t.pnl : -t.pnl;
    tax += 50;
  });
  let net = gross - tax;

  document.getElementById("total-gross").innerText =
    `₹${gross.toLocaleString()}`;
  document.getElementById("total-tax").innerText = `₹${tax.toLocaleString()}`;
  const netEl = document.getElementById("total-net");
  netEl.innerText = `₹${net.toLocaleString()}`;
  netEl.style.color = net >= 0 ? "#22c55e" : "#ef4444";
}

// 1. डिस्प्ले फंक्शन में डिलीट बटन जोड़ना
function displayTrades(trades) {
  const list = document.getElementById("trade-list");

  if (!trades || trades.length === 0) {
    list.innerHTML =
      "<p style='color: #94a3b8; text-align: center; padding: 20px;'>No trades recorded yet.</p>";
    return;
  }

  list.innerHTML = trades
    .map(
      (t) => `
        <div class="trade-item" style="display: flex; justify-content: space-between; align-items: center; background: #050505; padding: 12px; border-radius: 10px; margin-bottom: 10px; border: 1px solid rgba(160, 32, 240, 0.2);">
            
            <div class="item-info" style="text-align: left;">
                <b style="color: #ffffff; font-size: 1rem; display: block;">${t.name} (${t.type})</b>
                <small style="color: #94a3b8; font-size: 0.75rem;">${new Date(t.date).toLocaleDateString()}</small>
                <div style="color: #cbd5e1; font-size: 0.8rem; margin-top: 4px; font-style: italic;">"${t.note || ""}"</div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px;">
                <!-- P&L Amount -->
                <div style="color: ${t.status === "Profit" ? "#22c55e" : "#ef4444"}; font-weight: bold; font-size: 1.1rem;">
                    ${t.status === "Profit" ? "+" : "-"} ₹${t.pnl}
                </div>
                
                <!-- 🗑️ DELETE BUTTON (यह रहा आपका बटन) -->
                <button onclick="deleteTrade('${t._id}')" 
                        style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem; transition: 0.3s; padding: 5px;"
                        title="Delete Trade">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// ... पुराने फ़ंक्शंस (saveTrade, fetchUserTrades आदि) ...
async function deleteTrade(id) {
  if (!confirm("⚠️ Conform Delete?")) return;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(window.API_BASE_URL + '/api/trades/' + id, {
      method: "DELETE",
      headers: { "x-auth-token": token },
    });

    if (response.ok) {
      showPopup("🗑️ Trade Deleted!");
      fetchUserTrades();
    } else {
      alert("❌ Delete failed!");
    }
  } catch (err) {
    console.error("Delete Error:", err);
  }
}

// --- 5. Helpers & Listeners ---
function resetForm() {
  document.getElementById("trade-name").value = "";
  document.getElementById("trade-pnl").value = "";
  document.getElementById("trade-note").value = "";
}

function showPopup(msg) {
  const popup = document.createElement("div");
  popup.className = "save-popup";
  popup.innerText = msg;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.classList.add("fade-out");
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

document.onkeypress = function (e) {
  e = e || window.event;
  if (e.keyCode === 13) {
    if (document.activeElement.id !== "trade-note") {
      e.preventDefault();
      console.log("Enter Triggered!");
      saveTrade();
    }
  }
};
window.onload = fetchUserTrades;

// Filter user trade
async function filterTradesByDate() {
  const searchDate = document.getElementById("search-date").value;
  if (!searchDate) return;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(window.API_BASE_URL + '/api/trades/my-trades', {
      headers: { "x-auth-token": token },
    });
    const allTrades = await response.json();

    const filtered = allTrades.filter((t) => {
      const tDate = new Date(t.date).toISOString().split("T")[0];
      return tDate === searchDate;
    });

    if (filtered.length === 0) {
      document.getElementById("trade-list").innerHTML = `
                <p style="text-align:center; color:#94a3b8; padding:30px;">
                    ⚠️ No trades found for this date (${searchDate}).
                </p>`;
    } else {
      displayTrades(filtered);
    }
  } catch (err) {
    console.error("Filter Error:", err);
  }
}
function resetHistory() {
  document.getElementById("search-date").value = "";
  fetchUserTrades();
} // trade jarnel automation end.

/* ============================================
         Seasion Clock
  ===========================================*/
function updateMarketClocks() {
  const now = new Date();

  const markets = [
    {
      name: "India",
      tz: "Asia/Kolkata",
      open: "09:15",
      close: "15:30",
      timeId: "india-time",
      statusId: "india-status",
    },
    {
      name: "Tokyo",
      tz: "Asia/Tokyo",
      open: "09:00",
      close: "15:00",
      timeId: "tokyo-time",
      statusId: "tokyo-status",
    },
    {
      name: "London",
      tz: "Europe/London",
      open: "08:00",
      close: "16:30",
      timeId: "london-time",
      statusId: "london-status",
    },
    {
      name: "NY",
      tz: "America/New_York",
      open: "09:30",
      close: "16:00",
      timeId: "ny-time",
      statusId: "ny-status",
    },
  ];

  markets.forEach((m) => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: m.tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const timeParts = formatter.formatToParts(now);
    const hh = timeParts.find((p) => p.type === "hour").value;
    const mm = timeParts.find((p) => p.type === "minute").value;
    const ss = timeParts.find((p) => p.type === "second").value;

    const currentTime = `${hh}:${mm}:${ss}`;
    const currentTimeShort = `${hh}:${mm}`;

    const dayFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: m.tz,
    });
    const day = dayFormatter.format(now);

    document.getElementById(m.timeId).innerText = currentTime;

    const isWeekend = day === "Sat" || day === "Sun";
    const isOpen =
      !isWeekend && currentTimeShort >= m.open && currentTimeShort < m.close;

    const statusEl = document.getElementById(m.statusId);
    if (statusEl) {
      statusEl.innerText = isOpen ? "● OPEN" : "○ CLOSED";
      statusEl.className = isOpen ? "status-pill open" : "status-pill closed";
    }
  });
}
setInterval(updateMarketClocks, 1000);
updateMarketClocks(); // Sesion clock end.

/* ============================================
          Nav Alert Bell Function (Module Ready)
  ===========================================*/

// DOM load hone ka wait karein taaki elements mil sakein
document.addEventListener("DOMContentLoaded", () => {
  const bellBtn = document.querySelector(".bell-icon");
  const dropdown = document.getElementById("notif-dropdown");
  const badge = document.getElementById("notif-count");

  // 1. Click Event Listener (onclick ki jagah)
  if (bellBtn) {
    bellBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Menu toggle hone se rokne ke liye

      // Dropdown toggle logic
      if (dropdown) {
        if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
        } else {
          dropdown.style.display = "block";
          // Jab user dekh le, toh badge hata do (Optional)
          // if(badge) badge.style.display = "none";
        }
      }
    });
  }

  // 2. Bahar click karne par band karne ka logic
  window.addEventListener("click", (event) => {
    if (dropdown && dropdown.style.display === "block") {
      // Agar click bell icon par NAHI hai, toh dropdown band kar do
      if (!event.target.closest(".bell-icon")) {
        dropdown.style.display = "none";
      }
    }
  });

  // 3. Pehle se load ho rahi fetchNotifications ko yahan call karein
  if (typeof fetchNotifications === "function") {
    fetchNotifications();
  }
});

// --- डेटाबेस से असली अलर्ट्स मंगाने के लिए ---
async function fetchNotifications() {
  // 1. JWT Token nikalo
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      window.API_BASE_URL + '/api/notifications/all',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 🚨 YE BADLAV ZAROORI HAI: 'x-auth-token' hata kar 'Authorization' dalo
          "Authorization": "Bearer " + token
        },
      }
    );

    // 2. Error handling
    if (response.status === 401) {
      console.error("401 Unauthorized: Token missing or invalid.");
      // Agar logout ho raha hai, toh yahan redirect mat karna, bas return karo
      return;
    }

    // ... baaki ka logic (res.json() etc.) iske niche rehne do


    const notifs = await response.json();

    const list = document.getElementById("notif-list");
    const badge = document.getElementById("notif-count");

    // 3. Check karo ki notifs ek Array hai (TypeError fix karne ke liye)
    if (Array.isArray(notifs)) {
      if (notifs.length > 0) {
        if (badge) {
          badge.innerText = notifs.length;
          badge.style.display = "block";
        }
      } else {
        if (badge) badge.style.display = "none";
      }

      if (list) {
        if (notifs.length === 0) {
          list.innerHTML =
            '<p style="padding:15px; color:gray; text-align:center;">Abhi koi alert nahi hai.</p>';
        } else {
          list.innerHTML = notifs
            .map(
              (n) => `
                        <div class="notif-item unread">
                            <p>⚡ ${n.message}</p>
                            <small>${new Date(n.date).toLocaleTimeString()}</small>
                        </div>
                    `,
            )
            .join("");
        }
      }
    }
  } catch (err) {
    console.error("Alert Load Error:", err);
  }
}

// Window load hone par call karo
window.onload = () => {
  fetchNotifications();
};

window.toggleNotifications = toggleNotifications;
// Nav Alart bell function end.

/* ============================================
   Socket.io Connection Setup (admin Alart)
  ===========================================*/
const socket = io(window.API_BASE_URL, {
  path: "/socket.io/", // Agar backend pe custom path hai toh yahan define hota hai
  transports: ["websocket"],
  closeOnBeforeunload: true,
  reconnectionAttempts: 5,
  timeout: 10000,
});


socket.on("connect", () => {
  console.log("✅ Live connection ban gaya! ID:", socket.id);

  // Example: dynamic userId, apne user se fetch kar sakte ho
  const userId = "69bfdc6e61e19c17bf18d597";
  socket.emit("join", userId);
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection Error:", err.message);
});

// 🔥 Live Users Count (safe, HTML optional)
socket.on("live_users_count", (count) => {
  console.log("🔥 Live Users:", count);

  // Agar element hai to update kare, nahi to skip kare
  const liveUsersElem = document.getElementById("liveCount");
  if (liveUsersElem) {
    liveUsersElem.innerText = count;
  }
});

// 📩 Notifications
socket.on("notification", (data) => {
  console.log("📩 Notification:", data);

  // Optional: agar alert chahiye to
  if (data && data.message) {
    alert("New Notification: " + data.message);
  }
});

// Example: Front-end se backend ko notification bhejna
function sendTestNotification() {
  const userId = "69bfdc6e61e19c17bf18d597"; // apne userId ke hisab se
  const message = "Hello! This is a test notification!";

  socket.emit("send_notification", { userId, message });
  console.log("🚀 Test notification sent:", message);
}

// --- 2. Function: Database se purane Alerts load karne ke liye ---
async function loadNotifications() {
  // 1. Token nikalo (Bina iske backend refresh par data nahi dega)
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(window.API_BASE_URL + '/api/notifications/all', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token, // YE SABSE ZAROORI HAI REFRESH KE LIYE
      },
    });

    // Agar 401 error aaye toh console mein dikhega
    if (res.status === 401) {
      console.error("Token missing or expired! Please login again.");
      return;
    }

    const notifications = await res.json();

    const container = document.getElementById("notif-list");
    if (!container) return;

    container.innerHTML = "";

    // 2. Check karo ki data array hai ya nahi (TypeError fix karne ke liye)
    if (!Array.isArray(notifications) || notifications.length === 0) {
      container.innerHTML =
        '<p style="padding:15px; color:gray; text-align:center;">Abhi koi alert nahi hai.</p>';
      return;
    }

    // 3. Purane messages ko list mein dikhana
    notifications.forEach((notif) => {
      const title = notif.senderName || "Admin Alert"; // Model se match karo
      const message = notif.message;
      const time = notif.date
        ? new Date(notif.date).toLocaleString() // Poora date-time dikhao
        : "Recent";

      const html = `
        <div class="notif-item" style="border-bottom: 1px solid #444; padding: 12px;">
            <p style="margin:0; color:#fff;">🚀 <b>${title}:</b> ${message}</p>
            <small style="color: #bbb;">${time}</small>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    console.error("Error loading alerts:", err);
  }
}

// Page load hote hi purane alerts dikhao
document.addEventListener("DOMContentLoaded", loadNotifications);

// --- 3. Real-Time Update (Backend: io.emit("admin_alert") se match) ---
socket.on("new_alert", (data) => {
  console.log("🚀 Admin se real-time alert aaya:", data);

  const title = data.title || "📢 Admin Alert";
  const message = data.message || "Naya message aaya hai!";

  // ✅ STEP 1: Turant Screen pe Alert Popup (Browser Alert)
  alert(`📢 ${title}\n\n${message}`);

  // ✅ STEP 2: Desktop Notification (Agar permission hai)
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }

  // ✅ STEP 3: Notification Panel Update (Bina refresh kiye)
  const container = document.getElementById("notif-list");
  if (container) {
    // Agar "Abhi koi alert nahi hai" likha hai toh use saaf karo
    if (container.innerText.includes("Abhi koi alert nahi hai")) {
      container.innerHTML = "";
    }

    const newHTML = `
      <div class="notif-item unread" style="background: #2d2d3d; animation: fadeIn 0.5s; border-bottom: 1px solid #444; padding: 12px; border-left: 4px solid #a020f0;">
        <p style="margin:0; color:#fff;">🚀 <b>${title}:</b> ${message}</p>
        <small style="color: #bbb;">${new Date().toLocaleTimeString()}</small>
      </div>
    `;

    // Naya message sabse upar dikhao
    container.insertAdjacentHTML("afterbegin", newHTML);

    // Ghanti (Bell) pe badge dikhao (Agar hai toh)
    const badge = document.getElementById("notif-count");
    if (badge) {
      badge.style.display = "block";
      let count = parseInt(badge.innerText) || 0;
      badge.innerText = count + 1;
    }
  }
});

// --- 4. Global Functions (Bahar se call karne ke liye) ---
window.toggleNotifications = async function () {
  const panel = document.getElementById("notification-panel");
  if (!panel) return;

  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
    // Badge hide kar do jab panel khul jaye
    const badge = document.getElementById("notif-count");
    if (badge) badge.style.display = "none";
  } else {
    panel.style.display = "none";
  }
};

// --- 3. Clear All Notifications Function ---
const clearBtn = document.getElementById("clear-all-notifs");
if (clearBtn) {
  clearBtn.addEventListener("click", async () => {
    if (!confirm("Confirm Clear All?")) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        window.API_BASE_URL + '/api/notifications/clear-all',
        {
          method: "DELETE",
          headers: { "x-auth-token": token },
        },
      );

      if (response.ok) {
        fetchNotifications(); // UI refresh karne ke liye
        alert("Cleared successfully!");
      }
    } catch (err) {
      console.error("Clear Error:", err);
    }
  });
}

// Page load par fetch call karo
window.onload = fetchNotifications;

// Permission maangna browser notification ke liye
if (
  Notification.permission !== "granted" &&
  Notification.permission !== "denied"
) {
  Notification.requestPermission();
} // socket.io connection (end.)

/* ============================================================
   🚀 BR30 TRADER - ULTRA PRO MAX DYNAMIC PAYMENT ENGINE
============================================================ */

// 1. ✨ DYNAMIC PRICE LOADER: Database se latest price uthane ke liye
async function loadLatestPrice() {
  try {
    const res = await fetch(window.API_BASE_URL + '/api/courses');
    const courses = await res.json();

    const course = courses[0] || courses;

    if (course) {
      const priceElement = document.getElementById("course-price");
      if (priceElement) {
        priceElement.innerText = `₹${course.price}`;
        console.log("✅ Price Updated from DB: ₹", course.price);
      }

      document.querySelectorAll(".payBtn").forEach((btn) => {
        btn.setAttribute("data-id", course._id);
        btn.dataset.id = course._id;
      });
    }
  } catch (err) {
    console.error("❌ Price Load Error:", err);
  }
}

// 🔥 WhatsApp Retry Function (NEW ADD)
async function retryWhatsApp(courseId) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const message = `Hi BR30 Team, mera payment fail ho gaya hai.

Name: ${user?.name || "N/A"}
Email: ${user?.email || "N/A"}
Course ID: ${courseId}

Please help me retry.`;

    const url = `https://wa.me/917488802267?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  } catch (err) {
    console.error("WhatsApp Error:", err);
  }
}

// 2. 💳 MAIN CHECKOUT FUNCTION
const checkout = async function (courseId) {
  console.log("🚀 Checkout Started for ID:", courseId);
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Bhai, pehle login karo!",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  const sendStatusAlert = async (status, reason) => {
    try {
      await fetch(window.API_BASE_URL + '/api/payment/payment-failed', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          courseId: courseId,
          status: status,
          reason: reason,
        }),
      });
      console.log(`📡 Alert Sent to Team: ${status}`);
    } catch (err) {
      console.error("❌ Alert Error:", err);
    }
  };

  sendStatusAlert(
    "INTERESTED",
    "User ne Buy Now dabaya hai (Checkout Screen Opened).",
  );

  try {
    const res = await fetch(window.API_BASE_URL + '/api/payment/order', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ courseId: courseId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Order failed!");

    const options = {
      key: "rzp_test_SMoo8eTbcEjuw",
      amount: data.order.amount,
      currency: "INR",
      name: "BR30TRADER ACADEMY",
      description: "VIP Enrollment 🏆",
      order_id: data.order.id,

      handler: async function (response) {
        const verifyRes = await fetch(
          window.API_BASE_URL + '/api/payment/verify',
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: courseId,
            }),
          },
        );

        if (verifyRes.ok) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful 🎉",
            text: "Course Unlock ho gaya!",
          }).then(() => {
            window.location.href = "mycourse.html";
          });
        } else {
          sendStatusAlert("FAILED", "Payment verify failed");

          Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text: "Retry via WhatsApp support",
            confirmButtonText: "Retry on WhatsApp",
          }).then(() => {
            retryWhatsApp(courseId);
          });
        }
      },

      modal: {
        ondismiss: function () {
          sendStatusAlert(
            "ABANDONED",
            "User ne payment window band kar di (No completion).",
          );

          Swal.fire({
            icon: "warning",
            title: "Payment Cancelled",
            text: "Retry via WhatsApp support",
            confirmButtonText: "Retry on WhatsApp",
          }).then(() => {
            retryWhatsApp(courseId);
          });
        },
      },

      theme: { color: "#00ff88" },
    };

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", function (response) {
      sendStatusAlert(
        "FAILED",
        `Actual Bank Failure: ${response.error.description}`,
      );

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: response.error.description,
        confirmButtonText: "Retry on WhatsApp",
      }).then(() => {
        retryWhatsApp(courseId);
      });
    });

    rzp.open();
  } catch (err) {
    console.error("Error Detail:", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message,
    });
  }
};

// 🎬 INITIALIZE: DOM Load hote hi logic active karo
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ BR30 ULTRA System Active");

  loadLatestPrice(); // 1. Sabse pehle DB se Latest Price load karo

  // 2. Click Listeners set karo (type="module" safe way)
  document.body.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("payBtn")) {
      const id = e.target.getAttribute("data-id") || e.target.dataset.id;
      if (id) checkout(id);
    }
  });
});

// Window objects for global access
window.checkout = checkout;
window.toggleNotifications = function () {
  const dropdown = document.getElementById("notif-dropdown");
  if (dropdown)
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
};

// 2. Bell Notification Function Fix
window.toggleNotifications = async function () {
  const dropdown = document.getElementById("notif-dropdown");
  if (dropdown) {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  }
};

/* ============================================
     Admin Send email Logic 
============================================ */
// --- 1. Ye raha wo function jo aapne pucha tha ---
const sendMail = async (subject, message) => {
  const token = localStorage.getItem("token"); // JWT Token uthaya

  if (!token) {
    alert("Bhai, login expire ho gaya hai!");
    return;
  }

  try {
    const res = await fetch(window.API_BASE_URL + '/api/admin/send-all-email', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token, // Backend auth check karega
      },
      body: JSON.stringify({ subject, message }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ " + data.msg);
    } else {
      alert("❌ Error: " + data.msg);
    }
  } catch (err) {
    console.error("Email Fetch Error:", err);
    alert("Backend se connect nahi ho paya!");
  }
};

// --- 2. Button Click par function ko chalao ---
const sendBtn = document.getElementById("send-bulk-btn");
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    const sub = document.getElementById("email-subject").value;
    const msg = document.getElementById("email-message").value;

    if (!sub || !msg) {
      alert("Subject aur Message toh likho bhai!");
      return;
    }

    sendBtn.innerText = "Bhej raha hoon..."; // Loader feel
    sendBtn.disabled = true;

    sendMail(sub, msg).then(() => {
      sendBtn.innerText = "Sabko Mail Bhejo";
      sendBtn.disabled = false;
    });
  });
}

/* ============================================
   VIP Trader 
============================================ */
const API_URL = window.API_BASE_URL + '/';
let allTraders = [];
let currentIndex = 0;
const itemsPerPage = 6; // अब 6 नाम एक साथ दिखेंगे (3 लेफ्ट, 3 राइट)

async function fetchTraders() {
  try {
    const res = await fetch(window.API_BASE_URL + '/api/courses/leaderboard');
    allTraders = await res.json();
    if (allTraders.length > 0) displayNextBatch();
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

function displayNextBatch() {
  const listContainer = document.getElementById("topTradersList");
  if (!listContainer || allTraders.length === 0) return;

  listContainer.style.opacity = "0";

  setTimeout(() => {
    listContainer.innerHTML = "";
    const batch = allTraders.slice(currentIndex, currentIndex + itemsPerPage);

    batch.forEach((trader, index) => {
      const globalIndex = currentIndex + index + 1;
      const rawPath = trader.profilePic || "";
      let userPic;

      // 1. Check karo ki photo Cloudinary ki hai ya purani local wali
      if (rawPath && typeof rawPath === "string" && rawPath.length > 5) {
        if (rawPath.startsWith("http")) {
          // ✅ Case A: Cloudinary URL (Direct use karo)
          userPic = rawPath;
        } else {
          // ✅ Case B: Purani Local Photo (Uploads folder se uthao)
          const fileName = rawPath.split(/[\\/]/).pop();
          userPic = `${window.API_BASE_URL}/uploads/${fileName}`;
        }
      } else {
        // ❌ Case C: Photo nahi hai toh Avatar dikhao
        userPic = `https://ui-avatars.com/api/?name=${encodeURIComponent(trader.name)}&background=111&color=00ff88&bold=true`;
      }

      const row = `
        <div class="trader-item" style="animation-delay: ${index * 0.05}s;">
            <span class="rank-num">#${globalIndex}</span>
            <img src="${userPic}" class="user-avatar" 
                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(trader.name)}&background=111&color=00ff88&bold=true'">
            <span class="user-name">${trader.name}</span>
            <span class="vip-badge">💎VIP</span>
        </div>
    `;
      listContainer.insertAdjacentHTML("beforeend", row);
    });

    listContainer.style.opacity = "1";
    currentIndex =
      currentIndex + itemsPerPage >= allTraders.length
        ? 0
        : currentIndex + itemsPerPage;
  }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchTraders();
  setInterval(displayNextBatch, 5000); // 5 सेकंड में स्लाइड बदलेगी
});

// SEND BULK EMAIL VIP, TOTAL USER, NORMAL USER
async function sendBulkMail() {
  const target = document.getElementById("mail-target").value;
  const subject = document.getElementById("mail-subject").value;
  const htmlContent = document.getElementById("mail-body").value;

  try {
    const response = await fetch("/api/send-offers", {
      // Sahi API path check karein
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        target: target, // "all", "vip", ya "normal"
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    const data = await response.json();
    alert(data.message);
  } catch (err) {
    alert("Server error: " + err.message);
  }
}

/* ========================================================================
     🚀 PRO LEVEL SYNC: Price, Title & Specific Thumbnail (Auto-Refresh)
======================================================================== */
async function syncLatestPrices() {
  try {
    const res = await fetch(window.API_BASE_URL + "/api/courses");
    const courses = await res.json();

    // 💡 BASE_URL (UPLOADS)
    const UPLOADS_URL = `${window.API_BASE_URL}/uploads/`;

    courses.forEach((course) => {
      // 🎯 STEP 1: Specific Card dhoondo
      const card = document.querySelector(`.poster-card[data-id="${course._id}"]`);

      if (card) {
        console.log(`Updating Course: ${course.title}`);

        // ✅ STEP 2: THUMBNAIL UPDATE (Double Path Fix)
        const imgTag = card.querySelector(".course-img");
        if (imgTag && course.thumbnail) {

          // 🛠️ Agar database se '/uploads/' pehle se aa raha hai, toh use hata do
          const cleanThumbnail = course.thumbnail.replace('/uploads/', '');

          const fullPath = course.thumbnail.startsWith("http")
            ? course.thumbnail
            : `${window.API_BASE_URL}/uploads/${cleanThumbnail}`;

          console.log("Asli Image Link:", fullPath); // Ab ye single /uploads/ dikhayega
          imgTag.src = `${fullPath}?t=${new Date().getTime()}`;
          console.log(`🖼️ Thumbnail Updated for: ${course.title}`);
        }


        // ✅ STEP 3: PRICE UPDATE
        const priceTag = card.querySelector("p.price");
        if (priceTag) {
          const formattedPrice = Number(course.price).toLocaleString("en-IN");
          priceTag.innerText = `Price: ₹${formattedPrice}`;
        }

        // ✅ STEP 4: TITLE UPDATE
        const titleTag = card.querySelector(".course-title");
        if (titleTag && course.title) {
          titleTag.innerText = course.title;
        }

        // ✅ STEP 5: ENROLL BUTTON (PayBtn)
        const payBtn = card.querySelector(".payBtn");
        if (payBtn) {
          payBtn.setAttribute("data-id", course._id);
          payBtn.setAttribute("data-course", course.title);
        }
      } else {
        console.warn(`Card with ID ${course._id} not found in HTML!`);
      }
    });

    // 🔥 MAGIC STEP: Smooth display
    const grid = document.querySelector(".poster-grid");
    if (grid) {
      grid.style.opacity = "1";
    }
    console.log("✅ Webpage Fully Synced & Smoothly Loaded!");

  } catch (err) {
    console.error("❌ Sync Error:", err);
    const grid = document.querySelector(".poster-grid");
    if (grid) grid.style.opacity = "1";
  }
}

// Page load hone par prices aur data sync karo
document.addEventListener("DOMContentLoaded", syncLatestPrices);

// COUPEN OFFER DISCOUNT LOGIC cousrs scetion oneclick coupen apply
// 1. GLOBAL VARIABLE
// 1. GLOBAL VARIABLE
// 1. Global Variable
let currentCoupon = null;

// 2. ⏳ Load Coupon Function
async function loadLatestCoupon() {
  console.log("🔍 Checking for Discount...");
  try {
    // Pura URL use karo taaki error na aaye
    const res = await fetch(window.API_BASE_URL + '/api/auth/latest-coupon');
    const data = await res.json();

    if (data.success && data.coupon) {
      currentCoupon = data.coupon;

      // 🎯 Boxes ko dhundo
      const boxes = document.querySelectorAll(".coupon-display-box");
      if (boxes.length === 0) {
        console.error("❌ Error: HTML mein '.coupon-display-box' nahi mila!");
        return;
      }

      boxes.forEach((box) => {
        box.style.display = "block"; // 🔥 Dikhao box ko

        // Code aur Discount update
        const codeSpan = box.querySelector(".active-code");
        if (codeSpan) codeSpan.innerText = currentCoupon.code;

        const discLabel = box.querySelector(".discount-val");
        if (discLabel) discLabel.innerText = currentCoupon.discount;

        // ⏳ Countdown logic
        let expiryTag = box.querySelector(".expiry-countdown");
        if (!expiryTag) {
          expiryTag = document.createElement("div");
          expiryTag.className = "expiry-countdown";
          expiryTag.style =
            "color: #f87171; font-size: 11px; margin-top: 8px; font-weight: 800; text-transform: uppercase; animation: blink-expiry 1.5s infinite;";
          box.appendChild(expiryTag);
        }
        expiryTag.innerText = `⏳ Only ${data.daysLeft || 7} Days Left!`;
      });
      console.log("✅ Coupon Loaded Successfully!");
    } else {
      console.log("ℹ️ No active coupon found.");
      document
        .querySelectorAll(".coupon-display-box")
        .forEach((box) => (box.style.display = "none"));
    }
  } catch (e) {
    console.error("❌ Fetch Error:", e);
  }
}

// 3. Page Load Par Chalao
window.addEventListener("load", loadLatestCoupon);

// 3. ✨ MAIN EVENT LISTENER
document.addEventListener("DOMContentLoaded", () => {
  // Coupon load karo
  loadLatestCoupon();

  // Click Events
  document.addEventListener("click", async function (e) {
    const target = e.target;

    // --- A. APPLY COUPON LOGIC ---
    if (target.classList.contains("apply-coupon-btn")) {
      if (!currentCoupon)
        return alert("Bhai, filhal koi coupon available nahi hai.");

      const card = target.closest(".poster-card");
      const priceElement = card.querySelector(".price");

      let originalPrice = parseInt(
        priceElement.innerText.replace(/[^\d]/g, ""),
      );
      if (isNaN(originalPrice)) return;

      let discountAmount = (originalPrice * currentCoupon.discount) / 100;
      let newPrice = Math.round(originalPrice - discountAmount);

      // ✨ Price UI Update
      priceElement.innerHTML = `Price: 
        <span style="text-decoration: line-through; color: #94a3b8; font-size: 14px; margin-right: 8px;">₹${originalPrice.toLocaleString()}</span> 
        <b style="color: #4ade80; font-size: 20px; text-shadow: 0 0 10px rgba(74, 222, 128, 0.4);">₹${newPrice.toLocaleString()}</b>`;

      // ✅ Button Success
      target.innerHTML = `<i class="fas fa-check-circle"></i> Applied!`;
      target.style.background =
        "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
      target.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.4)";
      target.disabled = true;

      card.setAttribute("data-coupon-applied", "true");
    }

    // --- B. ENROLL NOW (PAYMENT) LOGIC ---
    if (target.classList.contains("payBtn")) {
      const courseId = target.getAttribute("data-id");
      const card = target.closest(".poster-card");
      const token = localStorage.getItem("token");

      if (!token) return alert("Bhai, pehle login kar lo!");

      const isCouponApplied =
        card.getAttribute("data-coupon-applied") === "true";
      const couponToSend = isCouponApplied ? currentCoupon.code : "";

      target.innerText = "Processing...";
      target.disabled = true;

      try {
        const res = await fetch(window.API_BASE_URL + '/api/auth/create-order', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: courseId,
            couponCode: couponToSend,
          }),
        });

        const data = await res.json();
        if (data.order) {
          alert(`Success! Final Price: ₹${data.finalPrice}`);
          // openRazorpay(data.order);
        } else {
          alert(data.msg || "Order creation failed!");
        }
      } catch (err) {
        alert("Server Connection Error!");
      } finally {
        target.innerText = "Enroll Now";
        target.disabled = false;
      }
    }
  });
});

// ✨ CSS Animation for Expiry Countdown
const styleTag = document.createElement("style");
styleTag.innerHTML = `
    @keyframes blink-expiry {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.02); }
        100% { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(styleTag);

// ⚡ AUTO-SYNC ENGINE: Database se ID aur Price button mein bharna
async function syncAdminData() {
  try {
    const res = await fetch(window.API_BASE_URL + '/api/courses');
    const courses = await res.json();

    courses.forEach((c) => {
      // 🎯 Database Title (e.g. 'Advance Option Buying') se card dhoondo
      const targetBtn = document.querySelector(
        `.payBtn[data-course="${c.title}"]`,
      );
      const targetPrice = document.querySelector(
        `.price[data-course="${c.title}"]`,
      );

      if (targetBtn) {
        // ✅ LATEST ID: Ab button mein Admin Panel wali nayi ID aa gayi
        targetBtn.setAttribute("data-id", c._id);
        targetBtn.dataset.id = c._id;
        console.log(`✅ ID Updated for: ${c.title} -> ${c._id}`);
      }

      if (targetPrice) {
        // 💰 LATEST PRICE: Price bhi database wala chamkega
        targetPrice.innerText = `Price: ₹${Number(c.price).toLocaleString("en-IN")}`;
      }
    });
  } catch (err) {
    console.error("❌ Sync Logic Fail:", err);
  }
}

// WhaatsApp Link Retry Logic (Agar pehle fail hua tha toh)
// 🔥 FUTURE FEATURE: Dynamic WhatsApp Link (Currently not in use)
async function retryWhatsApp() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const response = await axios.post("/api/whatsapp-link", {
      name: user.name,
      email: user.email,
      course: "Trading Course"
    });

    const url = response.data.url;

    window.open(url, "_blank");

  } catch (error) {
    console.error("WhatsApp error:", error);
    alert("Something went wrong");
  }
}
//#endregion


