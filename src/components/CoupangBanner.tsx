// D:\CityQuiz\src\components\CoupangBanner.tsx

import React from 'react';

import './CoupangBanner.css';

export interface CoupangBannerProps {
  text?: string;
}

export const CoupangBanner: React.FC<CoupangBannerProps> = ({ text }) => {
  return (
    <div className="coupang-banner-container">
      <div className="coupang-banner-box">
        {text || '도시 감성을 더 즐기고 싶다면?'}
      </div>
    </div>
  );
};

// 기본 내보내기도 함께 제공 (import CoupangBanner from ...) 용
export default CoupangBanner;
