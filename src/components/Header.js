import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="app-header">
      <div className="brand-container">
         <img src="/logo.png"
    alt="MB"
    className="app-logo"/>
        <h1 className="app-title">Mafia Bahasa</h1>
        </div>
        <p className="app-subtitle">Your Language Journey Partner</p>
    </header>
  );
}

export default Header;
