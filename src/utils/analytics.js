import { logEvent }
from "firebase/analytics";

import { analyticsPromise }
from "../firebase";

export async function trackTranslation(
  source,
  target,
  mode
) {
  const analytics =
    await analyticsPromise;

  if (!analytics) return;

  logEvent(
    analytics,
    "translate",
    {
      source,
      target,
      mode
    }
  );
}

export async function trackGrammar(
  text,
  score
) {
  const analytics =
    await analyticsPromise;

  if (!analytics) return;

  logEvent(
    analytics,
    "grammar_check",
    {
      length: text.length,
      score
    }
  );
}