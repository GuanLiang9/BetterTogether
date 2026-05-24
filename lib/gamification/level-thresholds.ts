export const LEVEL_TITLES: Record<number, string> = {
  1: "Seedling",
  2: "Sprout",
  3: "Sapling",
  4: "Bloom",
  5: "Grove",
  6: "Forest",
  7: "Canopy",
  8: "Sanctuary",
  9: "Starfield",
  10: "Constellation",
};

export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 150,
  3: 400,
  4: 800,
  5: 1500,
  6: 2500,
  7: 4000,
  8: 6000,
  9: 9000,
  10: 13000,
};

export function getLevelFromXp(xp: number): number {
  let level = 1;
  for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
    if (xp >= threshold) level = Number(lvl);
    else break;
  }
  return level;
}

export function getXpForLevel(level: number): number {
  if (level <= 10) return LEVEL_THRESHOLDS[level] ?? 0;
  const base = LEVEL_THRESHOLDS[10];
  let total = base;
  for (let l = 11; l <= level; l++) total += l * 1500;
  return total;
}

export function getLevelTitle(level: number): string {
  if (level <= 10) return LEVEL_TITLES[level] ?? "Cosmos";
  return `Cosmos ${toRoman(level - 10)}`;
}

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}
