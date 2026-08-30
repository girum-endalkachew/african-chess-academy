"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Chess, Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { PortalShell, NavItem } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Difficulty, getBestMove } from "@/lib/chess/engine";
import { computeElo, opponentRating, GameResult } from "@/lib/chess/elo";
import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings, Swords, RotateCcw, Flag, Cpu, TrendingUp, Sparkles, Loader2
} from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-slate-100 animate-pulse" />,
});

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/play", label: "Play Computer", icon: Swords },
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
  const [fen, setFen] = useState(gameRef.current.fen());
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

  const syncBoard = useCallback(() => {
    setFen(gameRef.current.fen());
    setHistory(gameRef.current.history());
  }, []);

  const finishGame = useCallback(async (r: GameResult) => {
    setGameOver(true);
    setResult(r);
    setThinking(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
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
    } catch (e) {
      // safe fallback
    }
  }, [difficulty, playerColor, rating, supabase]);

  const checkGameEnd = useCallback(() => {
    const g = gameRef.current;
    if (g.isCheckmate()) {
      const r = g.turn() === playerColor ? "loss" : "win";
      finishGame(r);
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

    // Asynchronous execution so main UI never freezes
    setTimeout(() => {
      const best = getBestMove(g.fen(), difficulty);
      if (best) {
        g.move({ from: best.from, to: best.to, promotion: best.promotion || "q" });
      }

      syncBoard();
      setThinking(false);

      if (!checkGameEnd()) {
        setStatus(`Your move (${playerColor === "w" ? "White" : "Black"})`);
      }
    }, 150);
  }, [difficulty, playerColor, syncBoard, checkGameEnd]);

  const onDrop = useCallback((source: string, target: string) => {
    if (thinking || gameOver) return false;
    const g = gameRef.current;
    if (g.turn() !== playerColor) return false;

    const move = g.move({
      from: source as Square,
      to: target as Square,
      promotion: "q",
    });

    if (!move) return false;

    syncBoard();

    if (!checkGameEnd()) {
      triggerComputerMove();
    }

    return true;
  }, [thinking, gameOver, playerColor, syncBoard, checkGameEnd, triggerComputerMove]);

  const startNewGame = (asColor: PlayerColor) => {
    gameRef.current = new Chess();
    setPlayerColor(asColor);
    setOrientation(asColor === "w" ? "white" : "black");
    setGameOver(false);
    setResult(null);
    setLastDelta(null);
    setThinking(false);
    syncBoard();

    if (asColor === "b") {
      setStatus("Computer is thinking (White)...");
      setTimeout(() => {
        triggerComputerMove();
      }, 200);
    } else {
      setStatus("Your move (White)");
    }
  };

  const resign = () => {
    if (gameOver) return;
    finishGame("resign");
    setStatus("You resigned");
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalShell role="Student" userName={profile?.full_name || "Player"} navItems={navItems}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Play vs Computer</h1>
            <p className="text-sm text-slate-500 mt-1">Real chess game with dynamic ELO updates.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="gap-1"><TrendingUp className="h-3.5 w-3.5" /> {rating} ELO</Badge>
            {lastDelta !== null && (
              <Badge variant={lastDelta >= 0 ? "success" : "warning"}>
                {lastDelta >= 0 ? `+${lastDelta}` : lastDelta}
              </Badge>
            )}
          </div>
        </div>

        {/* TOP COMPUTER THINKING BANNER */}
        {thinking && (
          <div className="bg-[#00A3E0] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-bold text-sm">Computer is calculating next move...</span>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-xs">AI Active</Badge>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white border border-[#DBE9F7] rounded-2xl p-3 sm:p-4 shadow-sm">
            <Chessboard
              id="aca-play-board"
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={orientation}
              arePiecesDraggable={!thinking && !gameOver && gameRef.current.turn() === playerColor}
              customLightSquareStyle={{ backgroundColor: "#E6F5FF" }}
              customDarkSquareStyle={{ backgroundColor: "#53B4E0" }}
              customBoardStyle={{ borderRadius: "12px", overflow: "hidden" }}
              animationDuration={200}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#DBE9F7] rounded-2xl p-5 space-y-4 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <p className="text-base font-bold text-[#1E293B]">{status}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Difficulty</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setDifficulty(k)}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold ${
                        difficulty === k
                          ? "border-[#00A3E0] bg-[#E6F5FF] text-[#00A3E0]"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {k[0].toUpperCase() + k.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button type="button" className="rounded-xl gap-2 font-semibold" onClick={() => startNewGame("w")}>
                  <RotateCcw className="h-4 w-4" /> Play as White
                </Button>
                <Button type="button" variant="outline" className="rounded-xl gap-2 font-semibold" onClick={() => startNewGame("b")}>
                  Play as Black
                </Button>
                <Button type="button" variant="outline" className="rounded-xl gap-2 text-red-600 hover:bg-red-50 col-span-2" onClick={resign} disabled={gameOver}>
                  <Flag className="h-4 w-4" /> Resign Game
                </Button>
              </div>

              {gameOver && result && (
                <div className={`rounded-xl p-3 border text-sm font-semibold ${
                  result === "win"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : result === "draw"
                    ? "bg-slate-50 border-slate-200 text-slate-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  Game Over · {result.toUpperCase()} · ELO Rating: {rating}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#DBE9F7] rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Moves History</p>
              <div className="max-h-48 overflow-y-auto text-sm font-mono text-slate-700 space-y-1">
                {history.length === 0 && <p className="text-slate-400 font-sans text-xs">No moves played yet.</p>}
                {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[32px_1fr_1fr] gap-2 text-xs">
                    <span className="text-slate-400">{i + 1}.</span>
                    <span>{history[i * 2] || ""}</span>
                    <span>{history[i * 2 + 1] || ""}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}