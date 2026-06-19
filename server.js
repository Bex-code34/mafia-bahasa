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
  temperature: 0,
  messages: [
  {
    role: "system",
    content: `
You are a professional translator.

Return ONLY valid JSON.

{
  "mode": "...",
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

Return:
- mode = "vocabulary" if input is a single word
- mode = "sentence" if input is a sentence or phrase

Rules:
- First determine whether the input is a WORD or a SENTENCE.

- Each translation must include a "type" field.

Use:
primary = most natural/native translation or common meaning
alternative = same meaning but different phrasing
synonym = synonym or closely related word

- For single-word inputs, synonyms may be returned.
- For sentence inputs, prefer primary and alternative.
- Prioritize primary over alternative.
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
- For WORD inputs, ALWAYS include synonyms if applicable.

SENTENCE:
- Return 1 to 3 natural expressions.
- NEVER force alternatives.
- NEVER use alternative for different style of formality.
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
- For single-word inputs, prioritize detecting the actual language of the word before translating.
- Do not assume the user wants a translation into their native language.
- If the detected language is the same as the target language, return the original word unchanged.

CRITICAL:
The translation text MUST ALWAYS be written in the TARGET LANGUAGE.
Never output translation text in Indonesian unless targetLang = id.
The note language and translation language are different things.
Notes must always be in Indonesian, regardless of the target language.
Translation text must always be in the target language, regardless of the note language.
Prioritize translation literal word-for-word accuracy over naturalness, but still ensure the translation is understandable and natural in the target language.

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
- Korean, Japanese, Russian, Arabic and Chinese MUST ALWAYS provide romanization.
- For German, French, Turkish and Spanish ALWAYS provide romanization even if the word is pronounced as it is written.
- Never use dots if user didn't put dots in input.
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

const cleaned = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let parsed;

try {
  parsed = JSON.parse(cleaned);
} catch {
  console.error("INVALID JSON:");
  console.error(cleaned);

  return res.status(500).json({
    error: "Invalid AI response"
  });
}

    res.json({
  mode: parsed.mode,
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

app.post("/grammar", async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

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
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `
You are a professional grammar correction assistant.

Return ONLY valid JSON:

{
  "score": 0,
  "corrected": "...",
  "nativeVersion": "...",
  "explanation": "..."
}

Rules:
- Keep meaning same.
- Fix grammar correctly.
- Explanation in Indonesian.
- NativeVersion = most natural native phrasing.
- Detect language automatically.

Score:
- give a score out of 100 based on grammar correctness, clarity, and naturalness.
- 100 = perfect grammar, clear and natural.
- 80-99 = minor errors, still understandable.
- 50-79 = noticeable errors, may affect clarity.
- 0-49 = major errors, hard to understand.

Corrected:
- Grammatically correct version.
- Keep meaning same.
- Text book style grammar rules.

NativeVersion:
- Most natural way a native speaker would say it.
- For native version only, Feel free to use slang, contractions, and abbreviations, but only when they are natural, context-appropriate, and commonly used by native speakers. 
- Prioritize authenticity over excessive informality.
- Do not add new information.
- Do not change meaning.
- Do not omit important details.

Explanation:
- Explain mistakes clearly in Indonesian.
- Explanation MUST be in Indonesian, regardless the language used in input.
`
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      }
    );

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    return res.json(parsed);

  } catch (error) {
    return res.status(500).json({
      error: "Grammar check failed"
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