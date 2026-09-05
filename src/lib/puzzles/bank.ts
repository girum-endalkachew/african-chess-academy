export type Puzzle = {
  id: string;
  fen: string;
  solution: string;
  theme: string;
  rating: number;
  hint: string;
  playerColor: "w" | "b";
};

export const PUZZLE_BANK: Puzzle[] = [
  {
    id: "p1",
    fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    solution: "a1a8",
    theme: "Back Rank Mate",
    rating: 800,
    hint: "The 8th rank is completely undefended!",
    playerColor: "w",
  },
  {
    id: "p2",
    fen: "4k3/8/4K3/4Q3/8/8/8/8 w - - 0 1",
    solution: "e5e7",
    theme: "Supported Queen Mate",
    rating: 700,
    hint: "Your King supports your Queen for a decisive attack.",
    playerColor: "w",
  },
  {
    id: "p3",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
    solution: "d8h4",
    theme: "Fool's Mate",
    rating: 400,
    hint: "White's kingside diagonal is fatally weak.",
    playerColor: "b",
  },
  {
    id: "p4",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: "f3e5",
    theme: "Central Capture",
    rating: 1000,
    hint: "Grab the free pawn in the center with tempo.",
    playerColor: "w",
  },
  {
    id: "p5",
    fen: "3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    solution: "d1d8",
    theme: "Rook Trade",
    rating: 900,
    hint: "Force an exchange on the d-file.",
    playerColor: "w",
  },
  {
    id: "p6",
    fen: "7k/6pp/8/8/8/8/6PP/R6K w - - 0 1",
    solution: "a1a8",
    theme: "Corner Mate",
    rating: 850,
    hint: "The h-file king has no escape.",
    playerColor: "w",
  },
  {
    id: "p7",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5",
    solution: "c4f7",
    theme: "Bishop Sacrifice",
    rating: 1100,
    hint: "The f7 square is a classic weak spot.",
    playerColor: "w",
  },
  {
    id: "p8",
    fen: "6k1/pp3ppp/8/8/8/5Q2/PP3PPP/6K1 w - - 0 1",
    solution: "f3f8",
    theme: "Back Rank Attack",
    rating: 950,
    hint: "Straight for the enemy king.",
    playerColor: "w",
  },
];

export function getPuzzleById(id: string) {
  return PUZZLE_BANK.find((p) => p.id === id);
}

export function getPuzzleForRating(userRating: number, exclude: string[] = []) {
  const available = PUZZLE_BANK.filter((p) => !exclude.includes(p.id));
  if (available.length === 0) return PUZZLE_BANK[Math.floor(Math.random() * PUZZLE_BANK.length)];
  // Find closest rating
  available.sort((a, b) => Math.abs(a.rating - userRating) - Math.abs(b.rating - userRating));
  const pool = available.slice(0, 3);
  return pool[Math.floor(Math.random() * pool.length)];
}
