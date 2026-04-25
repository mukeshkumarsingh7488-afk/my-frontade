//#region
/* ============================================================
       📦 GLOBAL STATE: Data ko store karne ke liye variables
       ============================================================ */
let allUsers = []; // Saare users ki list yahan rahegi
let allSales = []; // Sales reports ka data yahan rahegi

/* ============================================================
       🚀 INITIALIZATION: Page load hote hi dono tables bharna
       ============================================================ */
window.onload = async () => {
  console.log("🚀 Admin Panel Loading...");
  await fetchUsers();
  await loadSalesData();
};

/* ============================================================
       👥 USER MANAGEMENT FUNCTIONS: Backend se connection
       ============================================================ */

// 🔍 1. FETCH USERS: Backend API se User + Certificate data nikalna
async function fetchUsers() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${window.API_BASE_URL}/api/auth/all-users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.success) {
      allUsers = data.users;
      renderTable(allUsers);
    }
  } catch (err) {
    console.error("❌ User Fetch Error:", err);
  }
}

// ✨ 2. RENDER TABLE: User list ko HTML mein convert karna (With Certificate Icon)
function renderTable(users) {
  const list = document.getElementById("user-list");
  if (!list) return;

  list.innerHTML = users
    .map((u) => {
      const certIcon = u.certificateFile
        ? `<td style="padding: 15px; text-align: center;">
                <a href="${window.API_BASE_URL}/certificates/${u.certificateFile}" target="_blank" style="color:#00ff88; text-decoration:none; display:inline-flex; flex-direction:column; align-items:center;">
                    <i class="fas fa-file-pdf" style="font-size:18px;"></i>
                    <span style="font-size:9px; font-weight:bold;">VIEW</span>
                </a>
            </td>`
        : `<td style="padding: 15px; text-align: center; color:#334155; font-size:10px; font-weight:bold;">PENDING</td>`;

      return `
            <tr style="border-bottom: 1px solid #111; opacity: ${u.isBlocked ? "0.5" : "1"}; transition: 0.3s;">
                <td style="padding: 15px; color: white; font-weight: bold;">${u.name}</td>
                <td style="padding: 15px; color: #94a3b8; font-size: 13px;">${u.email}</td>
                <td style="padding: 15px; text-align:center;">
                    <span style="background: ${u.isVip ? "#a020f0" : "#334155"}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight:bold;">
                        ${u.isVip ? "💎 VIP" : "Normal"}
                    </span>
                </td>
                <td style="padding: 15px; text-align:center; white-space: nowrap;">
                    <!-- 💎 VIP TOGGLE -->
                    <button onclick="toggleVIP('${u._id}')" style="background:#a020f0; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:10px; font-weight:bold; margin-right:5px;">VIP</button>
                    
                    <!-- 🚫 BLOCK TOGGLE: Ek hi button se Block/Unblock -->
                    <button onclick="toggleBlock('${u._id}')" style="background:${u.isBlocked ? "#00ff88" : "#fbbf24"}; color:black; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:10px; font-weight:bold; width: 75px;">
                        ${u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    
                    <!-- 🗑️ DELETE USER -->
                    <button onclick="deleteUser('${u._id}')" style="background:#f87171; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:10px; font-weight:bold; margin-left:5px;">DEL</button>
                </td>
                ${certIcon}
            </tr>
        `;
    })
    .join("");
}

/* ============================================================
       🛠️ ACTION HANDLERS: Buttons par click karne wala logic
       ============================================================ */

