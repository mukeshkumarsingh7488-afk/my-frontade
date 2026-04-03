//#region MyCode
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA4wnSAZ3VLlAMyHhPt5WjULihejoKuLoY",
  projectId: "br30trader",
  messagingSenderId: "32865565434",
  appId: "1:32865565434:web:4d620d3cb41a19c5582743",
});

const messaging = firebase.messaging();

// 🔥POP-UP WALA CODE
messaging.onBackgroundMessage((payload) => {
  console.log("[sw.js] Background Message Aaya:", payload);

  const notificationTitle = payload.notification.title || "Naya Alert! 🔥";
  const notificationOptions = {
    body: payload.notification.body || "Bhai message check kar!",
    icon: "/images/BR30™  LOGO.jpeg",
    badge: "/image/BR30™  LOGO.jpeg",
  };

  // Browser notification pop-up
  self.registration.showNotification(notificationTitle, notificationOptions);
});
//#endregion