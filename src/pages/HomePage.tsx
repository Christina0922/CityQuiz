import React from 'react';
import './HomePage.css';
import { useI18n } from '../contexts/I18nContext';
import { CoupangBanner } from '../components/CoupangBanner';

interface HomePageProps {
  onStartQuiz: () => void;
  onSelectDifficulty: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartQuiz,
  onSelectDifficulty,
}) => {
  const { language } = useI18n();

  // 언어에 따라 제목/부제목만 간단히 분기
  const title = language === 'en' ? 'City Quiz' : '도시 퀴즈';
  const subtitle =
    language === 'en'
      ? 'Guess cities around the world and train your knowledge.'
      : '전 세계에 있는 도시를 맞춰보는 두뇌 상식 게임';

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">{title}</h1>
          <p className="home-subtitle">{subtitle}</p>
        </div>

        {/* 🔥 여기서부터는 "오늘 남은 무료 문제 20/20" 같은 잔여 표시 전부 제거 */}
        <div className="home-actions">
          <button
            className="home-button primary home-start-button"
            onClick={onStartQuiz}
          >
            퀴즈 시작하기
          </button>
          <button
            className="home-button secondary home-difficulty-button"
            onClick={onSelectDifficulty}
          >
            난이도 선택 후 시작
          </button>
        </div>

        {/* 쿠팡 배너 – 한 줄짜리 문구만 */}
        <CoupangBanner />
      </div>
    </div>
  );
};

export default HomePage;
