import React from 'react';
import './GlobalAdBanner.css';

interface GlobalAdBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  onClick?: () => void;
}

/**
 * 해외 사용자용 광고 배너 컴포넌트
 * Google Ads나 다른 글로벌 광고 플랫폼과 연동 가능
 */
export const GlobalAdBanner: React.FC<GlobalAdBannerProps> = ({
  title = 'Recommended for You',
  description = 'Discover great products and services',
  ctaText = 'Learn More',
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 기본 동작: Google Ads나 다른 광고 플랫폼으로 연결
      // 실제 구현 시 광고 플랫폼 URL로 변경
      window.open('https://www.google.com', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="global-ad-banner">
      <div className="global-ad-content">
        <div className="global-ad-label">Advertisement</div>
        <div className="global-ad-title">{title}</div>
        <div className="global-ad-description">{description}</div>
        <button className="global-ad-button" onClick={handleClick}>
          {ctaText}
        </button>
      </div>
    </div>
  );
};

/**
 * Google Ads 스타일의 광고 영역 (실제 광고 스크립트 연동용)
 */
export const GoogleAdPlaceholder: React.FC<{
  slot?: string;
  format?: string;
}> = ({ format = 'auto' }) => {
  // 실제 Google Ads 연동 시 이 부분에 광고 스크립트를 추가
  // 여기서는 플레이스홀더만 제공
  return (
    <div className="google-ad-placeholder">
      <div className="ad-placeholder-content">
        <div className="ad-placeholder-label">Advertisement</div>
        <div className="ad-placeholder-box">
          {/* 실제 Google Ads 스크립트는 여기에 삽입 */}
          <div className="ad-placeholder-text">
            {format === 'auto' ? 'Responsive Ad' : `${format} Ad`}
          </div>
        </div>
      </div>
    </div>
  );
};

