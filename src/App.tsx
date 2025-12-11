import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import Header from './components/Header';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Difficulty } from './types/difficulty';
import { getIsDeveloper, setIsDeveloper } from './utils/storage';
import './styles/App.css';

type Page = 'home' | 'quiz' | 'stats' | 'settings';

function AppContent() {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [quizDifficulty, setQuizDifficulty] = useState<Difficulty>('easy');

  // 개발자 모드 자동 활성화 (처음 실행 시)
  useEffect(() => {
    // 개발자 모드가 설정되지 않았으면 기본적으로 활성화
    const isDeveloper = getIsDeveloper();
    if (!isDeveloper) {
      setIsDeveloper(true);
      console.log('개발자 모드가 자동으로 활성화되었습니다. 모든 난이도와 해설에 접근할 수 있습니다.');
    }
  }, []);

  const handleStartQuiz = () => {
    setQuizDifficulty('easy');
    setCurrentPage('quiz');
  };

  const handleSelectDifficulty = () => {
    setCurrentPage('quiz');
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onStartQuiz={handleStartQuiz}
            onSelectDifficulty={handleSelectDifficulty}
          />
        );
      case 'quiz':
        return (
          <QuizPage
            initialDifficulty={quizDifficulty}
            onGoToStore={() => {}}
          />
        );
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <HomePage
            onStartQuiz={handleStartQuiz}
            onSelectDifficulty={handleSelectDifficulty}
          />
        );
    }
  };

  return (
    <div className="app">
      <Header />
        <nav className="main-nav">
          <button
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            {t('nav.home')}
          </button>
          <button
            className={`nav-button ${currentPage === 'quiz' ? 'active' : ''}`}
            onClick={() => setCurrentPage('quiz')}
          >
            {t('nav.quiz')}
          </button>
          <button
            className={`nav-button ${currentPage === 'stats' ? 'active' : ''}`}
            onClick={() => setCurrentPage('stats')}
          >
            {t('nav.stats')}
          </button>
          <button
            className={`nav-button ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            {t('nav.settings')}
          </button>
        </nav>
        <main className="app-main">{renderPage()}</main>
      <Footer />
    </div>
  );
}

function App() {
  // 개발자 모드 자동 활성화 (처음 실행 시)
  useEffect(() => {
    // 개발자 모드가 설정되지 않았으면 기본적으로 활성화
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

