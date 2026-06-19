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
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "ru", name: "Russian" },
    { code: "tr", name: "Turkish" },
    { code: "ar", name: "Arabic" },
    { code: "zh", name: "Chinese" }
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
            translator designed to help you understand how sentences and words change
            across multiple languages with different nuancesand formality levels.
          </p>
          <div className="about-features">
            <h3>Features:</h3>
            <ul>
              <li>✓ Support for 11 languages</li>
              <li>✓ Casual / Neutral / Formal styles</li>
              <li>✓ Romanization & pronunciation guides</li>
              <li>✓ Audio pronunciation</li>
              <li>✓ Translation history</li>
              <li>✓ Language auto-detection</li>
              <li>✓ Country flags</li>
              <li>✓ Mobile-friendly design</li>
              <li>✓ Context and nuance explanations</li>
              <li>✓ Synonyms and alternative translations</li>
              <li>✓ Multiple translation expressions</li>
              <li>✓ Literal word-for-word translations</li>
              <li>✓ Grammar correction and explanation</li>
              <li>✓ Native speaker version</li>
            </ul>
          </div>
          <div className="about-footer">
            <p className="version">Version 1.3 Learning Upgrade</p>
            <p className="created">Created with care for language learners</p>
            <p className="personal">Made by -H-</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
