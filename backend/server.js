const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ===== KEYWORDS =====
const URGENCY = ["urgent", "act now", "immediately", "verify"];
const FINANCIAL = ["bank", "otp", "account", "payment"];
const THREATS = ["blocked", "suspended", "locked"];

// ===== MESSAGE DETECTION =====
function detectMessage(text) {
  let score = 0;
  const msg = text.toLowerCase();

  URGENCY.forEach(w => msg.includes(w) && (score += 2));
  FINANCIAL.forEach(w => msg.includes(w) && (score += 2));
  THREATS.forEach(w => msg.includes(w) && (score += 2));

  if (msg.match(/http|www/)) score += 3;

  return score >= 6 ? "dangerous" : "safe";
}

// ===== API =====
app.post('/scan', (req, res) => {
  const { input } = req.body;

  const result = detectMessage(input);

  res.json({
    status: result,
    message:
      result === "dangerous"
        ? "⚠️ Phishing detected"
        : "✅ Message is safe"
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
