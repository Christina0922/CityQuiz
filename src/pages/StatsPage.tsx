import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { getIsPremium } from '../utils/storage';
import { useStats } from '../hooks/useStats';
import './StatsPage.css';

export const StatsPage: React.FC = () => {
  const { t } = useI18n();
  const { stats } = useStats();
  const isPremium = getIsPremium();

  const accuracy =
    stats.totalAnswered === 0
      ? 0
      : (stats.totalCorrect / stats.totalAnswered) * 100;

  const getDifficultyAccuracy = (answered: number, correct: number) => {
    return answered === 0 ? 0 : (correct / answered) * 100;
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
            <div className="stat-value">{accuracy.toFixed(1)}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">{t('stats.todayAnswered')}</div>
            <div className="stat-value">
              {stats.todayAnswered}
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
              ).toFixed(1)}
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
              ).toFixed(1)}
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
              ).toFixed(1)}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

