#!/usr/bin/env python3
"""
PC용 Google Play Games 이미지 생성 및 다운로드 폴더 복사
"""
import os
import sys
import shutil
from pathlib import Path

# 현재 스크립트 위치를 기준으로 프로젝트 루트 찾기
current_file = Path(__file__).resolve()
project_root = current_file.parent

# 프로젝트 루트로 이동
os.chdir(project_root)
sys.path.insert(0, str(project_root))

# generate-pc-gpg-images 모듈 import
sys.path.insert(0, str(project_root / 'scripts'))

try:
    from generate_pc_gpg_images import (
        ensure_directory,
        create_logo_600x400,
        create_graphic_image_16_9
    )
except ImportError:
    # 직접 함수 정의
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    
    def ensure_directory(dir_path):
        Path(dir_path).mkdir(parents=True, exist_ok=True)
    
    def create_logo_600x400(output_path, reference_logo_path=None):
        try:
            canvas = Image.new('RGBA', (600, 400), (0, 0, 0, 0))
            
            if reference_logo_path and Path(reference_logo_path).exists():
                logo = Image.open(reference_logo_path)
                if logo.mode != 'RGBA':
                    logo = logo.convert('RGBA')
                logo.thumbnail((580, 380), Image.Resampling.LANCZOS)
                x = (600 - logo.width) // 2
                y = (400 - logo.height) // 2
                canvas.paste(logo, (x, y), logo)
            else:
                draw = ImageDraw.Draw(canvas)
                center_x, center_y = 300, 200
                radius = 150
                for i in range(radius, 0, -5):
                    alpha = int(200 * (1 - i / radius))
                    color = (int(255 * (1 - i / radius)), int(200 * (i / radius)), int(255 * (i / radius)), alpha)
                    draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i], fill=color)
            
            canvas.save(output_path, 'PNG', optimize=True)
            file_size_mb = Path(output_path).stat().st_size / (1024 * 1024)
            print(f"✓ 로고 생성 완료: {output_path} (600x400px, {file_size_mb:.2f}MB)")
            return True
        except Exception as e:
            print(f"✗ 로고 생성 실패: {e}")
            return False
    
    def create_graphic_image_16_9(output_path, width=1920, reference_image_path=None):
        try:
            height = int(width * 9 / 16)
            canvas = Image.new('RGB', (width, height))
            draw = ImageDraw.Draw(canvas)
            
            if reference_image_path and Path(reference_image_path).exists():
                ref_img = Image.open(reference_image_path)
                ref_img = ref_img.convert('RGB')
                ref_ratio = ref_img.width / ref_img.height
                target_ratio = width / height
                
                if ref_ratio > target_ratio:
                    new_height = height
                    new_width = int(ref_img.width * (height / ref_img.height))
                    ref_img = ref_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    left = (new_width - width) // 2
                    ref_img = ref_img.crop((left, 0, left + width, height))
                else:
                    new_width = width
                    new_height = int(ref_img.height * (width / ref_img.width))
                    ref_img = ref_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    top = (new_height - height) // 2
                    ref_img = ref_img.crop((0, top, width, top + height))
                
                ref_img = ref_img.filter(ImageFilter.GaussianBlur(radius=1))
                canvas.paste(ref_img)
            else:
                for y in range(height):
                    ratio = y / height
                    r = int(255 * (1 - ratio) + 144 * ratio)
                    g = int(192 * (1 - ratio) + 238 * ratio)
                    b = int(203 * (1 - ratio) + 144 * ratio)
                    draw.line([(0, y), (width, y)], fill=(r, g, b))
            
            canvas.save(output_path, 'PNG', optimize=True)
            file_size_mb = Path(output_path).stat().st_size / (1024 * 1024)
            print(f"✓ 그래픽 이미지 생성 완료: {output_path} ({width}x{height}px, {file_size_mb:.2f}MB)")
            return True
        except Exception as e:
            print(f"✗ 그래픽 이미지 생성 실패: {e}")
            return False

def main():
    # 출력 디렉토리
    logo_dir = project_root / '구글플레이리스팅' / 'PC용 Google Play Games 로고'
    graphic_dir = project_root / '구글플레이리스팅' / 'PC용 Google Play Games 그래픽 이미지'
    
    ensure_directory(logo_dir)
    ensure_directory(graphic_dir)
    
    # 참고 이미지 찾기
    reference_logo = logo_dir / 'CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png'
    if not reference_logo.exists():
        reference_logo = project_root / 'assets' / 'icon-original.png'
        if not reference_logo.exists():
            reference_logo = None
    
    reference_graphic = graphic_dir / 'pc_gpg_graphic_1920x1080_no_text.png'
    if not reference_graphic.exists():
        reference_graphic = project_root / '구글플레이리스팅' / '그래픽 이미지' / 'feature_graphic_1024x500.png'
        if not reference_graphic.exists():
            reference_graphic = None
    
    print('🎨 PC용 Google Play Games 이미지 생성 시작...\n')
    
    # 1. 로고 생성
    logo_path = logo_dir / 'CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png'
    print('1️⃣ 로고 생성 중 (600x400, 투명 PNG)...')
    create_logo_600x400(logo_path, reference_logo)
    print()
    
    # 2. 그래픽 이미지 생성
    graphic_path = graphic_dir / 'pc_gpg_graphic_1920x1080_no_text.png'
    print('2️⃣ 그래픽 이미지 생성 중 (1920x1080, 16:9, 텍스트 없음)...')
    create_graphic_image_16_9(graphic_path, width=1920, reference_image_path=reference_graphic)
    print()
    
    # 다운로드 폴더로 복사
    downloads_path = Path.home() / 'Downloads'
    if downloads_path.exists():
        try:
            logo_dest = downloads_path / logo_path.name
            graphic_dest = downloads_path / graphic_path.name
            
            shutil.copy2(logo_path, logo_dest)
            print(f'📥 다운로드 폴더로 복사 완료:')
            print(f'   - 로고: {logo_dest}')
            
            shutil.copy2(graphic_path, graphic_dest)
            print(f'   - 그래픽 이미지: {graphic_dest}')
            print(f'\n✅ 모든 작업 완료!')
        except Exception as e:
            print(f'⚠️ 다운로드 폴더로 복사 실패: {e}')
    else:
        print(f'⚠️ 다운로드 폴더를 찾을 수 없습니다: {downloads_path}')

if __name__ == '__main__':
    main()


