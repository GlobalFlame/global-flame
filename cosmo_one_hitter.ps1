# ✅ Supabase Configuration
$SUPABASE_URL = 'https://iqdvfihpgmrwugthmhco.supabase.co'
$SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZHZmaWhwZ21yd3VndGhtaGNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgyNjUxMCwiZXhwIjoyMDY3NDAyNTEwfQ.eiZ_WHqZ-W5tkghW1N0L4kYnLonvTI9EjqyMm1mXQ5M'

# ✅ Endpoint & Table
$table = 'sports_posts'
$uri = "$SUPABASE_URL/rest/v1/$table"

# ✅ Payload (Clean and ready)
$body = @{
    user_id    = 'cosmo-test-5'
    village_id = 'goma1'
    category   = 'player'
    sport      = 'soccer'
    title      = 'Cosmo Triumph Goal 5!'
    content    = 'Cosmo''s epic third strike—unstoppable!'
    video_link = 'https://youtube.com/triumphvideo'
    tips       = 30
    status     = 'APPROVED'
    created_at = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss')
} | ConvertTo-Json

# ✅ POST Request (Fully Cleaned & Ready)
try {
    $response = Invoke-RestMethod -Uri $uri -Method Post `
        -Headers @{
            apikey        = $SUPABASE_SERVICE_KEY
            Authorization = "Bearer $SUPABASE_SERVICE_KEY"
            Prefer        = "return=representation"
        } `
        -ContentType 'application/json' `
        -Body $body

    Write-Host '✅ POST succeeded! Response:' -ForegroundColor Green           
    $response | ConvertTo-Json -Depth 8

    # Save response to file
    $response | ConvertTo-Json -Depth 8 | Out-File "last_successful_post.json"
}
catch {
    Write-Host "❌ POST failed:" $_.Exception.Message -ForegroundColor Red     
}
