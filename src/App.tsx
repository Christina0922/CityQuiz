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
import './styles/App.css';

type Page = 'home' | 'quiz' | 'stats';

// 도시 이름 한글-영어 매핑
const cityNameMap: Record<string, string> = {
  '시카고': 'Chicago',
  '토론토': 'Toronto',
  '뉴욕': 'New York',
  '밴쿠버': 'Vancouver',
  '로스앤젤레스': 'Los Angeles',
  '멕시코시티': 'Mexico City',
  '서울': 'Seoul',
  '부산': 'Busan',
  '도쿄': 'Tokyo',
  '오사카': 'Osaka',
  '베이징': 'Beijing',
  '상하이': 'Shanghai',
  '방콕': 'Bangkok',
  '싱가포르': 'Singapore',
  '파리': 'Paris',
  '런던': 'London',
  '베를린': 'Berlin',
  '로마': 'Rome',
  '마드리드': 'Madrid',
  '암스테르담': 'Amsterdam',
  '모스크바': 'Moscow',
  '시드니': 'Sydney',
  '멜버른': 'Melbourne',
  '리우데자네이루': 'Rio de Janeiro',
  '상파울루': 'São Paulo',
  '부에노스아이레스': 'Buenos Aires',
  '카이로': 'Cairo',
  '요하네스버그': 'Johannesburg',
  '두바이': 'Dubai',
  '델리': 'Delhi',
  '뭄바이': 'Mumbai',
  '방갈로르': 'Bangalore',
  '마닐라': 'Manila',
  '자카르타': 'Jakarta',
  '호치민': 'Ho Chi Minh City',
  '하노이': 'Hanoi',
  '쿠알라룸푸르': 'Kuala Lumpur',
  '타이페이': 'Taipei',
  '홍콩': 'Hong Kong',
  '마카오': 'Macau',
  '오타와': 'Ottawa',
  '호놀룰루': 'Honolulu',
  '몬트리올': 'Montreal',
  '보스턴': 'Boston',
  '마이애미': 'Miami',
  '에드몬턴': 'Edmonton',
  '시애틀': 'Seattle',
  '워싱턴 D.C.': 'Washington D.C.',
  '브라질리아': 'Brasília',
  '덴버': 'Denver',
  '필라델피아': 'Philadelphia',
  '퀸즈타운': 'Queenstown',
  '애틀랜타': 'Atlanta',
  '피닉스': 'Phoenix',
  '칸쿤': 'Cancún',
  '샌디에이고': 'San Diego',
  '미니애폴리스': 'Minneapolis',
  '로테르담': 'Rotterdam',
  '샌안토니오': 'San Antonio',
  '포트랜드': 'Portland',
  '케이프타운': 'Cape Town',
  '투손': 'Tucson',
  '쿠리티바': 'Curitiba',
  '리노': 'Reno',
  '바르나': 'Varna',
  '샬럿': 'Charlotte',
  '코펜하겐': 'Copenhagen',
};

// 질문 데이터 변환
function convertQuestions(oldQs: OldQuestion[]): Question[] {
  return oldQs.map((q: OldQuestion) => {
    // 영어 옵션 생성
    const choicesEn = q.options.map(opt => cityNameMap[opt] || opt);
    
    return {
      id: String(q.id),
      topic: 'general' as const,
      promptKo: q.questionText.ko,
      promptEn: q.questionText.en,
      choicesKo: q.options,
      choicesEn: choicesEn,
      correctIndex: q.correctIndex,
      explanationKo: q.explanation.ko,
      explanationEn: q.explanation.en,
    };
  });
}

function AppContent() {
  const { language } = useI18n();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [quizDifficulty, setQuizDifficulty] = useState<Difficulty>('low');

  useEffect(() => {
    const isDeveloper = getIsDeveloper();
    if (!isDeveloper) {
      setIsDeveloper(true);
      console.log('개발자 모드가 자동으로 활성화되었습니다. 모든 난이도와 해설에 접근할 수 있습니다.');
    }
  }, []);

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
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="app-main">{renderPage()}</main>
      <Footer />
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
