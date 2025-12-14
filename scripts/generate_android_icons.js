const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");
const resDir = path.join(projectRoot, "app", "src", "main", "res");
const srcPng = path.join(resDir, "playstore_512.png");

const targets = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

async function ensureFile() {
  if (!fs.existsSync(srcPng)) {
    throw new Error(`Source image not found: ${srcPng}`);
  }
}

async function writeIcon(folder, filename, size) {
  const outDir = path.join(resDir, folder);
  const outPath = path.join(outDir, filename);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await sharp(srcPng)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(outPath);

  return outPath;
}

async function run() {
  await ensureFile();

  for (const t of targets) {
    // 기본 런처 아이콘
    await writeIcon(t.folder, "ic_launcher.png", t.size);
    // 라운드 아이콘(같은 이미지로 통일)
    await writeIcon(t.folder, "ic_launcher_round.png", t.size);
    // adaptive foreground도 동일 이미지로 통일(필요 시 참조)
    await writeIcon(t.folder, "ic_launcher_foreground.png", t.size);
  }

  console.log("✅ Android launcher icons generated from playstore_512.png");
}

run().catch((e) => {
  console.error("❌ Icon generation failed:", e.message);
  process.exit(1);
});

