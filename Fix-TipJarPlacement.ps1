# Fix-TipJarPlacement.ps1

$walls = @("men","women","children")
$base  = "C:\Users\mrtbl\global-flame\public\walls"

$snippet = @'
<!-- 🌟 Tip Jar & Submit Your Flame -->
<div id="tip-jar-container" style="text-align:center; margin:2rem 0;">
  <img src="../images/MasonTipJar.png" alt="Tip Jar"
       style="max-width:200px; display:block; margin:0 auto;" />
  <p style="margin:.5rem 0; font-size:1rem;">Minimum $1 tip appreciated ❤️</p>
  <form onsubmit="return submitFlame();" style="margin-top:1rem;">
    <input name="flame" type="text" placeholder="Share your own love flame…" required
      style="padding:.5rem; font-size:1rem; width:80%; max-width:300px;" />
    <button type="submit" style="padding:.5rem 1rem; font-size:1rem; margin-left:.5rem;">
      Submit Your Flame
    </button>
  </form>
</div>
'@

foreach ($w in $walls) {
  $file = Join-Path $base "$w.html"
  if (-not (Test-Path $file)) {
    Write-Warning "❌ $w.html not found, skipping."
    continue
  }

  $html = Get-Content $file -Raw

  # 1) Remove old snippet
  $html = $html -replace '(?s)<!-- 🌟 Tip Jar & Submit Your Flame -->.*?</div>', ''

  # 2) Inject new snippet right before </body>
  $html = $html -replace '</body>', "$snippet`r`n</body>"

  Set-Content -Path $file -Value $html -Encoding UTF8
  Write-Host "✅ Tip Jar injected into $w.html"
}
