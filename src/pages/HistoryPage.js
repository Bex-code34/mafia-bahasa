import React, { useState, useEffect } from "react";
import { historyStorage } from "../utils/storage";
import HistoryItem from "../components/HistoryItem";
import { appText } from "../utils/appLanguage";
import "../styles/HistoryPage.css";

function HistoryPage({appLanguage}) {
  const t = appText[appLanguage];
  const [history, setHistory] = useState([]);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = historyStorage.getAll();
    setHistory(data);
  };

  const handleDeleteItem = (id) => {
    historyStorage.delete(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all history?")) {
      historyStorage.deleteAll();
      setHistory([]);
      setShowDeleteAll(false);
    }
  };

  const languages = {
    auto_detect: "Auto Detect",
    id: "Indonesian",
    en: "English",
    de: "German",
    ko: "Korean",
    ja: "Japanese",
    es: "Spanish"
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="history-page">
      {history.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📝</p>
          <p className="empty-text">{t.noHistory}</p>
          <p className="empty-subtext">{t.startHistory}</p>
        </div>
      ) : (
        <>
          <div className="history-controls">
            <h2 className="history-title">{t.historyTitle}</h2>
            <button
              onClick={() => setShowDeleteAll(!showDeleteAll)}
              className="delete-all-button"
            >
              {t.deleteAll}
            </button>
          </div>

          {showDeleteAll && (
            <div className="delete-confirm">
              <p>{t.deleteAllHistory}</p>
              <div className="confirm-buttons">
                <button
                  onClick={handleDeleteAll}
                  className="confirm-delete-button"
                >
                  {t.deleteAllConfirm}
                </button>
                <button
                  onClick={() => setShowDeleteAll(false)}
                  className="confirm-cancel-button"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          <div className="history-list">
            {history.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
                languages={languages}
                formatDate={formatDate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryPage;
