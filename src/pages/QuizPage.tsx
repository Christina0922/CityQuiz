import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Difficulty } from '../types/difficulty';
import { Question } from '../types/question';
import { questions } from '../data/questions';
import { getDailyLimit, incrementDailyAnswered, getIsPremium, updateStats } from '../utils/storage';
import { QuestionCard } from '../components/QuestionCard';
import { DifficultySelector } from '../components/DifficultySelector';
import { AdBanner } from '../components/AdBanner';
import './QuizPage.css';

interface QuizPageProps {
  initialDifficulty?: Difficulty;
  onGoToStore?: () => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({
  initialDifficulty = 'easy',
}) => {
  const { t, language } = useI18n();
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(initialDifficulty);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationText, setExplanationText] = useState('');

  const isPremium = getIsPremium();
  const dailyLimit = getDailyLimit();
  const isDailyLimitReached = !isPremium && dailyLimit.answeredToday >= 20;

  // 현재 난이도에 맞는 문제 필터링
  const filteredQuestions = questions.filter((q) => q.difficulty === currentDifficulty);

  // 새 문제 로드
  const loadNewQuestion = () => {
    if (filteredQuestions.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const question = filteredQuestions[randomIndex];
    setCurrentQuestion(question);
    setSelectedIndex(null);
    setShowResult(false);
    setShowExplanation(false);
    setExplanationText('');
  };

  useEffect(() => {
    loadNewQuestion();
  }, [currentDifficulty]);

  const handleAnswer = (index: number) => {
    if (showResult || isDailyLimitReached) return;

    setSelectedIndex(index);
    setShowResult(true);

    const isCorrect = index === currentQuestion!.correctIndex;
    updateStats(isCorrect, currentDifficulty);

    if (!isPremium) {
      incrementDailyAnswered();
    }
  };

  const handleShowExplanation = () => {
    if (!currentQuestion) return;

    // 개발자 모드 또는 Premium 또는 easy 난이도면 해설 표시
    const canShow = isPremium || currentQuestion.difficulty === 'easy';

    if (canShow) {
      setExplanationText(currentQuestion.explanation[language]);
      setShowExplanation(true);
    } else {
      // 해설을 볼 수 없는 경우 안내만 표시
      alert(t('msg.premiumRequiredExplanation'));
    }
  };

  const handleNextQuestion = () => {
    if (isDailyLimitReached) {
      return;
    }
    loadNewQuestion();
  };

  const canShowExplanation = isPremium || currentQuestion?.difficulty === 'easy';

  if (isDailyLimitReached) {
    return (
      <div className="quiz-page">
        <div className="limit-reached">
          <h2>{t('msg.dailyLimitReached')}</h2>
          <p>{t('msg.dailyLimitDescription')}</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-page">
        <div className="loading">문제를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-content">
        <div className="quiz-header">
          <DifficultySelector
            currentDifficulty={currentDifficulty}
            onChangeDifficulty={setCurrentDifficulty}
            isPremium={isPremium}
          />
          <div className="quiz-info">
            {isPremium ? (
              <div className="premium-badge">{t('label.unlimited')}</div>
            ) : (
              <div className="remaining-info">
                {t('label.remainingToday')}: {Math.max(0, 20 - dailyLimit.answeredToday)}/20
              </div>
            )}
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedIndex={selectedIndex}
          showResult={showResult}
          onAnswer={handleAnswer}
          onShowExplanation={handleShowExplanation}
          canShowExplanation={canShowExplanation}
          isPremium={isPremium}
        />

        {showExplanation && explanationText && (
          <div className="explanation-box">
            <h3>{t('button.showExplanation')}</h3>
            <p>{explanationText}</p>
          </div>
        )}

        {showResult && (
          <button className="next-button" onClick={handleNextQuestion}>
            {t('button.nextQuestion')}
          </button>
        )}

        {/* 퀴즈 페이지 하단 광고 (프로모션 메시지 포함) */}
        <div className="quiz-ad-section">
          <AdBanner />
        </div>
      </div>
    </div>
  );
};

