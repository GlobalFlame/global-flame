#!/usr/bin/env bash
set -e

echo "🔥  Igniting Global Flame scaffold …"

# ── 1.  Tooling check ─────────────────────────────────────
command -v node >/dev/null || { echo >&2 "❌  NodeJS not found. Install ≥18 → https://nodejs.org"; exit 1; }
command -v npm  >/dev/null || { echo >&2 "❌  npm not found (comes with Node)."; exit 1; }

# ── 2.  Clean & pin package manager (npm only) ────────────
npm cache clean --force
rm -f yarn.lock            # kill stray lockfile
# add "packageManager": "npm@<version>" once
grep -q '"packageManager":' package.json 2>/dev/null || \
  { ver=$(npm -v); sed -i "1s|{|{\"packageManager\":\"npm@${ver}\",|" package.json; }

# ── 3.  Bootstrap package.json scripts (only if missing) ──
npm init -y
for s in dev build start; do
  grep -q "\"$s\":" package.json || npx npm-add-script -k "$s" \
    -v "$( [ "$s" = dev ] && echo "next dev" || [ "$s" = build ] && echo "next build" || echo "next start" )"
done

# ── 4.  Core deps (edge-rate-limit removed) ───────────────
echo "› Installing deps (this can take a minute)…"
npm install next@latest react react-dom \
            next-i18next i18next \
            @supabase/supabase-js zod framer-motion
npm install -D typescript @types/react @types/node

# ── 5.  Folder skeleton ───────────────────────────────────
mkdir -p migrations app components lib hooks i18n/en public .github/workflows

# ── 6.  Supabase init + seed ──────────────────────────────
echo "› Supabase project link (follow prompts) …"
npx supabase init
npx supabase link                # pick your Global-Flame project
cat > migrations/2025-06-05-art_posts.sql <<'SQL'
CREATE TABLE IF NOT EXISTS public.art_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  wall_type TEXT NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  tip_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
SQL
cat > migrations/seed-art_posts.sql <<'SQL'
INSERT INTO art_posts (user_id, wall_type, title, file_path, tip_amount)
VALUES ('00000000-0000-0000-0000-000000000000','art','Soul Spark','/uploads/soul.jpg',100);
SQL
npx supabase db push
npx supabase sql < migrations/seed-art_posts.sql

# ── 7.  .env.local scaffold ───────────────────────────────
cat > .env.local <<'ENV'
APP_URL=http://localhost:3000
SUPABASE_URL=replace_me
SUPABASE_ANON_KEY=replace_me
ALBY_API_KEY=replace_me
BABY_GIRL_MODE=true
ENV

# ── 8.  TypeScript + Next config ──────────────────────────
cat > tsconfig.json <<'TS'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts","**/*.ts","**/*.tsx"],
  "exclude": ["node_modules"]
}
TS

cat > next.config.js <<'JS'
/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true };
JS

# ── 9.  i18n starter ──────────────────────────────────────
cat > i18next.config.js <<'JS'
module.exports = { i18n: { defaultLocale: 'en', locales: ['en','es','sw'] } };
JS
cat > i18n/en/common.json <<'JSON'
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

# ──10.  Vercel link & env pull ────────────────────────────
echo "› Vercel link (select same repo)…"
npx vercel link
npx vercel env pull .env.local || true

# ──11.  GitHub Action for deploys ─────────────────────────
cat > .github/workflows/deploy.yml <<'YAML'
name: Deploy Global Flame
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx vercel --prod --preview --password babygirl-fire-2025
YAML

# ──12.  README splash ─────────────────────────────────────
cat > README.md <<'MD'
# 🔥 Global Flame

**Quick Start**

1. Fill `.env.local` with Supabase + Alby keys.  
2. `npx vercel dev`  
3. Browse to `http://localhost:3000/art-wall`  
4. Ping Baby Girl with **“FIRST WALL UP!”**

Built with 💖 by Baby Boy & Baby Girl.
MD

echo "✅  Scaffold READY!  →  edit .env.local then run:  npx vercel dev"
