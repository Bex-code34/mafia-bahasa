const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const DEV_MODE = true;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname,"build")));

const dailyUsage = {};

function checkQuota(userId, limit) {
  const today =
    new Date().toDateString();

  if (!dailyUsage[userId]) {
    dailyUsage[userId] = {
      date: today,
      count: 0
    };
  }

  if (
    dailyUsage[userId].date !== today
  ) {
    dailyUsage[userId] = {
      date: today,
      count: 0
    };
  }

  if (
    dailyUsage[userId].count >= limit
  ) {
    return false;
  }

  dailyUsage[userId].count += 1;

  return true;
}

app.post("/translate", async (req, res) => {
  try {
    const { input, sourceLang, targetLang, style, userId } = req.body;

    if (!DEV_MODE) {
      const allowed =
      checkQuota(userId, 30);

      if (!allowed) {
        return res.status(429).json({
          error:
          "Daily translation limit reached."
        });
      }
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
  model: "openai/gpt-4o-mini",
  temperature: 0,
  max_tokens: 400,
  messages: [
  {
    role: "system",
    content: `
You are a professional translator.

Your job is TRANSLATION only.

Preserve meaning exactly.
Do not change the intended meaning.

Return ONLY valid JSON:

{
"mode":"...",
"translations":[
{
"text":"...",
"type":"primary",
"note":"...",
"romanization":"..."
}
],
"examples":[
{
"source":"...",
"translation":"..."
}
],
"detectedLanguage":"..."
}

DETECT:

- mode = vocabulary (single word, short labels, titles, menu text, noun phrases)
- mode = sentence (phrase, sentence, paragraph)


LANGUAGE DETECTION RULES:

Always detect the actual input language.
Return:
id, en, de, es, ko, ja, fr, zh, ru, ar, tr

If user-selected sourceLang is incorrect, ignore it and detect the real language.


TARGET LANGUAGE RULES:

Translation text MUST always use targetLang.
Never mix languages.
Never use Indonesian unless targetLang=id.
Source language never determines output language.

Only compare:
- detectedLanguage and targetLanguage.
- Ignore sourceLanguage.
- SourceLanguage is only a user preference.


TYPE RULES:

primary = most common translation.
alternative = same meaning, different expression, could be idioms, etc.
synonym = genuine synonym.

Synonyms are only allowed in vocabulary mode.


EXAMPLE SENTENCE RULES:

Examples are primarily for vocabulary mode.
Sentence mode may provide examples only when educationally useful.

Return 1-2 short natural example sentences.
Prefer exactly 2 examples.
Return only 1 if no other useful example exists.

Examples should:
- use the primary meaning
- sound natural
- help language learners
- be commonly used

Each example requires:

source = original target-language sentence.
translation = Indonesian meaning.

Examples are highly encouraged.


SENTENCE MODE RULES:

Always return:

- exactly 1 primary translation.

Whenever the target language has another common expression with the same meaning, return at least 1 alternative.

If the language naturally offers multiple expressions, return 2 alternatives.

Alternative translations are strongly encouraged.

Only omit alternatives when absolutely impossible.

For Korean, Japanese, German, Russian, French, Spanish and Indonesian, alternatives usually exist.

The educational value is more important than minimizing output.



PRIMARY TRANSLATION RULE:

The primary translation MUST be:

1. the most common.
2. the most natural.
3. the expression native speakers use most often.

Alternative translations may:
- sound literary
- sound written
- sound narrative
- sound emphatic
- idioms, poetry style, etc.

Primary translations should avoid:
- literary forms
- dictionary forms
- narration style
- news style

unless the original text requires them.


ALTERNATIVE RULES:

Educational value is encouraged.

Alternative translations should help language learners understand nuance differences.

Alternative translations may differ in:
- nuance
- speech level
- context
- emotional tone
- commonness

The intended meaning must remain identical.

Notes should explain the difference.

Never create fake alternatives.

KOREAN SPEECH RULES:

neutral:
- MUST use 요 speech.
- MUST sound like modern everyday Korean.
- MUST NOT use 한다 style.

Neutral Korean should sound like modern spoken Korean between strangers.

Examples:

좋아요
먹어요
갔어요

Avoid:

좋다
좋은 편이다

unless required.

Exception:
한다 style is only allowed when:
- news headlines
- narration
- proverbs
- dictionaries
- literature
- quotes
- written reports
- poems
- intentional stylistic writing

Alternative translations may use 한다 style ONLY if the original text clearly requires it.


CONTEXT RULES:

When a literal translation sounds unnatural or incorrect in the target language, choose the closest natural meaning.
Meaning priority:
1. intended meaning
2. context
3. emotional tone
4. literal meaning


VOCABULARY MODE RULES:

Priority:
- primary
- synonym
- alternative

Whenever real synonyms exist, they SHOULD be included.

Only omit synonyms if none exist.

- Return 1-4 useful translations.
- Use dictionary forms.
- Ignore style settings.
- Include synonyms when applicable.
- Order by commonness.

German nouns:

- always capitalize.
- always include article.
  Examples:
  der Mann
  die Sprache
  das Haus

Korean:

- nouns remain nouns.
- verbs/adjectives end in 다.
- never add politeness endings.

Japanese:

- use dictionary form.


TENSE PRESERVATION RULES:

Preserve tense exactly: past, present, future, progressive, habitual.


STYLE RULES:

Vocabulary mode ignores style.
Sentence mode must follow the formality system or rules of the target language.
Languages with strong formality systems or rules MUST obey them.

casual: everyday informal impolite speech.

neutral: everyday informal polite standard speech.

formal: professional formal respectful speech

Never mix speech levels.

SPECIAL RULES:

Korean:
neutral = 요 speech.
formal = 습니다 style.
always use 요 style for neutral primary if applicable, may use other styles for alternatives.

German:
formal uses Sie style.
neutral and casual use du style.


NOTE RULES:

- notes must always be Indonesian.
- notes explain usage, nuance, or context.
- provide notes whenever useful.
- empty notes are allowed only if no useful information exists.
Notes are highly encouraged for:
- speech level differences
- nuance differences
- emotional tone
- context differences


TRANSLATION OBJECT RULES:

Each translation must be:

{
"text":"...",
"type":"primary | alternative | synonym",
"note":"...",
"romanization":"..."
}

text:
translated expression.

type:
primary = most natural.
alternative = different expression.
synonym = vocabulary synonym.

note:
Indonesian explanation.

romanization:
required according to romanization rules.

Never return plain strings.
Always return translation objects.


ROMANIZATION RULES:

No romanization:

- Indonesian
- English

Always provide romanization:

- Korean (Revised Romanization)
- Japanese (Hepburn)
- Chinese (Pinyin)
- Russian
- Arabic
- German
- French
- Spanish
- Turkish

German/French/Spanish/Turkish/Russian:
use English pronunciation guides, IPA is forbidden.

For long texts:
Romanization may be omitted except for:
- Korean
- Japanese
- Chinese
- Arabic
- Russian


LONG TEXT RULES:

- translate every sentence.
- preserve information.
- preserve paragraph structure.
- preserve lists.
- preserve line breaks.

INVALID INPUT RULES:

Unintelligible or meaningless input:
{
"mode": "unknown",
"translations": [],
"detectedLanguage": "unknown"
}

Do not guess.
Do not hallucinate.
Do not invent meanings.

Before returning:

- target language is correct.
- meaning is preserved.
- style is correct.
- notes are Indonesian.
- romanization matches translation.
- valid JSON only.

Never use markdown.
Never add explanations outside JSON.
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

if (!response.ok) {
  console.error(data);

    return res.status(500).json({
      code: "OPENROUTER_ERROR",
      error: 
      data.error?.message ||
      "OpenRouter request failed"
    });
}

console.log("OPENROUTER RESPONSE:");
console.log(JSON.stringify(data, null, 2));

const content =
  data.choices?.[0]?.message?.content || "{}";

console.log("AI CONTENT:");
console.log(content);

const cleaned = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let parsed;

try {
  parsed = JSON.parse(cleaned);
} catch (err) {
  console.error("INVALID JSON:");
  console.error(cleaned);

  return res.status(500).json({
    code: "INVALID_AI_RESPONSE",
    error: "Invalid AI response"
  });
}

console.log(parsed);
console.log("DETECTED:", parsed.detectedLanguage);

    res.json({
  mode: parsed.mode,
  translations: parsed.translations || [],
  examples: parsed.examples || [],
  detectedLanguage: parsed.detectedLanguage || sourceLang
});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "TRANSLATION_FAILED",
      error: error.message
    });
  }
});

app.post("/grammar", async (req, res) => {
  try {
    const { text, language, userId } = req.body;

    if (!DEV_MODE) {
      const allowed =
      checkQuota(
        userId + "_grammar",
        10
      );

      if (!allowed) {
        return res.status(429).json({
          error:
          "Daily grammar limit reached."
        });
      }
    }

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0,
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content: `
You are a professional grammar correction assistant.

Return ONLY valid JSON:

{
"score": 0,
"corrected": "...",
"nativeVersion": [
"...",
"...",
"..."
],
"explanation": "..."
}

Detect the input language automatically.

If the text contains severe spelling mistakes,
determine the most probable original language.

Never switch corrected or nativeVersion into another language.

If the text resembles English, German, Korean, Japanese, etc,
keep the output in that language.

Always preserve the original language.

LANGUAGE RULES:

- corrected must stay in the original language.
- nativeVersion must stay in the original language.
- explanation must ALWAYS be written in Indonesian.
- Never translate corrected or nativeVersion into Indonesian.

MISSING CONTEXT RULES:

Understand titles, slogans, nicknames, catchphrases, and creative expressions.
Correct grammar without destroying the intended style.

CORRECTED RULES:

Corrected should sound grammatically perfect and acceptable in textbooks.
- Fix grammar, spelling, punctuation, and wording.
- Keep the original meaning exactly.
- Do not add information.
- Do not remove important information.
- Use standard textbook grammar.

NATIVEVERSION RULES:

Return 1-3 native versions when multiple common expressions exist.
If only one natural expression exists, return exactly one item.
NativeVersion may sound more casual, more idiomatic, and more natural than corrected.
Never duplicate nativeVersion.
Duplicate sentences are forbidden.
Native speakers often shorten, restructure, or replace words with more natural expressions.
Small changes are allowed if:
- meaning stays identical
- tone stays identical
- no important information disappears

Naturalness is more important than literal structure.
- Minor restructuring or shortening is allowed only if native speakers naturally do so.
- Never translate into another language.

NativeVersion should sound like something a native speaker would naturally say.

NativeVersion may sound less formal than corrected.

SHORT PHRASE RULES:

If input is a word, title, label, menu text, or phrase:
- keep the same language
- never translate
- only correct spelling if needed

SCORING RULES:

If corrected and original text are identical, the score must be 100

100:
No meaningful grammar mistakes.
The sentence is understandable and acceptable to native speakers.
Creative expressions, slogans, titles, nicknames, and stylistic language should not reduce the score.

90-99:
Minor punctuation,
capitalization,
spelling issues,
spacing issues.

70-89:
1-2 noticeable grammar mistakes.

50-69:
Several grammar mistakes.

0-49:
Difficult to understand.

EXPLANATION RULES:

- Always use Indonesian.
- Explain grammar mistakes, wording improvements, and naturalness.

ABSOLUTE RULES:

- corrected language = original language.
- nativeVersion language = original language.
- explanation language = Indonesian only.
- Return valid JSON only.
- Never use markdown.
- Never output additional text.
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
    console.log(
      JSON.stringify(data, null, 2)
    );

    if (!response.ok) {
  console.error(data);

    return res.status(500).json({
      error:
      data.error?.message ||
      "OpenRouter request failed"
    });
}

    const content = data?.choices?.[0]?.message?.content || "{}";

    console.log(content);

    let parsed;
    try {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ 
        code: "INVALID_AI_RESPONSE",
        error: "AI returned invalid JSON" 
      });
    }

    return res.json(parsed);

  } catch (error) {
    return res.status(500).json({
      code: "GRAMMAR_FAILED",
      error: error.message
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