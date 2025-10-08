import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔹 React 앱을 렌더링
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🔹 PWA Service Worker 등록
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker 등록 성공:", registration);
      })
      .catch((error) => {
        console.log("❌ Service Worker 등록 실패:", error);
      });
  });
}
