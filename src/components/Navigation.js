import React from "react";
import {
  LanguageIcon,
  ClockIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline"
import {
  DocumentCheckIcon
} from "@heroicons/react/24/solid"
import { appText } from "../utils/appLanguage";
import "../styles/Navigation.css";

function Navigation({ currentPage, onPageChange, appLanguage }) {

  const t = appText[appLanguage];

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-button ${currentPage === "translator" ? "active" : ""}`}
        onClick={() => onPageChange("translator")}
        title="Translator"
      >
        <span className="nav-icon"><LanguageIcon /></span>
        <span className="nav-label">{t.translate}</span>
      </button>
      <button
  className={`nav-button ${currentPage === "grammar" ? "active" : ""}`}
  onClick={() => onPageChange("grammar")}
  title="Grammar"
>
  <span className="nav-icon"><DocumentCheckIcon/></span>
  <span className="nav-label">{t.grammar}</span>
</button>
      <button
        className={`nav-button ${currentPage === "history" ? "active" : ""}`}
        onClick={() => onPageChange("history")}
        title="History"
      >
        <span className="nav-icon"><ClockIcon/></span>
        <span className="nav-label">{t.history}</span>
      </button>
      <button
        className={`nav-button ${currentPage === "settings" ? "active" : ""}`}
        onClick={() => onPageChange("settings")}
        title="Settings"
      >
        <span className="nav-icon"><Cog6ToothIcon/></span>
        <span className="nav-label">{t.settings}</span>
      </button>
    </nav>
  );
}

export default Navigation;
