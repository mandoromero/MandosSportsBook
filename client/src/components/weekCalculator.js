export default function getNFLWeek(gameDate) {
  const WEEK1_START = new Date("2026-09-08T00:00:00");

  const diffMs = gameDate - WEEK1_START;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;

  return Math.floor(diffDays / 7) + 1;
}
