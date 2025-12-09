import React, { useState, useEffect } from 'react';
import { getRandomItemByCategory } from '../data/coupangItems';
import './CoupangPromoMessages.css';

type PromoCategory = 'brain' | 'city' | 'quiz' | 'emotion' | 'accessory';

const PROMO_MESSAGES: Array<{ text: string; category: PromoCategory }> = [
  { text: '두뇌를 더 강하게!', category: 'brain' },
  { text: '세계 도시를 더 잘 맞추고 싶다면?', category: 'city' },
  { text: '상식·퀴즈 실력 올리고 싶다면?', category: 'quiz' },
  { text: '도시 감성을 더 즐기고 싶다면?', category: 'emotion' },
  { text: '퀴즈가 더 편해지는 스마트 액세서리', category: 'accessory' }
];

function getHourlyPromoIndex(): number {
  const seed = Math.floor(Date.now() / (1000 * 3600));
  return seed % PROMO_MESSAGES.length;
}

/**
 * 쿠팡 프로모션 메시지 컴포넌트
 * 1개의 박스만 표시하고, 1시간마다 5개 문구를 번갈아가며 표시
 */
export const CoupangPromoMessages: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(() => getHourlyPromoIndex());

  // 1시간마다 박스 내용 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(getHourlyPromoIndex());
    }, 3600000); // 1시간

    return () => clearInterval(interval);
  }, []);

  const currentPromo = PROMO_MESSAGES[currentIndex];

  const handleClick = () => {
    try {
      const item = getRandomItemByCategory(currentPromo.category);
      if (item && item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error in handleClick:', error);
    }
  };

  return (
    <div className="coupang-promo-messages">
      <div
        className="coupang-promo-message-item"
        onClick={handleClick}
      >
        {currentPromo.text}
      </div>
    </div>
  );
};
