import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// PrimeReact Core
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// 🔥 Theme will be injected dynamically
const lightTheme = document.createElement("link");
lightTheme.rel = "stylesheet";
lightTheme.id = "theme-link";
lightTheme.href =
  "https://unpkg.com/primereact/resources/themes/lara-light-indigo/theme.css";
document.head.appendChild(lightTheme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);