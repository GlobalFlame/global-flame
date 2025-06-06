#!/usr/bin/env bash
set -e

echo "🔥  Igniting Global Flame scaffolding …"

# ---------- 1. Ensure tooling ----------
command -v node >/dev/null || { echo >&2 "NodeJS not found – install Node 18+ first."; exit 1; }
command -v npm  >/dev/null || { echo >&2 "npm not found – install Node 18+ first."; exit 1; }

echo "› Installing global CLIs (supabase & vercel)"
npm install -g supabase@latest vercel@latest

# ---------- 2. Initialise local project ----------
echo "› Bootstrapping package.json"
npm init -y

echo "› Adding core deps"
npm install next@latest react react-dom
npm install next-i18next i18next
npm install @supabase/supabase-js zod framer-motion
npm install -D typescript @types/react @types/node

# ---------- 3. Supabase ----------
echo "› Setting up Supabase"
supabase init

cat <<SQL > migrations/2025-06-05-art_posts.sql
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

supabase db push

# ---------- 4. Env scaffold ----------
echo "› Generating .env.local"
cat <<ENV > .env.local
# === Global Flame local env =================
APP_URL=http://localhost:3000
SUPABASE_URL=$(supabase projects list --json | jq -r '.[0].api.url')
SUPABASE_ANON_KEY=$(supabase projects list --json | jq -r '.[0].api.anon')
ALBY_API_KEY=replace_me
SENTRY_DSN=
# ===========================================
ENV

# ---------- 5. Vercel link ----------
echo "› Pulling Vercel project env (skip if first-time)"
vercel env pull .env.local || true

echo "✅  Flame scaffold ready!  Run:  vercel dev"
