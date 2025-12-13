import React from 'react';
import './Header.css';
import { useI18n } from '../contexts/I18nContext';

type HeaderProps = {
  currentPage: 'home' | 'quiz' | 'stats';
  onNavigate: (page: 'home' | 'quiz' | 'stats') => void;
};

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { language, setLanguage, t } = useI18n();

  console.log("HEADER ONE-LINE VERSION 2025-12-12");

  const handleChangeLanguage = (lang: 'ko' | 'en') => {
    setLanguage(lang);
  };

  return (
    <header className="header-bar">
      <div className="header-title">도시 퀴즈</div>
      
      <div className="header-nav">
        <button
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          {t('nav.home')}
        </button>
        <button
          className={`nav-btn ${currentPage === 'quiz' ? 'active' : ''}`}
          onClick={() => onNavigate('quiz')}
        >
          {t('nav.quiz')}
        </button>
        <button
          className={`nav-btn ${currentPage === 'stats' ? 'active' : ''}`}
          onClick={() => onNavigate('stats')}
        >
          {t('nav.stats')}
        </button>
      </div>

      <div className="header-lang">
        <button 
          className={`lang-btn ${language === 'ko' ? 'active' : ''}`}
          onClick={() => handleChangeLanguage('ko')}
          aria-label="한국어"
        >
          한국어
        </button>
        <span className="lang-sep">|</span>
        <button 
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => handleChangeLanguage('en')}
          aria-label="English"
        >
          English
        </button>
      </div>
    </header>
  );
};

export default Header;
