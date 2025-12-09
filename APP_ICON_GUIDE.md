# 앱 아이콘 생성 가이드

앱 등록을 위한 모든 사이즈의 아이콘을 자동으로 생성하는 방법입니다.

## 📋 필요한 아이콘 사이즈

### Google Play Console
- **512 x 512px** (PNG, 투명 배경)

### Android mipmap 세트
- **mipmap-mdpi**: 48 x 48px
- **mipmap-hdpi**: 72 x 72px
- **mipmap-xhdpi**: 96 x 96px
- **mipmap-xxhdpi**: 144 x 144px
- **mipmap-xxxhdpi**: 192 x 192px

## 🚀 사용 방법

### 방법 1: Node.js 스크립트 (권장)

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **원본 아이콘 준비**
   - 원본 아이콘 이미지를 `assets/icon-original.png`에 저장
   - 권장 크기: **1024x1024px 이상** (PNG, 투명 배경)
   - CITY QUIZ 로고 이미지를 사용하세요

3. **아이콘 생성**
   ```bash
   npm run generate-icons
   ```

4. **생성된 파일 확인**
   - Google Play Console용: `assets/icon-512.png`
   - Android mipmap: `app/src/main/res/mipmap-*/ic_launcher.png`

### 방법 2: Python 스크립트

1. **Pillow 설치**
   ```bash
   pip install Pillow
   ```

2. **원본 아이콘 준비**
   - `assets/icon-original.png`에 저장 (1024x1024px 이상)

3. **아이콘 생성**
   ```bash
   python scripts/generate-app-icons-python.py
   ```

### 방법 3: PowerShell + ImageMagick

1. **ImageMagick 설치**
   - 다운로드: https://imagemagick.org/script/download.php
   - 또는: `choco install imagemagick`

2. **원본 아이콘 준비**
   - `assets/icon-original.png`에 저장 (1024x1024px 이상)

3. **아이콘 생성**
   ```powershell
   .\scripts\generate-app-icons.ps1
   ```

## 📁 생성되는 파일 구조

```
CityQuiz/
├── assets/
│   ├── icon-original.png      (원본 - 직접 준비)
│   └── icon-512.png           (Google Play Console용)
└── app/src/main/res/
    ├── mipmap-mdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-hdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-xhdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-xxhdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    └── mipmap-xxxhdpi/
        ├── ic_launcher.png
        └── ic_launcher_round.png
```

## ✅ 다음 단계

1. **Android Studio에서 앱 빌드**
   - 생성된 아이콘들이 자동으로 포함됩니다

2. **Google Play Console에 업로드**
   - `assets/icon-512.png` 파일을 업로드하세요
   - Google Play Console → 앱 → 스토어 등록정보 → 그래픽 자산

## 💡 팁

- 원본 이미지는 **정사각형**이어야 합니다
- **투명 배경**을 사용하면 더 깔끔합니다
- 고해상도 원본(1024x1024px 이상)을 사용하면 품질이 좋습니다
- CITY QUIZ 로고의 보라색 텍스트와 컬러 블롭 디자인이 잘 보이도록 확인하세요

## 🔧 문제 해결

### "원본 아이콘을 찾을 수 없습니다" 오류
- `assets/icon-original.png` 파일이 존재하는지 확인
- 파일 경로와 이름이 정확한지 확인

### 이미지 리사이즈 실패
- 원본 이미지가 손상되지 않았는지 확인
- 이미지 형식이 PNG인지 확인
- Node.js/Python/ImageMagick이 정상 설치되었는지 확인

