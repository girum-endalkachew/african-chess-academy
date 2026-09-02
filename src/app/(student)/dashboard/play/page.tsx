"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Chess, Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ContentLoader } from "@/components/ui/content-loader";
import { Difficulty, getBestMove } from "@/lib/chess/engine";
import { computeElo, opponentRating, GameResult } from "@/lib/chess/elo";
import {
  Swords,
  RotateCcw,
  Flag,
  TrendingUp,
  Loader2,
  Cpu,
  Circle,
  Lightbulb,
  Undo2,
  Handshake,
  Sparkles,
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

type PlayerColor = "w" | "b";
type ExtendedLevel = "beginner" | "easy" | "intermediate" | "advanced" | "expert" | "master";

export default function PlayComputerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customFen = searchParams.get("fen");
  const supabase = createClient();

  const gameRef = useRef(new Chess(customFen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));
  const [fen, setFen] = useState(gameRef.current.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("Your move (White)");
  const [thinking, setThinking] = useState(false);
  const [level, setLevel] = useState<ExtendedLevel>("easy");
  const [playerColor, setPlayerColor] = useState<PlayerColor>("w");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [rating, setRating] = useState(1200);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalSquares, setLegalSquares] = useState<Record<string, React.CSSProperties>>({});
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintStyle, setHintStyle] = useState<Record<string, React.CSSProperties>>({});
  const [boardWidth, setBoardWidth] = useState(360);
  const boardWrapRef = useRef<HTMLDivElement | null>(null);

  const engineDifficulty: Difficulty = useMemo(() => {
    if (level === "beginner" || level === "easy") return "easy";
    if (level === "intermediate" || level === "advanced") return "medium";
    return "hard";
  }, [level]);

  useEffect(() => {
    const el = boardWrapRef.current;
    if (!el) return;
    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      setBoardWidth((prev) => (Math.abs(prev - w) > 2 ? Math.max(280, Math.min(w, 560)) : prev));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof || { full_name: user.email?.split("@")[0], chess_rating: 1200 });
      setRating(prof?.chess_rating || 1200);
      setLoadingUser(false);
    })();
  }, [router, supabase]);

  const clearLights = useCallback(() => {
    setSelectedSquare(null);
    setLegalSquares({});
  }, []);

  const getMoveOptions = useCallback((square: Square) => {
    const g = gameRef.current;
    const piece = g.get(square);
    if (!piece || piece.color !== playerColor || g.turn() !== playerColor) {
      clearLights();
      return false;
    }
    const moves = g.moves({ square, verbose: true });
    if (!moves.length) {
      clearLights();
      return false;
    }
    const styles: Record<string, React.CSSProperties> = {};
    styles[square] = {
      background: "radial-gradient(circle, rgba(54,138,228,0.55) 0%, rgba(54,138,228,0.22) 55%, transparent 70%)",
    };
    for (const m of moves) {
      const targetHasEnemy = !!g.get(m.to) && g.get(m.to)?.color !== playerColor;
      if (targetHasEnemy) {
        styles[m.to] = {
          background: "radial-gradient(circle, rgba(239,68,68,0) 55%, rgba(239,68,68,0.55) 56%, rgba(239,68,68,0.25) 100%)",
          borderRadius: "50%",
        };
      } else {
        styles[m.to] = {
          background: "radial-gradient(circle, rgba(15,23,42,0.22) 0%, rgba(15,23,42,0.22) 28%, transparent 30%)",
          borderRadius: "50%",
        };
      }
    }
    setSelectedSquare(square);
    setLegalSquares(styles);
    return true;
  }, [playerColor, clearLights]);

  const syncBoard = useCallback(() => {
    setFen(gameRef.current.fen());
    setHistory(gameRef.current.history());
  }, []);

  const finishGame = useCallback(async (r: GameResult) => {
    setGameOver(true);
    setResult(r);
    setThinking(false);
    clearLights();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const opp = opponentRating(engineDifficulty);
      const { newRating, delta } = computeElo(rating, opp, r);
      await supabase.from("profiles").update({ chess_rating: newRating }).eq("id", user.id);
      await supabase.from("chess_games").insert({
        user_id: user.id,
        player_color: playerColor,
        difficulty: engineDifficulty,
        result: r,
        moves_pgn: gameRef.current.pgn(),
        moves_count: gameRef.current.history().length,
        rating_before: rating,
        rating_after: newRating,
        rating_delta: delta,
      });
      setRating(newRating);
      setLastDelta(delta);
    } catch {}
  }, [engineDifficulty, playerColor, rating, supabase, clearLights]);

  const checkGameEnd = useCallback(() => {
    const g = gameRef.current;
    if (g.isCheckmate()) {
      finishGame(g.turn() === playerColor ? "loss" : "win");
      return true;
    }
    if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition() || g.isInsufficientMaterial()) {
      finishGame("draw");
      return true;
    }
    return false;
  }, [finishGame, playerColor]);

  const triggerComputerMove = useCallback(() => {
    const g = gameRef.current;
    if (g.isGameOver() || g.turn() === playerColor) return;
    setThinking(true);
    setStatus("Computer is thinking...");
    clearLights();
    setTimeout(() => {
      const best = getBestMove(g.fen(), engineDifficulty);
      if (best) {
        g.move({ from: best.from, to: best.to, promotion: best.promotion || "q" });
        setLastMove({ from: best.from, to: best.to });
      }
      syncBoard();
      setThinking(false);
      if (!checkGameEnd()) {
        setStatus(`Your move (${playerColor === "w" ? "White" : "Black"})`);
      }
    }, 120);
  }, [engineDifficulty, playerColor, syncBoard, checkGameEnd, clearLights]);

  const tryMove = useCallback((from: Square, to: Square) => {
    if (thinking || gameOver) return false;
    const g = gameRef.current;
    if (g.turn() !== playerColor) return false;
    const move = g.move({ from, to, promotion: "q" });
    if (!move) return false;
    setLastMove({ from, to });
    clearLights();
    setHintStyle({});
    syncBoard();
    if (!checkGameEnd()) triggerComputerMove();
    return true;
  }, [thinking, gameOver, playerColor, clearLights, syncBoard, checkGameEnd, triggerComputerMove]);

  const onDrop = useCallback((source: string, target: string) => tryMove(source as Square, target as Square), [tryMove]);

  const onSquareClick = useCallback((square: Square) => {
    if (thinking || gameOver) return;
    const g = gameRef.current;
    if (g.turn() !== playerColor) return;
    if (selectedSquare) {
      const legal = g.moves({ square: selectedSquare, verbose: true }).some((m) => m.to === square);
      if (legal) {
        tryMove(selectedSquare, square);
        return;
      }
    }
    getMoveOptions(square);
  }, [thinking, gameOver, playerColor, selectedSquare, getMoveOptions, tryMove]);

  const onPieceDragBegin = useCallback((_piece: string, sourceSquare: string) => {
    if (thinking || gameOver) return;
    getMoveOptions(sourceSquare as Square);
  }, [thinking, gameOver, getMoveOptions]);

  const startNewGame = (asColor: PlayerColor) => {
    gameRef.current = new Chess(customFen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    setPlayerColor(asColor);
    setOrientation(asColor === "w" ? "white" : "black");
    setGameOver(false);
    setResult(null);
    setLastDelta(null);
    setThinking(false);
    setLastMove(null);
    setHintStyle({});
    clearLights();
    syncBoard();
    if (asColor === "b") {
      setStatus("Computer is thinking (White)...");
      setTimeout(() => triggerComputerMove(), 150);
    } else {
      setStatus("Your move (White)");
    }
  };

  const resign = () => {
    if (gameOver) return;
    finishGame("resign");
    setStatus("You resigned");
  };

  const showHint = useCallback(() => {
    if (thinking || gameOver) return;
    if (gameRef.current.turn() !== playerColor) return;
    const best = getBestMove(gameRef.current.fen(), "hard");
    if (!best) return;
    setHintStyle({
      [best.from]: { background: "radial-gradient(circle, rgba(251,191,36,0.75) 0%, transparent 70%)" },
      [best.to]: { background: "radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)" },
    });
    setTimeout(() => setHintStyle({}), 2500);
  }, [thinking, gameOver, playerColor]);

  const undoMove = useCallback(() => {
    if (thinking || gameOver) return;
    const g = gameRef.current;
    if (g.history().length < 1) return;
    g.undo();
    if (g.history().length > 0 && g.turn() !== playerColor) g.undo();
    setFen(g.fen());
    setHistory(g.history());
    setLastMove(null);
    setHintStyle({});
    clearLights();
    setStatus(`Your move (${playerColor === "w" ? "White" : "Black"})`);
  }, [thinking, gameOver, playerColor, clearLights]);

  const offerDrawVsAI = useCallback(() => {
    if (gameOver) return;
    const g = gameRef.current;
    const board = g.board();
    let score = 0;
    const val: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    for (const row of board) {
      for (const p of row) {
        if (p) score += (p.color === "w" ? 1 : -1) * (val[p.type] || 0);
      }
    }
    const threshold = level === "beginner" || level === "easy" ? 4 : level === "intermediate" ? 2 : 1;
    if (Math.abs(score) <= threshold) {
      finishGame("draw");
      setStatus("Draw accepted!");
    } else {
      setStatus("Computer declines the draw. Keep playing!");
      setTimeout(() => {
        if (!gameOver) setStatus(`Your move (${playerColor === "w" ? "White" : "Black"})`);
      }, 2000);
    }
  }, [gameOver, finishGame, playerColor, level]);

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: "rgba(54, 138, 228, 0.28)" };
      styles[lastMove.to] = { backgroundColor: "rgba(54, 138, 228, 0.38)" };
    }
    const g = gameRef.current;
    if (g.inCheck()) {
      const turn = g.turn();
      const board = g.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.type === "k" && p.color === turn) {
            styles[p.square] = {
              background: "radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(239,68,68,0.4) 45%, transparent 72%)",
            };
          }
        }
      }
    }
    Object.assign(styles, legalSquares, hintStyle);
    return styles;
  }, [lastMove, legalSquares, hintStyle, fen]);

  if (loadingUser) return <ContentLoader label="Loading board..." />;

  const playerName = profile?.full_name || "You";
  const isPlayerTurn = !thinking && !gameOver && gameRef.current.turn() === playerColor;

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#EEF3FA] flex items-center justify-center text-[#368AE4] shrink-0">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1528]">Play vs Computer</h1>
                <Badge variant="blue">Live AI</Badge>
                {customFen && <Badge variant="warning">Custom Position</Badge>}
              </div>
              <p className="text-[12px] sm:text-[13px] font-medium text-[#64748B]">
                6 Difficulty Levels · ACA AI Engine
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 border border-white/80 px-3 sm:px-4 py-2">
              <TrendingUp className="h-4 w-4 text-[#368AE4]" />
              <span className="text-sm font-extrabold text-[#0B1528]">{rating}</span>
              <span className="text-[11px] font-bold text-[#64748B]">ELO</span>
            </div>
            {lastDelta !== null && (
              <Badge variant={lastDelta >= 0 ? "success" : "danger"}>
                {lastDelta >= 0 ? `+${lastDelta}` : lastDelta}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 h-12">
          {thinking ? (
            <div className="h-12 flex items-center justify-between gap-3 rounded-2xl bg-[#368AE4] px-4 text-white">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-bold">ACA AI is calculating move…</span>
              </div>
              <Badge className="bg-white/20 text-white border-0">AI</Badge>
            </div>
          ) : (
            <div className="h-12 flex items-center rounded-2xl bg-white/40 border border-white/70 px-4">
              <p className="text-sm font-bold text-[#0B1528] truncate">{status}</p>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <GlassCard className="px-3 sm:px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#0B1528]">ACA AI Coach</p>
                <p className="text-[11px] font-bold text-[#64748B] capitalize">
                  {level} Level · {playerColor === "w" ? "Black" : "White"}
                </p>
              </div>
            </div>
            <Circle className={`h-2.5 w-2.5 fill-current ${thinking ? "text-amber-400" : "text-[#64748B]/40"}`} />
          </GlassCard>

          <GlassCard className="p-2 sm:p-4 overflow-hidden">
            <div ref={boardWrapRef} className="w-full max-w-[560px] mx-auto">
              <div className="w-full overflow-hidden rounded-2xl contain-board">
                <Chessboard
                  id="aca-play-board"
                  position={fen}
                  onPieceDrop={onDrop}
                  onSquareClick={onSquareClick}
                  onPieceDragBegin={onPieceDragBegin}
                  boardOrientation={orientation}
                  boardWidth={boardWidth}
                  arePiecesDraggable={isPlayerTurn}
                  animationDuration={120}
                  customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
                  customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
                  customSquareStyles={customSquareStyles}
                  customBoardStyle={{ borderRadius: "16px", overflow: "hidden" }}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="px-3 sm:px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white flex items-center justify-center font-extrabold shrink-0">
                {playerName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#0B1528] truncate">{playerName}</p>
                <p className="text-[11px] font-bold text-[#64748B]">
                  {rating} ELO · {playerColor === "w" ? "White" : "Black"}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#64748B]">
              {isPlayerTurn ? "Your turn" : gameOver ? "Over" : "Wait"}
            </span>
          </GlassCard>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-4 sm:p-6 space-y-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2">Level Selection</p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {(["beginner", "easy", "intermediate", "advanced", "expert", "master"] as ExtendedLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`rounded-xl border px-1.5 py-2 text-[11px] font-extrabold capitalize transition-all ${
                      level === lvl
                        ? "border-[#368AE4] bg-white/80 text-[#368AE4] shadow-sm"
                        : "border-white/70 bg-white/30 text-[#64748B]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="primary" className="rounded-2xl" onClick={() => startNewGame("w")}>
                <RotateCcw className="h-4 w-4" /> White
              </Button>
              <Button variant="outline" className="rounded-2xl" onClick={() => startNewGame("b")}>
                Black
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="glass" size="sm" className="rounded-xl" onClick={showHint} disabled={thinking || gameOver || !isPlayerTurn}>
                <Lightbulb className="h-3.5 w-3.5" /> Hint
              </Button>
              <Button variant="glass" size="sm" className="rounded-xl" onClick={undoMove} disabled={thinking || gameOver || history.length < 1}>
                <Undo2 className="h-3.5 w-3.5" /> Undo
              </Button>
              <Button variant="glass" size="sm" className="rounded-xl" onClick={offerDrawVsAI} disabled={gameOver}>
                <Handshake className="h-3.5 w-3.5" /> Draw
              </Button>
            </div>

            <Button variant="ghost" className="w-full rounded-2xl text-red-600 hover:bg-red-50" onClick={resign} disabled={gameOver}>
              <Flag className="h-4 w-4" /> Resign
            </Button>

            <div className="min-h-[72px]">
              {gameOver && result && (
                <div className={`rounded-2xl p-4 border text-sm font-extrabold ${
                  result === "win" ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : result === "draw" ? "bg-white/60 border-white/80 text-[#0B1528]"
                  : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  Game over · {result.toUpperCase()}
                  <div className="mt-1 text-xs font-bold opacity-80">ELO now {rating}</div>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-extrabold text-[#0B1528]">Move List</p>
              <Badge variant="outline" className="normal-case tracking-normal">{history.length}</Badge>
            </div>
            <div className="h-48 sm:h-64 overflow-y-auto rounded-2xl bg-white/35 border border-white/60 p-3">
              {history.length === 0 ? (
                <p className="text-xs text-[#64748B] text-center py-6">No moves yet</p>
              ) : (
                <div className="space-y-1">
                  {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                    <div key={i} className="grid grid-cols-[36px_1fr_1fr] gap-2 text-xs font-mono px-2 py-1">
                      <span className="text-[#64748B] font-sans font-bold">{i + 1}.</span>
                      <span>{history[i * 2] || ""}</span>
                      <span>{history[i * 2 + 1] || ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
