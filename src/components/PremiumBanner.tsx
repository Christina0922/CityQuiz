import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import './PremiumBanner.css';

interface PremiumBannerProps {
  onGoToStore: () => void;
}

export const PremiumBanner: React.FC<PremiumBannerProps> = ({ onGoToStore }) => {
  const { t } = useI18n();

  return (
    <div className="premium-banner">
      <div className="premium-content">
        <div className="premium-icon">⭐</div>
        <div className="premium-text">
          <h3 className="premium-title">{t('store.premiumTitle')}</h3>
          <p className="premium-description">{t('msg.dailyLimitDescription')}</p>
        </div>
        <button className="premium-button" onClick={onGoToStore}>
          {t('button.store')}
        </button>
      </div>
    </div>
  );
};

