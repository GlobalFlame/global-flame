Param(
  [Parameter(Mandatory=$true)][string]$Name,
  [Parameter(Mandatory=$true)][string]$Phone
)

# Ensure Twilio credentials are set
if (-not $env:TWILIO_SID -or -not $env:TWILIO_TOKEN -or -not $env:TWILIO_FROM) {
  Write-Error "Please set TWILIO_SID, TWILIO_TOKEN, and TWILIO_FROM environment variables."
  exit 1
}

# Import Twilio .NET helper via CLI (we'll use Invoke-RestMethod)
$AccountSid = $env:TWILIO_SID
$AuthToken  = $env:TWILIO_TOKEN
$FromNumber = $env:TWILIO_FROM
$Url        = "https://api.twilio.com/2010-04-01/Accounts/$AccountSid/Messages.json"

# Build body
$Body = "Hey $Name sent you a Global Flame!"

# Send SMS
$response = Invoke-RestMethod -Method Post -Uri $Url `
  -Credential (New-Object PSCredential($AccountSid,(ConvertTo-SecureString $AuthToken -AsPlainText -Force))) `
  -Body @{
    From = $FromNumber
    To   = $Phone
    Body = $Body
  }

if ($response.sid) {
  Write-Host "✅ Flame sent! Message SID:" $response.sid
} else {
  Write-Error "❌ Failed to send SMS:`n$response"
  exit 1
}
