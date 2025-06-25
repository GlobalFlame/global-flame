<#
  Add-TipJarAndForm.ps1
  Injects a Mason TipJar image and a tip‐form into each of your wall HTML pages.
  Usage: .\Add-TipJarAndForm.ps1 -SourceTipJarPath "C:\Users\mrtbl\Downloads\MasonTipJar.png"
#>

Param(
  [Parameter(Mandatory)][string] $SourceTipJarPath
)

Write-Host "`n🔧 Starting tip-jar & form injector…" -ForegroundColor Cyan

# 1) Ensure images folder exists
$imagesDir = Join-Path $PSScriptRoot "public\images"
if (-not (Test-Path $imagesDir)) {
  New-Item -ItemType Directory -Path $imagesDir | Out-Null
  Write-Host "✔ Created folder: public\images"
}

# 2) Copy the Mason TipJar PNG
$destTipJar = Join-Path $imagesDir (Split-Path $SourceTipJarPath -Leaf)
Copy-Item -Path $SourceTipJarPath -Destination $destTipJar -Force
Write-Host "✔ Copied TipJar to public\images\$(Split-Path $SourceTipJarPath -Leaf)"

# 3) Build the HTML snippet we will inject
$snippet = @"
<!-- Tip Jar & Submit Flame Form -->
<div style="text-align:center; margin:2rem 0;">
  <img src="../images/$(Split-Path $SourceTipJarPath -Leaf)" 
       alt="Tip Jar" 
       style="max-width:200px; display:block; margin:0 auto;"/>
  <p style="font-size:1rem; margin:0.5rem 0;">
    Minimum $1 tip appreciated ❤️
  </p>
  <form onsubmit="return submitFlame();" style="margin-top:1rem;">
    <input 
      type="number"
      name="tip"
      min="1"
      value="1"
      style="padding:.5rem; font-size:1rem; width:80px;"
      required
    />
    <button 
      type="submit"
      style="padding:.5rem 1rem; font-size:1rem; margin-left:.5rem;"
    >Tip & Send</button>
  </form>
</div>
<script>
async function submitFlame() {
  const phone = localStorage.getItem('lastPhone') || prompt("Enter phone (+123...):");
  if (!phone) return alert("Phone is required");
  localStorage.setItem('lastPhone', phone);
  const tipEl = document.querySelector('input[name="tip"]');
  const tip = tipEl.value;
  const status = document.getElementById('status');
  status.textContent = "Sending…";
  try {
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, tip: Number(tip) })
    });
    const j = await res.json();
    status.style.color = j.success ? 'green' : 'red';
    status.textContent = j.success
      ? '💌 Flame sent! Thank you!'
      : 'Error: ' + j.error;
  } catch (e) {
    status.style.color = 'red';
    status.textContent = 'Error: ' + e.message;
  }
  return false; // prevent form native post
}
</script>
"@

# 4) Inject into each wall page
$walls = 'men','women','children'
foreach ($w in $walls) {
  $file = Join-Path $PSScriptRoot "public\walls\$w.html"
  if (Test-Path $file) {
    (Get-Content $file) -replace '</body>', "$snippet`n</body>" |
      Set-Content -Encoding UTF8 $file
    Write-Host "✔ Injected tip jar & form into $w.html"
  } else {
    Write-Warning "⚠ File not found: public\walls\$w.html – skipping"
  }
}

Write-Host "`n🎉 All done! Tip jar & submit form added to your walls." -ForegroundColor Green
