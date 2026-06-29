// Local storage management for history and settings
const HISTORY_KEY = "mafiabahasaHistory";
const SETTINGS_KEY = "mafiabahasaSettings";
const QUOTA_KEY = "mafiabahasaQuota";
const LAST_TRANSLATION_KEY = "mafiabahasaLastTranslation";

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
      return data ? JSON.parse(data) : { defaultSourceLanguage: "auto_detect",
        appLanguage: "id"
       };
    } catch {
      return { defaultSourceLanguage: "auto_detect", appLanguage: "id" };
    }
  },

  setAppLanguage: (language) => {
    try {
  const settings =
    settingsStorage.getSettings();

  settings.appLanguage =
    language;

  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings)
  );
} catch (error) {
  console.error(error);
}
},

getAppLanguage: () => {
  const settings =
    settingsStorage.getSettings();

  return settings.appLanguage || "id";
},

  setDefaultSourceLanguage: (language) => {
    try {
      const settings = settingsStorage.getSettings();
      settings.defaultSourceLanguage = language;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  },

  setTargetLanguages: (languages) => {
      const settings = settingsStorage.getSettings();
      settings.targetLanguages = languages;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getTargetLanguages: () => {
    const settings = settingsStorage.getSettings();
    return (settings.targetLanguages || []);
  },
};

export const lastTranslationStorage = {
  save: (data) => {
    localStorage.setItem(
      LAST_TRANSLATION_KEY,
      JSON.stringify(data)
    );
  },

  get: () => {
    const data =
      localStorage.getItem(
        LAST_TRANSLATION_KEY
      );

    return data
      ? JSON.parse(data)
      : null;
  },

  clear: () => {
    localStorage.removeItem(
      LAST_TRANSLATION_KEY
    );
  }
};

export const quotaStorage = {
  get: () => {
    const today =
      new Date().toDateString();

    const saved =
      localStorage.getItem(
        QUOTA_KEY
      );

    if (!saved) {
      return {
        date: today,
        translation: 0,
        grammar: 0
      };
    }

    const data =
      JSON.parse(saved);

    if (data.date !== today) {
      return {
        date: today,
        translation: 0,
        grammar: 0
      };
    }

    return data;
  },

  addTranslation: () => {
    const data =
      quotaStorage.get();

    data.translation += 1;

    localStorage.setItem(
      QUOTA_KEY,
      JSON.stringify(data)
    );
  },

  addGrammar: () => {
    const data =
      quotaStorage.get();

    data.grammar += 1;

    localStorage.setItem(
      QUOTA_KEY,
      JSON.stringify(data)
    );
  }
};