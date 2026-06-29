const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

export const isOpenRouterKeyConfigured = () => Boolean(OPENROUTER_API_KEY);

export const translateWithOpenRouter = async ({
  input,
  sourceLang,
  targetLang,
  style
}) => {
  const userId =
  localStorage.getItem("mbUserId");

const response = await fetch("/translate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    input,
    sourceLang,
    targetLang,
    style,
    userId
  })
});

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  const data = await response.json();

return {
  mode: data.mode,
  type: data.type,
  translations: data.translations,
  detectedLanguage: data.detectedLanguage
};
};

export const checkGrammarWithOpenRouter = async ({
  text,
  language
}) => {
 const userId =
  localStorage.getItem("mbUserId");

const response = await fetch("/grammar", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text,
    language,
    userId
  })
});

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  return await response.json();
};