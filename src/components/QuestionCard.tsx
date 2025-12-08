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
  const isCorrect = selectedIndex !== null && selectedIndex === correctIndex;

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
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClassName(index)}
            onClick={() => !showResult && onAnswer(index)}
            disabled={showResult}
          >
            {option}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="result-section">
          <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
              <span className="result-icon">✓</span>
            ) : (
              <span className="result-icon">✗</span>
            )}
            <span>
              {isCorrect
                ? t('msg.correct')
                : `${t('msg.wrong')} ${t('msg.correctAnswerIs')} ${question.options[correctIndex]}`}
            </span>
          </div>

          <button
            className={`explanation-button ${canShowExplanation || isPremium ? '' : 'disabled'}`}
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

