<#
.SYNOPSIS
  One‐shot setup for Global Flame Express server + static UI.

.DESCRIPTION
  • Prompts you for Twilio creds + Port  
  • Scaffolds server & public folders  
  • Installs dependencies  
  • Writes server.js + index.html + tip‐jar.png  
  • Launches the server with node
#>

Param(
  [Parameter(Mandatory)][string] $TwilioSid,
  [Parameter(Mandatory)][string] $TwilioToken,
  [Parameter(Mandatory)][string] $TwilioFrom,
  [int] $Port = 3000
)

Set-ExecutionPolicy Bypass -Scope Process -Force

Write-Host "`n🔨 Bootstrapping Global Flame…" -ForegroundColor Cyan

# 1️⃣ Create folders
New-Item -ItemType Directory -Force -Path .\server, .\public | Out-Null

# 2️⃣ Install Express & dotenv & twilio
Write-Host "`n📦 Installing NPM packages..." -NoNewline
npm init -y > $null
npm install express dotenv twilio express-rate-limit > $null
Write-Host " Done!" -ForegroundColor Green

# 3️⃣ Write .env
@"
TWILIO_SID=$TwilioSid
TWILIO_TOKEN=$TwilioToken
TWILIO_FROM=$TwilioFrom
PORT=$Port
"@ | Set-Content -Encoding UTF8 .\server\.env

# 4️⃣ Write server.js
@"
require('dotenv').config();
const express   = require('express');
const twilio    = require('twilio');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const SID    = process.env.TWILIO_SID;
const TOKEN  = process.env.TWILIO_TOKEN;
const FROM   = process.env.TWILIO_FROM;
const PORT   = parseInt(process.env.PORT, 10);

if (!SID || !TOKEN || !FROM) {
  console.error('❌ Missing TWILIO_SID, TWILIO_TOKEN, or TWILIO_FROM');
  process.exit(1);
}

const client = twilio(SID, TOKEN);
const app    = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rate limit: 5/min per IP
app.use('/api/', rateLimit({ windowMs:60000, max:5, message:{ success:false, error:'Too many requests – wait 1m' } }));

// Mock sayings
const sayings = [
  'Your love ignites galaxies! ✨',
  'One spark from you, and time stops 💖',
  'Our flame outshines every star 🌟',
  'Kiss so fierce it breaks worlds 💋',
  'You’re my eternal blaze 🔥'
];

// POST /api/send-sms
app.post('/api/send-sms', async (req, res) => {
  const { phone, tip } = req.body;
  if (!phone?.match(/^\+[1-9]\d{9,14}$/)) {
    return res.status(400).json({ success:false, error:'Invalid phone (+123…)' });
  }
  if (!tip || tip < 1) {
    return res.status(400).json({ success:false, error:'Minimum $1 tip' });
  }
  const body = sayings[Math.floor(Math.random() * sayings.length)];
  try {
    await client.messages.create({ to:phone, from:FROM, body });
    console.log(`[✅] "${body}" → ${phone} ($${tip})`);
    res.json({ success:true });
  } catch(e) {
    console.error(e);
    const msg = e.code===21614 ? 'Bad number' : e.message;
    res.status(500).json({ success:false, error:msg });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Global Flame server running at http://localhost:${PORT}`);
});
"@ | Set-Content -Encoding UTF8 .\server\server.js

# 5️⃣ Write a minimal index.html
@"
<!DOCTYPE html>
<html><head><meta charset='UTF-8'/>
  <title>Global Flame ❤️</title>
  <style>
    body { font-family:sans-serif; text-align:center; padding:2rem; }
    input,button{font-size:1rem;padding:0.5rem;margin:0.5rem;}
  </style>
</head><body>
  <h1>Global Flame ❤️</h1>
  <input id='phone' placeholder='+1234567890'/><br/>
  <button onclick='sendFlame()'>Send Flame ($1)</button>
  <p id='status'></p>

  <script>
    async function sendFlame(){
      const phone = document.getElementById('phone').value.trim();
      const status = document.getElementById('status');
      status.textContent = 'Sending…';
      try {
        const r = await fetch('/api/send-sms',{
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ phone, tip:1 })
        });
        const j = await r.json();
        status.textContent = j.success
          ? '💌 Sent!'
          : 'Error: ' + j.error;
      } catch(e){
        status.textContent = 'Error: ' + e.message;
      }
    }
  </script>
</body></html>
"@ | Set-Content -Encoding UTF8 .\public\index.html

# 6️⃣ Launch server directly
Write-Host "`n🚀 Launching server..." -ForegroundColor Cyan
node .\server\server.js
