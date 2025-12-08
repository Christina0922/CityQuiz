import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import './Header.css';

interface HeaderProps {
  currentPage?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">{t('app.title')}</h1>
        <div className="header-actions">
          <div className="language-toggle">
            <button
              className={`lang-button ${language === 'ko' ? 'active' : ''}`}
              onClick={() => setLanguage('ko')}
              aria-label="한국어"
            >
              한국어
            </button>
            <span className="lang-separator">|</span>
            <button
              className={`lang-button ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="English"
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

