import { useState, useEffect } from "react";
import { loadStats, saveStats, recordAnswer, applyTodayReset, type Stats, type Difficulty } from "../utils/stats";

export function useStats() {
  const [stats, setStats] = useState<Stats>(() => {
    const loaded = loadStats();
    return applyTodayReset(loaded);
  });

  // 초기 로드 시 오늘 날짜 리셋 적용
  useEffect(() => {
    const updated = applyTodayReset(loadStats());
    setStats(updated);
    saveStats(updated);
  }, []);

  const record = (difficulty: Difficulty, isCorrect: boolean) => {
    setStats((currentStats) => {
      const newStats = recordAnswer(currentStats, difficulty, isCorrect);
      saveStats(newStats);
      return newStats;
    });
  };

  return { stats, record };
}
