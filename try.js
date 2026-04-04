async function loadLatestPrice() {
  try {
    const res = await fetch(window.API_BASE_URL + '/api/courses');
    const courses = await res.json();

    // Maan lo pehla course (Option Selling) aapka main course hai
    const course = courses[0] || courses;

    if (course) {
      // ✅ Home Page par Price update karo (Agar element hai toh)
      const priceElement = document.getElementById("course-price");
      if (priceElement) {
        priceElement.innerText = `₹${course.price}`;
        console.log("✅ Price Updated from DB: ₹", course.price);
      }

      // ✅ Sabhi buttons par dynamic ID set karo taaki sahi course khule
      document.querySelectorAll(".payBtn").forEach((btn) => {
        btn.setAttribute("data-id", course._id);
        btn.dataset.id = course._id;
      });
    }
  } catch (err) {
    console.error("❌ Price Load Error:", err);
  }
}

// 2. 💳 MAIN CHECKOUT FUNCTION (With Sales Hunter & Mail Logic)
const checkout = async function (courseId) {
  console.log("🚀 Checkout Started for ID:", courseId);
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Bhai, pehle Login toh karo! ✋");
    window.location.href = "login.html";
    return;
  }

  // 🔥 STATUS ALERT: User ne Click kiya, Window band ki, ya Fail hua (Sabka Mail jayega)
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

  // 🎯 STEP 1: Click hote hi "INTERESTED" alert bhej do (Paisa khulne se pehle)
  sendStatusAlert(
    "INTERESTED",
    "User ne Buy Now dabaya hai (Checkout Screen Opened).",
  );

  try {
    // 🌐 Backend ko sirf ID bhejo, wo DB se naya Price uthayega (100% Dynamic)
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
      amount: data.order.amount, // ✅ Backend se aane wala Dynamic Price
      currency: "INR",
      name: "BR30TRADER ACADEMY",
      description: "VIP Enrollment 🏆",
      order_id: data.order.id,
      handler: async function (response) {
        // ✅ SUCCESS VERIFICATION
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
          alert("Congratulations! 🎊 Course Unlock ho gaya.");
          window.location.href = "mycourse.html";
        }
      },
      modal: {
        ondismiss: function () {
          // 📧 User ne checkout band kiya (Abandoned) - Iska mail jayega
          sendStatusAlert(
            "ABANDONED",
            "User ne payment window खुद band kar di (No completion).",
          );
        },
      },
      theme: { color: "#00ff88" }, // ✨ Elite Neon Green Theme
    };

    const rzp = new Razorpay(options);

    // ❌ REAL BANK FAILURE: (Iska mail bhi jayega)
    rzp.on("payment.failed", function (response) {
      sendStatusAlert(
        "FAILED",
        `Actual Bank Failure: ${response.error.description}`,
      );
    });

    rzp.open();
  } catch (err) {
    console.error("Error Detail:", err);
    alert("Error: " + err.message);
  }
};