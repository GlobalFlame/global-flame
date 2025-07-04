param(
    [Parameter(Mandatory)]
    [string]\
)

# where this script lives
\ = Split-Path \System.Management.Automation.InvocationInfo.MyCommand.Path
\ = Join-Path \ 'LoveStrike.psm1'

if (-not (Test-Path \)) {
    Write-Error "❌ Cannot find LoveStrike.psm1 in \"
    exit 1
}

# Read the module
\ = Get-Content \

# Insert or update the global sender at top
if (-not (\ -match '^\')) {
    \ = @(
        "# — Twilio sender set by Configure-LoveStrike.ps1",
        "\ = '\'",
        ""
    )
    \ = \ + \
    Write-Host "✅ Inserted \ = '\'"
}
else {
    \ = \ -replace "^\\s*=.*", "\ = '\'"
    Write-Host "✅ Updated existing \ to '\'"
}

# Add "-From \" to every Send-TwilioSMS call
\ = \False
\ = \ | ForEach-Object {
    if (\ -match 'Send-TwilioSMS\b' -and \ -notmatch '-From\s*\') {
        \ = \True
        \ -replace 'Send-TwilioSMS', 'Send-TwilioSMS -From \'
    } else {
        \
    }
}
if (\) { Write-Host "✅ Patched all Send-TwilioSMS calls" }
else          { Write-Host "⚠️ No Send-TwilioSMS calls needed patching" }

# Write back
Set-Content -Path \ -Value \ -Encoding UTF8
Write-Host "🎉 LoveStrike.psm1 configured with your Twilio sender."
