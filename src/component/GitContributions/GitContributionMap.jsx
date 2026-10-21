import React, { useState, useEffect, useRef } from 'react';
import './GitContributionMap.css';
import { getGitHubContributions } from '../../services/githubService';
import { useInView } from 'react-intersection-observer';
import {
  Flame,
  Trophy,
  Calendar,
  Sparkles,
  ExternalLink,
  GitCommit,
  Palette,
} from 'lucide-react';

const USERNAME = 'vasanth246810';

export default function GitContributionMap() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gh_heatmap_theme') || 'neon';
    }
    return 'neon';
  });

  const [selectedYear, setSelectedYear] = useState('last');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const scrollAreaRef = useRef(null);

  // Toggle theme and persist
  const toggleTheme = () => {
    const nextTheme = theme === 'neon' ? 'emerald' : 'neon';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gh_heatmap_theme', nextTheme);
    }
  };

  // Fetch contribution data when year changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getGitHubContributions(USERNAME, selectedYear)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error in GitContributionMap:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Auto-scroll to the end of the year on mount
  useEffect(() => {
    if (!loading && scrollAreaRef.current) {
      scrollAreaRef.current.scrollLeft = scrollAreaRef.current.scrollWidth;
    }
  }, [loading, selectedYear]);

  const handleCellMouseEnter = (day, e) => {
    if (!day) return;
    const rect = e.target.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
    setHoveredDay(day);
  };

  const handleCellMouseLeave = () => {
    setHoveredDay(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stats = data?.stats || {
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
    busiestDay: { date: '', count: 0 },
  };

  return (
    <section
      id="activity"
      ref={sectionRef}
      className={`git-contributions-section theme-${theme} ${inView ? 'fade-in' : ''}`}
    >
      <div className="git-contributions-container">
        {/* Header */}
        <div className="git-contrib-header">
          <div className="git-contrib-badge">
            <Sparkles size={14} />
            <span>Open Source & Consistency</span>
          </div>
          <h2 className="git-contrib-title">Git Contribution Activity</h2>
          <p className="git-contrib-subtitle">
            Live commit heatmap, coding streaks, and continuous development insights pulled
            directly from GitHub.
          </p>
        </div>

        {/* Controls: Year Tabs & Palette Switcher */}
        <div className="git-contrib-controls">
          <div className="git-year-tabs" role="tablist">
            <button
              type="button"
              className={`git-year-btn ${selectedYear === 'last' ? 'active' : ''}`}
              onClick={() => setSelectedYear('last')}
            >
              Last 12 Months
            </button>
            {(data?.years || ['2026', '2025', '2024']).map((yr) => (
              <button
                key={yr}
                type="button"
                className={`git-year-btn ${selectedYear === yr ? 'active' : ''}`}
                onClick={() => setSelectedYear(yr)}
              >
                {yr}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="git-theme-toggle"
            onClick={toggleTheme}
            title="Toggle between Cyber Neon and Classic Emerald palettes"
          >
            <Palette size={15} />
            <span>Theme: {theme === 'neon' ? 'Cyber Neon' : 'Classic Emerald'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="git-stats-grid">
          <div className="git-stat-card">
            <div className="git-stat-icon">
              <GitCommit size={22} />
            </div>
            <div className="git-stat-info">
              <span className="git-stat-label">Total Commits</span>
              <span className="git-stat-value">{stats.totalContributions}</span>
              <span className="git-stat-sub">
                in {selectedYear === 'last' ? 'last 12 months' : selectedYear}
              </span>
            </div>
          </div>

          <div className="git-stat-card">
            <div className="git-stat-icon">
              <Flame size={22} />
            </div>
            <div className="git-stat-info">
              <span className="git-stat-label">Current Streak</span>
              <span className="git-stat-value">{stats.currentStreak} Days</span>
              <span className="git-stat-sub">continuous daily commits</span>
            </div>
          </div>

          <div className="git-stat-card">
            <div className="git-stat-icon">
              <Trophy size={22} />
            </div>
            <div className="git-stat-info">
              <span className="git-stat-label">Longest Streak</span>
              <span className="git-stat-value">{stats.longestStreak} Days</span>
              <span className="git-stat-sub">personal record</span>
            </div>
          </div>

          <div className="git-stat-card">
            <div className="git-stat-icon">
              <Calendar size={22} />
            </div>
            <div className="git-stat-info">
              <span className="git-stat-label">Busiest Day</span>
              <span className="git-stat-value">
                {stats.busiestDay.count > 0 ? `${stats.busiestDay.count} Commits` : '—'}
              </span>
              <span className="git-stat-sub">
                {stats.busiestDay.date ? formatDate(stats.busiestDay.date) : 'in selected period'}
              </span>
            </div>
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="git-heatmap-card">
          <div className="git-heatmap-scroll-area" ref={scrollAreaRef}>
            {loading ? (
              <div className="git-skeleton-grid">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="git-week-col">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <div
                        key={j}
                        className="git-day-cell"
                        data-level={Math.floor(Math.random() * 3)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="git-heatmap-inner">
                {/* Months Header */}
                <div className="git-months-row">
                  {data?.monthLabels.map((m, idx) => (
                    <span
                      key={idx}
                      className="git-month-label"
                      style={{ left: `${m.weekIndex * 16}px` }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                {/* Grid Body */}
                <div className="git-grid-body">
                  {/* Day of Week Labels */}
                  <div className="git-days-column">
                    <span className="git-day-label"></span>
                    <span className="git-day-label">Mon</span>
                    <span className="git-day-label"></span>
                    <span className="git-day-label">Wed</span>
                    <span className="git-day-label"></span>
                    <span className="git-day-label">Fri</span>
                    <span className="git-day-label"></span>
                  </div>

                  {/* 52-53 Weeks */}
                  <div className="git-weeks-columns">
                    {data?.weeks.map((week, wIdx) => (
                      <div key={wIdx} className="git-week-col">
                        {week.map((day, dIdx) => {
                          if (!day) {
                            return <div key={dIdx} className="git-day-cell empty" />;
                          }
                          return (
                            <div
                              key={dIdx}
                              className="git-day-cell"
                              data-level={day.level}
                              onMouseEnter={(e) => handleCellMouseEnter(day, e)}
                              onMouseLeave={handleCellMouseLeave}
                              aria-label={`${day.count} contributions on ${day.date}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Legend */}
          <div className="git-heatmap-footer">
            <div className="git-legend">
              <span>Less</span>
              <div className="git-legend-tiles">
                <div className="git-day-cell" data-level="0" />
                <div className="git-day-cell" data-level="1" />
                <div className="git-day-cell" data-level="2" />
                <div className="git-day-cell" data-level="3" />
                <div className="git-day-cell" data-level="4" />
              </div>
              <span>More</span>
            </div>

            <a
              href={`https://github.com/${USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="git-profile-link"
            >
              <span>@{USERNAME} on GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredDay && (
          <div
            className="git-floating-tooltip"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <span className="git-tooltip-count">
              {hoveredDay.count === 0 ? 'No contributions' : `${hoveredDay.count} contributions`}
            </span>
            <span className="git-tooltip-date">on {formatDate(hoveredDay.date)}</span>
          </div>
        )}
      </div>
    </section>
  );
}
