import React, { useState, useEffect } from "react";
import { checkGrammar } from "../utils/translationEngine";
import { historyStorage } from "../utils/storage";
import "../styles/GrammarPage.css";

function GrammarPage() {
  const savedDraft = localStorage.getItem("grammarDraft") || "";
  const [text, setText] = useState(savedDraft);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState("");
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("grammarDraft",text);
  }, [text]);

  const handleCheck = async () => {
    try {
      setLoading(true);

      const data = await checkGrammar(
        text,
        "auto"
      );

      setResult(data);
      historyStorage.add({
        type: "grammar",
        text,
        corrected: data.corrected,
        nativeVersion: data.nativeVersion,
        explanation: data.explanation,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
  const text = await navigator.clipboard.readText();

  setText(text);

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

      <h2>Grammar Assistant</h2>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Enter text..."
        rows="5"
      />
     
      <div className="grammar-tools">
        <button onClick={handlePaste}
        className="paste-btn">
          {
            pasteSuccess
            ? "Pasted"
            : "Paste"
          }
        </button>

        <button onClick={handleClear}
        className="clear-btn">
          {
            clearSuccess
            ? "Cleared"
            : "Clear"
          }
        </button>

      </div>

      <button onClick={handleCheck}>
        {loading
          ? "Checking..."
          : "Check Grammar"}
      </button>

     {result && (
  <div>

    <div className="grammar-score-card">
      <h3>Grammar Score</h3>
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
    ? "Copied"
    : "Copy"}
</button>
  </div>
</div>
          <div className="grammar-result-card">
            <div className="grammar-result-title">
              🗣 Native Speaker Version
            </div>

            <div className="grammar-result-text">
              {result.nativeVersion}
            </div>

            <div className="grammar-tools">
  <button
  onClick={() =>
    handleCopyResult(
      result.nativeVersion,
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
    ? "Copied"
    : "Copy"}
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