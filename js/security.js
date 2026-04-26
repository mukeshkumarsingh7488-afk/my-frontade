//#region SAFE SECURITY

// 🚫 Right Click Block
document.addEventListener("contextmenu", (e) => e.preventDefault());

// 🚫 Basic DevTools Block (light version)
document.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key))
  ) {
    e.preventDefault();
  }
});

// ❌ REMOVE debugger trap (important)
// ❌ REMOVE aggressive redirect

//#endregion
