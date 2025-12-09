import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { getCurrentCountryCode } from '../utils/country';
import { getRandomItemByCategory } from '../data/coupangItems';
import './CoupangBoxes.css';

type BoxType = 'brain' | 'world' | 'quiz' | 'vibe' | 'accessory';

const BOX_TYPES: BoxType[] = ['brain', 'world', 'quiz', 'vibe', 'accessory'];

// BoxType을 coupangItems 카테고리로 매핑
const CATEGORY_MAP: Record<BoxType, string> = {
  brain: 'brain',
  world: 'city',
  quiz: 'quiz',
  vibe: 'emotion',
  accessory: 'accessory',
};

function getHourlyBoxType(): BoxType {
  const seed = Math.floor(Date.now() / (1000 * 3600));
  return BOX_TYPES[seed % BOX_TYPES.length];
}

export const CoupangBoxes: React.FC = () => {
  const { t } = useI18n();
  const [currentBoxType, setCurrentBoxType] = useState<BoxType>(() => getHourlyBoxType());
  const [currentLink, setCurrentLink] = useState<string>('');
  const [isKorean, setIsKorean] = useState(false);

  useEffect(() => {
    // 한국 사용자만 표시
    const country = getCurrentCountryCode();
    setIsKorean(country === 'KR');
  }, []);

  useEffect(() => {
    if (!isKorean) return;

    const boxType = getHourlyBoxType();
    setCurrentBoxType(boxType);
    
    // 카테고리 매핑을 통해 실제 쿠팡 아이템 가져오기
    const category = CATEGORY_MAP[boxType];
    const item = getRandomItemByCategory(category);
    if (item && item.url) {
      setCurrentLink(item.url);
    } else {
      setCurrentLink('');
    }
  }, [isKorean]);

  // 1시간마다 박스 타입과 링크 업데이트
  useEffect(() => {
    if (!isKorean) return;

    const interval = setInterval(() => {
      const boxType = getHourlyBoxType();
      setCurrentBoxType(boxType);
      
      const category = CATEGORY_MAP[boxType];
      const item = getRandomItemByCategory(category);
      if (item && item.url) {
        setCurrentLink(item.url);
      } else {
        setCurrentLink('');
      }
    }, 3600000); // 1시간

    return () => clearInterval(interval);
  }, [isKorean]);

  // 한국 사용자가 아니면 표시하지 않음
  if (!isKorean) {
    return null;
  }

  const handleClick = () => {
    if (currentLink) {
      window.open(currentLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getBoxText = (type: BoxType): string => {
    return t(`coupang.box.${type}`);
  };

  const getBoxClassName = (type: BoxType): string => {
    return `coupang-box coupang-box-${type}`;
  };

  return (
    <div className="coupang-boxes-wrap">
      <div
        className={getBoxClassName(currentBoxType)}
        onClick={handleClick}
      >
        {getBoxText(currentBoxType)}
      </div>
    </div>
  );
};

