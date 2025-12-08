import { Language } from '../types/i18n';

type TranslationKey =
  | 'app.title'
  | 'app.subtitle'
  | 'button.startQuiz'
  | 'button.selectDifficulty'
  | 'button.store'
  | 'button.showExplanation'
  | 'button.nextQuestion'
  | 'button.premiumActivate'
  | 'button.premiumDeactivate'
  | 'button.resetData'
  | 'label.remainingToday'
  | 'label.unlimited'
  | 'msg.correct'
  | 'msg.wrong'
  | 'msg.correctAnswerIs'
  | 'msg.dailyLimitReached'
  | 'msg.dailyLimitDescription'
  | 'msg.premiumRequired'
  | 'msg.premiumRequiredExplanation'
  | 'store.premiumTitle'
  | 'store.premiumDescription'
  | 'store.activatePremium'
  | 'store.deactivatePremium'
  | 'store.premiumFeatures'
  | 'difficulty.easy'
  | 'difficulty.medium'
  | 'difficulty.hard'
  | 'difficulty.locked'
  | 'stats.totalAnswered'
  | 'stats.totalCorrect'
  | 'stats.accuracy'
  | 'stats.byDifficulty'
  | 'stats.todayAnswered'
  | 'ad.coupang.title'
  | 'ad.coupang.description'
  | 'ad.global.title'
  | 'ad.global.description'
  | 'nav.home'
  | 'nav.quiz'
  | 'nav.stats'
  | 'nav.settings'
  | 'coupang.label';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  ko: {
    'app.title': '도시 맞추기 퀴즈',
    'app.subtitle': '전 세계에 있는 도시를 맞춰보는 두뇌 상식 게임',
    'button.startQuiz': '퀴즈 시작하기',
    'button.selectDifficulty': '난이도 선택 후 시작',
    'button.store': '스토어 / 프리미엄',
    'button.showExplanation': '상세 해설 보기',
    'button.nextQuestion': '다음 문제',
    'button.premiumActivate': '프리미엄 활성화',
    'button.premiumDeactivate': '프리미엄 비활성화',
    'button.resetData': '데이터 초기화',
    'label.remainingToday': '오늘 남은 무료 문제',
    'label.unlimited': '무제한 이용 중',
    'msg.correct': '정답입니다!',
    'msg.wrong': '아쉽습니다.',
    'msg.correctAnswerIs': '정답은 다음과 같습니다:',
    'msg.dailyLimitReached': '오늘 무료 문제를 모두 사용했습니다.',
    'msg.dailyLimitDescription':
      '프리미엄을 사용하면 하루 제한 없이 문제를 풀 수 있습니다.',
    'msg.premiumRequired': '프리미엄 필요',
    'msg.premiumRequiredExplanation': '프리미엄에서 해설을 볼 수 있습니다',
    'store.premiumTitle': '프리미엄 패키지',
    'store.premiumDescription':
      '난이도 상 전체 해금, 상세 해설 전체 열람, 하루 무제한, 광고 제거 기능이 포함됩니다.',
    'store.activatePremium': '프리미엄 활성화',
    'store.deactivatePremium': '프리미엄 비활성화(테스트용)',
    'store.premiumFeatures': '프리미엄 기능',
    'difficulty.easy': '난이도 하',
    'difficulty.medium': '난이도 중',
    'difficulty.hard': '난이도 상',
    'difficulty.locked': '잠금됨',
    'stats.totalAnswered': '전체 푼 문제',
    'stats.totalCorrect': '정답 개수',
    'stats.accuracy': '정답률',
    'stats.byDifficulty': '난이도별 통계',
    'stats.todayAnswered': '오늘 푼 문제',
    'ad.coupang.title': '쿠팡 추천 상품',
    'ad.coupang.description': '쿠팡에서 다양한 상품을 구매하세요',
    'ad.global.title': 'Recommended for You',
    'ad.global.description': 'Discover great products and services',
    'nav.home': '홈',
    'nav.quiz': '퀴즈',
    'nav.stats': '통계',
    'nav.settings': '설정',
    'coupang.label': '쿠팡 파트너스',
  },
  en: {
    'app.title': 'City Quiz',
    'app.subtitle': 'Two-choice trivia about cities around the world.',
    'button.startQuiz': 'Start quiz',
    'button.selectDifficulty': 'Start with difficulty selection',
    'button.store': 'Store / Premium',
    'button.showExplanation': 'Show explanation',
    'button.nextQuestion': 'Next question',
    'button.premiumActivate': 'Activate Premium',
    'button.premiumDeactivate': 'Deactivate Premium',
    'button.resetData': 'Reset Data',
    'label.remainingToday': 'Free questions left today',
    'label.unlimited': 'Unlimited',
    'msg.correct': 'Correct!',
    'msg.wrong': 'Incorrect.',
    'msg.correctAnswerIs': 'The correct answer is:',
    'msg.dailyLimitReached': 'You have used all free questions for today.',
    'msg.dailyLimitDescription':
      'With Premium, you can play without a daily limit.',
    'msg.premiumRequired': 'Premium Required',
    'msg.premiumRequiredExplanation': 'View explanations with Premium',
    'store.premiumTitle': 'Premium Package',
    'store.premiumDescription':
      'Unlocks hard difficulty, full explanations, no daily limit, and removes ads.',
    'store.activatePremium': 'Activate Premium',
    'store.deactivatePremium': 'Deactivate Premium (for testing)',
    'store.premiumFeatures': 'Premium Features',
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    'difficulty.locked': 'Locked',
    'stats.totalAnswered': 'Total Answered',
    'stats.totalCorrect': 'Total Correct',
    'stats.accuracy': 'Accuracy',
    'stats.byDifficulty': 'Stats by Difficulty',
    'stats.todayAnswered': 'Today Answered',
    'ad.coupang.title': 'Coupang Recommended',
    'ad.coupang.description': 'Shop great products on Coupang',
    'ad.global.title': 'Recommended for You',
    'ad.global.description': 'Discover great products and services',
    'nav.home': 'Home',
    'nav.quiz': 'Quiz',
    'nav.stats': 'Stats',
    'nav.settings': 'Settings',
    'coupang.label': 'Coupang Partners',
  },
};

