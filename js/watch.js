//#region
let player;
let currentCourseName = "";

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id");
const token = localStorage.getItem("token");

if (!token) window.location.href = "login.html";

// 🔥 STRONG YT ID FUNCTION (sab handle karega)
function getYTID(url) {
  try {
    console.log("🎥 Original URL:", url);

    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      console.log("✅ ID (youtu.be):", id);
      return id;
    }

    if (u.pathname.includes("/shorts/")) {
      const id = u.pathname.split("/shorts/")[1];
      console.log("✅ ID (shorts):", id);
      return id;
    }

    const id = u.searchParams.get("v");
    console.log("✅ ID (watch):", id);
    return id;
  } catch (err) {
    console.error("❌ URL Parse Error:", err);
    return null;
  }
}

// ✅ API READY
function onYouTubeIframeAPIReady() {
  console.log("✅ YouTube API Loaded");
  loadCourseContent();
}

// 🎥 LOAD COURSE
async function loadCourseContent() {
  try {
    console.log("📡 Fetching course...");

    const res = await fetch(window.API_BASE_URL + `/api/courses/${courseId}`, {
      headers: { "x-auth-token": token },
    });

    const course = await res.json();
    console.log("📦 Course Data:", course);

    currentCourseName = course.title;
    document.getElementById("course-title").innerText = course.title;

    if (course.videos && course.videos.length > 0) {
      const firstVid = course.videos[0];
      const videoId = getYTID(firstVid.videoUrl);

      console.log("🎯 Final Video ID:", videoId);

      if (!videoId) {
        console.error("❌ INVALID VIDEO ID — Check DB URL");
        return;
      }

      player = new YT.Player("main-video-iframe", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => console.log("✅ Player Ready"),
          onStateChange: onPlayerStateChange,
          onError: (e) => console.error("❌ Player Error:", e),
        },
      });

      document.getElementById("current-video-title").innerText = firstVid.title;

      document.getElementById("playlist").innerHTML = course.videos
        .map(
          (vid, i) => `
                <div class="video-item" onclick="changeVideo('${vid.videoUrl}', '${vid.title}')">
                    ${i + 1}. ${vid.title}
                </div>
            `,
        )
        .join("");
    }
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
  }
}

// 🔁 CHANGE VIDEO
function changeVideo(url, title) {
  const vId = getYTID(url);

  if (!vId) {
    console.error("❌ Invalid Video Click");
    return;
  }

  if (player) {
    player.loadVideoById(vId);
    document.getElementById("current-video-title").innerText = title;
  }
}

// 🎯 VIDEO END
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    document.getElementById("cert-overlay").style.display = "flex";
  }
}

// 🏆 4. CERTIFICATE SUBMIT & AUTO-DOWNLOAD LOGIC
async function submitCertificate() {
  const name = document.getElementById("certName").value;
  const mobile = document.getElementById("certMobile").value;
  const btn = document.querySelector(".claim-btn");

  const finalBaseUrl =
    window.API_BASE_URL ||
    (window.location.hostname === "localhost" ? "http://localhost:5000" : "");

  if (!name)
    return alert("Bhai, certificate ke liye apna poora naam toh likho!");

  const originalText = btn.innerText;
  btn.innerText = "GENERATING CERTIFICATE... ⏳";
  btn.disabled = true;

  try {
    const res = await fetch(`${finalBaseUrl}/api/auth/claim-certificate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({
        fullName: name,
        mobile: mobile,
        courseId: courseId,
        courseName: currentCourseName,
      }),
    });

    const data = await res.json();

    if (data.success) {
      window.open(data.downloadUrl, "_blank");

      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.setAttribute("target", "_blank");
      link.download = `BR30_Certificate_${name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // ✨ Elite SUCCESS POPUP
      Swal.fire({
        title: `<span style="color:#00ff88; font-weight:900;">SHABASH ${name.toUpperCase()}! 🏆</span>`,
        html: `
          <div style="color:#e2e8f0; font-size:15px; margin-top:10px;">
            Aapne <b>${currentCourseName}</b> ko successfully finish kar liya hai.<br><br>
            <span style="color:#94a3b8;">Aapka Certificate download ho raha hai aur ek copy aapke <b>Email</b> par bhi bhej di gayi hai. 🚀</span>
          </div>
        `,
        icon: "success",
        iconColor: "#00ff88",
        background: "#0a0a0a",
        showConfirmButton: true,
        confirmButtonText: "MAZA AA GAYA! 🔥",
        confirmButtonColor: "#00ff88",
        timer: 8000,
        backdrop: `rgba(0,255,136,0.1)`,
      });

      document.getElementById("cert-overlay").style.display = "none";
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: data.msg || "Kuch gadbad hui!",
        background: "#0a0a0a",
        color: "#fff",
      });
    }
  } catch (err) {
    console.error("Submit Error:", err);
    Swal.fire({
      icon: "warning",
      title: "Server Issue!",
      text: "Bhai, backend se connection nahi ho paa raha!",
      background: "#0a0a0a",
      color: "#fff",
    });
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
}
//#endregion
