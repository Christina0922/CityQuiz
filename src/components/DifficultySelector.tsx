import React from 'react';
import { Difficulty } from '../types/difficulty';
import { useI18n } from '../contexts/I18nContext';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  isPremium: boolean;
  onPremiumRequired?: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onChangeDifficulty,
  isPremium,
  onPremiumRequired,
}) => {
  const { t, language } = useI18n();

  const handleDifficultyClick = (difficulty: Difficulty) => {
    // 개발자 모드면 모든 난이도 접근 가능
    if (difficulty === 'hard' && !isPremium) {
      if (onPremiumRequired) {
        onPremiumRequired();
      } else {
        alert(
          language === 'ko'
            ? '프리미엄에서 이용 가능합니다.'
            : 'Available with Premium.'
        );
      }
      return;
    }

    onChangeDifficulty(difficulty);
  };

  return (
    <div className="difficulty-selector">
      <div className="difficulty-buttons">
        <button
          className={`difficulty-button ${currentDifficulty === 'easy' ? 'active' : ''}`}
          onClick={() => handleDifficultyClick('easy')}
        >
          {t('difficulty.easy')}
        </button>
        <button
          className={`difficulty-button ${currentDifficulty === 'medium' ? 'active' : ''}`}
          onClick={() => handleDifficultyClick('medium')}
        >
          {t('difficulty.medium')}
        </button>
        <button
          className={`difficulty-button ${currentDifficulty === 'hard' ? 'active' : ''} ${!isPremium ? 'locked' : ''}`}
          onClick={() => handleDifficultyClick('hard')}
        >
          {t('difficulty.hard')}
          {!isPremium && <span className="lock-icon">🔒</span>}
        </button>
      </div>
    </div>
  );
};

