import React, { useState, useEffect } from "react";
import { getTranslation } from "../utils/translationEngine";
import { historyStorage, settingsStorage, lastTranslationStorage, quotaStorage } from "../utils/storage";
import TranslationCard from "../components/TranslationCard";
import { appText } from "../utils/appLanguage";
import "../styles/TranslatorPage.css";

function TranslatorPage({ onTranslate, appLanguage }) {
  const t = appText[appLanguage];
  const savedDraft = JSON.parse(localStorage.getItem("translatorDraft")) || {};
  const settings = settingsStorage.getSettings();
  const [quota,setQuota] = useState(quotaStorage.get());
  const userId =
  localStorage.getItem("mbUserId") ||
  crypto.randomUUID();

localStorage.setItem(
  "mbUserId",
  userId
);
 const [sourceLanguage, setSourceLanguage] =
  useState(
    savedDraft.sourceLanguage ||
    "auto_detect"
  );

const [sourceSuggestion, setSourceSuggestion] = useState(null);

const [targetLanguages, setTargetLanguages] =
  useState(
    savedDraft.targetLanguages ||
    settingsStorage.getTargetLanguages()
  );

const [inputText, setInputText] =
  useState(
    savedDraft.inputText || ""
  );

const [style, setStyle] =
  useState(
    savedDraft.style || "neutral"
  );
  const [translations, setTranslations] = useState({});
  useEffect(() => {
  const saved =
    lastTranslationStorage.get();

  if (!saved) return;

  setTranslations(saved.translations);

  setDetectedLanguage(
    saved.detectedLanguage || ""
  );
}, []);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Translating...");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");

  // Load default source language from settings
 
  useEffect(() => {
  localStorage.setItem(
    "translatorDraft",
    JSON.stringify({
      inputText,
      sourceLanguage,
      targetLanguages,
      style
    })
  );
}, [
  inputText,
  sourceLanguage,
  targetLanguages,
  style
]);

