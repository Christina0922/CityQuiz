#!/usr/bin/env python3
"""
PC용 Google Play Games 이미지 생성 및 다운로드 폴더 복사
"""
import os
import sys
from pathlib import Path

# 스크립트 디렉토리를 기준으로 프로젝트 루트 찾기
script_dir = Path(__file__).parent.absolute()
project_root = script_dir.parent.absolute()

# 프로젝트 루트로 이동
os.chdir(project_root)
sys.path.insert(0, str(project_root))

# 메인 스크립트 실행
from scripts.generate_pc_gpg_images import main

if __name__ == '__main__':
    main()


