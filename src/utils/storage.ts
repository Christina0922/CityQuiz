import { Difficulty } from '../types/difficulty';

const STORAGE_KEYS = {
  IS_PREMIUM: 'cityQuiz_isPremium',
  STATS: 'cityQuiz_stats',
  DAILY: 'cityQuiz_daily',
  LANGUAGE: 'cityQuiz_language',
  COUNTRY_CODE: 'cityQuiz_countryCode',
  IS_DEVELOPER: 'cityQuiz_isDeveloper',
} as const;

export interface Stats {
  totalAnswered: number;
  totalCorrect: number;
  byDifficulty: {
    easy: { answered: number; correct: number };
    medium: { answered: number; correct: number };
    hard: { answered: number; correct: number };
  };
}

export interface DailyLimit {
  date: string; // YYYY-MM-DD
  answeredToday: number;
}

// Developer 모드 관련
export function getIsDeveloper(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_DEVELOPER) === 'true';
  } catch {
    return false;
  }
}

export function setIsDeveloper(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_DEVELOPER, String(value));
  } catch (error) {
    console.warn('Failed to save developer mode:', error);
  }
}

// Premium 관련 (개발자 모드면 항상 true)
export function getIsPremium(): boolean {
  // 개발자 모드면 항상 프리미엄으로 처리
  if (getIsDeveloper()) {
    return true;
  }
  
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_PREMIUM) === 'true';
  } catch {
    return false;
  }
}

export function setIsPremium(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_PREMIUM, String(value));
  } catch (error) {
    console.warn('Failed to save premium status:', error);
  }
}

// Stats 관련
export function getStats(): Stats {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to read stats:', error);
  }
  
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    byDifficulty: {
      easy: { answered: 0, correct: 0 },
      medium: { answered: 0, correct: 0 },
      hard: { answered: 0, correct: 0 },
    },
  };
}

export function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save stats:', error);
  }
}

export function updateStats(
  isCorrect: boolean,
  difficulty: Difficulty
): void {
  const stats = getStats();
  stats.totalAnswered += 1;
  if (isCorrect) {
    stats.totalCorrect += 1;
    stats.byDifficulty[difficulty].correct += 1;
  }
  stats.byDifficulty[difficulty].answered += 1;
  saveStats(stats);
}

// Daily Limit 관련
export function getDailyLimit(): DailyLimit {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      
      // 오늘 날짜와 다르면 초기화
      if (parsed.date !== today) {
        const newLimit: DailyLimit = {
          date: today,
          answeredToday: 0,
        };
        saveDailyLimit(newLimit);
        return newLimit;
      }
      
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to read daily limit:', error);
  }
  
  const today = new Date().toISOString().split('T')[0];
  return {
    date: today,
    answeredToday: 0,
  };
}

export function saveDailyLimit(limit: DailyLimit): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(limit));
  } catch (error) {
    console.warn('Failed to save daily limit:', error);
  }
}

export function incrementDailyAnswered(): void {
  const limit = getDailyLimit();
  limit.answeredToday += 1;
  saveDailyLimit(limit);
}

export function resetStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.DAILY);
  } catch (error) {
    console.warn('Failed to reset stats:', error);
  }
}

// Language 관련
export function getLanguage(): 'ko' | 'en' {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored === 'ko' || stored === 'en') {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read language:', error);
  }
  return 'ko'; // 기본값
}

export function saveLanguage(lang: 'ko' | 'en'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (error) {
    console.warn('Failed to save language:', error);
  }
}

