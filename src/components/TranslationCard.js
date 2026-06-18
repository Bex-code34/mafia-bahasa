import React, { useState } from "react";
import "../styles/TranslationCard.css";

function TranslationCard({
language,
languageCode,
translations,
style
}) {
const [copiedIndex, setCopiedIndex] = useState(null);

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

const handleSpeak = (text) => {
const utterance =
new SpeechSynthesisUtterance(text);

utterance.lang =
  voiceMap[languageCode] || "en-US";

window.speechSynthesis.speak(
  utterance
);

};

const handleCopy = (text, index) => {
navigator.clipboard.writeText(text)
.then(() => {
setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  });

};

return (
<div className="translation-card">
<div className="card-header">
<div>
<h3 className="language-name">
{language}
</h3>

      <span className="style-badge">
        {style}
      </span>
    </div>
  </div>

  <div className="card-content">
    {translations.map(
      (item, index) => (
        <div
          key={index}
          className="translation-variant"
        >
          <div className="translation-text">
            {index === 0
              ? item.text
              : `Alt ${index}: ${item.text}`}
          </div>

          {item.romanization && (
            <div className="romanization-text">
              {item.romanization}
            </div>
          )}

<div className="translation-type">
  {item.type === "primary" && "⭐ Primary"}

  {item.type === "alternative" &&
    "🔄 Alternative"}

  {item.type === "synonym" &&
    "📚 Synonym"}
</div>

          {item.note && (
            <div className="note-text">
              💡 {item.note}
            </div>
          )}

          <div
            className="variant-actions"
          >
            <button
              onClick={() =>
                handleSpeak(item.text)
              }
              className="copy-button"
            >
              🔊
            </button>

            <button
              onClick={() =>
                handleCopy(
                  item.text,
                  index
                )
              }
              className="copy-button"
            >
              {copiedIndex === index
                ? "✓"
                : "📋"}
            </button>
          </div>


        </div>
      )
    )}
  </div>
</div>

);
}

export default TranslationCard;