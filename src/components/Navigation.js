import React from "react";
import {
  LanguageIcon,
  ClockIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline"
import {
  DocumentCheckIcon
} from "@heroicons/react/24/solid"
import "../styles/Navigation.css";

function Navigation({ currentPage, onPageChange }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-button ${currentPage === "translator" ? "active" : ""}`}
        onClick={() => onPageChange("translator")}
        title="Translator"
      >
        <span className="nav-icon"><LanguageIcon /></span>
        <span className="nav-label">Translate</span>
      </button>
      <button
  className={`nav-button ${currentPage === "grammar" ? "active" : ""}`}
  onClick={() => onPageChange("grammar")}
  title="Grammar"
>
  <span className="nav-icon"><DocumentCheckIcon/></span>
  <span className="nav-label">Grammar</span>
</button>
      <button
        className={`nav-button ${currentPage === "history" ? "active" : ""}`}
        onClick={() => onPageChange("history")}
        title="History"
      >
        <span className="nav-icon"><ClockIcon/></span>
        <span className="nav-label">History</span>
      </button>
      <button
        className={`nav-button ${currentPage === "settings" ? "active" : ""}`}
        onClick={() => onPageChange("settings")}
        title="Settings"
      >
        <span className="nav-icon"><Cog6ToothIcon/></span>
        <span className="nav-label">Settings</span>
      </button>
    </nav>
  );
}

export default Navigation;
