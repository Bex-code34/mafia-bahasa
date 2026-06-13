import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import TranslatorPage from "./pages/TranslatorPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("translator");
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const triggerHistoryRefresh = () => {
    setHistoryRefresh((prev) => prev + 1);
  };

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        {currentPage === "translator" && (
          <TranslatorPage onTranslate={triggerHistoryRefresh} />
        )}
        {currentPage === "history" && (
          <HistoryPage key={historyRefresh} />
        )}
        {currentPage === "settings" && <SettingsPage />}
      </div>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}

export default App;
