import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import './Footer.css';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">{t('app.subtitle')}</p>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} City Quiz. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

