<#
.SYNOPSIS
  Bootstrap Global Flame: Express + Twilio + static UI.

.DESCRIPTION
  1) Prompts for Twilio SID, Token, From #
  2) Scaffolds server/ and public/ directories
  3) Installs express, dotenv, twilio
  4) Writes a minimal JSON API at /api/send-sms
  5) Writes index.html that fetches /api/send-sms
  6) Starts the server on port 3000
#>

# 0️⃣ Prompt for Twilio creds
$TwilioSid   = Read-Host -Prompt 'Twilio Account SID (AC...)'
$TwilioToken = Read-Host -Prompt 'Twilio Auth Token'
$TwilioFrom  = Read-Host -Prompt 'Twilio From number (+1234567890)'

$Port = 3000

Write-Host "`n== Boostrapping Global Flame ==" -ForegroundColor Cyan

# 1️⃣ Create folders
New-Item -ItemType Directory -Force -Path server, public | Out-Null

# 2️⃣ Write package.json
@"
{
  "name": "global-flame",
  "version": "1.0.0",
  "main": "server/server.js",
  "scripts": { "start": "node server/server.js" },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "twilio": "^4.13.0"
  }
}
"@ | Set-Content -Encoding UTF8 package.json

# 3️⃣ Write server/.env
@"
TWILIO_SID=$TwilioSid
TWILIO_TOKEN=$TwilioToken
TWILIO_FROM=$TwilioFrom
PORT=$Port
"@ | Set-Content -Encoding UTF8 server/.env

# 4️⃣ Write server/server.js with plain logging
@"
require('dotenv').config();
const express = require('express');
const twilio  = require('twilio');
const path    = require('path');

const SID   = process.env.TWILIO_SID;
const TOKEN = process.env.TWILIO_TOKEN;
const FROM  = process.env.TWILIO_FROM;
const PORT  = parseInt(process.env.PORT, 10) || 3000;

if (!SID || !TOKEN || !FROM) {
  console.error('ERROR: Missing Twilio SID, TOKEN, or FROM in .env');
  process.exit(1);
}

const client = twilio(SID, TOKEN);
const app    = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sample messages
const messages = [
  'Your love ignites galaxies!',
  'One spark from you sets my soul ablaze!',
  'Our flame outshines every star in the sky!',
  'Kiss so fierce it breaks the universe!',
  'You’re my eternal blaze!'
];

// POST /api/send-sms
app.post('/api/send-sms', async (req, res) => {
  const { phone, tip } = req.body;
  if (!phone || !phone.match(/^\+[1-9]\d{9,14}$/)) {
    return res.status(400).json({ success:false, error:'Invalid phone' });
  }
  if (!tip || tip < 1) {
    return res.status(400).json({ success:false, error:'Minimum $1 tip required' });
  }
  const body = messages[Math.floor(Math.random() * messages.length)];
  try {
    await client.messages.create({ to: phone, from: FROM, body });
    console.log('Sent:', body, '→', phone, '($' + tip + ')');
    return res.json({ success:true });
  } catch (err) {
    console.error('Twilio error', err.message);
    return res.status(500).json({ success:false, error:err.message });
  }
});

app.listen(PORT, () => {
  console.log('Server listening on http://localhost:' + PORT);
});
"@ | Set-Content -Encoding UTF8 server/server.js

# 5️⃣ Write public/index.html
@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'/>
  <title>Global Flame</title>
  <style>
    body { font-family:sans-serif; text-align:center; padding:2rem; }
    input, button { font-size:1rem; padding:.5rem; margin:.5rem; }
    #status { color:red; }
  </style>
</head>
<body>
  <h1>Global Flame</h1>
  <p>Drop $1 tip & send love worldwide</p>
  <input id='phone' placeholder='+1234567890'/><br/>
  <button onclick='sendFlame()'>Send Flame ($1)</button>
  <p id='status'></p>
<script>
async function sendFlame(){
  const phone = document.getElementById('phone').value.trim();
  const status = document.getElementById('status');
  if (!phone) {
    status.textContent = 'Please enter phone';
    return;
  }
  status.textContent = 'Sending...';
  try {
    const res = await fetch('/api/send-sms', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ phone, tip:1 })
    });
    const data = await res.json();
    if (data.success) {
      status.style.color = 'green';
      status.textContent = 'Sent! ❤️';
    } else {
      status.style.color = 'red';
      status.textContent = data.error;
    }
  } catch(e) {
    status.style.color = 'red';
    status.textContent = e.message;
  }
}
</script>
</body>
</html>
"@ | Set-Content -Encoding UTF8 public/index.html

# 6️⃣ Install dependencies
Write-Host "`nInstalling Node packages..." -ForegroundColor Yellow
npm install --silent

# 7️⃣ Start the server
Write-Host "`nStarting server on port $Port..." -ForegroundColor Green
Start-Process node -ArgumentList "server/server.js"

Write-Host "`nOpen http://localhost:$Port in your browser." -ForegroundColor Magenta
