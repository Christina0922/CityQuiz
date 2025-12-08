import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { getStats, getDailyLimit, getIsPremium } from '../utils/storage';
import './StatsPage.css';

export const StatsPage: React.FC = () => {
  const { t } = useI18n();
  const stats = getStats();
  const dailyLimit = getDailyLimit();
  const isPremium = getIsPremium();

  const accuracy =
    stats.totalAnswered > 0
      ? ((stats.totalCorrect / stats.totalAnswered) * 100).toFixed(1)
      : '0.0';

  const getDifficultyAccuracy = (answered: number, correct: number) => {
    return answered > 0 ? ((correct / answered) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="stats-page">
      <div className="stats-content">
        <h1 className="stats-title">통계</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{t('stats.totalAnswered')}</div>
            <div className="stat-value">{stats.totalAnswered}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">{t('stats.totalCorrect')}</div>
            <div className="stat-value">{stats.totalCorrect}</div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-label">{t('stats.accuracy')}</div>
            <div className="stat-value">{accuracy}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">{t('stats.todayAnswered')}</div>
            <div className="stat-value">
              {dailyLimit.answeredToday}
              {!isPremium && ` / 20`}
            </div>
          </div>
        </div>

        <div className="difficulty-stats">
          <h2 className="section-title">{t('stats.byDifficulty')}</h2>

          <div className="difficulty-stat-item">
            <div className="difficulty-stat-header">
              <span className="difficulty-name">{t('difficulty.easy')}</span>
              <span className="difficulty-count">
                {stats.byDifficulty.easy.answered} 문제
              </span>
            </div>
            <div className="difficulty-accuracy">
              정답률:{' '}
              {getDifficultyAccuracy(
                stats.byDifficulty.easy.answered,
                stats.byDifficulty.easy.correct
              )}
              %
            </div>
          </div>

          <div className="difficulty-stat-item">
            <div className="difficulty-stat-header">
              <span className="difficulty-name">{t('difficulty.medium')}</span>
              <span className="difficulty-count">
                {stats.byDifficulty.medium.answered} 문제
              </span>
            </div>
            <div className="difficulty-accuracy">
              정답률:{' '}
              {getDifficultyAccuracy(
                stats.byDifficulty.medium.answered,
                stats.byDifficulty.medium.correct
              )}
              %
            </div>
          </div>

          <div className="difficulty-stat-item">
            <div className="difficulty-stat-header">
              <span className="difficulty-name">{t('difficulty.hard')}</span>
              <span className="difficulty-count">
                {stats.byDifficulty.hard.answered} 문제
              </span>
            </div>
            <div className="difficulty-accuracy">
              정답률:{' '}
              {getDifficultyAccuracy(
                stats.byDifficulty.hard.answered,
                stats.byDifficulty.hard.correct
              )}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

