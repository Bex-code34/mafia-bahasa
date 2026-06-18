import { translateWithOpenRouter, checkGrammarWithOpenRouter } from "./openRouter";

const supportedLanguages = ["id", "en", "de", "ko", "ja", "es", "fr", "zh", "ru", "ar", "tr"];
const supportedStyles = ["casual", "neutral", "formal"];

const validateLanguage = (lang, fieldName) => {
  if (lang !== "auto_detect" && !supportedLanguages.includes(lang)) {
    throw new Error(`${fieldName} must be one of: ${supportedLanguages.join(", ")}, or auto_detect.`);
  }
};

const validateStyle = (style) => {
  if (!supportedStyles.includes(style)) {
    throw new Error(`Style must be one of: ${supportedStyles.join(", ")}.`);
  }
};

export const getTranslation = async (text, sourceLang, targetLang, style) => {
  const trimmedText = String(text || "").trim();
  if (!trimmedText) {
    throw new Error("Text to translate is required.");
  }

  validateLanguage(sourceLang, "Source language");
  validateLanguage(targetLang, "Target language");
  validateStyle(style);

  return translateWithOpenRouter({
    input: trimmedText,
    sourceLang,
    targetLang,
    style
  });
};

export const checkGrammar = async (
  text,
  language
) => {
  const trimmedText = String(text || "").trim();

  if (!trimmedText) {
    throw new Error("Text is required.");
  }

  return checkGrammarWithOpenRouter({
    text: trimmedText,
    language
  });
};
