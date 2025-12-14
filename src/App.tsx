import { useState, useEffect, useMemo } from 'react';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import Header from './components/Header';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import { StatsPage } from './pages/StatsPage';
import { Difficulty, Question } from './types';
import { getIsDeveloper, setIsDeveloper } from './utils/storage';
import { questions as oldQuestions } from './data/questions';
import { Question as OldQuestion } from './types/question';
import { getCityName } from './utils/cityNameMap';
import './styles/App.css';

type Page = 'home' | 'quiz' | 'stats';

// 질문 데이터 변환
function convertQuestions(oldQs: OldQuestion[]): Question[] {
  // 모든 도시 수집 (중복 제거)
  const allCities = new Set<string>();
  oldQs.forEach(q => {
    q.options.forEach(opt => allCities.add(opt));
  });
  const cityList = Array.from(allCities);

  const converted: Question[] = [];
  
  for (const q of oldQs) {
    const correctCity = q.options[q.correctIndex];
    const wrongCity = q.options[1 - q.correctIndex];
    
    // 오답 도시 후보 (정답과 기존 오답 제외)
    const wrongCandidates = cityList.filter(
      city => city !== correctCity && city !== wrongCity
    );
    
    // 오답이 부족하면 건너뛰기
    if (wrongCandidates.length < 1) {
      continue;
    }
    
    // 오답 2개 선택 (기존 오답 + 랜덤 오답 1개)
    const secondWrongCity = wrongCandidates[Math.floor(Math.random() * wrongCandidates.length)];
    const wrongCities = [wrongCity, secondWrongCity];
    
    // 옵션 생성: 정답 1개 + 오답 2개 (한글/영어 모두 저장)
    const options: Array<{ id: string; labelKo: string; labelEn: string }> = [
      { id: `${q.id}-option-0`, labelKo: correctCity, labelEn: getCityName(correctCity, 'en') },
      { id: `${q.id}-option-1`, labelKo: wrongCities[0], labelEn: getCityName(wrongCities[0], 'en') },
      { id: `${q.id}-option-2`, labelKo: wrongCities[1], labelEn: getCityName(wrongCities[1], 'en') },
    ];
    
    // 정답 옵션 ID
    const correctOptionId = `${q.id}-option-0`;
    
    // 안전장치 검사
    if (options.length !== 3) {
      continue;
    }
    
    const optionIds = options.map(opt => opt.id);
    if (new Set(optionIds).size !== 3) {
      continue; // ID 중복
    }
    
    if (options.filter(opt => opt.id === correctOptionId).length !== 1) {
      continue; // correctOptionId가 options에 정확히 1개 존재하지 않음
    }
    
    converted.push({
      id: String(q.id),
      topic: 'general' as const,
      promptKo: q.questionText.ko,
      promptEn: q.questionText.en,
      options: options.map(opt => ({ id: opt.id, label: opt.labelKo })), // 기본은 한글
      optionsEn: options.map(opt => ({ id: opt.id, label: opt.labelEn })), // 영어 버전
      correctOptionId,
      explanationKo: q.explanation.ko,
      explanationEn: q.explanation.en,
    });
  }
  
  return converted;
}

function AppContent() {
  const { language } = useI18n();
  const [currentPage, setCurrentPage] = useState<Page | 'splash'>('splash');
  const [quizDifficulty, setQuizDifficulty] = useState<Difficulty>('low');

  useEffect(() => {
    const isDeveloper = getIsDeveloper();
    if (!isDeveloper) {
      setIsDeveloper(true);
      console.log('개발자 모드가 자동으로 활성화되었습니다. 모든 난이도와 해설에 접근할 수 있습니다.');
    }
  }, []);

  // 로고 화면 자동 전환
  useEffect(() => {
    if (currentPage === 'splash') {
      const timer = setTimeout(() => {
        setCurrentPage('home');
      }, 1000); // 1초 후 자동 전환
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // 질문 데이터 변환
  const allQuestions = useMemo(() => convertQuestions(oldQuestions), []);

  // 난이도별 질문 분류
  const questionsByDifficulty = useMemo(() => {
    const result: Record<Difficulty, Question[]> = {
      low: [],
      mid: [],
      high: [],
    };

    allQuestions.forEach((q) => {
      const oldQ = oldQuestions.find((oq) => String(oq.id) === q.id);
      if (oldQ) {
        if (oldQ.difficulty === 'easy') result.low.push(q);
        else if (oldQ.difficulty === 'medium') result.mid.push(q);
        else if (oldQ.difficulty === 'hard') result.high.push(q);
      }
    });

    return result;
  }, [allQuestions]);

  const handleStartQuiz = () => {
    setQuizDifficulty('low');
    setCurrentPage('quiz');
  };

  const handleSelectDifficulty = () => {
    setCurrentPage('quiz');
  };

  const handleChangeDifficulty = (d: Difficulty) => {
    setQuizDifficulty(d);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#667eea'
          }}>
            CITY QUIZ
          </div>
        );
      case 'home':
        return (
          <HomePage
            lang={language}
            difficulty={quizDifficulty}
            onStartQuiz={handleStartQuiz}
            onGoPickDifficulty={handleSelectDifficulty}
          />
        );
      case 'quiz':
        return (
          <QuizPage
            lang={language}
            difficulty={quizDifficulty}
            onChangeDifficulty={handleChangeDifficulty}
            questionsByDifficulty={questionsByDifficulty}
          />
        );
      case 'stats':
        return <StatsPage />;
      default:
        return (
          <HomePage
            lang={language}
            difficulty={quizDifficulty}
            onStartQuiz={handleStartQuiz}
            onGoPickDifficulty={handleSelectDifficulty}
          />
        );
    }
  };

  return (
    <div className="app">
      {currentPage !== 'splash' && (
        <>
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <Footer />
        </>
      )}
      <main className="app-main">{renderPage()}</main>
    </div>
  );
}

function App() {
  useEffect(() => {
    const isDeveloper = getIsDeveloper();
    if (!isDeveloper) {
      setIsDeveloper(true);
      console.log('개발자 모드가 자동으로 활성화되었습니다. 모든 난이도와 해설에 접근할 수 있습니다.');
    }
  }, []);

  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