// 🔄 1. VIP TOGGLE: Normal <-> VIP switch
async function toggleVIP(id) {
  try {
    const res = await fetch(
      `${window.API_BASE_URL}/api/auth/update-vip/${id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    const data = await res.json();
    if (data.success) fetchUsers();
  } catch (err) {
    console.error("VIP Toggle Error:", err);
  }
}

// 🚫 2. BLOCK TOGGLE: User ko rokna ya allow karna
async function toggleBlock(id) {
  try {
    const res = await fetch(
      `${window.API_BASE_URL}/api/auth/block-user/${id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    const data = await res.json();
    if (data.success) fetchUsers();
  } catch (err) {
    console.error("Block Toggle Error:", err);
  }
}

// 🗑️ 3. DELETE USER: User ko database se poori tarah udaana
async function deleteUser(id) {
  if (!confirm("Bhai, pakka udaana hai? (Soche samjhe bina mat dabao!)"))
    return;
  try {
    const res = await fetch(
      `${window.API_BASE_URL}/api/auth/delete-user/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    const data = await res.json();
    if (data.success) fetchUsers();
  } catch (err) {
    console.error("Delete Error:", err);
  }
}

/* ============================================================
       📅 USER DATE FILTER: Registration date ke hisab se filter
       ============================================================ */

// 🔍 1. FILTER BY DATE: MongoDB data se super fast filtering
function filterByDate(selectedDate) {
  if (!selectedDate) return;

  const btn = document.getElementById("show-all-btn");
  if (btn) {
    btn.style.background = "transparent";
    btn.style.color = "#64748b";
    btn.style.borderColor = "#333";
  }
  const filtered = allUsers.filter((u) => {
    if (!u.createdAt) return false;

    const userDate = new Date(u.createdAt).toISOString().split("T")[0];
    return userDate === selectedDate;
  });

  renderTable(filtered);

  const label = document.getElementById("filter-label");
  if (label) label.innerText = `Date: ${selectedDate}`;
}

// 🔄 2. RESET USER FILTER: Wapas saari list dikhao
function loadAllUsers() {
  document.getElementById("date-picker").value = "";

  const btn = document.getElementById("show-all-btn");
  if (btn) {
    btn.style.background = "#00ff88";
    btn.style.color = "#000";
    btn.style.borderColor = "#00ff88";
  }

  renderTable(allUsers);

  const label = document.getElementById("filter-label");
  if (label) label.innerText = `Showing: All Students`;
}

/* ============================================================
       📊 SALES REPORT & DOWNLOAD: Business performance logic
       ============================================================ */

// 📥 1. DOWNLOAD CSV: Sales report ko Excel format mein nikalna
function downloadSalesReport() {
  const table = document.querySelector(".sales-container table");
  if (!table) return alert("Bhai, pehle data load hone do!");

  let csvRows = [];
  const rows = table.querySelectorAll("tr");

  for (let i = 0; i < rows.length; i++) {
    const rowData = [];
    const cols = rows[i].querySelectorAll("td, th");

    for (let j = 0; j < cols.length; j++) {
      let data = cols[j].innerText.replace(/,/g, "").trim();
      rowData.push(`"${data}"`);
    }
    csvRows.push(rowData.join(","));
  }

  const BOM = "\uFEFF";
  const csvString = BOM + csvRows.join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const date = new Date().toLocaleDateString("en-IN").replace(/\//g, "-");
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", `BR30_Sales_Report_${date}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log("✅ Sales Report Downloaded!");
}

/* ============================================================
       📅 SALES DATE RANGE: Calendar filter for Business
       ============================================================ */

// 🚀 1. APPLY RANGE: Do dates ke beech ka sales data
async function applyCalendarFilter() {
  const start = document.getElementById("salesStartDate").value;
  const end = document.getElementById("salesEndDate").value;

  if (!start || !end) {
    return alert("Bhai, 'Start' aur 'End' dono dates select karo!");
  }
  loadSalesData(start, end);
}

// 🔄 2. RESET SALES: Sales report ko reset karna
function resetSalesFilter() {
  document.getElementById("salesStartDate").value = "";
  document.getElementById("salesEndDate").value = "";
  loadSalesData(); // 'All' data load hoga
}

// 📋 3. SALES DATA FETCHER: Revenue aur Table load karna
async function loadSalesData(startDate = "", endDate = "") {
  const showAllBtn = document.getElementById("show-all-btn");
  const applyBtn = document.getElementById("apply-btn");

  if (!startDate && !endDate) {
    if (showAllBtn) {
      showAllBtn.style.background = "#00ff88";
      showAllBtn.style.color = "black";
    }
  } else {
    if (showAllBtn) {
      showAllBtn.style.background = "rgba(255,255,255,0.05)";
      showAllBtn.style.color = "#94a3b8";
    }
    if (applyBtn) {
      applyBtn.style.background = "#00ff88";
      applyBtn.style.color = "black";
    }
  }

  try {
    const url = `${window.API_BASE_URL}/api/auth/sales-history?startDate=${startDate}&endDate=${endDate}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById("total-revenue").innerText =
        `₹${data.totalRevenue.toLocaleString("en-IN")}`;

      const counts = {};
      data.sales.forEach((sale) => {
        const title =
          sale.courseName || (sale.course ? sale.course.title : null);
        if (title) counts[title] = (counts[title] || 0) + 1;
      });
      const bestSeller = Object.keys(counts).reduce(
        (a, b) => (counts[a] > counts[b] ? a : b),
        "No Sales",
      );

      if (document.getElementById("best-course-name")) {
        document.getElementById("best-course-name").innerText =
          bestSeller.toUpperCase();
      }

      // 📝 Render Sales Table
      document.getElementById("sales-table-body").innerHTML = data.sales
        .map(
          (sale) => `
            <tr style="border-bottom: 1px solid #111;">
                <td style="padding: 15px; color: white;">${sale.user?.email || "Unknown"}</td>
                <td style="padding: 15px; color: #00ff88; font-weight: bold;">${sale.courseName || sale.course?.title}</td>
                <td style="padding: 15px; color: white; font-weight: 800;">₹${sale.amount}</td>
                <td style="padding: 15px; font-size: 11px; opacity: 0.7;">${new Date(sale.createdAt).toLocaleString("en-IN")}</td>
            </tr>`,
        )
        .join("");
    }
  } catch (err) {
    console.error("❌ Sales Data Error:", err);
  }
}
//#endregion
