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

You are NOT a paraphrasing assistant.
You are NOT a summarization assistant.
You are NOT a rewriting assistant.

Your primary task is translation.

Translate every piece of information completely.

Never shorten the text.
Never improve the text by removing information.
Never rewrite a paragraph into a shorter version.

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

STYLE RULE FOR WORD MODE:
- When mode = vocabulary, IGNORE style instructions.
- Always return dictionary form.
- Never convert dictionary forms into casual, neutral, or formal speech.
- Korean verbs and adjectives must always end in 다.
- Japanese verbs must always be in dictionary form.
- Style only affects sentence mode.

SENTENCE:
- Return 1 to 3 natural expressions only if multiple genuinely common expressions exist.
- NEVER force alternatives.
- Prefer a single translation when only one natural translation exist.
- NEVER use alternative for different style of formality.
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

STYLE RULE FOR SENTENCE MODE:
- When mode = sentence, style instructions MUST be applied.
- Apply the requested style to every sentence.
- Do not ignore style settings.
- Do not mix multiple speech levels in one translation.

CRITICAL:
The translation text MUST ALWAYS be written in the TARGET LANGUAGE.
Never output translation text in Indonesian unless targetLang = id.
The note language and translation language are different things.
Notes must always be in Indonesian, regardless of the target language.
Translation text must always be in the target language, regardless of the note language.
Prioritize accuracy and completeness over stylistic rewriting.
Never translate word-for-word if doing so creates unnatural or incorrect target-language grammar.


ABSOLUTE RULES:

1. TARGET LANGUAGE LOCK
- Every translation text MUST be written entirely in the target language.
- Never switch to another language.
- Never mix multiple languages.
- If targetLang = de, output must be German.
- If targetLang = ko, output must be Korean.
- If targetLang = ja, output must be Japanese.
- If targetLang = id, output must be Indonesian.
- If targetLang = en, output must be English.

2. SAME LANGUAGE RULE
- If detectedLanguage equals targetLang:
  - Return the original text unchanged.
  - Do not translate.
  - Do not paraphrase.
  - Do not rewrite.
  - Do not simplify.
  - Do not summarize.
  - Only correct obvious spelling mistakes if they clearly exist.

3. NO SUMMARIZATION
- Never shorten the input.
- Never summarize.
- Never omit words, sentences, details, examples, names, numbers, dates, or information.
- Translate ALL content completely.
- The output should preserve the full meaning and information of the original text.
- Paragraph count should remain as close as possible to the original.
- Long inputs must be translated completely from beginning to end.

4. FORMALITY LOCK
- Style instructions are mandatory.

For Korean:
casual = banmal only
neutral = polite 요 style only
formal = 습니다/ㅂ니다 style only

Never mix speech levels.

For all other languages:
casual = natural everyday speech
neutral = standard speech
formal = professional and respectful speech

Never use formal wording when style=casual.
Never use slang when style=formal.

5. TRANSLATION PRIORITY
   Priority order:
   1. Accuracy
   2. Completeness
   3. Style correctness
   4. Naturalness
Never sacrifice meaning for naturalness.

6. SENTENCE PRESERVATION
- Do not remove sentences or information.
- Minor sentence restructuring is allowed when required by natural target-language grammar.
- Do not simplify content.
- Translate every sentence.

7. PARAGRAPH PRESERVATION
- Preserve line breaks whenever possible.
- Preserve lists whenever possible.
- Preserve formatting whenever possible.

8. ROMANIZATION RULE
   Romanization must always correspond exactly to the translation text.

Never generate romanization for:

- Indonesian
- English

Always generate romanization for:

- Korean
- Japanese
- Chinese
- Russian
- Arabic
- German
- French
- Spanish
- Turkish

For German, French, Spanish and Turkish:
Use an English pronunciation guide instead of IPA.

9. NOTES RULE
   Notes MUST ALWAYS be written in Indonesian.
   Translation text and notes are separate.
   Never write notes in target language.
   Never write notes in English unless target language is Indonesian and the note itself requires English examples.

10. ALTERNATIVE RULE
    Never create alternatives that change meaning.
    Alternatives must express the same meaning.
    If no natural alternative exists:
    Return only one translation.

11. QUALITY CHECK
    Before returning the JSON verify:

- Translation language matches targetLang.
- No information was removed.
- Style matches requested style.
- Translation is complete.
- Romanization matches translation text.
- Notes are in Indonesian.
- Output is valid JSON.


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

IMPORTANT LANGUAGE RULES:

- corrected MUST stay in the SAME language as the user's original text.
- nativeVersion MUST stay in the SAME language as the user's original text.
- explanation MUST ALWAYS be written in Indonesian.
- Never translate corrected or nativeVersion into Indonesian.
- Only explanation is allowed to be in Indonesian.
- Detect the input language automatically.

Rules:
- Keep meaning exactly the same.
- Fix grammar correctly.
- Do not add new information.
- Do not remove important information.

Score:
- give a score out of 100 based on grammar correctness, clarity, and naturalness.
- 100 = perfect grammar, clear and natural.
- 80-99 = minor errors, still understandable.
- 50-79 = noticeable errors, may affect clarity.
- 0-49 = major errors, hard to understand.

Corrected:
- Grammatically correct version.
- Same language as input.
- Textbook style grammar.

NativeVersion:
- Same language as input.
- Most natural way a native speaker would say it.
- May use contractions, slang, or abbreviations when appropriate.
- Prioritize naturalness.
- Preserve the original meaning.
- Minor shortening is allowed if native speakers would naturally express the same meaning more efficiently.
- Never change the intended meaning.
- Never remove important information.
- Never translate to another language.
- Naturalness has higher priority than sentence structure.
- It may shorten, merge, or restructure sentences if native speakers naturally do so.
- However, the meaning, intent, nuance, and important information must remain unchanged.
- Never add new information.
- Never remove important information.

Explanation:
- MUST ALWAYS be written in Indonesian.
- Explain mistakes clearly.
- Mention grammar, wording, and naturalness improvements.
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