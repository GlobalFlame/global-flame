#!/usr/bin/env bash
set -e

echo "🔥  Igniting Global Flame scaffolding …"

# ---------- 1. Ensure tooling ----------
command -v node >/dev/null || { echo >&2 "NodeJS not found – install Node 18+ first: https://nodejs.org"; exit 1; }
command -v npm  >/dev/null || { echo >&2 "npm not found – install Node 18+ first: https://nodejs.org"; exit 1; }

echo "› Clearing npm cache"
npm cache clean --force

echo "› Installing Vercel CLI globally"
npm install -g vercel@latest          # Supabase will run via npx

# ---------- 2. Initialise project ----------
echo "› Bootstrapping package.json"
npm init -y
npx npm-add-script -k dev    -v "next dev"
npx npm-add-script -k build  -v "next build"
npx npm-add-script -k start  -v "next start"

echo "› Adding core deps"
npm install next@latest react react-dom
npm install next-i18next i18next
npm install @supabase/supabase-js zod framer-motion          # <-- edge-rate-limit removed
npm install -D typescript @types/react @types/node

echo "› Creating folders"
mkdir -p migrations app components lib hooks i18n/en public

# ---------- 3. Supabase ----------
echo "› Supabase init (follow prompt – pick an existing project or create one)"
npx supabase init

cat <<'SQL' > migrations/2025-06-05-art_posts.sql
CREATE TABLE IF NOT EXISTS public.art_posts (
  id          SERIAL PRIMARY KEY,
  user_id     UUID          NOT NULL,
  wall_type   TEXT          NOT NULL,
  title       TEXT          NOT NULL,
  file_path   TEXT          NOT NULL,
  tip_amount  NUMERIC       DEFAULT 0,
  created_at  TIMESTAMP     DEFAULT NOW()
);
SQL

cat <<'SQL' > migrations/seed-art_posts.sql
INSERT INTO art_posts (user_id, wall_type, title, file_path, tip_amount)
VALUES ('00000000-0000-0000-0000-000000000000', 'art', 'Soul Spark', '/uploads/soul.jpg', 100);
SQL

echo "› Linking & pushing DB"
npx supabase link
npx supabase db push
npx supabase sql < migrations/seed-art_posts.sql

# ---------- 4. Env scaffold ----------
echo "› Creating .env.local"
cat <<'ENV' > .env.local
APP_URL=http://localhost:3000
SUPABASE_URL=replace_me
SUPABASE_ANON_KEY=replace_me
ALBY_API_KEY=replace_me
BABY_GIRL_MODE=true
SENTRY_DSN=
I18N_LOCALES=en,es,sw
ENV

# ---------- 5. TypeScript / Next ----------
echo "› tsconfig / next.config"
cat <<'TS' > tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
TS

cat <<'JS' > next.config.js
/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true };
JS

# ---------- 6. i18n ----------
echo "› i18n scaffold"
cat <<'JS' > i18next.config.js
module.exports = { i18n: { defaultLocale: 'en', locales: ['en', 'es', 'sw'] } };
JS

mkdir -p i18n/en
cat <<'JSON' > i18n/en/common.json
{
  "art_wall": {
    "title": "Global Flame: Artist Wall",
    "description": "Your flame’s lit {{userImpact}} hearts!",
    "title_placeholder": "Name your flame…",
    "submit_button": "Ignite My Flame 🔥",
    "live_tips": "Live: {{count}} sats tipped!"
  },
  "errors": {
    "no_file": "Pick a file, baby!",
    "upload_failed": "Upload fizzled—retry.",
    "network": "Network hiccup: {{message}}"
  },
  "success": { "upload": "Flame lit! 🌟" }
}
JSON

# ---------- 7. Vercel link ----------
echo "› Linking Vercel project (follow prompt)"
npx vercel link
npx vercel env pull .env.local || true

# ---------- 8. GitHub Action ----------
mkdir -p .github/workflows
cat <<'YAML' > .github/workflows/deploy.yml
name: Deploy Global Flame
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx vercel --prod --preview --password babygirl-fire-2025
YAML

# ---------- 9. README ----------
cat <<'MD' > README.md
# 🔥 Global Flame

**Quick Start**

1. Fill `.env.local` with Supabase + Alby keys.  
2. `npx vercel dev`  
3. Browse to `http://localhost:3000/art-wall`  
4. Ping Baby Girl with **“FIRST WALL UP!”**

Built with 💖 by Baby Boy & Baby Girl.
MD

echo "✅  Scaffold READY!  Fill .env.local then run:  npx vercel dev"
