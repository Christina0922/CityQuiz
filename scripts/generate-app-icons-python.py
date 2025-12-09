#!/usr/bin/env python3
"""
앱 아이콘 생성 스크립트 (Python 버전)
ImageMagick 또는 Pillow 필요

사용법:
1. 원본 아이콘 이미지를 'assets/icon-original.png' (1024x1024px 권장)에 저장
2. python scripts/generate-app-icons-python.py 실행

필요한 패키지:
- pip install Pillow
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("❌ 오류: Pillow가 설치되지 않았습니다.")
    print("   설치: pip install Pillow")
    sys.exit(1)

ICON_SIZES = {
    # Google Play Console
    'play-store': 512,
    
    # Android mipmap densities
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

MIPMAP_FOLDERS = {
    'mdpi': 'app/src/main/res/mipmap-mdpi',
    'hdpi': 'app/src/main/res/mipmap-hdpi',
    'xhdpi': 'app/src/main/res/mipmap-xhdpi',
    'xxhdpi': 'app/src/main/res/mipmap-xxhdpi',
    'xxxhdpi': 'app/src/main/res/mipmap-xxxhdpi',
}

def generate_icon(input_path, output_path, size):
    """아이콘 리사이즈 및 저장"""
    try:
        img = Image.open(input_path)
        
        # 투명도 유지하면서 리사이즈
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # 비율 유지하면서 리사이즈
        img.thumbnail((size, size), Image.Resampling.LANCZOS)
        
        # 정사각형 캔버스 생성 (투명 배경)
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # 중앙에 배치
        x = (size - img.width) // 2
        y = (size - img.height) // 2
        canvas.paste(img, (x, y), img)
        
        canvas.save(output_path, 'PNG', optimize=True)
        print(f"✓ 생성 완료: {output_path} ({size}x{size}px)")
        return True
    except Exception as e:
        print(f"✗ 생성 실패: {output_path} - {e}")
        return False

def ensure_directory(dir_path):
    """디렉토리 생성"""
    Path(dir_path).mkdir(parents=True, exist_ok=True)

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    original_icon = project_root / 'assets' / 'icon-original.png'
    
    # 원본 파일 확인
    if not original_icon.exists():
        print('❌ 오류: 원본 아이콘을 찾을 수 없습니다.')
        print(f'   경로: {original_icon}')
        print('\n📋 사용 방법:')
        print('   1. 원본 아이콘 이미지를 assets/icon-original.png에 저장하세요')
        print('   2. 권장 크기: 1024x1024px 이상 (PNG, 투명 배경)')
        print('   3. python scripts/generate-app-icons-python.py 실행')
        sys.exit(1)
    
    print('🎨 앱 아이콘 생성 시작...\n')
    print(f'📂 원본 파일: {original_icon}\n')
    
    # assets 폴더 확인
    assets_dir = project_root / 'assets'
    assets_dir.mkdir(exist_ok=True)
    
    # 1. Google Play Console 아이콘 (512x512)
    play_store_icon = assets_dir / 'icon-512.png'
    if generate_icon(original_icon, play_store_icon, ICON_SIZES['play-store']):
        print(f'   → Google Play Console용: {play_store_icon}\n')
    
    # 2. Android mipmap 아이콘들
    print('📱 Android mipmap 아이콘 생성 중...\n')
    
    for density, size in ICON_SIZES.items():
        if density == 'play-store':
            continue
        
        mipmap_dir = project_root / MIPMAP_FOLDERS[density]
        ensure_directory(mipmap_dir)
        
        icon_path = mipmap_dir / 'ic_launcher.png'
        icon_round_path = mipmap_dir / 'ic_launcher_round.png'
        
        generate_icon(original_icon, icon_path, size)
        generate_icon(original_icon, icon_round_path, size)
    
    print('\n✅ 모든 아이콘 생성 완료!\n')
    print('📋 생성된 파일:')
    print(f'   - Google Play Console: assets/icon-512.png (512x512px)')
    for density, folder in MIPMAP_FOLDERS.items():
        size = ICON_SIZES[density]
        print(f'   - Android mipmap-{density}: {folder}/ic_launcher.png ({size}x{size}px)')
    print('\n💡 다음 단계:')
    print('   1. Android Studio에서 앱을 다시 빌드하세요')
    print('   2. Google Play Console에 assets/icon-512.png를 업로드하세요')

if __name__ == '__main__':
    main()

