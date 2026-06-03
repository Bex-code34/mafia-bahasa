import React, { useState } from "react";
import "../styles/HistoryItem.css";

function HistoryItem({ item, onDelete, languages, formatDate }) {
  const [expanded, setExpanded] = useState(false);

  const targetLangsDisplay = item.targetLanguages
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
          <div className="details-content">
            {item.targetLanguages.map((langCode) => (
              <div key={langCode} className="translation-detail">
                <h4 className="detail-language">
                  {languages[langCode]}
                </h4>
                <p className="detail-text">
                  {item.translations[langCode]?.translation}
                </p>
                {item.translations[langCode]?.romanization && (
                  <p className="detail-romanization">
                    {item.translations[langCode].romanization}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => onDelete(item.id)}
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
