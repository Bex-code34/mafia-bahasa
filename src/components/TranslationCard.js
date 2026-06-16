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
        <button
          onClick={handleCopy}
          className={`copy-button ${copied ? "copied" : ""}`}
          title="Copy translation"
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
      </div>

      <div className="card-content">
        <div className="translation-text">{translation}</div>
        {romanization && (
          <div className="romanization-text">{romanization}</div>
        )}
      </div>
    </div>
  );
}

export default TranslationCard;
