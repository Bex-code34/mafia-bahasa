// Local storage management for history and settings
const HISTORY_KEY = "mafiabahasaHistory";
const SETTINGS_KEY = "mafiabahasaSettings";

export const historyStorage = {
  getAll: () => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  add: (entry) => {
    try {
      const history = historyStorage.getAll();
      const newEntry = {
  id: Date.now().toString(),

  type: entry.type || "translation",

  text: entry.text,

  sourceLanguage: entry.sourceLanguage,
  targetLanguages: entry.targetLanguages,

  translations: entry.translations,
  style: entry.style,

  corrected: entry.corrected,
  nativeVersion: entry.nativeVersion,
  explanation: entry.explanation,

  timestamp: new Date().toISOString()
};
      history.unshift(newEntry);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      return newEntry;
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  },

  delete: (id) => {
    try {
      const history = historyStorage.getAll();
      const filtered = history.filter((entry) => entry.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting from history:", error);
    }
  },

  deleteAll: () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  }
};

export const settingsStorage = {
  getSettings: () => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { defaultSourceLanguage: "auto_detect" };
    } catch {
      return { defaultSourceLanguage: "auto_detect" };
    }
  },

  setDefaultSourceLanguage: (language) => {
    try {
      const settings = settingsStorage.getSettings();
      settings.defaultSourceLanguage = language;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }
};
