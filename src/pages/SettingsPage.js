import React, { useState, useEffect } from "react";
import { settingsStorage } from "../utils/storage";
import { appText } from "../utils/appLanguage";
import "../styles/SettingsPage.css";

function SettingsPage({
  appLanguage, 
  setAppLanguage
}) {
  const [defaultLanguage, setDefaultLanguage] = useState("auto_detect");
  const [saveMessage, setSaveMessage] = useState("");
  const [languageMessage, setLanguageMessage] = useState("");
  const t = appText[appLanguage];

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

    setDefaultLanguage(
      settings.defaultSourceLanguage
    );
  }, []);

  const handleSaveSettings = () => {
    settingsStorage.setDefaultSourceLanguage(defaultLanguage);
    settingsStorage.setAppLanguage(appLanguage);

    setLanguageMessage("");

    setSaveMessage(t.settingsUpdated);
    
    setTimeout(() => {
      setSaveMessage("");
     }, 3000);
  };

  return (
    <div className="settings-page">
      {/* Default Source Language Section */}
      <div className="card settings-card">
        <h2 className="settings-section-title">{t.sourceTitle}</h2>
        <p className="settings-description">
          {t.sourceDescription}
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
          {t.saveBtn}
        </button>
        {saveMessage && <div className="save-message">{saveMessage}</div>}
      </div>

   <div className="card settings-card">
<h2 className="settings-section-title">{t.appTitle}</h2>
<p className="settings-description">
    {t.appDescription}
  </p>
<select
  value={appLanguage}
  onChange={(e) => {
 
    const lang =
      e.target.value;

    const confirmed = window.confirm(
      t.confirmLanguageChange
    );

    if (!confirmed) return;

    setAppLanguage(lang);

    settingsStorage
      .setAppLanguage(lang);

    setSaveMessage("");

    setLanguageMessage(
      t.appUpdated
    );

    setTimeout(() => {
      setLanguageMessage("");
    }, 3000);

  }}
  className="select-input"
>
    <option value="id">
      🇮🇩 Indonesian
    </option>

    <option value="en">
      🇬🇧 English
    </option>

  </select>
  {languageMessage && (<div className="save-message">{languageMessage}</div>)}

</div>

      {/* About Section */}
      <div className="card about-card">
        <h2 className="settings-section-title">{t.aboutTitle}</h2>
        <div className="about-content">
          <p>
            <strong>Mafia Bahasa</strong> {t.aboutDescription}
          </p>
          <div className="about-features">
            <h3>{t.feature}</h3>
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
            <p className="version">{t.version} 1.5</p>
            <p className="created">{t.created}</p>
            <p className="personal">{t.made}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
