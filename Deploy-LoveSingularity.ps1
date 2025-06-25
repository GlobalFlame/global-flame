# Navigate to your project folder
Set-Location "C:\Users\mrtbl\global-flame"

# Define the file path for index.js inside /pages folder
$indexFilePath = ".\pages\index.js"

# Check if pages folder exists; create it if not
if (-not (Test-Path ".\pages")) {
    New-Item -Path ".\pages" -ItemType Directory
}

# Create or overwrite the index.js file
@"
export default function Home() {
  return (
    <div>
      <h1>Welcome to Global Flame 🔥</h1>
      <p>The flame is your inner truth. This is just the beginning...</p>
    </div>
  );
}
"@ | Out-File -FilePath $indexFilePath -Encoding UTF8 -Force

# Confirm it's been written
Write-Host "`n✅ index.js created at: $indexFilePath"
Write-Host "🚀 Now commit and push to Vercel to fix your deployment."
