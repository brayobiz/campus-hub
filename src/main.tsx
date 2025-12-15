import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(

    <BrowserRouter>
      <App />
    </BrowserRouter>

);

// Global error hooks to surface errors in terminal/browser console
window.addEventListener("error", (e) => {
  // eslint-disable-next-line no-console
  console.error("Global error:", e.error || e.message, e);
});

window.addEventListener("unhandledrejection", (e) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled promise rejection:", e.reason);
});