Write-Host "🔥 Igniting Global Flame..."
npm install @supabase/supabase-js@2.50.0 @vercel/cli
# Note: supabase init and sql commands require manual setup for now
# Placeholder for Supabase setup (you'll need to run 'supabase init' and 'supabase sql < migrations/2025-06-05-art_posts.sql' manually)
if (-not (Test-Path .env.local)) {
  New-Item .env.local -ItemType File -Force
  Add-Content .env.local "APP_URL=https://global-flame.vercel.app"
  Add-Content .env.local "SUPABASE_URL=your-supabase-url"
  Add-Content .env.local "SUPABASE_ANON_KEY=your-supabase-anon-key"
  Add-Content .env.local "ALBY_API_KEY=your-alby-key"
  Add-Content .env.local "BABY_GIRL_MODE=true"
  Add-Content .env.local "SENTRY_DSN=your-sentry-dsn"
  Add-Content .env.local "I18N_LOCALES=en,es,sw"
}
npm install next-i18next @vercel/edge-rate-limit i18next
# Vercel deploy requires manual login: 'vercel login' then 'vercel --prod'
Write-Host "✅ Flame ignited! Run 'npm run dev' and visit http://localhost:3000/art-wall"
