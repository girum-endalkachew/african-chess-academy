"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Chess, Square } from "chess.js";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, Shuffle, Copy, ArrowRight } from "lucide-react";

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
};

type ArrowColor = keyof typeof ARROW_COLORS;

type BoardPosition = Record<string, string>;

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
  } catch { return {}; }
}

function positionToFen(position: BoardPosition, turn: "w" | "b" = "w"): string {
  const rows: string[] = [];
  for (let r = 8; r >= 1; r--) {
    let row = "", empty = 0;
    for (const file of "abcdefgh") {
      const sq = `${file}${r}`;
      const piece = position[sq];
      if (!piece) { empty++; continue; }
      if (empty > 0) { row += `${empty}`; empty = 0; }
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
  const [position, setPosition] = useState<BoardPosition>(() => fenToPosition(START_FEN));
  const [inputFen, setInputFen] = useState(START_FEN);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [copied, setCopied] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<string>("wP");
  const [arrowColor, setArrowColor] = useState<ArrowColor>("green");
  const [arrows, setArrows] = useState<Array<[string, string, string]>>([]);
  const [arrowFrom, setArrowFrom] = useState<string | null>(null);

  const fen = useMemo(() => positionToFen(position, turn), [position, turn]);

  const loadFen = () => {
    try {
      new Chess(inputFen);
      setPosition(fenToPosition(inputFen));
      setTurn(inputFen.split(" ")[1] === "b" ? "b" : "w");
    } catch { alert("Invalid FEN"); }
  };

  const clearBoard = () => { setPosition({}); setInputFen(EMPTY_FEN); setArrows([]); };
  const resetStart = () => { setPosition(fenToPosition(START_FEN)); setInputFen(START_FEN); setArrows([]); };

  const copyFen = async () => {
    const v = positionToFen(position, turn);
    setInputFen(v);
    await navigator.clipboard.writeText(v);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onSquareClick = (square: Square) => {
    // Right-click removes piece is not straightforward; use left-click to place selected piece
    setPosition((prev) => ({ ...prev, [square]: selectedPiece }));
  };

  const onSquareRightClick = (square: Square) => {
    // Arrow drawing via right-click drag would be ideal; here toggle arrow
    if (!arrowFrom) {
      setArrowFrom(square);
    } else if (arrowFrom !== square) {
      setArrows((a) => [...a, [arrowFrom, square, ARROW_COLORS[arrowColor]]]);
      setArrowFrom(null);
    } else {
      setArrowFrom(null);
    }
  };

  const clearArrows = () => setArrows([]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <GlassCard className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Board Editor</h1>
            <Badge variant="blue">Analysis</Badge>
          </div>
          <p className="text-xs text-[#64748B]">Set up positions, draw arrows, copy FEN.</p>
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
            Click a square to place selected piece. Right-click two squares to draw an arrow.
          </p>
        </GlassCard>

        <div className="lg:col-span-5 space-y-4">
          {/* Piece palette with real chess piece icons */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
              <p className="text-sm font-extrabold text-[#0B1528]">Piece Palette</p>
            </div>
            <p className="text-[10px] text-[#64748B]">Selected: <span className="text-lg">{PIECE_ICONS[selectedPiece]}</span></p>
            <div className="grid grid-cols-6 gap-2">
              {Object.keys(PIECE_ICONS).map((p) => (
                <button
                  key={p}
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

          {/* Arrow colors */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
              <p className="text-sm font-extrabold text-[#0B1528]">Draw Arrows</p>
            </div>
            <p className="text-[10px] text-[#64748B]">Right-click source square, then right-click target.</p>
            <div className="grid grid-cols-3 gap-2">
              {(["green", "yellow", "red"] as ArrowColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setArrowColor(c)}
                  className={`h-10 rounded-xl border text-xs font-extrabold uppercase flex items-center justify-center gap-1 ${
                    arrowColor === c
                      ? "border-[#368AE4] bg-white shadow-sm"
                      : "border-white/70 bg-white/40 hover:bg-white/70"
                  }`}
                  style={{ color: c === "green" ? "#16a34a" : c === "yellow" ? "#d97706" : "#dc2626" }}
                >
                  <ArrowRight className="h-3 w-3" /> {c}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={clearArrows}>
              Clear all arrows ({arrows.length})
            </Button>
          </GlassCard>

          {/* Controls */}
          <GlassCard className="p-5 space-y-3">
            <label className="text-[10px] font-extrabold text-[#64748B] uppercase">FEN</label>
            <div className="flex gap-2">
              <Input value={inputFen} onChange={(e) => setInputFen(e.target.value)} className="font-mono text-[11px]" />
              <Button variant="primary" onClick={loadFen}>Load</Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={resetStart}><RotateCcw className="h-4 w-4" /> Start</Button>
              <Button variant="ghost" className="text-red-600" onClick={clearBoard}><Trash2 className="h-4 w-4" /> Clear</Button>
              <Button variant="glass" onClick={() => setTurn(t => t === "w" ? "b" : "w")}>
                <Shuffle className="h-4 w-4" /> Turn
              </Button>
              <Button variant="glass" onClick={() => setOrientation(o => o === "white" ? "black" : "white")}>
                Flip
              </Button>
              <Button variant="primary" className="col-span-2" onClick={copyFen}>
                <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy FEN"}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
