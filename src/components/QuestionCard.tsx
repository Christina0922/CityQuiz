import React from 'react';
import { Question } from '../types/question';
import { useI18n } from '../contexts/I18nContext';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  selectedIndex: number | null;
  showResult: boolean;
  onAnswer: (selectedIndex: number) => void;
  onShowExplanation: () => void;
  canShowExplanation: boolean;
  isPremium: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedIndex,
  showResult,
  onAnswer,
  onShowExplanation,
  canShowExplanation,
  isPremium,
}) => {
  const { language, t } = useI18n();
  const correctIndex = question.correctIndex;

  const getOptionClassName = (index: number): string => {
    if (!showResult) {
      return `option-button ${selectedIndex === index ? 'selected' : ''}`;
    }

    if (index === correctIndex) {
      return 'option-button correct';
    }

    if (index === selectedIndex && index !== correctIndex) {
      return 'option-button incorrect';
    }

    return 'option-button';
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <span className={`difficulty-badge difficulty-${question.difficulty}`}>
          {question.difficulty === 'easy' && t('difficulty.easy')}
          {question.difficulty === 'medium' && t('difficulty.medium')}
          {question.difficulty === 'hard' && t('difficulty.hard')}
        </span>
      </div>

      <h2 className="question-text">
        {question.questionText[language]}
      </h2>

      <div className="options-container">
        {question.options.map((option, index) => {
          const isCorrectOption = index === correctIndex;
          const isSelectedWrong = showResult && index === selectedIndex && index !== correctIndex;
          const showIndicator = showResult && (isCorrectOption || isSelectedWrong);
          
          return (
            <button
              key={index}
              className={`${getOptionClassName(index)} ${showResult ? (index === selectedIndex ? 'selected-option' : 'unselected-option') : ''}`}
              onClick={() => !showResult && onAnswer(index)}
              disabled={showResult}
            >
              {showIndicator && (
                <span className={`option-indicator ${isCorrectOption ? 'correct-indicator' : 'incorrect-indicator'}`}>
                  {isCorrectOption ? '○' : '✗'}
                </span>
              )}
              <span className="option-text">{option}</span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="result-section">
          <button
            className={`explanation-button explain-btn ${canShowExplanation || isPremium ? '' : 'disabled'}`}
            onClick={onShowExplanation}
            disabled={!canShowExplanation && !isPremium}
          >
            {t('button.showExplanation')}
          </button>
        </div>
      )}
    </div>
  );
};

