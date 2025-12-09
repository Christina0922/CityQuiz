const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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

async function moveContentUp(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    // 30% 위로 이동 = 하단 30%를 잘라내고 상단에 추가
    const moveAmount = Math.round(height * 0.30);
    
    // 이미지 로드
    const image = await sharp(filePath).toBuffer();
    
    // 하단 30%를 잘라내고 나머지 부분 추출
    const bottomCrop = await sharp(image)
      .extract({ left: 0, top: 0, width: width, height: height - moveAmount })
      .toBuffer();
    
    // 새로운 높이로 캔버스 생성 (원본 크기 유지)
    const newImage = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: bottomCrop,
      top: moveAmount,
      left: 0
    }])
    .png()
    .toBuffer();
    
    // 파일 저장
    await sharp(newImage).toFile(filePath);
    console.log(`✓ 처리 완료: ${filePath}`);
  } catch (error) {
    console.error(`✗ 처리 실패: ${filePath}`, error.message);
  }
}

async function main() {
  console.log('아이콘 내용을 30% 위로 이동 중...\n');
  
  for (const file of filesToProcess) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      await moveContentUp(filePath);
    } else {
      console.log(`⚠ 파일 없음: ${filePath}`);
    }
  }
  
  console.log('\n✅ 모든 아이콘 처리 완료!');
}

main().catch(error => {
  console.error('오류:', error);
  process.exit(1);
});

