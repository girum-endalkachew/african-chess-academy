"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Chess, Square } from "chess.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Calendar,
  Award,
  User,
  Settings,
  Swords,
  Edit3,
  Copy,
  Trash2,
  RotateCcw,
  Shuffle,
} from "lucide-react";

const Chessboard = dynamic(
  () => import("react-chessboard").then((m) => m.Chessboard),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square rounded-2xl bg-white/40 border border-white/60 animate-pulse" />
    ),
  }
);

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const EMPTY_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";

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
        const square = `${file}${rank}`;
        position[square] = `${piece.color}${piece.type.toUpperCase()}`;
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
        empty += 1;
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
  const [position, setPosition] = useState<BoardPosition>(() => fenToPosition(START_FEN));
  const [inputFen, setInputFen] = useState(START_FEN);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [copied, setCopied] = useState(false);

  const fen = useMemo(() => positionToFen(position, turn), [position, turn]);

  const loadFen = () => {
    try {
      // validate with chess.js
      // eslint-disable-next-line no-new
      new Chess(inputFen);
      setPosition(fenToPosition(inputFen));
      const t = inputFen.split(" ")[1] === "b" ? "b" : "w";
      setTurn(t);
    } catch {
      alert("Invalid FEN. Please check and try again.");
    }
  };

  const clearBoard = () => {
    setPosition({});
    setInputFen(EMPTY_FEN);
    setTurn("w");
  };

  const resetStart = () => {
    setPosition(fenToPosition(START_FEN));
    setInputFen(START_FEN);
    setTurn("w");
  };

  const copyFen = async () => {
    const value = positionToFen(position, turn);
    setInputFen(value);
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onPieceDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    setPosition((prev) => {
      const next = { ...prev };

      // moving existing piece
      if (sourceSquare !== targetSquare) {
        delete next[sourceSquare];
      }

      // drop / place piece
      next[targetSquare] = piece;
      return next;
    });
    return true;
  };

  // Remove piece by dragging off-board-ish: click-to-delete helper via right panel buttons
  const removeSquare = (square: string) => {
    setPosition((prev) => {
      const next = { ...prev };
      delete next[square];
      return next;
    });
  };

  return (
    <>
<div className="mx-auto max-w-6xl space-y-6">
        <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-[#0B1528]">Board Editor</h1>
              <Badge variant="blue">Sandbox</Badge>
            </div>
            <p className="text-[13px] font-medium text-[#64748B]">
              Set up custom positions, copy FEN, and prepare puzzles or analysis boards.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="normal-case tracking-normal">
              Side to move: {turn === "w" ? "White" : "Black"}
            </Badge>
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* BOARD */}
          <div className="lg:col-span-7">
            <GlassCard className="p-4">
              <div className="rounded-2xl overflow-hidden">
                <Chessboard
                  id="aca-editor-board"
                  position={position}
                  onPieceDrop={onPieceDrop}
                  boardOrientation={orientation}
                  arePiecesDraggable={true}
                  animationDuration={150}
                  customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
                  customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
                  customBoardStyle={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 12px 40px rgba(54,138,228,0.15)",
                  }}
                />
              </div>
              <p className="mt-3 text-[11px] font-medium text-[#64748B]">
                Drag pieces on the board to rearrange. Use the palette below to add pieces.
              </p>
            </GlassCard>
          </div>

          {/* CONTROLS */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="p-6 space-y-5">
              <div>
                <label className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider mb-2 block">
                  FEN String
                </label>
                <div className="flex gap-2">
                  <Input
                    value={inputFen}
                    onChange={(e) => setInputFen(e.target.value)}
                    className="font-mono text-[11px]"
                  />
                  <Button variant="primary" onClick={loadFen}>
                    Load
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-xl" onClick={resetStart}>
                  <RotateCcw className="h-4 w-4" /> Start
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={clearBoard}
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </Button>
                <Button
                  variant="glass"
                  className="rounded-xl"
                  onClick={() => setTurn((t) => (t === "w" ? "b" : "w"))}
                >
                  <Shuffle className="h-4 w-4" /> Side to move
                </Button>
                <Button
                  variant="glass"
                  className="rounded-xl"
                  onClick={() =>
                    setOrientation((o) => (o === "white" ? "black" : "white"))
                  }
                >
                  Flip board
                </Button>
                <Button variant="primary" className="col-span-2 rounded-xl" onClick={copyFen}>
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy current FEN"}
                </Button>
              </div>
            </GlassCard>

            {/* Piece palette */}
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
                <p className="text-sm font-extrabold text-[#0B1528]">Add pieces</p>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">
                Click a piece, then click a square on the quick grid, or drag pieces already on the board.
              </p>

              <PiecePalette
                onPlace={(square, piece) => {
                  setPosition((prev) => ({ ...prev, [square]: piece }));
                }}
                onClearSquare={removeSquare}
              />
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2">
                Current FEN
              </p>
              <code className="block text-[11px] font-mono text-[#0B1528] break-all leading-relaxed">
                {fen}
              </code>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}

function PiecePalette({
  onPlace,
  onClearSquare,
}: {
  onPlace: (square: string, piece: string) => void;
  onClearSquare: (square: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>("wP");
  const pieces = ["wK", "wQ", "wR", "wB", "wN", "wP", "bK", "bQ", "bR", "bB", "bN", "bP"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {pieces.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setSelected(p)}
            className={`h-10 rounded-xl border text-xs font-extrabold transition ${
              selected === p
                ? "border-[#368AE4] bg-white text-[#368AE4]"
                : "border-white/70 bg-white/40 text-[#0B1528] hover:bg-white/70"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div>
        <p className="text-[11px] font-bold text-[#64748B] mb-2">
          Place <span className="text-[#368AE4]">{selected}</span> on square
        </p>
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 8 }, (_, f) => {
              const file = "abcdefgh"[f];
              const rank = `${8 - r}`;
              const square = `${file}${rank}` as Square;
              return (
                <button
                  key={square}
                  type="button"
                  title={square}
                  onClick={() => {
                    if (!selected) return;
                    onPlace(square, selected);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onClearSquare(square);
                  }}
                  className={`h-7 rounded-md text-[9px] font-bold border ${
                    (r + f) % 2 === 0
                      ? "bg-[#EAF2FB] border-white/70 text-[#64748B]"
                      : "bg-[#368AE4]/20 border-white/50 text-[#0B1528]"
                  }`}
                >
                  {square}
                </button>
              );
            })
          )}
        </div>
        <p className="mt-2 text-[10px] text-[#64748B]">Right-click a square to remove a piece.</p>
      </div>
    </div>
  );
}

