Param(
  [Parameter(Mandatory)][string] $FirebaseConfig,
  [Parameter(Mandatory)][string] $OpenAiApiKey
)

# Root path
$root = $PWD.Path
Push-Location $root

# 1. Inject time-aware quotes into men.html
$men = Join-Path $root "public\walls\men.html"
$quotes = @'
<!-- ❤️ TIME-AWARE QUOTES -->
<div id="morning" class="quote-box">06:00 — You are not what the world said you are. You are what your actions say today.</div>
<div id="noon"    class="quote-box">12:00 — Rest is not weakness. It’s a weapon.</div>
<div id="evening"class="quote-box">18:00 — Even silence can roar when your purpose is strong.</div>
<script>
window.addEventListener('DOMContentLoaded', () => {
  const h = new Date().getHours();
  ['morning','noon','evening'].forEach(id => document.getElementById(id).style.display='none');
  if (h < 12)      document.getElementById('morning').style.display = 'block';
  else if (h < 18) document.getElementById('noon').style.display    = 'block';
  else             document.getElementById('evening').style.display = 'block';
});
</script>
'@
(Get-Content $men) -replace '(?s)<!-- ❤️ TIME-AWARE QUOTES -->.*?</script>', $quotes |
  Set-Content $men -Encoding UTF8
Write-Host "✅ Injected quotes into men.html"

# 2. Inject Tip Jar & form (uses your existing Add-TipJarAndForm.ps1)
.\Add-TipJarAndForm.ps1 -SourceTipJarPath "$root\public\images\MasonTipJar.png"

# 3. Scaffold API endpoints
$api = Join-Path $root "api"
if (-not (Test-Path $api)) { New-Item -ItemType Directory -Path $api | Out-Null }

$send = @"
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import OpenAI from 'openai';

const firebaseConfig = $FirebaseConfig;
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const openai = new OpenAI({ apiKey: '$OpenAiApiKey' });

export default async function handler(req, res) {
  const { message, wall } = req.body;
  const hour = new Date().getHours();
  const block = hour < 12 ? 'morning' : hour < 18 ? 'noon' : 'evening';
  const comp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Refine this flame: keep soul, elevate tone.' },
      { role: 'user', content: message }
    ]
  });
  const flame = comp.choices[0].message.content.trim();
  await push(ref(db, \`walls/\${wall}/\${block}\`), { text: flame, ts: Date.now() });
  res.status(200).json({ success: true, flame });
}
"@
Set-Content (Join-Path $api "send-flame.js") $send -Encoding UTF8
Write-Host "✅ Created api/send-flame.js"

$get = @"
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';

const firebaseConfig = $FirebaseConfig;
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  const { wall, time } = req.query;
  const snap = await get(child(ref(db), \`walls/\${wall}/\${time}\`));
  res.status(200).json(snap.exists() ? Object.values(snap.val()) : []);
}
"@
Set-Content (Join-Path $api "get-flames.js") $get -Encoding UTF8
Write-Host "✅ Created api/get-flames.js"

Pop-Location
Write-Host "🎉 Setup script complete. Ready to launch your love engine!" -ForegroundColor Cyan
