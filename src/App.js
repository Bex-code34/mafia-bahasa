import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import TranslatorPage from "./pages/TranslatorPage";
import GrammarPage from "./pages/GrammarPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import { settingsStorage } from "./utils/storage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("translator");
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [appLanguage, setAppLanguage] = useState(settingsStorage.getAppLanguage());

  useEffect(() => {
    setAppLanguage(
      settingsStorage.getAppLanguage()
    );
  }, []);

  const triggerHistoryRefresh = () => {
    setHistoryRefresh((prev) => prev + 1);
  };

  return (
    <div className="app">
      <Header 
      appLanguage={
        appLanguage
      }
      />
      <div className="app-content">
        {currentPage === "translator" && (
          <TranslatorPage 
          onTranslate={triggerHistoryRefresh} 
          appLanguage={appLanguage}
          />
        )}
        {currentPage === "history" && (
          <HistoryPage 
          key={historyRefresh}
          appLanguage={appLanguage}  
          />
        )}
        {currentPage === "grammar" && <GrammarPage 
        appLanguage={appLanguage}
        />}
        {currentPage === "settings" && <SettingsPage 
        appLanguage={appLanguage}
        setAppLanguage={setAppLanguage}
        />}
      </div>
      <Navigation
       currentPage={currentPage}
       onPageChange={setCurrentPage}
       appLanguage={appLanguage} 
       />
    </div>
  );
}

export default App;
