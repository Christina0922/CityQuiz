export type Difficulty = "easy" | "medium" | "hard";

export type Stats = {
  totalAnswered: number;     // 전체 푼 문제(정답/오답 포함)
  totalCorrect: number;      // 정답 개수
  todayAnswered: number;     // 오늘 푼 문제(정답/오답 포함)
  lastPlayedDate: string;    // "YYYY-MM-DD"
  byDifficulty: Record<Difficulty, { answered: number; correct: number }>;
};

const STORAGE_KEY = "cityquiz_stats_v1";

const defaultStats: Stats = {
  totalAnswered: 0,
  totalCorrect: 0,
  todayAnswered: 0,
  lastPlayedDate: "",
  byDifficulty: {
    easy: { answered: 0, correct: 0 },
    medium: { answered: 0, correct: 0 },
    hard: { answered: 0, correct: 0 },
  },
};

function getTodayDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStats;
    }
    const parsed = JSON.parse(raw) as Stats;
    
    // 구조 검증
    if (
      typeof parsed.totalAnswered !== "number" ||
      typeof parsed.totalCorrect !== "number" ||
      typeof parsed.todayAnswered !== "number" ||
      typeof parsed.lastPlayedDate !== "string" ||
      !parsed.byDifficulty ||
      !parsed.byDifficulty.easy ||
      !parsed.byDifficulty.medium ||
      !parsed.byDifficulty.hard
    ) {
      return defaultStats;
    }
    
    return parsed;
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn("Failed to save stats:", error);
  }
}

export function applyTodayReset(stats: Stats): Stats {
  const today = getTodayDate();
  
  // 날짜가 바뀌었으면 오늘 푼 문제 리셋
  if (stats.lastPlayedDate !== today) {
    return {
      ...stats,
      todayAnswered: 0,
      lastPlayedDate: today,
    };
  }
  
  return stats;
}

export function recordAnswer(stats: Stats, difficulty: Difficulty, isCorrect: boolean): Stats {
  const today = getTodayDate();
  
  // 날짜가 바뀌었으면 오늘 푼 문제 리셋
  const updatedStats = applyTodayReset(stats);
  
  // 통계 업데이트
  const newStats: Stats = {
    ...updatedStats,
    totalAnswered: updatedStats.totalAnswered + 1,
    todayAnswered: updatedStats.todayAnswered + 1,
    lastPlayedDate: today,
    byDifficulty: {
      ...updatedStats.byDifficulty,
      [difficulty]: {
        answered: updatedStats.byDifficulty[difficulty].answered + 1,
        correct: updatedStats.byDifficulty[difficulty].correct + (isCorrect ? 1 : 0),
      },
    },
  };
  
  if (isCorrect) {
    newStats.totalCorrect = updatedStats.totalCorrect + 1;
  }
  
  return newStats;
}
