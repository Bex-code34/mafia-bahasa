import React, { useState, useEffect } from "react";
import { getTranslation } from "../utils/translationEngine";
import { historyStorage, settingsStorage } from "../utils/storage";
import TranslationCard from "../components/TranslationCard";
import "../styles/TranslatorPage.css";

function TranslatorPage({ onTranslate }) {
  const [sourceLanguage, setSourceLanguage] = useState("auto_detect");
  const [targetLanguages, setTargetLanguages] = useState(["en"]);
  const [inputText, setInputText] = useState("");
  const [style, setStyle] = useState("neutral");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load default source language from settings
  useEffect(() => {
    const settings = settingsStorage.getSettings();
    setSourceLanguage(settings.defaultSourceLanguage);
  }, []);

  const languages = [
    { code: "auto_detect", name: "Auto Detect" },
    { code: "id", name: "Indonesian" },
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "ko", name: "Korean" },
    { code: "ja", name: "Japanese" },
    { code: "es", name: "Spanish" }
  ];

  const targetLanguagesList = languages.filter((l) => l.code !== "auto_detect");

  const handleTargetLanguageToggle = (code) => {
    setTargetLanguages((prev) => {
      if (prev.includes(code)) {
        return prev.filter((l) => l !== code);
      } else if (prev.length < 3) {
        return [...prev, code];
      }
      return prev;
    });
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === "auto_detect") {
      setError("Cannot swap when Auto Detect is selected");
      return;
    }
    if (targetLanguages.length === 1 && !targetLanguages.includes(sourceLanguage)) {
      setSourceLanguage(targetLanguages[0]);
      setTargetLanguages([sourceLanguage]);
    } else {
      setError("Can only swap with one target language");
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    if (targetLanguages.length === 0) {
      setError("Please select at least one target language");
      return;
    }

    setError("");
    setLoading(true);
    setTranslations({});

    try {
      const results = {};
      const promises = targetLanguages.map(async (targetLang) => {
       const result = await getTranslation(
  inputText,
  sourceLanguage,
  targetLang,
  style
);

console.log(result);

results[targetLang] = {
  translation: result.translation,
  romanization: result.romanization
};
      });

      await Promise.all(promises);
      setTranslations(results);

      // Save to history
      historyStorage.add({
        text: inputText,
        sourceLanguage,
        targetLanguages,
        translations: results,
        style
      });
      onTranslate();
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearInput = () => {
    setInputText("");
    setTranslations({});
    setError("");
  };

  return (
    <div className="translator-page">
      {/* Source Language Section */}
      <div className="card language-selector-card">
        <label className="label">Source Language</label>
        <select
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          className="select-input"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <div className="swap-button-container">
        <button
          onClick={handleSwapLanguages}
          className="swap-button"
          title="Swap source and target languages"
        >
          ⇅
        </button>
      </div>

      {/* Text Input Section */}
      <div className="card input-card">
        <div className="input-header">
          <label className="label">Your Text</label>
          <span className="character-count">{inputText.length} / 500</span>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, 500))}
          placeholder="Enter text to translate..."
          className="textarea-input"
          maxLength="500"
          rows="4"
        />
        <button onClick={handleClearInput} className="clear-button">
          Clear Input
        </button>
      </div>

      {/* Target Languages Section */}
      <div className="card target-languages-card">
        <label className="label">
          Target Languages (Max 3): {targetLanguages.length}/3
        </label>
        <div className="language-checkboxes">
          {targetLanguagesList.map((lang) => (
            <label key={lang.code} className="checkbox-label">
              <input
                type="checkbox"
                checked={targetLanguages.includes(lang.code)}
                onChange={() => handleTargetLanguageToggle(lang.code)}
                disabled={
                  !targetLanguages.includes(lang.code) &&
                  targetLanguages.length >= 3
                }
                className="checkbox-input"
              />
              <span className="checkbox-text">{lang.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Style Selector */}
      <div className="card style-selector-card">
        <label className="label">Translation Style</label>
        <div className="style-buttons">
          {["casual", "neutral", "formal"].map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`style-button ${style === s ? "active" : ""}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="translate-button"
      >
        {loading ? "Translating..." : "Translate"}
      </button>

      {/* Loading Spinner */}
      {loading && <div className="loading-spinner"></div>}

      {/* Translation Results */}
      <div className="translations-container">
        {Object.entries(translations).map(([langCode, data]) => {
          const langName = languages.find((l) => l.code === langCode)?.name;
          return (
            <TranslationCard
              key={langCode}
              language={langName}
              languageCode={langCode}
              translation={data.translation}
              romanization={data.romanization}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TranslatorPage;
