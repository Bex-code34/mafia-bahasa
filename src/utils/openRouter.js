const OPENROUTER_API_URL = "https://openrouter.ai/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

const languageNames = {
  id: "Indonesian",
  en: "English",
  de: "German",
  ko: "Korean",
  ja: "Japanese",
  es: "Spanish"
};

const buildTranslationPrompt = ({ input, sourceLang, targetLang, style }) => {
  const sourceDescription =
    sourceLang === "auto_detect"
      ? "Detect the source language automatically."
      : `Translate from ${languageNames[sourceLang] || sourceLang}.`;

  const styleDescription =
    style === "casual"
      ? "Use a casual and friendly tone."
      : style === "formal"
      ? "Use a polite and formal tone."
      : "Use a neutral tone, neither too casual nor too formal.";

  const sameLanguageNote =
    sourceLang === targetLang
      ? "If the text is already in the target language, rewrite it in the requested style while preserving the meaning."
      : "";

  return `Translate the following text into ${languageNames[targetLang] || targetLang}.
${sourceDescription}
${styleDescription}
${sameLanguageNote}
Output only the translated text. Do not include explanations, extra markup, or language tags.

Text:
${input}`;
};

export const isOpenRouterKeyConfigured = () => Boolean(OPENROUTER_API_KEY);

export const translateWithOpenRouter = async ({
  input,
  sourceLang,
  targetLang,
  style
}) => {
  const response = await fetch("http://localhost:5000/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input,
      sourceLang,
      targetLang,
      style
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  const data = await response.json();

  return data.translation;
};