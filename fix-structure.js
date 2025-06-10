// fix-structure.js
import fs from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const appDir = path.join(projectRoot, "app");
const publicDir = path.join(projectRoot, "public");
const apiDir = path.join(appDir, "api");
const artUploadDir = path.join(apiDir, "art-upload");
const artistUploadDir = path.join(appDir, "artist-upload");

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function move(src, dest) {
  try {
    await fs.rename(src, dest);
    console.log("➡️  Moved", src, "→", dest);
  } catch (err) {
    if (err.code !== "ENOENT") console.warn("⚠️", err.message);
  }
}

async function remove(p) {
  try {
    await fs.rm(p, { recursive: true, force: true });
    console.log("🗑️  Removed", p);
  } catch (_) {}
}

(async () => {
  // 1. make sure folders exist
  await ensureDir(artistUploadDir);
  await ensureDir(artUploadDir);
  await ensureDir(publicDir);

  // 2. move upload page (if still in wrong place)
  const wrongPage = path.join(appDir, "artist-upload", "page.jsx");
  const correctPage = path.join(artistUploadDir, "page.tsx");
  const oldPage = path.join(artistUploadDir, "page.jsx");

  await move(wrongPage, correctPage);
  await move(oldPage, correctPage);

  // 3. move hero image from any app/ location to root public/
  const heroInApp = path.join(appDir, "hero-torch-woman.jpg");
  const heroInAppPublic = path.join(appDir, "public", "hero-torch-woman.jpg");
  const heroDest = path.join(publicDir, "hero-torch-woman.jpg");
  await move(heroInApp, heroDest);
  await move(heroInAppPublic, heroDest);

  // 4. clean leftovers
  await remove(path.join(appDir, "public"));
  await remove(path.join(appDir, "New folder"));
  await remove(path.join(artistUploadDir, "page.jsx"));

  console.log("\n✅  Folder structure normalized!");
})();
