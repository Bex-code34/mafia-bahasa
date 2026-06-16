import React, { useState } from "react";
import "../styles/TranslationCard.css";

function TranslationCard({
language,
languageCode,
translation,
romanization,
style
}) {
const [copied, setCopied] = useState(false);

const handleSpeak = () => {
const voiceMap = {
en: "en-US",
id: "id-ID",
de: "de-DE",
ko: "ko-KR",
ja: "ja-JP",
es: "es-ES",
fr: "fr-FR",
ru: "ru-RU",
tr: "tr-TR",
ar: "ar-SA",
zh: "zh-CN"
};

const utterance = new SpeechSynthesisUtterance(
  translation
);

utterance.lang =
  voiceMap[languageCode] || "en-US";

window.speechSynthesis.speak(utterance);

};

const handleCopy = () => {
navigator.clipboard.writeText(translation).then(() => {
setCopied(true);
setTimeout(() => setCopied(false), 2000);
});
};

return (
<div className="translation-card">
<div className="card-header">
<div>
<h3 className="language-name">{language}</h3>
<span className="style-badge">{style}</span>
</div>

    <div>
      <button
        onClick={handleSpeak}
        className="copy-button"
        title="Listen"
      >
        🔊
      </button>

      <button
        onClick={handleCopy}
        className={`copy-button ${copied ? "copied" : ""}`}
        title="Copy translation"
      >
        {copied ? "✓ Copied" : "📋 Copy"}
      </button>
    </div>
  </div>

  <div className="card-content">
    <div className="translation-text">
      {translation}
    </div>

    {romanization && (
      <div className="romanization-text">
        {romanization}
      </div>
    )}
  </div>
</div>

);
}

export default TranslationCard;