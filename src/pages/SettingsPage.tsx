import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { getIsPremium, resetStats, getIsDeveloper, setIsDeveloper } from '../utils/storage';
import { useCountry } from '../hooks/useCountry';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useI18n();
  const isPremium = getIsPremium();
  const isDeveloper = getIsDeveloper();
  const { countryCode, isKR } = useCountry();
  
  const handleToggleDeveloper = () => {
    const newValue = !isDeveloper;
    setIsDeveloper(newValue);
    alert(
      language === 'ko'
        ? `개발자 모드가 ${newValue ? '활성화' : '비활성화'}되었습니다.`
        : `Developer mode ${newValue ? 'activated' : 'deactivated'}.`
    );
    window.location.reload();
  };

  const handleResetData = () => {
    if (
      window.confirm(
        language === 'ko'
          ? '모든 통계 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
          : 'Are you sure you want to reset all statistics data? This action cannot be undone.'
      )
    ) {
      resetStats();
      alert(
        language === 'ko'
          ? '데이터가 초기화되었습니다.'
          : 'Data has been reset.'
      );
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-content">
        <h1 className="settings-title">설정</h1>

        <div className="settings-section">
          <h2 className="section-title">언어 설정</h2>
          <div className="language-options">
            <button
              className={`language-option ${language === 'ko' ? 'active' : ''}`}
              onClick={() => setLanguage('ko')}
            >
              한국어
            </button>
            <button
              className={`language-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">개발자 모드</h2>
          <div className="developer-status">
            {isDeveloper ? (
              <div className="status-active">
                <span className="status-icon">👨‍💻</span>
                <span>개발자 모드 활성화됨</span>
              </div>
            ) : (
              <div className="status-inactive">
                <span>개발자 모드 비활성화</span>
              </div>
            )}
            <button className="toggle-developer-button" onClick={handleToggleDeveloper}>
              {isDeveloper ? '개발자 모드 비활성화' : '개발자 모드 활성화'}
            </button>
            <p className="developer-description">
              개발자 모드를 활성화하면 모든 난이도와 해설에 자유롭게 접근할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">프리미엄 상태</h2>
          <div className="premium-status">
            {isPremium ? (
              <div className="status-active">
                <span className="status-icon">⭐</span>
                <span>프리미엄 활성화됨 {isDeveloper && '(개발자 모드)'}</span>
              </div>
            ) : (
              <div className="status-inactive">
                <span>프리미엄 비활성화</span>
              </div>
            )}
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">국가 정보</h2>
          <div className="country-info">
            <p>
              감지된 국가: <strong>{isKR ? '한국 (KR)' : `해외 (${countryCode})`}</strong>
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">데이터 관리</h2>
          <button className="reset-button" onClick={handleResetData}>
            {t('button.resetData')}
          </button>
          <p className="reset-description">
            모든 통계 데이터와 오늘 푼 문제 수를 초기화합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

