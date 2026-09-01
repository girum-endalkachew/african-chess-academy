"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Chess, Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Difficulty, getBestMove } from "@/lib/chess/engine";
import { computeElo, opponentRating, GameResult } from "@/lib/chess/elo";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Calendar,
  Award,
  User,
  Settings,
  Swords,
  RotateCcw,
  Flag,
  TrendingUp,
  Loader2,
  Cpu,
  Circle,
  Edit3,
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

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/play", label: "Play Computer", icon: Swords },
  { href: "/dashboard/editor", label: "Board Editor", icon: Edit3 },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type PlayerColor = "w" | "b";

export default function PlayComputerPage() {
  const router = useRouter();
  const supabase = createClient();

  const gameRef = useRef(new Chess());
  const boardWrapRef = useRef<HTMLDivElement | null>(null);
  const scrollLockY = useRef<number>(0);

  const [fen, setFen] = useState(() => gameRef.current.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("Your move (White)");
  const [thinking, setThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [playerColor, setPlayerColor] = useState<PlayerColor>("w");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [rating, setRating] = useState<number>(1200);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalSquares, setLegalSquares] = useState<Record<string, React.CSSProperties>>({});
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [boardWidth, setBoardWidth] = useState(480);

  // Keep board width stable and responsive without layout jump
  useEffect(() => {
    const el = boardWrapRef.current;
    if (!el) return;

    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      // only update when meaningful change happens
      setBoardWidth((prev) => (Math.abs(prev - w) > 2 ? w : prev));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Prevent scroll jump around state updates
  const lockScroll = useCallback(() => {
    scrollLockY.current = window.scrollY;
  }, []);

  const unlockScroll = useCallback(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollLockY.current, behavior: "auto" });
    });
  }, []);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(prof || { full_name: user.email?.split("@")[0], chess_rating: 1200 });
      setRating(prof?.chess_rating || 1200);
      setLoadingUser(false);
    })();
  }, [router, supabase]);

  const clearLights = useCallback(() => {
    setSelectedSquare(null);
    setLegalSquares({});
  }, []);

  const getMoveOptions = useCallback(
    (square: Square) => {
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
        background:
          "radial-gradient(circle, rgba(54,138,228,0.55) 0%, rgba(54,138,228,0.22) 55%, transparent 70%)",
      };

      for (const m of moves) {
        const targetHasEnemy = !!g.get(m.to) && g.get(m.to)?.color !== playerColor;
        if (targetHasEnemy) {
          styles[m.to] = {
            background:
              "radial-gradient(circle, rgba(239,68,68,0.0) 0%, rgba(239,68,68,0.0) 55%, rgba(239,68,68,0.55) 56%, rgba(239,68,68,0.25) 100%)",
            borderRadius: "50%",
          };
        } else {
          styles[m.to] = {
            background:
              "radial-gradient(circle, rgba(15,23,42,0.22) 0%, rgba(15,23,42,0.22) 28%, transparent 30%)",
            borderRadius: "50%",
          };
        }
      }

      setSelectedSquare(square);
      setLegalSquares(styles);
      return true;
    },
    [playerColor, clearLights]
  );

  const syncBoard = useCallback(() => {
    setFen(gameRef.current.fen());
    setHistory(gameRef.current.history());
  }, []);

  const finishGame = useCallback(
    async (r: GameResult) => {
      lockScroll();
      setGameOver(true);
      setResult(r);
      setThinking(false);
      clearLights();

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const opp = opponentRating(difficulty);
        const { newRating, delta } = computeElo(rating, opp, r);

        await supabase.from("profiles").update({ chess_rating: newRating }).eq("id", user.id);
        await supabase.from("chess_games").insert({
          user_id: user.id,
          player_color: playerColor,
          difficulty,
          result: r,
          moves_pgn: gameRef.current.pgn(),
          moves_count: gameRef.current.history().length,
          rating_before: rating,
          rating_after: newRating,
          rating_delta: delta,
        });

        setRating(newRating);
        setLastDelta(delta);
      } catch {
      } finally {
        unlockScroll();
      }
    },
    [difficulty, playerColor, rating, supabase, clearLights, lockScroll, unlockScroll]
  );

  const checkGameEnd = useCallback(() => {
    const g = gameRef.current;
    if (g.isCheckmate()) {
      const r = g.turn() === playerColor ? "loss" : "win";
      finishGame(r);
      return true;
    }
    if (
      g.isDraw() ||
      g.isStalemate() ||
      g.isThreefoldRepetition() ||
      g.isInsufficientMaterial()
    ) {
      finishGame("draw");
      return true;
    }
    return false;
  }, [finishGame, playerColor]);

  const triggerComputerMove = useCallback(() => {
    const g = gameRef.current;
    if (g.isGameOver() || g.turn() === playerColor) return;

    lockScroll();
    setThinking(true);
    setStatus("Computer is thinking...");
    clearLights();

    setTimeout(() => {
      const best = getBestMove(g.fen(), difficulty);
      if (best) {
        g.move({ from: best.from, to: best.to, promotion: best.promotion || "q" });
        setLastMove({ from: best.from, to: best.to });
      }
      syncBoard();
      setThinking(false);
      if (!checkGameEnd()) {
        setStatus(`Your move (${playerColor === "w" ? "White" : "Black"})`);
      }
      unlockScroll();
    }, 120);
  }, [difficulty, playerColor, syncBoard, checkGameEnd, clearLights, lockScroll, unlockScroll]);

  const tryMove = useCallback(
    (from: Square, to: Square) => {
      if (thinking || gameOver) return false;
      const g = gameRef.current;
      if (g.turn() !== playerColor) return false;

      lockScroll();
      const move = g.move({ from, to, promotion: "q" });
      if (!move) {
        unlockScroll();
        return false;
      }

      setLastMove({ from, to });
      clearLights();
      syncBoard();

      if (!checkGameEnd()) {
        triggerComputerMove();
      } else {
        unlockScroll();
      }
      return true;
    },
    [
      thinking,
      gameOver,
      playerColor,
      clearLights,
      syncBoard,
      checkGameEnd,
      triggerComputerMove,
      lockScroll,
      unlockScroll,
    ]
  );

  const onDrop = useCallback(
    (source: string, target: string) => tryMove(source as Square, target as Square),
    [tryMove]
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      if (thinking || gameOver) return;
      const g = gameRef.current;
      if (g.turn() !== playerColor) return;

      if (selectedSquare) {
        const legal = g
          .moves({ square: selectedSquare, verbose: true })
          .some((m) => m.to === square);
        if (legal) {
          tryMove(selectedSquare, square);
          return;
        }
      }

      getMoveOptions(square);
    },
    [thinking, gameOver, playerColor, selectedSquare, getMoveOptions, tryMove]
  );

  const onPieceDragBegin = useCallback(
    (_piece: string, sourceSquare: string) => {
      if (thinking || gameOver) return;
      getMoveOptions(sourceSquare as Square);
    },
    [thinking, gameOver, getMoveOptions]
  );

  const startNewGame = (asColor: PlayerColor) => {
    lockScroll();
    gameRef.current = new Chess();
    setPlayerColor(asColor);
    setOrientation(asColor === "w" ? "white" : "black");
    setGameOver(false);
    setResult(null);
    setLastDelta(null);
    setThinking(false);
    setLastMove(null);
    clearLights();
    syncBoard();

    if (asColor === "b") {
      setStatus("Computer is thinking (White)...");
      setTimeout(() => triggerComputerMove(), 150);
    } else {
      setStatus("Your move (White)");
      unlockScroll();
    }
  };

  const resign = () => {
    if (gameOver) return;
    finishGame("resign");
    setStatus("You resigned");
  };

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
              ...(styles[p.square] || {}),
              background:
                "radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(239,68,68,0.4) 45%, transparent 72%)",
            };
          }
        }
      }
    }

    Object.assign(styles, legalSquares);
    return styles;
  }, [lastMove, legalSquares, fen]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
        <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
      </div>
    );
  }

  const playerName = profile?.full_name || "You";
  const isPlayerTurn = !thinking && !gameOver && gameRef.current.turn() === playerColor;

  return (
    <PortalShell role="Student" userName={playerName} navItems={navItems}>
      <div className="mx-auto max-w-7xl space-y-5 overflow-anchor-none">
        <GlassCard className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#EEF3FA] flex items-center justify-center text-[#368AE4] shrink-0">
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1528] tracking-tight">
                    Play vs Computer
                  </h1>
                  <Badge variant="blue">Live</Badge>
                </div>
                <p className="text-[13px] font-medium text-[#64748B]">
                  Click a piece to see legal moves · drag or click destination
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/60 border border-white/80 px-4 py-2">
                <TrendingUp className="h-4 w-4 text-[#368AE4]" />
                <span className="text-sm font-extrabold text-[#0B1528]">{rating}</span>
                <span className="text-[11px] font-bold text-[#64748B]">ELO</span>
              </div>
              {lastDelta !== null && (
                <Badge variant={lastDelta >= 0 ? "success" : "danger"}>
                  {lastDelta >= 0 ? `+${lastDelta}` : lastDelta}
                </Badge>
              )}
              <Badge variant="outline" className="gap-1.5 normal-case tracking-normal">
                <Cpu className="h-3.5 w-3.5" />
                {difficulty[0].toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>
          </div>

          {/* FIXED HEIGHT status strip: prevents page jump when thinking toggles */}
          <div className="mt-4 h-12">
            {thinking ? (
              <div className="h-12 flex items-center justify-between gap-3 rounded-2xl bg-[#368AE4] px-4 text-white">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-bold">Computer is calculating…</span>
                </div>
                <Badge className="bg-white/20 text-white border-0">AI Active</Badge>
              </div>
            ) : (
              <div className="h-12 flex items-center rounded-2xl bg-white/40 border border-white/70 px-4">
                <p className="text-sm font-bold text-[#0B1528] truncate">{status}</p>
              </div>
            )}
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 space-y-4">
            <GlassCard className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B1528]">ACA Engine</p>
                  <p className="text-[11px] font-bold text-[#64748B]">
                    {difficulty[0].toUpperCase() + difficulty.slice(1)} ·{" "}
                    {playerColor === "w" ? "Black" : "White"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Circle
                  className={`h-2.5 w-2.5 fill-current ${
                    thinking ? "text-amber-400" : "text-[#64748B]/40"
                  }`}
                />
                <span className="text-[11px] font-bold text-[#64748B]">
                  {thinking ? "Thinking" : "Waiting"}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-3 sm:p-4 overflow-hidden">
              {/* Stable square box: no reflow after moves */}
              <div ref={boardWrapRef} className="relative w-full max-w-[640px] mx-auto">
                <div className="w-full aspect-square overflow-hidden rounded-2xl contain-layout contain-paint">
                  <Chessboard
                    id="aca-play-board"
                    position={fen}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    onPieceDragBegin={onPieceDragBegin}
                    boardOrientation={orientation}
                    boardWidth={Math.max(boardWidth, 280)}
                    arePiecesDraggable={isPlayerTurn}
                    animationDuration={120}
                    customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
                    customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
                    customSquareStyles={customSquareStyles}
                    customBoardStyle={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 12px 40px rgba(54,138,228,0.15)",
                    }}
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white flex items-center justify-center font-extrabold">
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#0B1528]">{playerName}</p>
                  <p className="text-[11px] font-bold text-[#64748B]">
                    {rating} ELO · {playerColor === "w" ? "White" : "Black"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Circle
                  className={`h-2.5 w-2.5 fill-current ${
                    isPlayerTurn ? "text-emerald-500" : "text-[#64748B]/40"
                  }`}
                />
                <span className="text-[11px] font-bold text-[#64748B]">
                  {isPlayerTurn ? "Your turn" : gameOver ? "Game over" : "Wait"}
                </span>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="p-5 sm:p-6 space-y-5">
              <div className="min-h-[52px]">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-1">
                  Status
                </p>
                <p className="text-base font-extrabold text-[#0B1528]">{status}</p>
              </div>

              <div>
                <p className="text-[12px] font-bold text-[#64748B] mb-2">Difficulty</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setDifficulty(k)}
                      className={`rounded-xl border px-2 py-2.5 text-xs font-extrabold transition-all ${
                        difficulty === k
                          ? "border-[#368AE4] bg-white/80 text-[#368AE4] shadow-sm"
                          : "border-white/70 bg-white/30 text-[#64748B] hover:bg-white/50"
                      }`}
                    >
                      {k[0].toUpperCase() + k.slice(1)}
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
                <Button
                  variant="ghost"
                  className="col-span-2 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={resign}
                  disabled={gameOver}
                >
                  <Flag className="h-4 w-4" /> Resign
                </Button>
              </div>

              {/* Reserve result box space so layout doesn't jump */}
              <div className="min-h-[76px]">
                {gameOver && result ? (
                  <div
                    className={`rounded-2xl p-4 border text-sm font-extrabold ${
                      result === "win"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : result === "draw"
                        ? "bg-white/60 border-white/80 text-[#0B1528]"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    Game over · {result.toUpperCase()}
                    <div className="mt-1 text-xs font-bold opacity-80">ELO now {rating}</div>
                  </div>
                ) : null}
              </div>
            </GlassCard>

            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-1.5 rounded-full bg-[#368AE4]" />
                  <p className="text-sm font-extrabold text-[#0B1528]">Move list</p>
                </div>
                <Badge variant="outline" className="normal-case tracking-normal">
                  {history.length} plies
                </Badge>
              </div>

              {/* Fixed height list: grows inside, page does not move */}
              <div className="h-64 overflow-y-auto overscroll-contain rounded-2xl bg-white/35 border border-white/60 p-3">
                {history.length === 0 ? (
                  <p className="text-xs font-medium text-[#64748B] py-6 text-center">
                    No moves yet — click a piece to see lights.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[36px_1fr_1fr] gap-2 rounded-lg px-2 py-1.5 text-xs font-mono text-[#0B1528] hover:bg-white/50"
                      >
                        <span className="text-[#64748B] font-sans font-bold">{i + 1}.</span>
                        <span className="font-semibold">{history[i * 2] || ""}</span>
                        <span className="font-semibold">{history[i * 2 + 1] || ""}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
