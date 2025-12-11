import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const globalStyles = `
  body {
    background: linear-gradient(135deg, #f7f8fa 0%, #edf2f7 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
    margin: 0;
    padding: 20px;
    min-height: 100vh;
  }

  html {
    scroll-behavior: smooth;
  }

  *:focus-visible {
    outline: 2px solid #0066ff;
    outline-offset: 2px;
  }

  * {
    box-sizing: border-box;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);