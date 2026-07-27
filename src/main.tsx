import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div style={{ minHeight: "100vh", padding: 16, boxSizing: "border-box" }}>
      <App />
    </div>
  </React.StrictMode>,
);
