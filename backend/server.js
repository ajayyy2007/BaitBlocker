const express = require("express");
const cors = require("cors");
const axios = require("axios");
const stringSimilarity = require("string-similarity");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

/* ===============================
   BRAND DATABASE
================================ */

const brands = [
  "amazon",
  "google",
  "microsoft",
  "paypal",
  "apple",
  "facebook",
  "instagram",
  "netflix",
  "sbi",
  "hdfc",
  "icici",
  "paytm",
  "phonepe",
  "flipkart",
  "jio",
  "airtel"
];

/* ===============================
   BRAND IMPERSONATION DETECTION
================================ */

function detectBrandImpersonation(url) {

  if (!url) return null;

  const domain = url
    .replace("https://", "")
    .replace("http://", "")
    .split("/")[0]
    .toLowerCase();

  for (let brand of brands) {

    const similarity = stringSimilarity.compareTwoStrings(domain, brand);

    if (similarity > 0.6 && !domain.includes(`${brand}.com`)) {

      return {
        impersonation: true,
        brandDetected: brand,
        similarityScore: similarity
      };

    }
  }

  return {
    impersonation: false
  };
}

/* ===============================
   URL EXTRACTION
================================ */

function extractURL(text) {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

/* ===============================
   REDIRECT TRACING
================================ */

async function traceRedirect(url) {
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 1000
    });

    return [url, response.request?.res?.responseUrl || url];

  } catch (err) {
    return [url];
  }
}

/* ===============================
   DISTILBERT AI ANALYSIS
================================ */

async function analyzeWithAI(message) {
  try {

    const response = await axios.post(
      "http://127.0.0.1:5001/analyze",
      { text: message },
      { timeout: 1500 }
    );

    return response.data;

  } catch (error) {

    console.log("AI error:", error.message);

    return {
      label: "UNKNOWN",
      confidence: 0
    };
  }
}

/* ===============================
   SCAN ROUTE
================================ */

app.post("/scan", async (req, res) => {

  console.log("🔥 /scan route hit 🔥");
  console.log("Request received");

  const { input, sensitivity } = req.body;
  const message = input || "";

  let isResponded = false;

  const fallbackTimer = setTimeout(() => {
    if (!isResponded) {
      isResponded = true;
      console.log("Sending response (timeout fallback)");
      return res.json({ status: "safe", message: "Quick fallback result", fallback: true });
    }
  }, 2000);

  try {
    /* URL detection */
    const url = extractURL(message);

    /* Brand detection */
    const brandResult = detectBrandImpersonation(url);

    let redirectChain = [];
    let aiResult = { label: "UNKNOWN", confidence: 0 };

    /* Concurrent Execution: Redirect trace & AI analysis */
    const [redirects, aiResponse] = await Promise.all([
      url ? traceRedirect(url) : Promise.resolve([]),
      analyzeWithAI(message)
    ]);

    redirectChain = redirects;
    aiResult = aiResponse;

    console.log("AI Result:", aiResult);

    /* Convert AI result & Evaluate Threat */
    let status = "safe";
    let threatType = "Safe";
    let riskLevel = "low";
    let recommendedAction = "No immediate action required";

    if (brandResult && brandResult.impersonation) {
      status = "dangerous";
      threatType = "Brand Impersonation";
      riskLevel = "high";
      recommendedAction = `Do NOT click any links. This message impersonates ${brandResult.brandDetected}.`;
    } else if (aiResult.label === "NEGATIVE") {
      let threshold = 0.7; // MEDIUM
      if (sensitivity === "low") threshold = 0.9;
      if (sensitivity === "high") threshold = 0.5;

      if (aiResult.confidence > threshold) {
        status = "dangerous";
        threatType = url ? "Phishing Link" : "Scam Message";
        riskLevel = aiResult.confidence > 0.9 ? "high" : "medium";
        recommendedAction = url 
          ? "Do not click links or share personal information." 
          : "Ignore and delete this message. It is likely a scam.";
      }
    }

    if (!isResponded) {
      clearTimeout(fallbackTimer);
      isResponded = true;
      console.log("Sending response");
      return res.json({
        status,
        confidence: Math.round(aiResult.confidence * 100),
        ai: aiResult,
        detectedURL: url,
        redirectChain,
        brandResult,
        threatType,
        riskLevel,
        recommendedAction
      });
    }

  } catch (err) {
    if (!isResponded) {
      clearTimeout(fallbackTimer);
      isResponded = true;
      console.log("Sending response (error fallback)");
      return res.json({ status: "safe", message: "Quick fallback result", fallback: true });
    }
  }

});

/* ===============================
   SERVER START
================================ */

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});