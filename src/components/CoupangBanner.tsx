import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import './CoupangBanner.css';

const promoMessages = {
  ko: [
    '도시를 더 자세히 알고 싶다면?',
    '여행 준비 중이신가요?',
    '영어권 나라에 관심이 있다면?',
    '세계 도시를 좋아한다면?',
    '세계 여행자를 위한 추천 아이템',
  ],
  en: [
    'Want to learn more about cities?',
    'Planning a trip?',
    'Interested in English-speaking countries?',
    'Love world cities?',
    'Recommended items for world travelers',
  ],
};

function getRandomMessage(language: 'ko' | 'en'): string {
  const messageList = promoMessages[language];
  return messageList[Math.floor(Math.random() * messageList.length)];
}

interface CoupangBannerProps {
  productName?: string;
  productUrl?: string;
  imageUrl?: string;
  description?: string;
}

/**
 * 쿠팡 파트너스 배너 컴포넌트
 * 실제 쿠팡 파트너스 링크를 사용해야 합니다.
 * 여기서는 예시 링크 구조만 제공합니다.
 * 프로모션 메시지가 1시간마다 자동으로 변경됩니다.
 */
export const CoupangBanner: React.FC<CoupangBannerProps> = ({
  productName = '추천 상품',
  productUrl = 'https://link.coupang.com/a/bcdefg',
  imageUrl,
}) => {
  const { language } = useI18n();
  const [currentMessage, setCurrentMessage] = useState(() =>
    getRandomMessage(language)
  );

  // 언어 변경 시 메시지 업데이트
  useEffect(() => {
    setCurrentMessage(getRandomMessage(language));
  }, [language]);

  // 1시간(3600000ms)마다 문구 자동 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(getRandomMessage(language));
    }, 3600000); // 1시간

    return () => clearInterval(interval);
  }, [language]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 쿠팡 파트너스 링크로 이동
    // 실제 구현 시 쿠팡 파트너스 URL로 변경 필요
    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="coupang-banner">
      <a
        href={productUrl}
        onClick={handleClick}
        className="coupang-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="coupang-content">
          {imageUrl && (
            <div className="coupang-image">
              <img src={imageUrl} alt={productName} />
            </div>
          )}
          <div className="coupang-text">
            <div className="coupang-title">{currentMessage}</div>
          </div>
        </div>
      </a>
    </div>
  );
};

/**
 * 쿠팡 추천 상품 목록 컴포넌트
 */
export const CoupangProductList: React.FC = () => {
  // 예시 상품 데이터 (실제로는 쿠팡 API나 데이터를 사용)
  const products = [
    {
      id: 1,
      name: '미국 여행 가이드북',
      url: 'https://www.coupang.com/',
      image: '/placeholder-book.jpg',
    },
    {
      id: 2,
      name: '영어 학습 교재',
      url: 'https://www.coupang.com/',
      image: '/placeholder-book.jpg',
    },
    {
      id: 3,
      name: '지도책 세트',
      url: 'https://www.coupang.com/',
      image: '/placeholder-book.jpg',
    },
  ];

  return (
    <div className="coupang-product-list">
      <h3 className="coupang-section-title">추천 상품</h3>
      <div className="coupang-products-grid">
        {products.map((product) => (
          <CoupangBanner
            key={product.id}
            productName={product.name}
            productUrl={product.url}
            imageUrl={product.image}
          />
        ))}
      </div>
    </div>
  );
};

