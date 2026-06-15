const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

export const isOpenRouterKeyConfigured = () => Boolean(OPENROUTER_API_KEY);

export const translateWithOpenRouter = async ({
  input,
  sourceLang,
  targetLang,
  style
}) => {
  const response = await fetch("/translate", {
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

return {
  translation: data.translation,
  romanization: data.romanization
};
};