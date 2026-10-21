/**
 * GitHub Contributions Service
 * Fetches, caches, and parses GitHub contribution data with streak analytics.
 */

const CACHE_PREFIX = 'gh_contrib_';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetch contribution calendar for a given GitHub username and year
 * @param {string} username - GitHub username (defaults to 'vasanth246810')
 * @param {string|number} year - 'last' or specific year (e.g., '2026', '2025')
 */
export async function getGitHubContributions(username = 'vasanth246810', year = 'last') {
  const cacheKey = `${CACHE_PREFIX}${username}_${year}`;
  
  // Check localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          return data;
        }
      }
    } catch {
      // Ignore cache parse error
    }
  }

  try {
    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const rawData = await response.json();
    const parsed = processContributionData(rawData, year);

    // Save to cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ data: parsed, timestamp: Date.now() }));
      } catch {
        // Storage quota catch
      }
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to fetch live GitHub contributions, using fallback:', error);
    return getFallbackContributionData(year);
  }
}

/**
 * Compute streaks, weekly calendar layout, and summary metrics from raw API response
 */
function processContributionData(data, requestedYear) {
  const days = data.contributions || [];
  const years = Object.keys(data.total || {}).filter(y => y !== 'lastYear').sort((a, b) => b - a);

  let totalContributions = 0;
  if (requestedYear === 'last' && data.total?.lastYear !== undefined) {
    totalContributions = data.total.lastYear;
  } else if (data.total?.[requestedYear] !== undefined) {
    totalContributions = data.total[requestedYear];
  } else {
    totalContributions = days.reduce((sum, d) => sum + (d.count || 0), 0);
  }

  // Calculate streaks & peak day
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let busiestDay = { date: '', count: 0 };
  let activeDaysCount = 0;

  // Process days in chronological order
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const count = day.count || 0;

    if (count > 0) {
      activeDaysCount++;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      if (count > busiestDay.count) {
        busiestDay = { date: day.date, count };
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak backward from latest days
  for (let i = days.length - 1; i >= 0; i--) {
    const count = days[i].count || 0;
    if (count > 0) {
      currentStreak++;
    } else {
      // If today has 0 commits, check if yesterday had commits (streak can still be active)
      if (i === days.length - 1) continue;
      break;
    }
  }

  // Organize days into 7-day week columns (Sunday=0 to Saturday=6)
  const weeks = [];
  let currentWeek = [];

  // Align the first week to its day-of-week
  if (days.length > 0) {
    const firstDate = new Date(days[0].date);
    const leadingEmptyDays = firstDate.getDay(); // 0 for Sun, 1 for Mon...
    for (let pad = 0; pad < leadingEmptyDays; pad++) {
      currentWeek.push(null);
    }
  }

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // Generate month labels mapped to week column indices
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstValidDay = week.find(d => d !== null);
    if (firstValidDay) {
      const d = new Date(firstValidDay.date);
      const month = d.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          weekIndex,
          name: d.toLocaleString('en-US', { month: 'short' }),
        });
        lastMonth = month;
      }
    }
  });

  return {
    days,
    weeks,
    monthLabels,
    years: years.length ? years : ['2026', '2025', '2024'],
    stats: {
      totalContributions,
      currentStreak,
      longestStreak,
      busiestDay,
      activeDaysCount,
      averagePerWeek: Math.round(totalContributions / Math.max(1, weeks.length)),
    },
  };
}

/**
 * Fallback static contribution data for offline or rate-limited environments
 */
function getFallbackContributionData(year) {
  const days = [];
  const now = new Date();
  const totalDays = 365;

  for (let i = totalDays; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const count = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 6);
    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count <= 4) level = 2;
    else if (count <= 6) level = 3;
    else if (count > 6) level = 4;

    days.push({ date: dateStr, count, level });
  }

  return processContributionData(
    {
      contributions: days,
      total: { lastYear: 450, 2026: 220, 2025: 580 },
    },
    year
  );
}
