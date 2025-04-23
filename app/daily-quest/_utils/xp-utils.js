export const RANKS = [
    { rank: 'E-Rank', threshold: 0 },
    { rank: 'D-Rank', threshold: 50 },
    { rank: 'C-Rank', threshold: 120 },
    { rank: 'B-Rank', threshold: 200 },
    { rank: 'A-Rank', threshold: 300 },
    { rank: 'S-Rank', threshold: 500 }
  ];
  
  export function calculateRank(xp) {
    return RANKS.filter(r => xp >= r.threshold).slice(-1)[0].rank;
  }
  
  export function calculateProgressToNext(xp) {
    const current = RANKS.filter(r => xp >= r.threshold).slice(-1)[0];
    const currentIdx = RANKS.findIndex(r => r.rank === current.rank);
    const next = RANKS[currentIdx + 1] || current;
    const xpInRank = xp - current.threshold;
    const xpNeeded = next.threshold - current.threshold;
    const percent = xpNeeded ? Math.min((xpInRank / xpNeeded) * 100, 100) : 100;
    return { current: current.rank, next: next.rank, percent: Math.round(percent) };
  }