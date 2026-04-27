//#region
/* ========================================================================
           🚀 PRO LEVEL ADMIN DASHBOARD: Full Sync with Pro Comments
      ======================================================================== */

// 🌐 1. FETCH COURSES: Database se saare courses nikaal kar grid mein dikhana
async function fetchCourses() {
  try {
    const res = await fetch(`${window.API_BASE_URL}/api/courses`);
    const courses = await res.json();

    const grid = document.getElementById("course-grid");

    const BASE_URL = window.API_BASE_URL;

    grid.style.opacity = "0";
    grid.innerHTML = "";

    let imagesLoadedCount = 0;
    const totalImages = courses.length;

    if (totalImages === 0) {
      grid.innerHTML =
        "<p style='text-align:center; color:#64748b; width:100%;'>Abhi tak koi course nahi hai bhai!</p>";
      grid.style.opacity = "1";
      return;
    }

    courses.forEach((c) => {
      const card = document.createElement("div");
      card.className = "course-card";

      const displayImage = c.thumbnail
        ? (c.thumbnail.startsWith("http")
            ? c.thumbnail
            : (BASE_URL + "/" + c.thumbnail).replace(/([^:]\/)\/+/g, "$1")) +
          `?t=${Date.now()}`
        : "images/BR30Trader.png";

      card.innerHTML = `
                <div style="background: rgba(160, 32, 240, 0.1); border: 1px dashed #a020f0; padding: 6px; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 10px; color: #a020f0; font-weight: bold; font-family: 'Courier New', monospace;">ID: ${c._id}</span>
                    <button onclick="copyID('${c._id}')" title="Copy ID" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 14px;">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>

                <img src="${displayImage}" class="course-img-preview" alt="course" style="border-radius: 10px; margin-bottom: 10px; width:100%; height:150px; object-fit:cover; background: #111;">

                <h3 style="color:#fff; margin-bottom: 8px; font-size: 18px;">${c.title}</h3>
                <p class="price" style="color:#00ff88; font-weight:800; font-size: 22px; margin-bottom: 15px;">
                    ₹${Number(c.price).toLocaleString("en-IN")}
                </p>

                <div class="actions" style="display:flex; gap:10px;">
                    <button class="edit-btn" style="flex:2; background:#a020f0; color:white; border:none; padding:12px; border-radius:10px; cursor:pointer; font-weight:bold;">
                        <i class="fas fa-edit"></i> EDIT FULL COURSE
                    </button>
                    <button class="del-btn" style="flex:1; background:#ef4444; color:white; border:none; border-radius:10px; cursor:pointer;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

      const img = card.querySelector(".course-img-preview");
      img.onload = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === totalImages) {
          grid.style.opacity = "1";
        }
      };
      img.onerror = img.onload;

      card.querySelector(".edit-btn").onclick = () =>
        openEdit(c._id, c.title, c.price, c.thumbnail, c.videoUrl);
      card.querySelector(".del-btn").onclick = () => deleteCourse(c._id);

      grid.appendChild(card);
    });

    setTimeout(() => {
      grid.style.opacity = "1";
    }, 2500);
  } catch (err) {
    console.error("Fetch Error:", err);
    document.getElementById("course-grid").style.opacity = "1";
  }
}

// 📋 2. 1-CLICK COPY: Course ID copy karne ka feature
window.copyID = (id) => {
  navigator.clipboard.writeText(id);
  Swal.fire({
    title: "ID Copied! ✅",
    text: id,
    timer: 1000,
    showConfirmButton: false,
    background: "#0a0a0a",
    color: "#00ff88",
  });
};

// ✍️ 3. EDIT POPUP: SweetAlert se course details badalna aur thumbnail upload karna
async function openEdit(id, title, price, image, videoUrl) {
  const { value: formValues } = await Swal.fire({
    title: '<span style="color:#a020f0">Edit Full Course</span>',
    background: "#0a0a0a",
    color: "#fff",
    html: `
            <div style="text-align:left; padding: 0 10px;">
                <label style="font-size:12px; color:#64748b;">Course Title</label>
                <input id="sw-title" class="swal2-input" value="${title}" style="background:#111; color:white; border-color:#a020f0; margin-top:5px; width:85%;">

                <label style="font-size:12px; color:#64748b;">Price (INR)</label>
                <input id="sw-price" class="swal2-input" value="${price}" type="number" style="background:#111; color:white; border-color:#a020f0; margin-top:5px; width:85%;">

                <label style="font-size:12px; color:#64748b;">Thumbnail (Folder se Select Karo)</label>
                <input type="file" id="sw-file" class="swal2-input" accept="image/*" style="background:#111; color:white; border-color:#a020f0; margin-top:5px; width:85%; padding:10px; font-size:12px;">

                <label style="font-size:12px; color:#64748b;">Video Link</label>
                <input id="sw-video" class="swal2-input" value="${videoUrl || ""}" style="background:#111; color:white; border-color:#a020f0; margin-top:5px; width:85%;">
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: "SAVE CHANGES 🚀",
    preConfirm: () => ({
      title: document.getElementById("sw-title").value,
      price: document.getElementById("sw-price").value,
      videoUrl: document.getElementById("sw-video").value,
      imageFile: document.getElementById("sw-file").files,
    }),
  });

  if (formValues) {
    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("price", formValues.price);
      formData.append("videoUrl", formValues.videoUrl);

      if (formValues.imageFile.length > 0) {
        formData.append("thumbnail", formValues.imageFile[0]);
      }

      const res = await fetch(
        `${window.API_BASE_URL}/api/courses/update-course/${id}`,
        {
          method: "PUT",
          headers: { "x-auth-token": localStorage.getItem("token") },
          body: formData,
        },
      );

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          title: "Updated!",
          icon: "success",
          background: "#0a0a0a",
          color: "#fff",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchCourses();
      }
    } catch (err) {
      console.error("Update fail:", err);
    }
  }
}

// 🗑️ 4. DELETE LOGIC: Course ko udaane ke liye conformation popup
async function deleteCourse(id) {
  const check = await Swal.fire({
    title: "Delete Course?",
    text: "Bhai, pakka udaana hai? Wapas nahi aayega!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    background: "#0a0a0a",
    color: "#fff",
  });

  if (check.isConfirmed) {
    try {
      const res = await fetch(
        `${window.API_BASE_URL}/api/courses/delete-course/${id}`,
        {
          method: "DELETE",
          headers: { "x-auth-token": localStorage.getItem("token") },
        },
      );
      if (res.ok) {
        Swal.fire({
          title: "Deleted!",
          icon: "success",
          background: "#0a0a0a",
          color: "#fff",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchCourses();
      }
    } catch (err) {
      console.error("Delete Fail:", err);
    }
  }
}

// Page load par courses nikaalo
document.addEventListener("DOMContentLoaded", fetchCourses);
//#endregion
