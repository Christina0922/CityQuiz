import React from 'react';
import { useCountry } from '../hooks/useCountry';
import { CoupangBanner } from './CoupangBanner';
import { GlobalAdBanner, GoogleAdPlaceholder } from './GlobalAdBanner';

interface AdBannerProps {
  variant?: 'banner' | 'product-list' | 'google';
  productName?: string;
  productUrl?: string;
  imageUrl?: string;
  description?: string;
}

/**
 * 국가별로 다른 광고를 표시하는 통합 광고 배너 컴포넌트
 * - KR 사용자: 쿠팡 파트너스 배너
 * - 해외 사용자: 글로벌 광고 배너
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  variant = 'banner',
  productName,
  productUrl,
  imageUrl,
  description,
}) => {
  const { isKR, isLoading } = useCountry();

  // 로딩 중이거나 한국 사용자에게는 쿠팡 배너 표시 (기본값: 한국)
  // 한국 사용자에게는 쿠팡 배너 표시
  if (isLoading || isKR) {
    if (variant === 'google') {
      // Google Ads는 한국에서도 사용 가능하지만, 쿠팡 우선
      return <CoupangBanner productName={productName} productUrl={productUrl} imageUrl={imageUrl} description={description} />;
    }
    return (
      <CoupangBanner
        productName={productName}
        productUrl={productUrl}
        imageUrl={imageUrl}
        description={description}
      />
    );
  }

  // 해외 사용자에게는 글로벌 광고 표시
  if (variant === 'google') {
    return <GoogleAdPlaceholder />;
  }

  return (
    <GlobalAdBanner
      title={productName}
      description={description}
      ctaText="Learn More"
    />
  );
};

