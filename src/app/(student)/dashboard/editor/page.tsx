"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Chess, Square } from "chess.js";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, Shuffle, Copy, ArrowRight, Play, Sparkles, Puzzle } from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-white/40 animate-pulse" />,
});

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const EMPTY_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";

const PIECE_ICONS: Record<string, string> = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

const ARROW_COLORS = {
  green: "rgba(34, 197, 94, 0.75)",
  yellow: "rgba(251, 191, 36, 0.75)",
  red: "rgba(239, 68, 68, 0.75)",
} as const;

type ArrowColor = keyof typeof ARROW_COLORS;
type BoardPosition = Record<string, string>;
type BoardArrow = [Square, Square, string];

function fenToPosition(fen: string): BoardPosition {
  try {
    const chess = new Chess(fen);
    const position: BoardPosition = {};
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (!piece) continue;
        const file = "abcdefgh"[f];
        const rank = `${8 - r}`;
        position[`${file}${rank}`] = `${piece.color}${piece.type.toUpperCase()}`;
      }
    }
    return position;
  } catch {
    return {};
  }
}

function positionToFen(position: BoardPosition, turn: "w" | "b" = "w"): string {
  const rows: string[] = [];
  for (let r = 8; r >= 1; r--) {
    let row = "";
    let empty = 0;
    for (const file of "abcdefgh") {
      const sq = `${file}${r}`;
      const piece = position[sq];
      if (!piece) {
        empty++;
        continue;
      }
      if (empty > 0) {
        row += `${empty}`;
        empty = 0;
      }
      const color = piece[0];
      const type = piece[1].toLowerCase();
      row += color === "w" ? type.toUpperCase() : type;
    }
    if (empty > 0) row += `${empty}`;
    rows.push(row || "8");
  }
  return `${rows.join("/")} ${turn} - - 0 1`;
}

