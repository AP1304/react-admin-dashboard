import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// PrimeReact Core + theme (bundled locally — CDN URL was returning 404)
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);