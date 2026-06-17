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
  "text": "...",
  "translations": [
    {
      "text": "...",
      "romanization": "...",
      "note": "...",
      "type": "..."

    }
  ],
  "detectedLanguage": "..."
}

Rules:
- First determine whether the input is a WORD or a SENTENCE.

- Each translation must include a "type" field.

Use:
primary = most natural/native translation or common meaning
alternative = same meaning but different phrasing
synonym = synonym or closely related word

- For single-word inputs, synonyms may be returned.
- For sentence inputs, prefer primary and alternative.
- Do not label something as synonym unless it is genuinely a synonym.

WORD:
- Return 1 to 4 useful translations.
- Include common meaning, alternative meanings, synonyms, gender-specific variants if relevant.
- Explain usage/context briefly in note.
- Order from most common to least common.
- Return dictionary form whenever applicable.
- Do not return conjugated forms.
- For Korean adjectives and verbs, return the dictionary form ending in 다.
- For Japanese verbs, return dictionary form.
- For German nouns, preserve capitalization.

SENTENCE:
- Return 1 to 3 natural expressions.
- NEVER force alternatives.
- If only one natural expression exists, return only one.
- If multiple common expressions exist, return up to 3.
- Expressions must be commonly used by native speakers.
- Explain usage/context briefly in note.
- Note can be empty if no explanation is needed.
- All alternative expressions must preserve the same meaning as the original text.
- Do not generate expressions with different meanings merely to increase the count.
- Order translations by commonness.
- The first translation must be the most natural and most commonly used expression by native speakers.

- Notes must be written in Indonesian.

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
- For korean casual = banmal, never use 요 endings.
- For korean neutral = polite everyday speech, use 요 endings.
- For korean formal = professional speech, use 습니다/ㅂ니다 endings.
- Never mix speech levels.
- Korean: romanization using Revised Romanization.
- Japanese: use Hepburn romanization.
- Russian: use standard latin transliteration.
- Arabic: use readable latin transliteration.
- Chinese simplified: use Hanyu Pinyin.
- For German, French, Turkish and Spanish, romanization should be a pronunciation guide using English sounds.
- Indonesian and English: romanization can be empty.
- Korean, Japanese, Russian, Arabic and Chinese must always provide romanization.
- For German, French, Turkish and Spanish always provide romanization even if the word is not pronounced as it is written.
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
Note Language: id

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
  type: parsed.type || "sentence",
  translations: parsed.translations || [],
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