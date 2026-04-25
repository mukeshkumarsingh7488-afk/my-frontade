//#region
// 🎥 1. Camera Scanner Logic
const html5QrCode = new Html5Qrcode("reader");
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

html5QrCode
  .start({ facingMode: "environment" }, config, (decodedText) => {
    let id = decodedText;
    if (decodedText.includes("id=")) {
      id = decodedText.split("id=")[1];
    }
    document.getElementById("certInput").value = id;
    verifyCert();
  })
  .catch((err) => console.error("Camera Error:", err));

// 🔍 2. Verification API Logic
async function verifyCert() {
  const certId = document.getElementById("certInput").value.trim();
  const resBox = document.getElementById("result-box");

  if (!certId) return alert("Bhai, ID toh dalo!");

  try {
    const res = await fetch(
      `${window.API_BASE_URL}/api/auth/verify-certificate/${certId}`,
    );
    const data = await res.json();

    if (data.success) {
      resBox.style.display = "block";
      document.getElementById("res-name").innerText =
        data.studentName.toUpperCase();
      document.getElementById("res-course").innerText = data.course;

      const dateObj = new Date(data.issueDate);
      const formattedDate = isNaN(dateObj)
        ? new Date().toLocaleDateString("en-IN")
        : dateObj.toLocaleDateString("en-IN");
      document.getElementById("res-date").innerText =
        "Issued on: " + formattedDate;

      const oldBtn = document.getElementById("dl-btn");
      if (oldBtn) oldBtn.remove();

      const dlBtn = document.createElement("button");
      dlBtn.id = "dl-btn";
      dlBtn.innerHTML = "DOWNLOAD CERTIFICATE 📥";
      dlBtn.style.cssText =
        "width:100%; padding:12px; margin-top:20px; background:#D4AF37; color:#000; border:none; border-radius:10px; font-weight:900; cursor:pointer; text-transform:uppercase; letter-spacing:1px; transition: 0.3s;";

      dlBtn.onmouseover = () =>
        (dlBtn.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.5)");
      dlBtn.onmouseout = () => (dlBtn.style.boxShadow = "none");

      dlBtn.onclick = async () => {
        try {
          const response = await fetch(data.downloadUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `BR30_Certificate_${certId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
          window.open(data.downloadUrl, "_blank");
        }
      };

      resBox.appendChild(dlBtn);
      resBox.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("❌ Invalid Certificate ID!");
      resBox.style.display = "none";
    }
  } catch (err) {
    alert("Bhai, server connection fail!");
  }
}

// 3. Auto-load logic (verifyCert ke bahar)
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    const input = document.getElementById("certInput");
    if (input) {
      input.value = id;
      verifyCert();
    }
  }
});
//#endregion
