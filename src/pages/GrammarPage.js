import React, { useState } from "react";
import { checkGrammar } from "../utils/translationEngine";
 import { historyStorage } from "../utils/storage";

function GrammarPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="translator-page">

      <h2>Grammar Assistant</h2>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Enter text..."
        rows="5"
      />

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
</div>

          <div className="grammar-result-card">
            <div className="grammar-result-title">
              🗣 Native Speaker Version
            </div>

            <div className="grammar-result-text">
              {result.nativeVersion}
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