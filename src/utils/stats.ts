export type Difficulty = "상" | "중" | "하";

export type Stats = {
  totalSolved: number;
  totalCorrect: number;
  todaySolved: number;
  todayDate: string; // YYYY-MM-DD
  byDifficulty: Record<Difficulty, { solved: number; correct: number }>;
};

const KEY = "cityquiz_stats_v1";

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function defaultStats(): Stats {
  return {
    totalSolved: 0,
    totalCorrect: 0,
    todaySolved: 0,
    todayDate: todayStr(),
    byDifficulty: {
      하: { solved: 0, correct: 0 },
      중: { solved: 0, correct: 0 },
      상: { solved: 0, correct: 0 },
    },
  };
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultStats();
    const parsed = JSON.parse(raw) as Stats;

    // ✅ 1차 방어: 구조가 깨졌으면 초기화
    if (!parsed?.byDifficulty?.하 || !parsed?.byDifficulty?.중 || !parsed?.byDifficulty?.상) {
      return defaultStats();
    }

    // ✅ 2차 방어: 날짜 바뀌면 todaySolved만 리셋
    const t = todayStr();
    if (parsed.todayDate !== t) {
      parsed.todayDate = t;
      parsed.todaySolved = 0;
    }

    return parsed;
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats: Stats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function recordSolved(params: { difficulty: Difficulty; isCorrect: boolean }) {
  const stats = loadStats();

  stats.totalSolved += 1;
  stats.todaySolved += 1;
  stats.byDifficulty[params.difficulty].solved += 1;

  if (params.isCorrect) {
    stats.totalCorrect += 1;
    stats.byDifficulty[params.difficulty].correct += 1;
  }

  saveStats(stats);
}

export function accuracy(totalCorrect: number, totalSolved: number) {
  if (totalSolved <= 0) return 0;
  return Math.round((totalCorrect / totalSolved) * 1000) / 10; // 소수 1자리
}
