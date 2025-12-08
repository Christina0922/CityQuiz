import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { getDailyLimit, getIsPremium } from '../utils/storage';
import { AdBanner } from '../components/AdBanner';
import './HomePage.css';

interface HomePageProps {
  onStartQuiz: () => void;
  onSelectDifficulty: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartQuiz,
  onSelectDifficulty,
}) => {
  const { t } = useI18n();
  const isPremium = getIsPremium();
  const dailyLimit = getDailyLimit();
  const remainingFree = Math.max(0, 20 - dailyLimit.answeredToday);

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">{t('app.title')}</h1>
          <p className="home-subtitle">{t('app.subtitle')}</p>
        </div>

        <div className="daily-info">
          {isPremium ? (
            <div className="premium-badge">{t('label.unlimited')}</div>
          ) : (
            <div className="remaining-info">
              {t('label.remainingToday')}: {remainingFree}/20
            </div>
          )}
        </div>

        <div className="home-actions">
          <button className="home-button primary" onClick={onStartQuiz}>
            {t('button.startQuiz')}
          </button>
          <button className="home-button secondary" onClick={onSelectDifficulty}>
            {t('button.selectDifficulty')}
          </button>
        </div>

        {/* 국가별 광고 배너 (프로모션 메시지 포함) */}
        <div className="home-ad-section">
          <AdBanner
            productName={t('ad.coupang.title')}
            description={t('ad.coupang.description')}
          />
        </div>
      </div>
    </div>
  );
};

