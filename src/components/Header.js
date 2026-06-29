import React from "react";
import { appText } from "../utils/appLanguage";
import "../styles/Header.css";

function Header({appLanguage}) {
const t = appText[appLanguage];

  return (
    <header className="app-header">
      <div className="brand-container">

  <img
    src="logo.png"
    alt="MB"
    className="app-logo"
  />

  <div>
    <h1 className="app-title">
      MAFIA BAHASA
    </h1>

    <p className="app-subtitle">
      {t.subtitle}
    </p>
  </div>

</div>
    </header>
  );
}

export default Header;
