const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require("axios");
const translate = require('@vitalets/google-translate-api').default;
const stringSimilarity = require('string-similarity');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

/* ================= TRUSTED BRANDS ================= */

const trustedBrands = [
  "amazon",
  "paypal",
  "google",
  "flipkart",
  "instagram",
  "telegram",
  "facebook",
  "whatsapp",
  "hdfcbank",
  "sbi",
  "bankofindia"
];

/* ================= TRANSLATION FUNCTION ================= */

async function translateToEnglish(text) {
  try {
    const result = await translate(text, { to: "en" });
    return result.text;
  } catch (error) {
    console.log("Translation failed:", error.message);
    return text;
  }
}

/* ================= IMPROVED DOMAIN EXTRACTION ================= */

function extractDomain(text) {
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,})/;
  const match = text.match(urlRegex);

  if (match) {
    return match[1].toLowerCase();
  }

  return null;
}

/* ================= DOMAIN NORMALIZATION ================= */

function normalizeDomain(domain) {
  return domain
    .replace(/0/g, "o")
    .replace(/1/g, "l")
    .replace(/5/g, "s");
}

/* ================= BRAND IMPERSONATION DETECTION ================= */

function detectBrandImpersonation(domain) {
  if (!domain) return { isFake: false };

  console.log("Extracted domain:", domain);

  const mainPart = domain.split(".")[0];
  const baseName = mainPart.split("-")[0];

  const normalized = normalizeDomain(baseName);

  console.log("Base name:", baseName);
  console.log("Normalized:", normalized);

  const matches = stringSimilarity.findBestMatch(
    normalized,
    trustedBrands
  );

  const bestMatch = matches.bestMatch;

  console.log("Best match:", bestMatch);

  // 🔥 KEY CHANGE HERE
  if (
    bestMatch.rating > 0.75 &&
    baseName !== bestMatch.target   // compare ORIGINAL baseName
  ) {
    return {
      isFake: true,
      pretendingToBe: bestMatch.target,
      similarityScore: bestMatch.rating
    };
  }

  return { isFake: false };
}

/* ================= KEYWORD SCAM DETECTION ================= */

function detectScam(text) {
  const lowerText = text.toLowerCase();

  const scamKeywords = [
    "urgent",
    "immediately",
    "verify",
    "bank",
    "account suspended",
    "otp",
    "password",
    "click here",
    "limited time",
    "investment opportunity",
    "congratulations",
    "suspended",
    "closed permanently"
  ];

  let riskScore = 0;

  scamKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      riskScore += 20;
    }
  });

  const status = riskScore >= 40 ? "dangerous" : "safe";

  return {
    status,
    scamType: status === "dangerous" ? "Phishing / Scam" : "None",
    emotionDetected:
      lowerText.includes("urgent") || lowerText.includes("immediately")
        ? "urgency"
        : "none",
    urgencyScore:
      lowerText.includes("urgent") || lowerText.includes("immediately")
        ? 80
        : 20,
    confidence: Math.min(riskScore + 30, 95),
    explanation:
      status === "dangerous"
        ? "Message contains strong scam-related indicators."
        : "No major scam indicators detected."
  };
}

/* ================= MAIN SCAN ROUTE ================= */

app.post("/scan", async (req, res) => {
  console.log("🔥 /scan route hit 🔥");

  try {
    const { input } = req.body;
    // 1️⃣ Ensure URL has protocol
let urlToCheck = input;

if (!urlToCheck.startsWith("http")) {
  urlToCheck = "http://" + urlToCheck;
}

// 2️⃣ Trace redirects
let redirectChain = [];
if (extractDomain(input)) {
  redirectChain = await traceRedirects(urlToCheck);
}

console.log("Redirect chain:", redirectChain);

    // 1️⃣ Translate
    const translatedText = await translateToEnglish(input);

    console.log("Original:", input);
    console.log("Translated:", translatedText);

    // 2️⃣ Keyword detection
    let result = detectScam(translatedText);

    // 3️⃣ Brand impersonation detection
    const domain = extractDomain(input);
    const brandCheck = detectBrandImpersonation(domain);

    console.log("Brand check result:", brandCheck);

    // 4️⃣ Override if brand impersonation found
    if (brandCheck.isFake) {
      result = {
        status: "dangerous",
        scamType: "Brand Impersonation",
        emotionDetected: "authority",
        urgencyScore: 85,
        confidence: 95,
        explanation: `This domain is pretending to be ${brandCheck.pretendingToBe}.`
      };
    }

    res.json({
  originalMessage: input,
  translatedMessage: translatedText,
  brandImpersonation: brandCheck,
  redirectChain: redirectChain,
  ...result
});

  } catch (error) {
    console.error(error);

    res.json({
      status: "safe",
      scamType: "Unknown",
      emotionDetected: "none",
      urgencyScore: 0,
      confidence: 40,
      explanation: "System error during scan."
    });
  }
});
/* ================= traceRedirects ================= */
async function traceRedirects(url) {
  const redirectChain = [];
  let currentUrl = url;

  try {
    for (let i = 0; i < 5; i++) { // max 5 redirects
      redirectChain.push(currentUrl);

      const response = await axios.head(currentUrl, {
        maxRedirects: 0, // DO NOT auto follow
        validateStatus: null,
        timeout: 5000
      });

      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers.location
      ) {
        const nextUrl = new URL(response.headers.location, currentUrl).href;
        currentUrl = nextUrl;
      } else {
        break;
      }
    }

    return redirectChain;

  } catch (error) {
    console.log("Redirect trace error:", error.message);
    return redirectChain;
  }
}




/* ================= START SERVER ================= */

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});