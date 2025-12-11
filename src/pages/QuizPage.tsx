import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Difficulty } from '../types/difficulty';
import { Question } from '../types/question';
import { questions } from '../data/questions';
import { getDailyLimit, incrementDailyAnswered, getIsPremium, updateStats } from '../utils/storage';
import { QuestionCard } from '../components/QuestionCard';
import { DifficultySelector } from '../components/DifficultySelector';
import { CoupangBoxes } from '../components/CoupangBoxes';
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
  const [recentQuestionIds, setRecentQuestionIds] = useState<number[]>([]);

  const isPremium = getIsPremium();
  const dailyLimit = getDailyLimit();
  const isDailyLimitReached = !isPremium && dailyLimit.answeredToday >= 20;

  // 현재 난이도에 맞는 문제 필터링
  const filteredQuestions = questions.filter((q) => q.difficulty === currentDifficulty);

  // 새 문제 로드 (중복 방지)
  const loadNewQuestion = () => {
    if (filteredQuestions.length === 0) return;

    // 최근에 나온 문제 제외
    const availableQuestions = filteredQuestions.filter(
      (q) => !recentQuestionIds.includes(q.id)
    );

    // 사용 가능한 문제가 없으면 최근 목록 초기화
    const questionsToUse = availableQuestions.length > 0 
      ? availableQuestions 
      : filteredQuestions;

    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * questionsToUse.length);
    const question = questionsToUse[randomIndex];
    
    // 최근 문제 목록 업데이트 (최대 5개 유지)
    setRecentQuestionIds((prev) => {
      const newList = [question.id, ...prev].slice(0, 5);
      return newList;
    });

    setCurrentQuestion(question);
    setSelectedIndex(null);
    setShowResult(false);
    setShowExplanation(false);
    setExplanationText('');
  };

  useEffect(() => {
    // 난이도 변경 시 최근 문제 목록 초기화
    setRecentQuestionIds([]);
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

    // 틀렸을 때 자동으로 상세설명 표시
    if (!isCorrect) {
      const canShow = isPremium || currentQuestion!.difficulty === 'easy';
      if (canShow && currentQuestion) {
        setExplanationText(currentQuestion.explanation[language]);
        setShowExplanation(true);
      }
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
      <div className="quiz-content quiz-screen">
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
            <h3>상세 설명 보기</h3>
            <p>{explanationText}</p>
          </div>
        )}

        {showResult && (
          <button className="next-button" onClick={handleNextQuestion}>
            {t('button.nextQuestion')}
          </button>
        )}

        {/* 쿠팡 추천 박스 (한국 사용자만 표시) */}
        <CoupangBoxes />
      </div>
    </div>
  );
};

