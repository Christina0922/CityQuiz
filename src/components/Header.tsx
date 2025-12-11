import React from 'react';
import './Header.css';
import { useI18n } from '../contexts/I18nContext';

export const Header: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const handleChangeLanguage = (lang: 'ko' | 'en') => {
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  return (
    <header className="app-header">
      {/* 🔥 상단 파란 영역 제목도 "도시 퀴즈"로 통일 */}
      <div className="app-header-title">도시 퀴즈</div>

      <div className="app-header-language">
        <button
          className={language === 'ko' ? 'lang-button active' : 'lang-button'}
          onClick={() => handleChangeLanguage('ko')}
        >
          한국어
        </button>
        <span className="lang-separator"> | </span>
        <button
          className={language === 'en' ? 'lang-button active' : 'lang-button'}
          onClick={() => handleChangeLanguage('en')}
        >
          English
        </button>
      </div>
    </header>
  );
};

export default Header;
