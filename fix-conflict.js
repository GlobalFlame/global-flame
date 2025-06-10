// fix-conflict.js
import fs from "fs/promises";
import path from "path";

const root = process.cwd();
const appDir = path.join(root, "app");
const publicRoot = path.join(root, "public");
const artistDir = path.join(appDir, "artist-upload");
const apiDir = path.join(appDir, "api", "art-upload");

const log = (...m) => console.log("»", ...m);

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function safeMove(src, dest) {
  try {
    await fs.rename(src, dest);
    log("moved", src, "→", dest);
  } catch (e) {
    if (e.code !== "ENOENT") log("skip", src, e.message);
  }
}

async function safeDelete(p) {
  try {
    await fs.rm(p, { recursive: true, force: true });
    log("deleted", p);
  } catch (_) {}
}

(async () => {
  await ensureDir(artistDir);
  await ensureDir(apiDir);
  await ensureDir(publicRoot);

  /* 1. kill conflicting route.* inside artist-upload */
  const files = await fs.readdir(artistDir);
  for (const f of files) {
    if (/^route\.(t|j)sx?$/.test(f) || f === "page.jsx") {
      await safeDelete(path.join(artistDir, f));
    }
  }

  /* 2. ensure backend route lives in /api/art-upload/route.ts */
  const existing = [
    path.join(appDir, "artist-upload", "route.ts"),
    path.join(appDir, "artist-upload", "route.js"),
  ];
  for (const src of existing) {
    const dest = path.join(apiDir, "route.ts");
    await safeMove(src, dest);
  }

  /* 3. move hero image to root public */
  const heroCandidates = [
    path.join(appDir, "hero-torch-woman.jpg"),
    path.join(appDir, "public", "hero-torch-woman.jpg"),
  ];
  for (const src of heroCandidates) {
    await safeMove(src, path.join(publicRoot, "hero-torch-woman.jpg"));
  }

  /* 4. clean empty app/public & stray "New folder" */
  await safeDelete(path.join(appDir, "public"));
  await safeDelete(path.join(appDir, "New folder"));

  log("\n✅  Structure fixed. Restart with:  npm run dev");
})();
