#!/usr/bin/env python3
"""
PC용 Google Play Games 이미지 생성 스크립트

요구사항:
1. 로고: 600x400 픽셀, 투명 PNG, 최대 8MB
2. 그래픽 이미지: 16:9 비율, 가로 720-7680픽셀 (1920x1080 추천), PNG 또는 JPG, 최대 15MB, 텍스트 없음

사용법:
1. 참고 이미지 파일 확인 (assets/icon-original.png 또는 기존 로고)
2. python scripts/generate-pc-gpg-images.py 실행

필요한 패키지:
- pip install Pillow
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
except ImportError:
    print("❌ 오류: Pillow가 설치되지 않았습니다.")
    print("   설치: pip install Pillow")
    sys.exit(1)

def ensure_directory(dir_path):
    """디렉토리 생성"""
    Path(dir_path).mkdir(parents=True, exist_ok=True)

def create_logo_600x400(output_path, reference_logo_path=None):
    """
    PC용 Google Play Games 로고 생성 (600x400, 투명 PNG)
    """
    try:
        # 600x400 투명 캔버스 생성
        canvas = Image.new('RGBA', (600, 400), (0, 0, 0, 0))
        
        if reference_logo_path and Path(reference_logo_path).exists():
            # 참고 로고가 있으면 사용
            logo = Image.open(reference_logo_path)
            
            # 투명도 유지
            if logo.mode != 'RGBA':
                logo = logo.convert('RGBA')
            
            # 비율 유지하면서 리사이즈 (600x400 안에 맞춤)
            logo.thumbnail((580, 380), Image.Resampling.LANCZOS)
            
            # 중앙에 배치
            x = (600 - logo.width) // 2
            y = (400 - logo.height) // 2
            canvas.paste(logo, (x, y), logo)
        else:
            # 참고 로고가 없으면 간단한 로고 생성
            draw = ImageDraw.Draw(canvas)
            
            # 배경 원형 그라데이션 (참고 이미지 스타일)
            center_x, center_y = 300, 200
            radius = 150
            
            # 다채로운 원형 배경
            for i in range(radius, 0, -5):
                alpha = int(200 * (1 - i / radius))
                color = (
                    int(255 * (1 - i / radius)),  # R
                    int(200 * (i / radius)),        # G
                    int(255 * (i / radius)),      # B
                    alpha
                )
                draw.ellipse(
                    [center_x - i, center_y - i, center_x + i, center_y + i],
                    fill=color
                )
            
            # CITY QUIZ 텍스트 (간단한 버전)
            try:
                # 시스템 폰트 사용
                font_size = 60
                font = ImageFont.truetype("arial.ttf", font_size)
            except:
                try:
                    font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", font_size)
                except:
                    font = ImageFont.load_default()
            
            text = "CITY QUIZ"
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # 텍스트 중앙 배치
            text_x = (600 - text_width) // 2
            text_y = (400 - text_height) // 2
            
            # 텍스트 그림자 효과
            draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0, 100), font=font)
            draw.text((text_x, text_y), text, fill=(138, 43, 226, 255), font=font)  # 보라색
        
        # 파일 저장
        canvas.save(output_path, 'PNG', optimize=True)
        
        # 파일 크기 확인
        file_size_mb = Path(output_path).stat().st_size / (1024 * 1024)
        if file_size_mb > 8:
            print(f"⚠️ 경고: 로고 파일 크기가 8MB를 초과합니다 ({file_size_mb:.2f}MB)")
        
        print(f"✓ 로고 생성 완료: {output_path} (600x400px, {file_size_mb:.2f}MB)")
        return True
    except Exception as e:
        print(f"✗ 로고 생성 실패: {output_path} - {e}")
        return False

def create_graphic_image_16_9(output_path, width=1920, reference_image_path=None):
    """
    PC용 Google Play Games 그래픽 이미지 생성 (16:9, 텍스트 없음)
    """
    try:
        # 16:9 비율 계산
        height = int(width * 9 / 16)
        
        # 캔버스 생성
        canvas = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(canvas)
        
        if reference_image_path and Path(reference_image_path).exists():
            # 참고 이미지가 있으면 사용
            ref_img = Image.open(reference_image_path)
            ref_img = ref_img.convert('RGB')
            
            # 16:9 비율로 리사이즈 (비율 유지하면서 크롭)
            ref_ratio = ref_img.width / ref_img.height
            target_ratio = width / height
            
            if ref_ratio > target_ratio:
                # 참고 이미지가 더 넓음 - 높이 기준으로 리사이즈 후 좌우 크롭
                new_height = height
                new_width = int(ref_img.width * (height / ref_img.height))
                ref_img = ref_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                left = (new_width - width) // 2
                ref_img = ref_img.crop((left, 0, left + width, height))
            else:
                # 참고 이미지가 더 좁음 - 너비 기준으로 리사이즈 후 상하 크롭
                new_width = width
                new_height = int(ref_img.height * (width / ref_img.width))
                ref_img = ref_img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                top = (new_height - height) // 2
                ref_img = ref_img.crop((0, top, width, top + height))
            
            # 텍스트 제거를 위한 블러 효과 (약하게)
            ref_img = ref_img.filter(ImageFilter.GaussianBlur(radius=1))
            
            canvas.paste(ref_img)
        else:
            # 참고 이미지가 없으면 그라데이션 배경 생성
            # 상단: 핑크, 하단: 연두색 (게임 스타일)
            for y in range(height):
                # 그라데이션 계산
                ratio = y / height
                r = int(255 * (1 - ratio) + 144 * ratio)  # 핑크에서 연두색으로
                g = int(192 * (1 - ratio) + 238 * ratio)
                b = int(203 * (1 - ratio) + 144 * ratio)
                
                draw.line([(0, y), (width, y)], fill=(r, g, b))
            
            # 게임 스타일의 추상적인 도형 추가 (텍스트 없음)
            center_x, center_y = width // 2, height // 2
            
            # 큰 원형 (반투명 효과를 위한 그라데이션)
            for i in range(300, 0, -15):
                alpha_ratio = 1 - (i / 300)
                color = (
                    int(255 * alpha_ratio * 0.3),
                    int(200 * alpha_ratio * 0.3),
                    int(255 * alpha_ratio * 0.3)
                )
                # 원형 그리기
                draw.ellipse(
                    [center_x - i, center_y - i, center_x + i, center_y + i],
                    fill=color,
                    outline=None
                )
        
        # 파일 저장
        canvas.save(output_path, 'PNG', optimize=True)
        
        # 파일 크기 확인
        file_size_mb = Path(output_path).stat().st_size / (1024 * 1024)
        if file_size_mb > 15:
            print(f"⚠️ 경고: 그래픽 이미지 파일 크기가 15MB를 초과합니다 ({file_size_mb:.2f}MB)")
            # JPG로 변환하여 파일 크기 줄이기
            jpg_path = output_path.with_suffix('.jpg')
            canvas.save(jpg_path, 'JPEG', quality=85, optimize=True)
            jpg_size_mb = Path(jpg_path).stat().st_size / (1024 * 1024)
            print(f"   → JPG 버전 생성: {jpg_path} ({jpg_size_mb:.2f}MB)")
        
        print(f"✓ 그래픽 이미지 생성 완료: {output_path} ({width}x{height}px, {file_size_mb:.2f}MB)")
        return True
    except Exception as e:
        print(f"✗ 그래픽 이미지 생성 실패: {output_path} - {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    # 출력 디렉토리
    logo_dir = project_root / '구글플레이리스팅' / 'PC용 Google Play Games 로고'
    graphic_dir = project_root / '구글플레이리스팅' / 'PC용 Google Play Games 그래픽 이미지'
    
    ensure_directory(logo_dir)
    ensure_directory(graphic_dir)
    
    # 참고 이미지 경로 찾기
    reference_logo = None
    reference_graphic = None
    
    # 로고 참고 이미지 찾기 (기존 파일 우선)
    existing_logo = logo_dir / 'CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png'
    if existing_logo.exists():
        reference_logo = existing_logo
        print(f"📂 기존 로고 발견: {reference_logo}")
    else:
        possible_logo_paths = [
            project_root / 'assets' / 'icon-original.png',
            project_root / '구글플레이리스팅' / '앱 아이콘' / 'app_icon_512.png',
            project_root / 'assets' / 'icon-512.png',
        ]
        
        for path in possible_logo_paths:
            try:
                if path.exists():
                    reference_logo = path
                    print(f"📂 참고 로고 발견: {reference_logo}")
                    break
            except:
                continue
    
    # 그래픽 이미지 참고 이미지 찾기 (기존 파일 우선)
    existing_graphic = graphic_dir / 'pc_gpg_graphic_1920x1080_no_text.png'
    if existing_graphic.exists():
        reference_graphic = existing_graphic
        print(f"📂 기존 그래픽 이미지 발견: {reference_graphic}")
    else:
        possible_graphic_paths = [
            project_root / '구글플레이리스팅' / 'PC용 Google Play Games 그래픽 이미지' / 'pc_gpg_graphic_1920x1080_no_text.png',
            project_root / '구글플레이리스팅' / '그래픽 이미지' / 'feature_graphic_1024x500.png',
        ]
        
        for path in possible_graphic_paths:
            try:
                if path.exists():
                    reference_graphic = path
                    print(f"📂 참고 그래픽 이미지 발견: {reference_graphic}")
                    break
            except:
                continue
    
    print('\n🎨 PC용 Google Play Games 이미지 생성 시작...\n')
    
    # 1. 로고 생성 (600x400)
    logo_path = logo_dir / 'CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png'
    print('1️⃣ 로고 생성 중 (600x400, 투명 PNG)...')
    create_logo_600x400(logo_path, reference_logo)
    print()
    
    # 2. 그래픽 이미지 생성 (1920x1080, 16:9)
    graphic_path = graphic_dir / 'pc_gpg_graphic_1920x1080_no_text.png'
    print('2️⃣ 그래픽 이미지 생성 중 (1920x1080, 16:9, 텍스트 없음)...')
    create_graphic_image_16_9(graphic_path, width=1920, reference_image_path=reference_graphic)
    print()
    
    print('✅ 모든 이미지 생성 완료!\n')
    print('📋 생성된 파일:')
    print(f'   - 로고: {logo_path} (600x400px, 투명 PNG)')
    print(f'   - 그래픽 이미지: {graphic_path} (1920x1080px, 16:9, 텍스트 없음)')
    
    # 다운로드 폴더로 복사
    try:
        import shutil
        downloads_path = Path.home() / 'Downloads'
        
        if downloads_path.exists():
            logo_dest = downloads_path / logo_path.name
            graphic_dest = downloads_path / graphic_path.name
            
            shutil.copy2(logo_path, logo_dest)
            print(f'\n📥 다운로드 폴더로 복사 완료:')
            print(f'   - 로고: {logo_dest}')
            
            shutil.copy2(graphic_path, graphic_dest)
            print(f'   - 그래픽 이미지: {graphic_dest}')
            print(f'\n✅ 모든 작업 완료! 다운로드 폴더를 확인하세요.')
        else:
            print(f'\n⚠️ 다운로드 폴더를 찾을 수 없습니다: {downloads_path}')
    except Exception as e:
        print(f'\n⚠️ 다운로드 폴더로 복사 실패: {e}')
        import traceback
        traceback.print_exc()
    
    print('\n💡 다음 단계:')
    print('   Google Play Console에 생성된 이미지를 업로드하세요.')

if __name__ == '__main__':
    main()

