/**
 * App Icon Generator Script
 * 
 * Usage:
 * 1. Place original icon image at 'assets/icon-original.png' (1024x1024px recommended)
 * 2. Run: npm run generate-icons
 * 
 * Generated files:
 * - Google Play Console: assets/icon-512.png (512x512px)
 * - Android mipmap set: app/src/main/res/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher.png
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = {
  // Google Play Console
  'play-store': 512,
  
  // Android mipmap densities
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192,
};

const MIPMAP_FOLDERS = {
  'mdpi': 'app/src/main/res/mipmap-mdpi',
  'hdpi': 'app/src/main/res/mipmap-hdpi',
  'xhdpi': 'app/src/main/res/mipmap-xhdpi',
  'xxhdpi': 'app/src/main/res/mipmap-xxhdpi',
  'xxxhdpi': 'app/src/main/res/mipmap-xxxhdpi',
};

async function generateIcon(inputPath, outputPath, size) {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // 투명 배경
      })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated: ${outputPath} (${size}x${size}px)`);
  } catch (error) {
    console.error(`✗ Failed: ${outputPath}`, error.message);
    throw error;
  }
}

async function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

async function main() {
  const originalIcon = path.join(__dirname, '../assets/icon-original.png');
  
  // Check if original file exists
  if (!fs.existsSync(originalIcon)) {
    console.error('❌ Error: Original icon not found.');
    console.error(`   Path: ${originalIcon}`);
    console.error('\n📋 Usage:');
    console.error('   1. Place original icon image at assets/icon-original.png');
    console.error('   2. Recommended size: 1024x1024px or larger (PNG, transparent background)');
    console.error('   3. Run: npm run generate-icons');
    process.exit(1);
  }

  console.log('🎨 Starting app icon generation...\n');
  console.log(`📂 Original file: ${originalIcon}\n`);

  // Check assets directory
  const assetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Google Play Console icon (512x512)
  const playStoreIcon = path.join(assetsDir, 'icon-512.png');
  await generateIcon(originalIcon, playStoreIcon, ICON_SIZES['play-store']);
  console.log(`   → Google Play Console: ${playStoreIcon}\n`);

  // 2. Android mipmap icons
  console.log('📱 Generating Android mipmap icons...\n');
  
  for (const [density, size] of Object.entries(ICON_SIZES)) {
    if (density === 'play-store') continue;
    
    const mipmapDir = path.join(__dirname, '..', MIPMAP_FOLDERS[density]);
    await ensureDirectory(mipmapDir);
    
    const iconPath = path.join(mipmapDir, 'ic_launcher.png');
    const iconRoundPath = path.join(mipmapDir, 'ic_launcher_round.png');
    
    await generateIcon(originalIcon, iconPath, size);
    await generateIcon(originalIcon, iconRoundPath, size);
  }

  console.log('\n✅ All icons generated successfully!\n');
  console.log('📋 Generated files:');
  console.log(`   - Google Play Console: assets/icon-512.png (512x512px)`);
  console.log(`   - Android mipmap-mdpi: ${MIPMAP_FOLDERS['mdpi']}/ic_launcher.png (48x48px)`);
  console.log(`   - Android mipmap-hdpi: ${MIPMAP_FOLDERS['hdpi']}/ic_launcher.png (72x72px)`);
  console.log(`   - Android mipmap-xhdpi: ${MIPMAP_FOLDERS['xhdpi']}/ic_launcher.png (96x96px)`);
  console.log(`   - Android mipmap-xxhdpi: ${MIPMAP_FOLDERS['xxhdpi']}/ic_launcher.png (144x144px)`);
  console.log(`   - Android mipmap-xxxhdpi: ${MIPMAP_FOLDERS['xxxhdpi']}/ic_launcher.png (192x192px)`);
  console.log('\n💡 Next steps:');
  console.log('   1. Rebuild the app in Android Studio');
  console.log('   2. Upload assets/icon-512.png to Google Play Console');
}

main().catch(error => {
  console.error('❌ Error occurred:', error);
  process.exit(1);
});