useEffect(() => {
  if (!sourceSuggestion) return;

  const timer = setTimeout(() => {
    setSourceSuggestion(null);
  }, 6000);

  return () => clearTimeout(timer);
}, [sourceSuggestion]);

 const languages = [
  { code: "auto_detect", name: "🌐 Auto Detect" },

  { code: "id", name: "🇮🇩 Indonesian" },
  { code: "en", name: "🇬🇧 English" },
  { code: "de", name: "🇩🇪 German" },
  { code: "ko", name: "🇰🇷 Korean" },
  { code: "ja", name: "🇯🇵 Japanese" },
  { code: "es", name: "🇪🇸 Spanish" },
  { code: "ru", name: "🇷🇺 Russian" },
  { code: "fr", name: "🇫🇷 French" },
  { code: "tr", name: "🇹🇷 Turkish" },
  { code: "ar", name: "🇸🇦 Arabic" },
  { code: "zh", name: "🇨🇳 Chinese" }
];
  const targetLanguagesList = languages.filter((l) => l.code !== "auto_detect");

 const handleTargetLanguageToggle = (code) => {
  setTargetLanguages((prev) => {

    let updated;

    if (prev.includes(code)) {
      updated = prev.filter((l) => l !== code);
    } else if (prev.length < 3) {
      updated = [...prev, code];
    } else {
      updated = prev;
    }

    settingsStorage.setTargetLanguages(updated);

    return updated;
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

    const quota =
    quotaStorage.get();

   if (
  process.env.NODE_ENV !== "development" &&
  quota.translation >= 30
) {
      setError(
        "Daily translation quota reached."
      );
      return;
    }

    setError("");
    const singleWord =
  inputText.trim().split(/\s+/).length === 1;

const loadingSequence = singleWord
  ? [
      "Opening vocabulary...",
      "Analyzing word..."
    ]
  : [
      "Analyzing sentence...",
      "Building natural expression..."
    ];

setLoadingText(t.translating);
setLoadingMessage("");

loadingSequence.forEach((message, index) => {
  setTimeout(() => {
    setLoadingMessage(message);
  }, (index + 1) * 1000);
});

    setSourceSuggestion(null);
    setLoading(true);
    setTranslations({});

    try {
      const results = {};
      let detected = "";

      const promises = targetLanguages.map(async (targetLang) => {
       const result = await getTranslation(
  inputText,
  sourceLanguage,
  targetLang,
  style
);

if (
  sourceLanguage !== "auto_detect" &&
  result.detectedLanguage &&
  result.detectedLanguage !== sourceLanguage
) {

  setSourceSuggestion(
    result.detectedLanguage
  );

  setTimeout(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}, 100);

  throw new Error("SOURCE_MISMATCH");
}

console.log("FULL RESULT:");
console.log(JSON.stringify(result, null, 2));

console.log("TRANSLATIONS:");
console.log(result.translations);

if (sourceLanguage === "auto_detect") {
  detected = 
  result.detectedLanguage;

  setDetectedLanguage(
    result.detectedLanguage
  );
}

results[targetLang] = {
  mode: result.mode,
  translations:
    result.translations?.length > 0
      ? result.translations
      : [
          {
            type: "unknown",
            text: "Input tidak dapat dikenali.",
            note: "Teks tampaknya berupa karakter acak atau tidak memiliki makna."
          }
        ]
};
      });

      await Promise.all(promises);
      setTranslations(results);
      quotaStorage.addTranslation();
      setQuota(quotaStorage.get());
      lastTranslationStorage.save({
        translations: results,
        detectedLanguage: detected
      });
      console.log(translations);

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
      if (
        err.message === "SOURCE_MISMATCH"
      ) {
        return;
      }

      setError(
        "Translation failed. Please try again."
      );
      console.error(err);

    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleClearInput = () => {
    lastTranslationStorage.clear();
    setInputText("");
    setTranslations({});
    setError("");

    localStorage.removeItem("translatorDraft");
  };

  return (
    <div className="translator-page">
      {/* Source Language Section */}
      <div className="card language-selector-card">
        <label className="label">{t.sourceTitleCard}</label>
        {sourceLanguage === "auto_detect" && detectedLanguage && (
          <div className="detected-language">
            {t.detected} {detectedLanguage.toUpperCase()}
          </div>
        )}
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

        {sourceSuggestion && (
  <div className="detected-language">

    {t.looksLike} {
      sourceSuggestion.toUpperCase()
    } {t.switchSource}

    <button
      onClick={() => {
        setSourceLanguage(
          sourceSuggestion
        );
        setSourceSuggestion(null);
      }}
    >
      {t.switchBtn}
    </button>

  </div>
)}
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
          <label className="label">{t.textTitle}</label>
          <span className="character-count">{inputText.length} / 1000</span>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
          placeholder={t.enterText}
          className="textarea-input"
          maxLength="1000"
          rows="6"
        />
        <button onClick={handleClearInput} className="clear-button">
          {t.clearInput}
        </button>
      </div>

      {/* Target Languages Section */}
      <div className="card target-languages-card">
        <label className="label">
          {t.targetLang}: {targetLanguages.length}/3
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
        <label className="label">{t.formalStyle}</label>
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
      <div className="quota-info">
        Free quota:
        {30 - quota.translation}/30
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading}
        className="translate-button"
      >
        {loading ? loadingText : t.translate}
      </button>

      {loading && loadingMessage && (
        <div className="translate-loading-text">
          {loadingMessage}
          </div>
      )}

      {/* Loading Spinner */}
      {loading && <div className="loading-spinner"></div>}

      {/* Translation Results */}
      <div className="translations-container">
       {Object.entries(translations).map(([langCode, data]) => {
  const langName = languages.find(
    (l) => l.code === langCode
  )?.name;

  return (
    <TranslationCard
      key={langCode}
      language={langName}
      languageCode={langCode}
      translations={data}
      style={style}
    />
  );
})}
      </div>
    </div>
  );
}

export default TranslatorPage;
