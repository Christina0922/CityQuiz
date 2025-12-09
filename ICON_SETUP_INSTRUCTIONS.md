# 아이콘 설정 가이드

## 방법 1: 자동 생성 (권장)

### 1단계: 원본 이미지 준비
- CITY QUIZ 로고 이미지를 `assets/icon-original.png`에 저장
- 권장 크기: **1024x1024px 이상** (PNG, 투명 배경)

### 2단계: 아이콘 자동 생성
```bash
npm run generate-icons
```

이 명령어가 자동으로:
- Google Play Console용 512x512px 아이콘 생성
- 모든 Android mipmap 폴더에 적절한 사이즈의 아이콘 생성 및 배치

## 방법 2: 수동 복사

이미 각 사이즈의 아이콘 파일을 가지고 있다면:

### 1단계: assets 폴더에 파일 배치
각 사이즈의 아이콘을 다음 형식으로 저장:
- `assets/icon-mdpi.png` (48x48px)
- `assets/icon-hdpi.png` (72x72px)
- `assets/icon-xhdpi.png` (96x96px)
- `assets/icon-xxhdpi.png` (144x144px)
- `assets/icon-xxxhdpi.png` (192x192px)

또는:
- `assets/icon-48x48.png`
- `assets/icon-72x72.png`
- 등등...

### 2단계: 자동 복사
```powershell
.\scripts\copy-icons-to-mipmap.ps1
```

## 방법 3: 직접 복사

각 mipmap 폴더에 직접 파일을 복사:

```
app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48px)
│   └── ic_launcher_round.png (48x48px)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72px)
│   └── ic_launcher_round.png (72x72px)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96px)
│   └── ic_launcher_round.png (96x96px)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144px)
│   └── ic_launcher_round.png (144x144px)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192px)
    └── ic_launcher_round.png (192x192px)
```

## 필요한 사이즈

| 폴더 | 사이즈 | 용도 |
|------|--------|------|
| mipmap-mdpi | 48x48px | 저해상도 디바이스 |
| mipmap-hdpi | 72x72px | 중간 해상도 디바이스 |
| mipmap-xhdpi | 96x96px | 고해상도 디바이스 |
| mipmap-xxhdpi | 144x144px | 매우 고해상도 디바이스 |
| mipmap-xxxhdpi | 192x192px | 초고해상도 디바이스 |
| assets/icon-512.png | 512x512px | Google Play Console |

## 확인

아이콘 설정 후:
1. Android Studio에서 앱을 다시 빌드
2. 앱 아이콘이 올바르게 표시되는지 확인
3. Google Play Console에 `assets/icon-512.png` 업로드

