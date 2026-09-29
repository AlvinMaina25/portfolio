import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Order matters: tokens first, then tones, base, then shared effects.
import "./styles/tokens.css";
import "./styles/tones.css";
import "./styles/base.css";
import "./styles/effects.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
