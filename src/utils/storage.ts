import { Difficulty } from '../types/difficulty';

const STORAGE_KEYS = {
  IS_PREMIUM: 'cityQuiz_isPremium',
  STATS: 'cityQuiz_stats',
  DAILY: 'cityQuiz_daily',
  LANGUAGE: 'cityQuiz_language',
  COUNTRY_CODE: 'cityQuiz_countryCode',
  IS_DEVELOPER: 'cityQuiz_isDeveloper',
  LAST_MESSAGE: 'cityQuiz_lastMessage',
  LAST_MESSAGE_TIME: 'cityQuiz_lastMessageTime',
  XP: 'cityQuiz_xp',
  LEVEL: 'cityQuiz_level',
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

// Promo Message 관련
export function getLastMessage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_MESSAGE);
  } catch {
    return null;
  }
}

export function saveLastMessage(message: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_MESSAGE, message);
  } catch (error) {
    console.warn('Failed to save last message:', error);
  }
}

export function getLastMessageTime(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_MESSAGE_TIME);
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveLastMessageTime(timestamp: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_MESSAGE_TIME, String(timestamp));
  } catch (error) {
    console.warn('Failed to save last message time:', error);
  }
}

// XP/Level 관련
export interface XPData {
  xp: number;
  level: number;
}

// 레벨업 필요 XP 계산: 레벨 1->2: 100 XP, 레벨 2->3: 150 XP, 레벨 3->4: 200 XP... (100 + (level-1)*50)
export function getXPRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return 100 + (level - 1) * 50;
}

// 현재 레벨에서 다음 레벨까지 필요한 XP 계산
export function getXPRequiredForNextLevel(level: number): number {
  return getXPRequiredForLevel(level + 1) - getXPRequiredForLevel(level);
}

// 누적 XP로 레벨 계산
export function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  let requiredXP = getXPRequiredForLevel(2); // 레벨 2로 가기 위해 필요한 XP
  
  while (totalXP >= requiredXP) {
    level++;
    requiredXP = getXPRequiredForLevel(level + 1);
  }
  
  return level;
}

export function getXP(): XPData {
  try {
    const storedXP = localStorage.getItem(STORAGE_KEYS.XP);
    const storedLevel = localStorage.getItem(STORAGE_KEYS.LEVEL);
    
    let xp = 0;
    let level = 1;
    
    if (storedXP !== null) {
      xp = parseInt(storedXP, 10);
      if (isNaN(xp)) xp = 0;
    }
    
    // XP로 레벨 계산 (레벨이 저장되어 있어도 XP 기준으로 재계산)
    level = calculateLevelFromXP(xp);
    
    // 저장된 레벨과 계산된 레벨이 다르면 XP 기준이 맞으므로 저장 업데이트
    if (storedLevel !== null && parseInt(storedLevel, 10) !== level) {
      saveLevel(level);
    }
    
    return { xp, level };
  } catch (error) {
    console.warn('Failed to read XP:', error);
    return { xp: 0, level: 1 };
  }
}

export function saveXP(xp: number): void {
  try {
    const level = calculateLevelFromXP(xp);
    localStorage.setItem(STORAGE_KEYS.XP, String(xp));
    localStorage.setItem(STORAGE_KEYS.LEVEL, String(level));
  } catch (error) {
    console.warn('Failed to save XP:', error);
  }
}

export function saveLevel(level: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEVEL, String(level));
  } catch (error) {
    console.warn('Failed to save level:', error);
  }
}

// XP 추가 (정답 +10, 오답 +3)
export function addXP(isCorrect: boolean): { xp: number; level: number; leveledUp: boolean } {
  const currentData = getXP();
  const oldLevel = currentData.level;
  
  const xpToAdd = isCorrect ? 10 : 3;
  const newXP = currentData.xp + xpToAdd;
  const newLevel = calculateLevelFromXP(newXP);
  
  saveXP(newXP);
  
  const leveledUp = newLevel > oldLevel;
  
  return {
    xp: newXP,
    level: newLevel,
    leveledUp,
  };
}

// XP 초기화
export function resetXP(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.XP);
    localStorage.removeItem(STORAGE_KEYS.LEVEL);
  } catch (error) {
    console.warn('Failed to reset XP:', error);
  }
}

