import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import './Footer.css';

export const Footer: React.FC = () => {
  const { language } = useI18n();

  // 쿠팡 파트너스 링크 (첨부 파일 "쿠팡 제품.txt"에 있는 URL만 사용)
  // 기본 쿠팡 메인 페이지나 임의 링크는 절대 사용하지 않음
  const coupangUrl = "https://link.coupang.com/a/dcsFqr";

  return (
    <footer className="app-footer">
      <div className="footer-coupang">
        <a 
          href={coupangUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-coupang-btn"
        >
          {language === "ko" ? "도시를 더 많이 알고 싶다면?" : "Want to know more cities?"}
        </a>
        <div className="footer-coupang-text">
          {language === "ko" 
            ? "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
            : "This posting is part of Coupang Partners activity, and a certain amount of commission is provided accordingly."}
        </div>
      </div>
    </footer>
  );
};
