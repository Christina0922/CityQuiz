/**
 * 앱 아이콘 생성 스크립트
 * 
 * 사용법:
 * 1. 원본 아이콘 이미지를 'assets/icon-original.png' (1024x1024px 권장)에 저장
 * 2. npm run generate-icons 실행
 * 
 * 생성되는 파일:
 * - Google Play Console: assets/icon-512.png (512x512px)
 * - Android mipmap 세트: app/src/main/res/mipmap-*/ic_launcher.png
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
    console.log(`✓ 생성 완료: ${outputPath} (${size}x${size}px)`);
  } catch (error) {
    console.error(`✗ 생성 실패: ${outputPath}`, error.message);
    throw error;
  }
}

async function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 폴더 생성: ${dir}`);
  }
}

async function main() {
  const originalIcon = path.join(__dirname, '../assets/icon-original.png');
  
  // 원본 파일 확인
  if (!fs.existsSync(originalIcon)) {
    console.error('❌ 오류: 원본 아이콘을 찾을 수 없습니다.');
    console.error(`   경로: ${originalIcon}`);
    console.error('\n📋 사용 방법:');
    console.error('   1. 원본 아이콘 이미지를 assets/icon-original.png에 저장하세요');
    console.error('   2. 권장 크기: 1024x1024px 이상 (PNG, 투명 배경)');
    console.error('   3. npm run generate-icons 실행');
    process.exit(1);
  }

  console.log('🎨 앱 아이콘 생성 시작...\n');
  console.log(`📂 원본 파일: ${originalIcon}\n`);

  // assets 폴더 확인
  const assetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Google Play Console 아이콘 (512x512)
  const playStoreIcon = path.join(assetsDir, 'icon-512.png');
  await generateIcon(originalIcon, playStoreIcon, ICON_SIZES['play-store']);
  console.log(`   → Google Play Console용: ${playStoreIcon}\n`);

  // 2. Android mipmap 아이콘들
  console.log('📱 Android mipmap 아이콘 생성 중...\n');
  
  for (const [density, size] of Object.entries(ICON_SIZES)) {
    if (density === 'play-store') continue;
    
    const mipmapDir = path.join(__dirname, '..', MIPMAP_FOLDERS[density]);
    await ensureDirectory(mipmapDir);
    
    const iconPath = path.join(mipmapDir, 'ic_launcher.png');
    const iconRoundPath = path.join(mipmapDir, 'ic_launcher_round.png');
    
    await generateIcon(originalIcon, iconPath, size);
    await generateIcon(originalIcon, iconRoundPath, size);
  }

  console.log('\n✅ 모든 아이콘 생성 완료!\n');
  console.log('📋 생성된 파일:');
  console.log(`   - Google Play Console: assets/icon-512.png (512x512px)`);
  console.log(`   - Android mipmap-mdpi: ${MIPMAP_FOLDERS['mdpi']}/ic_launcher.png (48x48px)`);
  console.log(`   - Android mipmap-hdpi: ${MIPMAP_FOLDERS['hdpi']}/ic_launcher.png (72x72px)`);
  console.log(`   - Android mipmap-xhdpi: ${MIPMAP_FOLDERS['xhdpi']}/ic_launcher.png (96x96px)`);
  console.log(`   - Android mipmap-xxhdpi: ${MIPMAP_FOLDERS['xxhdpi']}/ic_launcher.png (144x144px)`);
  console.log(`   - Android mipmap-xxxhdpi: ${MIPMAP_FOLDERS['xxxhdpi']}/ic_launcher.png (192x192px)`);
  console.log('\n💡 다음 단계:');
  console.log('   1. Android Studio에서 앱을 다시 빌드하세요');
  console.log('   2. Google Play Console에 assets/icon-512.png를 업로드하세요');
}

main().catch(error => {
  console.error('❌ 오류 발생:', error);
  process.exit(1);
});

