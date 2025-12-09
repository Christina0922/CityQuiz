const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 원본 파일 (playstore_512.png를 원본으로 사용)
const originalFile = 'app/src/main/res/playstore_512.png';

// 처리할 파일 목록
const filesToProcess = [
  'app/src/main/res/playstore_512.png',
  'app/src/main/res/mipmap-mdpi/ic_launcher.png',
  'app/src/main/res/mipmap-mdpi/ic_launcher_round.png',
  'app/src/main/res/mipmap-hdpi/ic_launcher.png',
  'app/src/main/res/mipmap-hdpi/ic_launcher_round.png',
  'app/src/main/res/mipmap-xhdpi/ic_launcher.png',
  'app/src/main/res/mipmap-xhdpi/ic_launcher_round.png',
  'app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
  'app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png',
  'app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
  'app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png',
];

async function centerContent(filePath, targetSize) {
  try {
    const originalPath = path.join(__dirname, '..', originalFile);
    
    // 원본 이미지 로드
    const originalImage = await sharp(originalPath)
      .resize(targetSize, targetSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();
    
    // 원본 메타데이터 가져오기
    const originalMeta = await sharp(originalPath).metadata();
    const originalWidth = originalMeta.width;
    const originalHeight = originalMeta.height;
    
    // 원본 이미지의 실제 콘텐츠 영역 찾기 (투명도가 아닌 부분)
    const originalBuffer = await sharp(originalPath).raw().toBuffer({ resolveWithObject: true });
    
    // 이미지를 정중앙에 배치하기 위해 원본을 리사이즈
    const centeredImage = await sharp(originalPath)
      .resize(targetSize, targetSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    // 파일 저장
    await sharp(centeredImage).toFile(filePath);
    console.log(`✓ 처리 완료: ${filePath} (${targetSize}x${targetSize})`);
  } catch (error) {
    console.error(`✗ 처리 실패: ${filePath}`, error.message);
  }
}

async function main() {
  console.log('아이콘 내용을 정중앙에 배치 중...\n');
  
  // 각 파일의 타겟 사이즈 결정
  const sizeMap = {
    'playstore_512.png': 512,
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
  };
  
  for (const file of filesToProcess) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ 파일 없음: ${filePath}`);
      continue;
    }
    
    // 파일 경로에서 사이즈 추출
    let targetSize = 512;
    if (file.includes('mipmap-mdpi')) targetSize = 48;
    else if (file.includes('mipmap-hdpi')) targetSize = 72;
    else if (file.includes('mipmap-xhdpi')) targetSize = 96;
    else if (file.includes('mipmap-xxhdpi')) targetSize = 144;
    else if (file.includes('mipmap-xxxhdpi')) targetSize = 192;
    
    await centerContent(filePath, targetSize);
  }
  
  console.log('\n✅ 모든 아이콘 처리 완료!');
}

main().catch(error => {
  console.error('오류:', error);
  process.exit(1);
});

