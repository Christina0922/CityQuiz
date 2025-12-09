import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { getCurrentCountryCode } from '../utils/country';
import './Footer.css';

export const Footer: React.FC = () => {
  const { t } = useI18n();
  const [isKorean, setIsKorean] = useState(false);

  useEffect(() => {
    const country = getCurrentCountryCode();
    setIsKorean(country === 'KR');
  }, []);

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {isKorean && (
          <p className="coupang-partnership-notice">
            {t('coupang.partnership')}
          </p>
        )}
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} City Quiz. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

