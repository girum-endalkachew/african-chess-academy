export function calculateStreak(dates: Date[]): {
  currentStreak: number;
  longestStreak: number;
  streakDays: Set<string>;
} {
  if (!dates.length) return { currentStreak: 0, longestStreak: 0, streakDays: new Set() };

  // Normalize to YYYY-MM-DD unique days
  const uniqueDays = Array.from(new Set(
    dates.map(d => new Date(d).toISOString().split("T")[0])
  )).sort();

  const streakDays = new Set(uniqueDays);

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Current streak: count backward from today or yesterday
  let currentStreak = 0;
  let checkDate = streakDays.has(today) ? today : streakDays.has(yesterday) ? yesterday : null;

  while (checkDate && streakDays.has(checkDate)) {
    currentStreak++;
    const prev = new Date(checkDate);
    prev.setDate(prev.getDate() - 1);
    checkDate = prev.toISOString().split("T")[0];
  }

  // Longest streak
  let longestStreak = 0;
  let running = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const cur = new Date(uniqueDays[i]);
    const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) {
      running++;
    } else {
      longestStreak = Math.max(longestStreak, running);
      running = 1;
    }
  }
  longestStreak = Math.max(longestStreak, running);

  return { currentStreak, longestStreak, streakDays };
}
