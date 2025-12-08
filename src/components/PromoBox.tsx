import { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import './PromoBox.css';

const messages = {
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
  const messageList = messages[language];
  return messageList[Math.floor(Math.random() * messageList.length)];
}

export const PromoBox: React.FC = () => {
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

  return (
    <div className="promo-box">
      <p className="promo-message">{currentMessage}</p>
    </div>
  );
};

