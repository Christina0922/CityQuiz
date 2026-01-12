#!/usr/bin/env python3
"""기존 이미지를 다운로드 폴더로 복사"""
import shutil
from pathlib import Path

# 프로젝트 루트
project_root = Path(__file__).parent

# 다운로드 폴더
downloads = Path.home() / 'Downloads'

print(f"📥 다운로드 폴더: {downloads}\n")

# 복사할 파일들 (실제 파일 이름 확인)
files_to_try = [
    {
        'source': project_root / '구글플레이리스팅' / 'PC용 Google Play Games 로고' / 'pc_gpg_logo_600x400_transparent.png',
        'dest': downloads / 'CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png',
        'name': '로고 (600x400)'
    },
    {
        'source': project_root / '구글플레이리스팅' / 'PC용 Google Play Games 로고' / 'CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png',
        'dest': downloads / 'CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png',
        'name': '로고 (600x400)'
    },
    {
        'source': project_root / '구글플레이리스팅' / 'PC용 Google Play Games 그래픽 이미지' / 'pc_gpg_graphic_1920x1080_no_text.png',
        'dest': downloads / 'pc_gpg_graphic_1920x1080_no_text.png',
        'name': '그래픽 이미지 (1920x1080)'
    }
]

copied = []
for file in files_to_try:
    if file['source'].exists():
        try:
            shutil.copy2(file['source'], file['dest'])
            size_mb = file['source'].stat().st_size / (1024 * 1024)
            print(f"✅ 복사 완료: {file['name']} ({size_mb:.2f}MB)")
            print(f"   → {file['dest']}")
            copied.append(file['name'])
        except Exception as e:
            print(f"❌ 복사 실패: {file['name']} - {e}")
        print()

if len(copied) > 0:
    print(f"✅ {len(copied)}개 파일 복사 완료!")
    print(f"다운로드 폴더를 확인하세요: {downloads}")
else:
    print("❌ 복사된 파일이 없습니다.")
    print("이미지 파일을 찾을 수 없습니다.")


