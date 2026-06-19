import React from "react";
import "../styles/Header.css";

function Header() {
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
      Your Language Journey Partner
    </p>
  </div>

</div>
    </header>
  );
}

export default Header;
