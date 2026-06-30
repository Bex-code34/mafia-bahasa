import React, { useState, useEffect } from "react";
import { checkGrammar } from "../utils/translationEngine";
import { historyStorage, quotaStorage } from "../utils/storage";
import { appText } from "../utils/appLanguage";
import { trackGrammar } from "../utils/analytics";
import "../styles/GrammarPage.css";

function GrammarPage({appLanguage}) {
 const savedDraft =
  JSON.parse(
    localStorage.getItem("grammarDraft")
  ) || {};

const [text, setText] =
  useState(savedDraft.text || "");

const [result, setResult] =
  useState(savedDraft.result || null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Checking...");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [copiedType, setCopiedType] = useState("");
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [quota,setQuota] = useState(quotaStorage.get());
  const [error, setError] = useState("");
  const t = appText[appLanguage];

 useEffect(() => {
  localStorage.setItem(
    "grammarDraft",
    JSON.stringify({
      text,
      result
    })
  );
}, [text, result]);

  const handleCheck = async () => {
    setError("");
    const quota = 
    quotaStorage.get();

    if (
  process.env.NODE_ENV !== "development" &&
  quota.grammar >= 10
) {
      alert(
        "Daily grammar quota reached."
      );
      return;
    }
    try {
      const loadingMessages = [
  "Calling grammar master...",
  "Fixing grammar...",
  "Checking native usage...",
  "Analyzing mistakes..."
];

setLoadingText(t.checking);
setLoadingMessage("");
setLoading(true);

loadingMessages.forEach((message, index) =>
{
  setTimeout(() => {
    setLoadingMessage(message);
  }, (index + 1) * 1500);
});

      const data = await checkGrammar(
        text,
        "auto"
      );

      trackGrammar(
        text,
        data.score
      );

      setResult(data);
      if (process.env.NODE_ENV !==
        "development") {
      quotaStorage.addGrammar();
      setQuota(quotaStorage.get());
        }
      historyStorage.add({
        type: "grammar",
        text,
        corrected: data.corrected,
        nativeVersion: data.nativeVersion,
        explanation: data.explanation,
      });
    } catch (error) {
      console.error(error);

if (
  error.code === "OPENROUTER_ERROR"
) {
  setError(
    "AI server sedang sibuk."
  );
}
else if (
  error.code === "INVALID_AI_RESPONSE"
) {
  setError(
    "AI memberikan respons tidak valid."
  );
}
else {
  setError(
    "Grammar checker gagal."
  );
}
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handlePaste = async () => {
  const clipboardText = 
  await navigator.clipboard.readText();

  setText(clipboardText);

  setPasteSuccess(true);

  setTimeout(() => {
    setPasteSuccess(false);
  }, 1500);
};

 const handleClear = () => {
  setText("");
  setResult(null);
  localStorage.removeItem("grammarDraft");

  setClearSuccess(true);

  setTimeout(() => {
    setClearSuccess(false);
  }, 1500);
};

 const handleCopyResult = (textToCopy, type) => {
  if (!result) return;
  navigator.clipboard.writeText(
    textToCopy
  );

  setCopiedType(type);
  setTimeout(() => {
    setCopiedType("");
  }, 1500);
 }

  return (
    <div className="grammar-page">

      <h2>{t.grammarAssistant}</h2>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder={t.enterText}
        rows="5"
      />
     
      <div className="grammar-tools">
        <button onClick={handlePaste}
        className="paste-btn">
          {
            pasteSuccess
            ? t.pasteActive
            : t.paste
          }
        </button>

        <button onClick={handleClear}
        className="clear-btn">
          {
            clearSuccess
            ? t.clearActive
            : t.clear
          }
        </button>

      </div>

    <div className="quota-info">
      Grammar:
      {10 - quota.grammar}/10
    </div>

      <button onClick={handleCheck}
      disabled={loading}
      >
        {loading
          ? loadingText
        : t.checkGrammar
        }
      </button>

      {error && (
        <div className="error-message">
          {error}
          </div>
      )}

      {loading && loadingMessage && (
        <div className="grammar-loading-text">
          {loadingMessage}
          </div>
      )}

     {result && (
  <div>

   <div
  className={`grammar-score-card ${
    result.score === 100
      ? "perfect"
      : result.score >= 90
      ? "minormistakes"
      : result.score >= 70
      ? "good"
      : result.score >= 50
      ? "average"
      : "bad"
  }`}
>

  <h3>
    {
      result.score === 100
        ? t.perfect
        : result.score >= 90
        ? t.minorMistakes
        : result.score >= 70
        ? t.good
        : result.score >= 50
        ? t.average
        : t.bad
    }
  </h3>

  <div className="grammar-score">
    {result.score}/100
  </div>

</div>

         <div className="grammar-result-card">
  <div className="grammar-result-title">
    ✏ Corrected Version
  </div>
 <div className="grammar-result-text">
    {result.corrected}
  </div>

<div className="grammar-tools">
 <button
  onClick={() =>
    handleCopyResult(
      result.corrected,
      "corrected"
    )
  }
  className={
    copiedType === "corrected"
      ? "copied-btn"
      : ""
  }
>
  {copiedType === "corrected"
    ? t.copyActive
    : t.copy}
</button>
  </div>
</div>
          <div className="grammar-result-card">
            <div className="grammar-result-title">
              🗣 Native Speaker Version
            </div>

           <div className="grammar-result-text">
            {result.nativeVersion.map((item, index) => (
              <div key={index}>
                {index + 1}. {item}
                </div>
            ))}
            </div>

            <div className="grammar-tools">
  <button
  onClick={() =>
    handleCopyResult(
      result.nativeVersion.join("\n"),
      "native"
    )
  }
  className={
    copiedType === "native"
      ? "copied-btn"
      : ""
  }
>
  {copiedType === "native"
    ? t.copyActive
    : t.copy}
</button>
  </div>
          </div>

        <div className="grammar-result-card">
  <div className="grammar-result-title">
    💡 Explanation
  </div>

  <div className="grammar-result-text">
    {result.explanation}
  </div>
</div>

        </div>
      )}

    </div>
  );
}

export default GrammarPage;