# Start-GlobalFlameApi.ps1
Import-Module .\LoveStrike.psm1 -Force
Initialize-LoveSystem

\ = New-Object System.Net.HttpListener
\.Prefixes.Add('http://+:3001/')
\.Start()
Write-Host '🚀 Global Flame API listening on http://localhost:3001/'

while (\True) {
    \ = \.GetContext()
    \ = \.Request
    \ = \.Response

    Write-Host "→ \ \"

    switch (\.Url.AbsolutePath) {
        '/api/submit-flame' {
            if (\.HttpMethod -ne 'POST') { \.StatusCode=405; \.Close(); break }
            \ = (New-Object IO.StreamReader(\.InputStream, \.ContentEncoding)).ReadToEnd() | ConvertFrom-Json
            try {
                Handle-CongoFlame -Wall \.wall -Name \.name -RawFlame \.flame
                \=\@{status='ok'; flame=\.flame}
                \=200
            } catch {
                \=\@{status='error'; message=\.Exception.Message}
                \=500
            }
            \=[Text.Encoding]::UTF8.GetBytes((\|ConvertTo-Json))
            \.ContentType='application/json'; \.StatusCode=\
            \.OutputStream.Write(\,0,\.Length); \.Close()
        }
        '/api/tip-checkout' {
            if (\.HttpMethod -ne 'POST') { \.StatusCode=405; \.Close(); break }
            \ = (New-Object IO.StreamReader(\.InputStream, \.ContentEncoding)).ReadToEnd() | ConvertFrom-Json
            try {
                \=Start-MasonTipJar -Amount \.amount -Phone \.phone -Wall \.wall
                \=\@{status='ok'; chargeId=\.Id}; \=200
            } catch {
                \=\@{status='error'; message=\.Exception.Message}; \=500
            }
            \=[Text.Encoding]::UTF8.GetBytes((\|ConvertTo-Json))
            \.ContentType='application/json'; \.StatusCode=\
            \.OutputStream.Write(\,0,\.Length); \.Close()
        }
        Default { \.StatusCode=404; \.Close() }
    }
}
