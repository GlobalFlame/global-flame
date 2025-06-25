# Inject-FormLogic.ps1

$men = "C:\Users\mrtbl\global-flame\public\walls\men.html"

# The logic to add under the form
$logic = @'
<!-- 🌟 Form & Flames Logic -->
<div id="user-flames" style="margin-top:2rem;"></div>
<script>
async function submitFlame() {
  const msg = document.querySelector('input[name="flame"]').value;
  const container = document.getElementById('user-flames');
  const p = document.createElement('p');
  p.textContent = `🔥 ${msg}`;
  container.prepend(p);
  document.querySelector('input[name="flame"]').value = '';
  return false;
}
document.querySelector('form').onsubmit = submitFlame;
</script>
'@

# Read, inject, and overwrite men.html
$content = Get-Content $men -Raw
$content = $content -replace '(</form>)', "`$1`r`n$logic"
Set-Content -Path $men -Value $content -Encoding UTF8

Write-Host "✅ Injected form logic into men.html"
