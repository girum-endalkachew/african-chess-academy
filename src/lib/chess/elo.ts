export type GameResult = "win" | "loss" | "draw" | "resign";

// Fixed opponent rating per difficulty for fair ELO changes
export function opponentRating(diff: "easy" | "medium" | "hard"): number {
  if (diff === "easy") return 1200;
  if (diff === "medium") return 1500;
  return 1800;
}

// Standard Elo calculation
export function computeElo(
  playerRating: number,
  opponent: number,
  result: GameResult
): { newRating: number; delta: number } {
  const kFactor = playerRating < 1400 ? 40 : playerRating < 2000 ? 20 : 10;
  const expected = 1 / (1 + Math.pow(10, (opponent - playerRating) / 400));

  let score = 0.5;
  if (result === "win") score = 1;
  else if (result === "loss" || result === "resign") score = 0;

  const delta = Math.round(kFactor * (score - expected));
  const newRating = Math.max(100, playerRating + delta);
  return { newRating, delta };
}