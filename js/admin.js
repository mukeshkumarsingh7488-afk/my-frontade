//#region
/**
 * 1. GLOBAL SETTINGS & AUTH CHECK
 */
const BASE_URL = `${window.API_BASE_URL}/api/courses`;
const token = localStorage.getItem("token");

if (!token) {
  alert("Security Alert: Admin login required! 🔑");
  window.location.href = "login.html";
} else {
  console.log("🔑 Admin Token Found:", token);
}

/**
 * 2. FUNCTION: Load Courses (Dropdown Bharne ke liye)
 */
async function loadCourses() {
  console.log("📡 Fetching courses for dropdown...");
  try {
    const res = await fetch(window.API_BASE_URL);
    const courses = await res.json();
    const select = document.getElementById("courseSelect");

    if (!select) return;

    select.innerHTML = '<option value="">-- Choose Target Course --</option>';
    courses.forEach((c) => {
      select.innerHTML += `<option value="${c._id}">${c.title}</option>`;
    });
    console.log("✅ Dropdown Updated!");
  } catch (err) {
    console.error("❌ Dropdown Load Error:", err);
  }
}

/**
 * 3. FUNCTION: Create Course (Step 1)
 */
document.getElementById("courseForm").onsubmit = async (e) => {
  e.preventDefault();
  console.log("🚀 Publishing Course...");

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("thumbnail", document.getElementById("thumbnail").files[0]);

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/courses/add`, {
      method: "POST",
      headers: { "x-auth-token": token },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Course Ban Gaya Bhai!");
      loadCourses();
      e.target.reset();
    } else {
      alert("❌ Error: " + (data.msg || "Server ne mana kar diya"));
      console.log("Server Response:", data);
    }
  } catch (err) {
    console.error("🔥 Fetch Error:", err);
    alert("Server connect nahi ho raha!");
  }
};

/**
 * 4. FUNCTION: Add Video (Step 2)
 */
document.getElementById("videoForm").onsubmit = async (e) => {
  e.preventDefault();

  const courseId = document.getElementById("courseSelect").value;
  if (!courseId) return alert("Pehle Course select karle bhai! 🛑");

  const videoData = {
    title: document.getElementById("videoTitle").value,
    videoUrl: document.getElementById("videoUrl").value,
  };

  console.log("📹 Adding Video to ID:", courseId);

  try {
    const res = await fetch(
      window.window.API_BASE_URL + `/api/courses/add-video/${courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(videoData),
      },
    );

    const data = await res.json();
    if (res.ok) {
      alert("📹 Video successfully add ho gayi!");
      e.target.reset();
    } else {
      alert("❌ Error: " + (data.msg || "Update Fail"));
    }
  } catch (err) {
    console.error("🔥 Video Fetch Error:", err);
  }
};

/**
 * 5. ENTER KEY LOGIC (Focus Switch)
 */
const allInputs = document.querySelectorAll("input, textarea, select");
allInputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = allInputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  });
});

// Initial Load
window.onload = loadCourses;
//#endregion
