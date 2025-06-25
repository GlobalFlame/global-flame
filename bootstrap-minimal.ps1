<#
.SYNOPSIS
  Minimal Express + Static Frontend Scaffold

.DESCRIPTION
  • Creates api/server.js
  • Creates public/index.html
  • Installs express via npm
  • Starts the server

.PARAMETER Port
  The port number to listen on (default 3000).

.EXAMPLE
  Set-ExecutionPolicy Bypass -Scope Process
  .\bootstrap-minimal.ps1 -Port 3000
#>

Param(
  [int] $Port = 3000
)

# 0) Stop any stray Node processes
Write-Host "🔹 Stopping existing Node processes (if any)…" -ForegroundColor Yellow
Stop-Process -Name node -ErrorAction SilentlyContinue

# 1) Create folder structure
Write-Host "✅ Creating api/ and public/ folders…" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path api, public | Out-Null

# 2) Write Express server to api/server.js
Write-Host "✅ Writing api/server.js…" -ForegroundColor Cyan
@"
const express = require('express');
const path    = require('path');
const app     = express();
const port    = process.env.PORT || $Port;

// Serve static files from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is alive on port $Port!' });
});

// Fallback to index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start listening
app.listen(port, () => {
  console.log('🚀 Server listening at http://localhost:' + port);
});
"@ | Set-Content -Encoding UTF8 api\server.js

# 3) Write static index.html
Write-Host "✅ Writing public/index.html…" -ForegroundColor Cyan
@"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Global Flame Minimal Test</title>
  <style>
    body { font-family: sans-serif; text-align: center; padding: 2rem; }
    #msg { font-size: 1.25rem; color: #444; }
  </style>
</head>
<body>
  <h1>🔥 Global Flame Minimal Test</h1>
  <p id="msg">Loading…</p>
  <script>
    fetch('/api/health')
      .then(res => res.json())
      .then(json => {
        document.getElementById('msg').textContent = json.status;
      })
      .catch(err => {
        document.getElementById('msg').textContent = 'Error: ' + err.message;
      });
  </script>
</body>
</html>
"@ | Set-Content -Encoding UTF8 public\index.html

# 4) Initialize npm & install express
Write-Host "`n📦 Initializing npm & installing express…" -ForegroundColor Cyan
npm init -y    > $null
npm install express | Out-Host

# 5) Launch the server
Write-Host "`n🚀 Starting server on port $Port…" -ForegroundColor Cyan
node api\server.js
