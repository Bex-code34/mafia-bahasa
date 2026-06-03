const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
              role: "user",
              content: `Translate this text from ${sourceLang} to ${targetLang} using ${style} style. Return only the translation.\n\n${input}`
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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});