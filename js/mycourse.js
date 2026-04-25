//#region
const courseDiv = document.getElementById("courseContent");
const token = localStorage.getItem("token");

const baseUrl = window.API_BASE_URL || "https://my-backend-1-avpd.onrender.com";

if (!token) {
  alert("Please login first!");
  window.location.href = "login.html";
} else {
  fetchMyCourses();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchMyCourses();
});

async function fetchMyCourses() {
  try {
    courseDiv.innerHTML =
      "<p style='color:#94a3b8;'>Loading your courses...</p>";

    const res = await fetch(`${baseUrl}/api/courses/my-courses`, {
      method: "GET",
      headers: { "x-auth-token": token },
    });

    const courses = await res.json();

    if (res.status === 401 || res.status === 403) {
      alert("Session expired, please login again.");
      window.location.href = "login.html";
      return;
    }

    if (!courses || courses.length === 0) {
      courseDiv.innerHTML = `
          <h2>No Courses Found 🔒</h2>
          <p style="color:#94a3b8;">Aapne abhi tak koi course purchase nahi kiya hai.</p>
          <button onclick="window.location.href='index.html#coursesection'">
            Browse Courses
          </button>
        `;
      return;
    }

    let html = `
        <h2>Welcome Back!</h2>
        <p style="color:#94a3b8; margin-bottom:20px;">Your purchased courses:</p>
      `;

    courses.forEach((course) => {
      const thumbUrl = course.thumbnail
        ? course.thumbnail.startsWith("http")
          ? course.thumbnail
          : `${baseUrl}/${course.thumbnail}`
        : "https://via.placeholder.com/300x200?text=No+Image";

      html += `
          <div class="course-card">
            <img 
              src="${thumbUrl}" 
              alt="${course.title}" 
              onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
            >
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <button onclick="watchCourse('${course._id}')">
              Watch Now
            </button>
          </div>
        `;
    });

    courseDiv.innerHTML = html;
  } catch (err) {
    console.error("Error:", err);
    courseDiv.innerHTML =
      "<p style='color:#f87171;'>Connection error. Please try again later.</p>";
  }
}

function watchCourse(courseId) {
  window.location.href = `watch.html?id=${courseId}`;
}
//#endregion
