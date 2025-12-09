const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '../app/src/main/res/playstore_512.png');
const sizes = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192
};

async function generate() {
  console.log('아이콘 생성 시작...');
  
  for (const [density, size] of Object.entries(sizes)) {
    const dir = path.join(__dirname, `../app/src/main/res/mipmap-${density}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const iconPath = path.join(dir, 'ic_launcher.png');
    const iconRoundPath = path.join(dir, 'ic_launcher_round.png');
    
    await sharp(input).resize(size, size).png().toFile(iconPath);
    await sharp(input).resize(size, size).png().toFile(iconRoundPath);
    
    console.log(`✓ ${density}: ${size}x${size}px 생성 완료`);
  }
  
  console.log('\n✅ 모든 아이콘 생성 완료!');
}

generate().catch(error => {
  console.error('오류:', error);
  process.exit(1);
});

