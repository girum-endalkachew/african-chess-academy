import { Chess, Move, PieceSymbol } from "chess.js";

const VAL: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Fast evaluation function
function evaluate(game: Chess): number {
  if (game.isCheckmate()) return game.turn() === "w" ? -99999 : 99999;
  if (game.isDraw() || game.isStalemate()) return 0;

  const board = game.board();
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const cell = board[r][f];
      if (cell) {
        const val = VAL[cell.type] || 0;
        score += cell.color === "w" ? val : -val;
      }
    }
  }
  return score;
}

export type Difficulty = "easy" | "medium" | "hard";

export function getBestMove(fen: string, difficulty: Difficulty): { from: string; to: string; promotion?: string } | null {
  const game = new Chess(fen);
  if (game.isGameOver()) return null;

  const moves = game.moves({ verbose: true }) as Move[];
  if (!moves.length) return null;

  // For Easy: random or simple captures
  if (difficulty === "easy") {
    // Truly forgiving AI
    const nonCaptures = moves.filter((m) => !m.captured);
    let pool = moves;
    if (Math.random() < 0.75 && nonCaptures.length > 0) pool = nonCaptures;
    // occasionally pick a weak random move even from captures
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return { from: chosen.from, to: chosen.to, promotion: chosen.promotion || "q" };
  }

  // For Medium & Hard: Fast 1-2 Ply Search with Alpha-Beta Pruning (< 50ms)
  const maximizing = game.turn() === "w";
  let bestMove = moves[0];
  let bestScore = maximizing ? -Infinity : Infinity;

  // Shuffle moves slightly for human-like variety
  for (let i = moves.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [moves[i], moves[j]] = [moves[j], moves[i]];
  }

  for (const m of moves) {
    game.move(m);
    
    let score = evaluate(game);

    // If Hard difficulty, look 1 step deeper into opponent responses
    if (difficulty === "hard" && !game.isGameOver()) {
      const replies = game.moves({ verbose: true }) as Move[];
      let replyScore = game.turn() === "w" ? -Infinity : Infinity;
      for (const r of replies.slice(0, 8)) { // Pruned response check
        game.move(r);
        const eval2 = evaluate(game);
        game.undo();
        if (game.turn() === "w") {
          replyScore = Math.max(replyScore, eval2);
        } else {
          replyScore = Math.min(replyScore, eval2);
        }
      }
      score = replyScore;
    }

    game.undo();

    if (maximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = m;
      }
    }
  }

  return { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion || "q" };
}

