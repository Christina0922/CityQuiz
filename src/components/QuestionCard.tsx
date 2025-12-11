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

  return (
    <div className="question-card">
      {/* 난이도 배지 */}
      <div className="question-header">
        <span className={`difficulty-badge difficulty-${question.difficulty}`}>
          {question.difficulty === 'easy' && t('difficulty.easy')}
          {question.difficulty === 'medium' && t('difficulty.medium')}
          {question.difficulty === 'hard' && t('difficulty.hard')}
        </span>
      </div>

      {/* 문제 문구 */}
      <h2 className="question-text">
        {question.questionText[language]}
      </h2>

      {/* 보기 목록 */}
      <div className="options-container">
        {question.options.map((option, index) => {
          const isCorrect = index === correctIndex;
          const isSelected = index === selectedIndex;

          const showIcon =
            showResult && (isCorrect || (isSelected && !isCorrect));

          const optionClass = showResult
            ? isCorrect
              ? 'correct'
              : isSelected
              ? 'incorrect'
              : ''
            : isSelected
            ? 'selected'
            : '';

          return (
            <button
              key={index}
              className={`answer-option ${optionClass}`}
              disabled={showResult}
              onClick={() => !showResult && onAnswer(index)}
            >
              <span className="answer-label">{option}</span>

              {showIcon && (
                <span
                  className={`answer-icon ${
                    isCorrect ? 'correct-indicator' : 'incorrect-indicator'
                  }`}
                >
                  {isCorrect ? '⭕' : '❌'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 상세 해설 버튼 (정답 공개 후, 해설이 있을 때만) */}
      {showResult && (
        <div className="explanation-button-wrapper">
          <button
            type="button"
            className="explanation-button"
            onClick={onShowExplanation}
            disabled={!canShowExplanation}
          >
            {canShowExplanation
              ? '상세 설명 보기'
              : isPremium
              ? t('quiz.noExplanation') || '해설이 준비되지 않았습니다.'
              : t('quiz.premiumOnly') || '프리미엄 전용 해설입니다.'}
          </button>
        </div>
      )}
    </div>
  );
};
