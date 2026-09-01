"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Chess, Square } from "chess.js";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Puzzle, RefreshCw, Lightbulb, CheckCircle2, XCircle } from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-white/40 animate-pulse" />,
});

type Puzzle = {
  id: string;
  fen: string;
  solution: string[]; // UCI moves like "e2e4"
  theme: string;
  rating: number;
  sideToMove: "w" | "b";
  description: string;
};

const PUZZLES: Puzzle[] = [
  {
    id: "p1",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["g5f7"],
    theme: "Fork",
    rating: 1000,
    sideToMove: "w",
    description: "White to play. Find the winning fork.",
  },
  {
    id: "p2",
    fen: "r1b1kbnr/pppp1ppp/2n5/1B2p3/4P2q/5N2/PPPP1PPP/RNBQK2R w KQkq - 3 4",
    solution: ["b5c6"],
    theme: "Pin",
    rating: 1100,
    sideToMove: "w",
    description: "White to play. Exploit the pin.",
  },
  {
    id: "p3",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
    solution: [],
    theme: "Mate in 1",
    rating: 900,
    sideToMove: "b",
    description: "Black to play. Fool's Mate — deliver checkmate.",
  },
  {
    id: "p4",
    fen: "r2qkbnr/ppp2ppp/2np4/4p3/2B1P1b1/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 5",
    solution: ["f3e5"],
    theme: "Capture",
    rating: 1200,
    sideToMove: "w",
    description: "White to play. Win a pawn safely.",
  },
];

export default function PuzzlesPage() {
  const [idx, setIdx] = useState(0);
  const puzzle = PUZZLES[idx];
  const gameRef = useRef(new Chess(puzzle.fen));
  const [fen, setFen] = useState(puzzle.fen);
  const [status, setStatus] = useState<"solving" | "solved" | "failed">("solving");
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState<Set<string>>(new Set());

  useEffect(() => {
    gameRef.current = new Chess(puzzle.fen);
    setFen(puzzle.fen);
    setStatus("solving");
    setHintSquare(null);
    setAttempts(0);
  }, [idx, puzzle.fen]);

  const onDrop = useCallback((from: string, to: string) => {
    if (status !== "solving") return false;
    const uci = `${from}${to}`;
    const move = gameRef.current.move({ from: from as Square, to: to as Square, promotion: "q" });
    if (!move) return false;

    setFen(gameRef.current.fen());
    setAttempts((a) => a + 1);

    // Mate in 1 check
    if (puzzle.solution.length === 0 && gameRef.current.isCheckmate()) {
      setStatus("solved");
      setSolved((s) => new Set(s).add(puzzle.id));
      return true;
    }

    if (puzzle.solution.includes(uci)) {
      setStatus("solved");
      setSolved((s) => new Set(s).add(puzzle.id));
    } else {
      setStatus("failed");
      setTimeout(() => {
        gameRef.current = new Chess(puzzle.fen);
        setFen(puzzle.fen);
        setStatus("solving");
      }, 1200);
    }
    return true;
  }, [puzzle, status]);

  const showHint = () => {
    if (puzzle.solution.length > 0) {
      setHintSquare(puzzle.solution[0].slice(0, 2));
    } else {
      // For mate puzzles show any piece from side to move
      const moves = gameRef.current.moves({ verbose: true });
      if (moves.length) setHintSquare(moves[0].from);
    }
    setTimeout(() => setHintSquare(null), 2000);
  };

  const next = () => setIdx((i) => (i + 1) % PUZZLES.length);
  const restart = () => {
    gameRef.current = new Chess(puzzle.fen);
    setFen(puzzle.fen);
    setStatus("solving");
    setAttempts(0);
  };

  const squareStyles = useMemo(() => {
    if (!hintSquare) return {};
    return { [hintSquare]: { background: "radial-gradient(circle, rgba(251,191,36,0.7) 0%, transparent 70%)" } };
  }, [hintSquare]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <GlassCard className="p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/40 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="warning" className="mb-2">Daily Puzzles</Badge>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Puzzle Trainer</h1>
            <p className="text-sm text-[#64748B] mt-1">Solve tactical positions. Get hints. Level up.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Solved</p>
              <p className="text-2xl font-extrabold text-[#0B1528]">{solved.size} / {PUZZLES.length}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Puzzle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-12 gap-5">
        <GlassCard className="lg:col-span-7 p-3 sm:p-4">
          <div className="relative overflow-hidden rounded-2xl">
            <Chessboard
              id="puzzle-board"
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={puzzle.sideToMove === "w" ? "white" : "black"}
              arePiecesDraggable={status === "solving"}
              customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
              customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
              customSquareStyles={squareStyles}
              customBoardStyle={{ borderRadius: "16px" }}
              animationDuration={200}
            />
          </div>
        </GlassCard>

        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="blue">{puzzle.theme}</Badge>
              <Badge variant="outline" className="normal-case tracking-normal">Rating {puzzle.rating}</Badge>
            </div>
            <p className="text-sm font-bold text-[#0B1528]">{puzzle.description}</p>
            <p className="text-xs text-[#64748B]">{puzzle.sideToMove === "w" ? "White" : "Black"} to move</p>

            {status === "solved" && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-extrabold">Solved in {attempts} attempt{attempts !== 1 && "s"}!</span>
              </div>
            )}
            {status === "failed" && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-red-700">
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-extrabold">Not quite. Try again...</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="glass" onClick={showHint} disabled={status !== "solving"}>
                <Lightbulb className="h-4 w-4" /> Hint
              </Button>
              <Button variant="outline" onClick={restart}>
                <RefreshCw className="h-4 w-4" /> Reset
              </Button>
              <Button variant="primary" className="col-span-2" onClick={next}>
                Next Puzzle →
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-3">Puzzle List</p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {PUZZLES.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setIdx(i)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold border ${
                    i === idx ? "bg-white border-[#368AE4] text-[#368AE4]"
                    : solved.has(p.id) ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white/40 border-white/70 text-[#0B1528] hover:bg-white/70"
                  }`}
                >
                  <span>{i + 1}. {p.theme}</span>
                  <span className="flex items-center gap-1">
                    {solved.has(p.id) && <CheckCircle2 className="h-3 w-3" />}
                    {p.rating}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
