const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname,"build")));

app.post("/translate", async (req, res) => {
  try {
    const { input, sourceLang, targetLang, style } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
  model: "openai/gpt-4o-mini",
  messages: [
  {
    role: "system",
    content: `
You are a professional translator.

Return ONLY valid JSON.

{
  "translation": "...",
  "romanization": "...",
  "detectedLanguage": "..."
}

- Detect the source Language and return its code.
- Use:
id = Indonesian
en = English
de = German
es = Spanish
ko = Korean
ja = Japanese
fr = French
zh = Chinese (simplified)
ru = Russian
ar = Arabic
tr = Turkish

Rules:
- Translate accurately and naturally.
- casual = banmal, never use 요 endings.
- neutral = polite everyday speech, use 요 endings.
- formal = professional speech, use 습니다/ㅂ니다 endings.
- For Korean casual, NEVER use 요 endings.
- For Korean formal, ALWAYS use polite endings.
- Korean: romanization using Revised Romanization.
- Japanese: use Hepburn romanization.
- Russian: use standard latin transliteration.
- Arabic: use readable latin transliteration.
- Chinese simplified: use Hanyu Pinyin.
- For German, French and Spanish, romanization should be a pronunciation guide using English sounds.
- Indonesian and English: romanization can be empty.
- Korean, Japanese, Russian, Arabic and Chinese must always provide romanization.
- Do not add explanations.
- Do not wrap JSON in markdown.
`
  },
  {
    role: "user",
    content: `
Source Language: ${sourceLang}
Target Language: ${targetLang}
Style: ${style}

Text:
${input}
`
  }
]
})
      }
    );

const data = await response.json();

console.log("OPENROUTER RESPONSE:");
console.log(JSON.stringify(data, null, 2));

const content =
  data.choices?.[0]?.message?.content || "{}";

const parsed = JSON.parse(content);

    res.json({
  translation: parsed.translation || "",
  romanization: parsed.romanization || "",
  detectedLanguage: parsed.detectedLanguage || sourceLang
});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Translation failed"
    });
  }
});

app.get("/*path", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});