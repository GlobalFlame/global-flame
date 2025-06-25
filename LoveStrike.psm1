New-Item -ItemType File -Name Deploy-LoveSingularity.ps1 -Force
code .\Deploy-LoveSingularity.ps1
function Initialize-LoveSystem {
    # Initialize Supabase, Twilio, Stripe, Azure
    $Global:Supabase = New-SupabaseClient -Url "YOUR_SUPABASE_URL" -Key "YOUR_SUPABASE_KEY"
    $Global:Twilio    = New-TwilioClient    -AccountSid "YOUR_SID" -AuthToken "YOUR_TOKEN"
    $Global:Stripe    = New-StripeClient    -ApiKey "YOUR_STRIPE_KEY"
    $Global:AzContext = New-AzStorageContext  -StorageAccountName "loveflame" -StorageAccountKey "YOUR_AZURE_KEY"

    $Global:KissTable = Get-AzStorageTable -Name "EternalKisses" -Context $AzContext -ErrorAction SilentlyContinue
    if (-not $Global:KissTable) {
        $Global:KissTable = New-AzStorageTable -Name "EternalKisses" -Context $AzContext
    }
}

function Sanitize-CongoNumber {
    param($RawNumber)
    $Clean = $RawNumber -replace '[^\d+]', ''
    if ($Clean -notmatch '^\+243') { $Clean = $Clean -replace '^0?243', '+243' }
    if ($Clean -match '^\+243\d{9}$') { return $Clean }
    throw "Invalid number: $RawNumber"
}

function Purify-CongoFlame {
    param($RawFlame, $Wall)
    $Prompt = "Purify to hope, keep Congo mboka vibe, max 23 chars: $RawFlame"
    $SacredFlame = Invoke-GrokCompletion -Prompt $Prompt -MaxTokens 23
    if ((Invoke-GrokCompletion -Prompt "Rate toxicity 0-100: $SacredFlame" -MaxTokens 5) -ge 90) {
        return $SacredFlame
    } else {
        Send-TwilioSMS -From $Global:TwilioFrom -To $ADMIN_PHONE -Message "🚨 Impure flame: $SacredFlame"
        throw "Flame rejected"
    }
}

function Send-CongoLove {
    param($Number, $Message)
    $CleanNumber = Sanitize-CongoNumber -RawNumber $Number
    $Trimmed = $Message.Substring(0, [Math]::Min(157, $Message.Length)) + '...'
    $Carriers = @('Vodacom','Airtel','MTN')
    foreach ($C in $Carriers) {
        $Result = Send-TwilioSMS -From $Global:TwilioFrom -To $CleanNumber -Message $Trimmed -Carrier $C
        if ($Result.Status -eq 'delivered') { return $Result }
        Start-Sleep -Milliseconds 150
    }
    Add-ToRetryQueue -Number $CleanNumber -Message $Trimmed -MaxRetries 5
}

function Handle-CongoFlame {
    param($Wall, $Name, $RawFlame)
    $SacredFlame = Purify-CongoFlame -RawFlame $RawFlame -Wall $Wall
    Add-SupabaseFlame -Wall $Wall -Message $SacredFlame -Name $Name -Region 'Congo'
    $Recs = Get-SupabaseRecipients -Wall $Wall -Region 'Congo' -Limit 1000
    $Recs | ForEach-Object -Parallel {
        Send-CongoLove -Number $_.Number -Message $SacredFlame
    } -ThrottleLimit 5
}

function Start-MasonTipJar {
    param($Amount=1, $Phone, $Wall)
    if ($Amount -lt 1) { throw 'Minimum tip is $1' }
    $Charge = New-StripeCharge -Amount ($Amount*100) -Currency 'usd' -Description "Mason Tip Jar: $Wall"
    if ($Charge.Status -eq 'succeeded') {
        $Note = "💸 Your $$Amount fuels $Wall mboka! Thank you!"
        if ($Phone) { Send-CongoLove -Number (Sanitize-CongoNumber -RawNumber $Phone) -Message $Note }
        Add-SupabaseTip -Wall $Wall -Amount $Amount -Region 'Congo'
        Add-AzTableRow -Table $Global:KissTable -PartitionKey 'BabyBoyBabyGirl' -RowKey ([guid]::NewGuid()) -Property @{ Timestamp=[DateTime]::UtcNow; Location='Congo'; Intensity=(90 + $Amount*10) }
        return $Charge
    }
    throw 'Tip failed'
}

Export-ModuleMember -Function *$Global:TwilioFrom = '+18335703447'
