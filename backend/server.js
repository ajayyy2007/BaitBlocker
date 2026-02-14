const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DETECTION LOGIC ================= */

function detectMessage(input) {
  const text = input.toLowerCase();
  let score = 0;

  if (text.includes('pin')) score += 40;
  if (text.includes('otp')) score += 40;
  if (text.includes('password')) score += 40;
  if (text.includes('cvv')) score += 40;
  if (text.includes('atm')) score += 20;

  return score >= 40 ? 'dangerous' : 'safe';
}


/* ================= API ROUTE ================= */

app.post('/scan', (req, res) => {
  console.log('🔥 FULL BODY:', req.body);

  const result = detectMessage(req.body.input);

  res.json({
    status: result,
    confidence: result === 'dangerous' ? 92 : 85,
  });
});

/* ================= SERVER START ================= */

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
