const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");
const resDir = path.join(projectRoot, "app", "src", "main", "res");

// 원본: 누님이 넣어둔 512 png
const srcPng = path.join(resDir, "playstore_512.png");

// 아이콘 크기
const targets = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

// 원형 마스크 안전영역을 위해 여백 확보
// 0.78이면 전체의 78% 크기로 로고를 넣고, 나머지는 투명 여백(패딩)
const SAFE_RATIO = 0.78;

async function ensureFile() {
  if (!fs.existsSync(srcPng)) throw new Error(`Source image not found: ${srcPng}`);
}

async function writePaddedIcon(outDir, filename, canvasSize) {
  const outPath = path.join(outDir, filename);

  const innerSize = Math.round(canvasSize * SAFE_RATIO);

  // 1) 로고를 innerSize로 "contain" 리사이즈(절대 잘리지 않게)
  const resized = await sharp(srcPng)
    .resize(innerSize, innerSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // 2) 투명 캔버스(canvasSize x canvasSize) 중앙에 합성
  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(outPath);

  return outPath;
}

async function run() {
  await ensureFile();

  for (const t of targets) {
    const outDir = path.join(resDir, t.folder);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 런처 아이콘(투명 여백 포함)
    await writePaddedIcon(outDir, "ic_launcher.png", t.size);
    await writePaddedIcon(outDir, "ic_launcher_round.png", t.size);

    // adaptive foreground도 동일하게(투명 여백 포함)
    await writePaddedIcon(outDir, "ic_launcher_foreground.png", t.size);
  }

  console.log("✅ Launcher icons regenerated with safe padding (no cropping).");
}

run().catch((e) => {
  console.error("❌ Icon generation failed:", e);
  process.exit(1);
});
