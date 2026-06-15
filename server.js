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

Translate accurately and naturally.

Style rules:
- casual = fully casual/native informal speech
- neutral = everyday standard speech
- formal = polite/professional speech

Important:
- For Korean casual, NEVER use 요 endings.
- For Korean formal, ALWAYS use polite endings.
- Return ONLY the translation.
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

    res.json({
      translation: data.choices?.[0]?.message?.content || ""
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