export default function BoardEditorPage() {
  const router = useRouter();
  const [position, setPosition] = useState<BoardPosition>(() => fenToPosition(START_FEN));
  const [inputFen, setInputFen] = useState(START_FEN);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [copied, setCopied] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<string>("wP");
  const [arrowColor, setArrowColor] = useState<ArrowColor>("green");
  const [arrows, setArrows] = useState<BoardArrow[]>([]);
  const [arrowFrom, setArrowFrom] = useState<Square | null>(null);

  const fen = useMemo(() => positionToFen(position, turn), [position, turn]);

  const loadFen = () => {
    try {
      new Chess(inputFen);
      setPosition(fenToPosition(inputFen));
      setTurn(inputFen.split(" ")[1] === "b" ? "b" : "w");
    } catch {
      alert("Invalid FEN string");
    }
  };

  const clearBoard = () => {
    setPosition({});
    setInputFen(EMPTY_FEN);
    setArrows([]);
  };

  const resetStart = () => {
    setPosition(fenToPosition(START_FEN));
    setInputFen(START_FEN);
    setArrows([]);
  };

  const copyFen = async () => {
    const v = positionToFen(position, turn);
    setInputFen(v);
    await navigator.clipboard.writeText(v);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const playFromThisPosition = () => {
    const currentFen = positionToFen(position, turn);
    router.push(`/dashboard/play?fen=${encodeURIComponent(currentFen)}`);
  };

  const createPuzzleFromPosition = () => {
    router.push(`/dashboard/puzzles`);
  };

  const onSquareClick = (square: Square) => {
    setPosition((prev) => ({ ...prev, [square]: selectedPiece }));
  };

  const onSquareRightClick = (square: Square) => {
    if (!arrowFrom) {
      setArrowFrom(square);
      return;
    }
    if (arrowFrom !== square) {
      const next: BoardArrow = [arrowFrom, square, ARROW_COLORS[arrowColor]];
      setArrows((a) => [...a, next]);
    }
    setArrowFrom(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <GlassCard className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Board Editor</h1>
            <Badge variant="blue">Sandbox & Analysis</Badge>
          </div>
          <p className="text-xs text-[#64748B]">Set up custom positions, analyze, and play vs AI from here.</p>
        </div>
        <Badge variant="outline" className="normal-case tracking-normal">
          Side to move: {turn === "w" ? "White" : "Black"}
        </Badge>
      </GlassCard>

      <div className="grid lg:grid-cols-12 gap-5">
        <GlassCard className="lg:col-span-7 p-3 sm:p-4">
          <div className="rounded-2xl overflow-hidden">
            <Chessboard
              id="editor-board"
              position={position}
              boardOrientation={orientation}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              customArrows={arrows}
              customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
              customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
              customBoardStyle={{ borderRadius: "14px" }}
              animationDuration={120}
            />
          </div>
          <p className="mt-2 text-[11px] font-medium text-[#64748B]">
            Click square to place piece. Right-click two squares to draw an arrow.
          </p>
        </GlassCard>

        <div className="lg:col-span-5 space-y-4">
          {/* Quick Actions */}
          <GlassCard className="p-5 space-y-3">
            <p className="text-[10px] font-extrabold text-[#368AE4] uppercase tracking-wider">Position Actions</p>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="primary" className="w-full justify-between h-12 rounded-xl" onClick={playFromThisPosition}>
                <span>Play From This Position</span>
                <Play className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="glass" size="sm" className="rounded-xl" onClick={createPuzzleFromPosition}>
                  <Puzzle className="h-3.5 w-3.5" /> Create Puzzle
                </Button>
                <Button variant="glass" size="sm" className="rounded-xl" onClick={copyFen}>
                  <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy FEN"}
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Piece Palette */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
              <p className="text-sm font-extrabold text-[#0B1528]">Piece Palette</p>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {Object.keys(PIECE_ICONS).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPiece(p)}
                  className={`h-12 rounded-xl border text-2xl transition ${
                    selectedPiece === p
                      ? "border-[#368AE4] bg-white text-[#368AE4] shadow-sm"
                      : "border-white/70 bg-white/40 text-[#0B1528] hover:bg-white/70"
                  }`}
                >
                  {PIECE_ICONS[p]}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Arrow Palette */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
              <p className="text-sm font-extrabold text-[#0B1528]">Draw Arrows</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["green", "yellow", "red"] as ArrowColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setArrowColor(c)}
                  className={`h-10 rounded-xl border text-xs font-extrabold uppercase flex items-center justify-center gap-1 ${
                    arrowColor === c ? "border-[#368AE4] bg-white shadow-sm" : "border-white/70 bg-white/40 hover:bg-white/70"
                  }`}
                  style={{ color: c === "green" ? "#16a34a" : c === "yellow" ? "#d97706" : "#dc2626" }}
                >
                  <ArrowRight className="h-3 w-3" /> {c}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setArrows([])}>
              Clear arrows ({arrows.length})
            </Button>
          </GlassCard>

          {/* FEN Controls */}
          <GlassCard className="p-5 space-y-3">
            <label className="text-[10px] font-extrabold text-[#64748B] uppercase">FEN Input</label>
            <div className="flex gap-2">
              <Input value={inputFen} onChange={(e) => setInputFen(e.target.value)} className="font-mono text-[11px]" />
              <Button variant="primary" onClick={loadFen}>Load</Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={resetStart}><RotateCcw className="h-3.5 w-3.5" /> Start</Button>
              <Button variant="ghost" size="sm" className="rounded-xl text-red-600 hover:bg-red-50" onClick={clearBoard}><Trash2 className="h-3.5 w-3.5" /> Clear</Button>
              <Button variant="glass" size="sm" className="rounded-xl" onClick={() => setTurn((t) => (t === "w" ? "b" : "w"))}><Shuffle className="h-3.5 w-3.5" /> Turn</Button>
              <Button variant="glass" size="sm" className="rounded-xl" onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}>Flip</Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
