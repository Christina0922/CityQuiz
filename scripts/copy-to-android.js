const fs = require('fs');
const path = require('path');

// Android 프로젝트 경로 설정
// 사용자가 실제 Android 프로젝트 경로로 수정해야 합니다
const ANDROID_ASSETS_PATH = process.env.ANDROID_ASSETS_PATH || 
  path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'dist');

const DIST_PATH = path.join(__dirname, '..', 'dist');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // 디렉토리 내용 복사
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    // 파일 복사
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

function main() {
  console.log('📦 Android assets 복사 시작...');
  console.log(`소스: ${DIST_PATH}`);
  console.log(`대상: ${ANDROID_ASSETS_PATH}`);

  // dist 폴더 확인
  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.');
    process.exit(1);
  }

  // assets 폴더 생성 (없으면)
  if (!fs.existsSync(ANDROID_ASSETS_PATH)) {
    console.log(`📁 assets 폴더 생성: ${ANDROID_ASSETS_PATH}`);
    fs.mkdirSync(ANDROID_ASSETS_PATH, { recursive: true });
  }

  try {
    // dist 내용을 assets로 복사
    copyRecursiveSync(DIST_PATH, ANDROID_ASSETS_PATH);
    console.log('✅ Android assets 복사 완료!');
    console.log(`\n📝 Android 코드에서 다음 URL을 사용하세요:`);
    console.log(`   file:///android_asset/index.html\n`);
  } catch (error) {
    console.error('❌ 복사 중 오류 발생:', error.message);
    console.error('\n💡 Android 프로젝트 경로를 설정하려면:');
    console.error('   ANDROID_ASSETS_PATH=/path/to/android/app/src/main/assets npm run copy:android');
    process.exit(1);
  }
}

main();

