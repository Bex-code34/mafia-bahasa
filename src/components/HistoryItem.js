import React, { useState } from "react";
import "../styles/HistoryItem.css";

function HistoryItem({ item, onDelete, languages, formatDate }) {
  const [expanded, setExpanded] = useState(false);
  const isGrammar = item.type === "grammar";

  const targetLangsDisplay = isGrammar
    ? "Grammar Check"
  : item.targetLanguages
    .map((code) => languages[code])
    .join(", ");

  return (
    <div className="history-item">
      <div className="history-item-main" onClick={() => setExpanded(!expanded)}>
        <div className="history-item-info">
          <p className="history-source-text">{item.text}</p>
          <div className="history-meta">
            <span className="meta-item">
              {languages[item.sourceLanguage]} →{" "}
              {targetLangsDisplay}
            </span>
            <span className="meta-item">{item.style}</span>
            <span className="meta-time">{formatDate(item.timestamp)}</span>
          </div>
        </div>
      </div>

      {expanded && (
  <div className="history-item-details">

    {isGrammar ? (

      <div className="details-content">

        <h4>📝 Corrected</h4>
        <p>{item.corrected}</p>

        <h4>🗣 Native Version</h4>
        <p>{item.nativeVersion}</p>

        <h4>💡 Explanation</h4>
        <p>{item.explanation}</p>

      </div>

    ) : (

      <div className="details-content">

        {item.targetLanguages.map(
          (langCode) => (
            <div
              key={langCode}
              className="translation-detail"
             
            >
              <h4 className="detail-language">
                {languages[langCode]}
              </h4>

              <p className="detail-text">
                {
                  item.translations[
                    langCode
                  ]?.translations?.[0]?.text
                }
              </p>

              {item.translations[
                langCode
              ]?.translations?.[0]?.romanization && (
                <p className="detail-romanization">
                  {
                    item.translations[
                      langCode
                    ]?.translations?.[0]?.romanization
                  }
                </p>
              )}

              <button
  className="copy-history-button"
  onClick={() =>
    navigator.clipboard.writeText(
      item.translations[
        langCode
      ]?.translations?.[0]?.text || ""
    )
  }
>
  📋 Copy
</button>

            </div>
          )
        )}

      </div>

    )}

    <button
      onClick={() =>
        onDelete(item.id)
      }
      className="delete-item-button"
    >
      🗑 Delete
    </button>

  </div>
)}
    </div>
  );
}
export default HistoryItem;
