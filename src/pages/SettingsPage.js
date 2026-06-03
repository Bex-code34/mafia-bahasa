import React, { useState, useEffect } from "react";
import { settingsStorage } from "../utils/storage";
import "../styles/SettingsPage.css";

function SettingsPage() {
  const [defaultLanguage, setDefaultLanguage] = useState("auto_detect");
  const [saveMessage, setSaveMessage] = useState("");

  const languages = [
    { code: "auto_detect", name: "Auto Detect" },
    { code: "id", name: "Indonesian" },
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "ko", name: "Korean" },
    { code: "ja", name: "Japanese" },
    { code: "es", name: "Spanish" }
  ];

  useEffect(() => {
    const settings = settingsStorage.getSettings();
    setDefaultLanguage(settings.defaultSourceLanguage);
  }, []);

  const handleSaveSettings = () => {
    settingsStorage.setDefaultSourceLanguage(defaultLanguage);
    setSaveMessage("✓ Settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="settings-page">
      {/* Default Source Language Section */}
      <div className="card settings-card">
        <h2 className="settings-section-title">Default Source Language</h2>
        <p className="settings-description">
          Choose your preferred source language for new translations
        </p>
        <select
          value={defaultLanguage}
          onChange={(e) => setDefaultLanguage(e.target.value)}
          className="select-input"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <button onClick={handleSaveSettings} className="save-button">
          💾 Save Settings
        </button>
        {saveMessage && <div className="save-message">{saveMessage}</div>}
      </div>

      {/* About Section */}
      <div className="card about-card">
        <h2 className="settings-section-title">About Mafia Bahasa</h2>
        <div className="about-content">
          <p>
            <strong>Mafia Bahasa</strong> is a modern language learning
            translator designed to help you understand how sentences change
            across multiple languages and formality levels.
          </p>
          <div className="about-features">
            <h3>Features:</h3>
            <ul>
              <li>✓ Support for 6 major languages</li>
              <li>✓ Multiple translation styles (Casual, Neutral, Formal)</li>
              <li>✓ Korean and Japanese romanization</li>
              <li>✓ Local translation history</li>
              <li>✓ Mobile-friendly responsive design</li>
              <li>✓ Dark theme for comfortable reading</li>
            </ul>
          </div>
          <div className="about-footer">
            <p className="version">Version 1.0.0</p>
            <p className="created">Created with care for language learners</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
