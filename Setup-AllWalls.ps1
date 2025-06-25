# Setup-AllWalls.ps1
Param()

$root      = "C:\Users\mrtbl\global-flame"
$wallsDir  = Join-Path $root "public\walls"

# Tip-Jar & Form snippet
$tipJarForm = @'
<!-- 🌟 Tip Jar & Submit Your Flame -->
<div id="tip-jar-container" style="text-align:center; margin:2rem 0;">
  <img src="../images/MasonTipJar.png" alt="Tip Jar" style="max-width:200px; display:block; margin:0 auto;" />
  <p style="margin:.5rem 0; font-size:1rem;">Minimum $1 tip appreciated ❤️</p>
  <form onsubmit="return submitFlame();" style="margin-top:1rem;">
    <input name="flame" type="text" placeholder="Share your own love flame…" required style="padding:.5rem; font-size:1rem; width:80%; max-width:300px;" />
    <button type="submit" style="padding:.5rem 1rem; font-size:1rem; margin-left:.5rem;">Submit Your Flame</button>
  </form>
</div>
'@

# JS for quotes + form
$footInject = @'
<script>
window.addEventListener("DOMContentLoaded",()=>{
  const h=new Date().getHours();
  ["morning","noon","evening"].forEach(id=>document.getElementById(id).style.display="none");
  const block = h<12?"morning":h<18?"noon":"evening";
  document.getElementById(block).style.display="block";
});
async function submitFlame(){
  const msg=document.querySelector("input[name=flame]").value;
  const c=document.getElementById("user-flames");
  const p=document.createElement("p");
  p.textContent=`🔥 ${msg}`;
  c.prepend(p);
  document.querySelector("input[name=flame]").value="";
  return false;
}
</script>
'@

# Process each wall
foreach($w in @("men","women","children")){
  $file=Join-Path $wallsDir "$w.html"
  if(Test-Path $file){
    $html=Get-Content $file -Raw
    # Remove old tip‐jar/form
    $html=$html -replace '(?s)<!-- 🌟 Tip Jar & Submit Your Flame -->.*?</div>',''
    # Inject new form + flames container + JS before </body>
    $html=$html -replace '</body>',"$tipJarForm`r`n<div id=""user-flames""></div>`r`n$footInject`r`n</body>"
    Set-Content $file -Value $html -Encoding UTF8
    Write-Host "✅ $w.html updated" -ForegroundColor Green
  } else {
    Write-Warning "$w.html not found, skipping"
  }
}
Write-Host "🎉 All walls injected with Tip Jar + form logic" -ForegroundColor Cyan
