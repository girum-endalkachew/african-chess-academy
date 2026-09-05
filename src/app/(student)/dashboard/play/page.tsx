"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Chess, Move, Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBestMove } from "@/lib/chess/engine";
import { computeElo, type GameResult } from "@/lib/chess/elo";
import { COACHES, getCoach } from "@/lib/chess/coaches";
import { CHESS_THEMES, getTheme } from "@/lib/chess/themes";
import { cn } from "@/lib/utils";
import {
  RotateCcw, Lightbulb, Flag, Crown, Play, RefreshCw, Edit3,
  Palette, Settings, Volume2, VolumeX, Trophy, X
} from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-white/40 animate-pulse" />,
});

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function playMoveSound(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 500;
    gain.gain.value = 0.1;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

export default function PlayvsComputerPage() {
  const searchParams = useSearchParams();
  const customFen = searchParams.get("fen");
  const supabase = createClient();

  const [selectedCoach, setSelectedCoach] = useState(COACHES[0]);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [inSetup, setInSetup] = useState(!customFen);
  const [showSettings, setShowSettings] = useState(false);
  const [themeId, setThemeId] = useState("aca-blue");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [game, setGame] = useState(() => new Chess(customFen || START_FEN));
  const [fen, setFen] = useState(customFen || START_FEN);
  const [history, setHistory] = useState<Move[]>([]);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [hintSquare, setHintSquare] = useState<{ from: Square; to: Square } | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [endMessage, setEndMessage] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(1200);
  const [eloDelta, setEloDelta] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [winStreak, setWinStreak] = useState(0);

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  const theme = getTheme(themeId);

  useEffect(() => {
    const savedTheme = localStorage.getItem("aca_chess_theme");
    if (savedTheme) setThemeId(savedTheme);
    const savedSound = localStorage.getItem("aca_sound_enabled");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    const savedStreak = localStorage.getItem("aca_win_streak");
    if (savedStreak) setWinStreak(parseInt(savedStreak, 10));

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: prof } = await supabase.from("profiles").select("chess_rating").eq("id", user.id).maybeSingle();
        if (prof?.chess_rating) setUserRating(prof.chess_rating);
      }
    })();
  }, [supabase]);

  const saveTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem("aca_chess_theme", id);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("aca_sound_enabled", String(next));
  };

  const makeBotMove = useCallback((currentFen: string, currentGame: Chess) => {
    if (currentGame.isGameOver() || gameEnded) return;
    setIsBotThinking(true);
    setTimeout(() => {
      const best = getBestMove(currentFen, selectedCoach.id);
      if (best) {
        try {
          const move = currentGame.move({ from: best.from, to: best.to, promotion: best.promotion || "q" });
          if (move) {
            const nextFen = currentGame.fen();
            setGame(new Chess(nextFen));
            setFen(nextFen);
            setHistory((h) => [...h, move]);
            setLastMove({ from: best.from as Square, to: best.to as Square });
            setHintSquare(null);
            playMoveSound(soundEnabled);
          }
        } catch {}
      }
      setIsBotThinking(false);
    }, 400);
  }, [gameEnded, selectedCoach.id, soundEnabled]);

  const handleGameEnd = useCallback(async (result: GameResult, reason: string) => {
    if (gameEnded) return;
    setGameEnded(true);

    const { newRating, delta } = computeElo(userRating, selectedCoach.elo, result);
    setEloDelta(delta);
    setEndMessage(reason);

    if (result === "win") {
      const newStreak = winStreak + 1;
      setWinStreak(newStreak);
      localStorage.setItem("aca_win_streak", String(newStreak));
    } else {
      setWinStreak(0);
      localStorage.setItem("aca_win_streak", "0");
    }

    if (userId) {
      await supabase.from("profiles").update({ chess_rating: newRating }).eq("id", userId);
      await supabase.from("chess_games").insert({
        user_id: userId,
        opponent_type: "computer",
        bot_level: selectedCoach.id,
        result: result === "win" ? "win" : result === "draw" ? "draw" : "loss",
        user_color: playerColor,
        fen: game.fen(),
        rating_after: newRating,
      });
    }
  }, [gameEnded, userRating, selectedCoach.elo, selectedCoach.id, userId, playerColor, game, supabase, winStreak]);

  useEffect(() => {
    if (gameEnded || inSetup) return;

    if (game.isCheckmate()) {
      const winner = game.turn() === "w" ? "Black" : "White";
      const isUserWinner = (winner === "White" && playerColor === "w") || (winner === "Black" && playerColor === "b");
      handleGameEnd(isUserWinner ? "win" : "loss", `Checkmate! ${winner} wins.`);
    } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
      handleGameEnd("draw", "Game drawn by rules.");
    } else {
      const currentTurn = game.turn();
      const isBotTurn = (currentTurn === "w" && playerColor === "b") || (currentTurn === "b" && playerColor === "w");
      if (isBotTurn && !isBotThinking) {
        makeBotMove(fen, game);
      }
    }
  }, [fen, game, playerColor, isBotThinking, gameEnded, inSetup, makeBotMove, handleGameEnd]);

  const startGame = () => {
    const fresh = new Chess(START_FEN);
    setGame(fresh);
    setFen(START_FEN);
    setHistory([]);
    setGameEnded(false);
    setEndMessage(null);
    setEloDelta(null);
    setHintSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setInSetup(false);
    if (playerColor === "b") makeBotMove(START_FEN, fresh);
  };

  const onSquareClick = (square: Square) => {
    if (inSetup || gameEnded || isBotThinking) return;

    const currentTurn = game.turn();
    const isUserTurn = (currentTurn === "w" && playerColor === "w") || (currentTurn === "b" && playerColor === "b");
    if (!isUserTurn) return;

    if (selectedSquare && legalMoves.includes(square)) {
      tryMove(selectedSquare, square);
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === currentTurn) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }) as Move[];
      setLegalMoves(moves.map((m) => m.to as Square));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const tryMove = (from: Square, to: Square): boolean => {
    try {
      const move = game.move({ from, to, promotion: "q" });
      if (!move) return false;
      const nextFen = game.fen();
      setGame(new Chess(nextFen));
      setFen(nextFen);
      setHistory((h) => [...h, move]);
      setLastMove({ from, to });
      setHintSquare(null);
      setSelectedSquare(null);
      setLegalMoves([]);
      playMoveSound(soundEnabled);
      return true;
    } catch {
      return false;
    }
  };

  const onDrop = (source: string, target: string) => {
    if (inSetup || gameEnded || isBotThinking) return false;
    const currentTurn = game.turn();
    const isUserTurn = (currentTurn === "w" && playerColor === "w") || (currentTurn === "b" && playerColor === "b");
    if (!isUserTurn) return false;
    return tryMove(source as Square, target as Square);
  };

  const undoMove = () => {
    if (inSetup || history.length < 2 || isBotThinking) return;
    const g = new Chess(START_FEN);
    const newHist = history.slice(0, history.length - 2);
    newHist.forEach((m) => g.move(m));
    setGame(g);
    setFen(g.fen());
    setHistory(newHist);
    setHintSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(newHist.length > 0 ? { from: newHist[newHist.length - 1].from as Square, to: newHist[newHist.length - 1].to as Square } : null);
    setGameEnded(false);
  };

  const requestHint = () => {
    if (inSetup || gameEnded || isBotThinking) return;
    const best = getBestMove(fen, "hard");
    if (best) setHintSquare({ from: best.from as Square, to: best.to as Square });
  };

  const resign = () => {
    if (inSetup || gameEnded) return;
    if (confirm("Are you sure you want to resign?")) {
      handleGameEnd("loss", "You resigned the match.");
    }
  };

  const capturedByUser: string[] = [];
  const capturedByBot: string[] = [];
  history.forEach((m) => {
    if (m.captured) {
      const symbol = m.captured;
      if (m.color === playerColor) capturedByUser.push(symbol);
      else capturedByBot.push(symbol);
    }
  });

  const pieceSymbol = (p: string) => ({ p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" } as any)[p] || "";

  const customSquares: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    customSquares[lastMove.from] = { backgroundColor: theme.highlight };
    customSquares[lastMove.to] = { backgroundColor: theme.highlight };
  }
  if (selectedSquare) {
    customSquares[selectedSquare] = { backgroundColor: "rgba(54, 138, 228, 0.5)" };
  }
  legalMoves.forEach((sq) => {
    const isCapture = !!game.get(sq);
    customSquares[sq] = isCapture
      ? { background: "radial-gradient(circle, transparent 55%, rgba(220, 38, 38, 0.55) 60%)", borderRadius: "50%" }
      : { background: "radial-gradient(circle, rgba(54, 138, 228, 0.5) 22%, transparent 25%)" };
  });
  if (hintSquare) {
    customSquares[hintSquare.from] = { backgroundColor: "rgba(251, 191, 36, 0.7)" };
    customSquares[hintSquare.to] = { backgroundColor: "rgba(34, 197, 94, 0.7)" };
  }

  const orientation = playerColor === "w" ? "white" : "black";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Play vs Coach</h1>
            <Badge variant="blue">AI Match</Badge>
            {winStreak > 0 && (
              <Badge variant="warning" className="gap-1">
                <Trophy className="h-3 w-3" /> {winStreak} streak
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#64748B] font-medium">
            Face our academy coaches. Get hints, undo blunders, and climb the ELO ladder.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-extrabold">
            Your Rating: <span className="text-[#368AE4] ml-1">{userRating} ELO</span>
          </Badge>
          <Button variant="glass" size="sm" className="rounded-xl" onClick={() => setShowSettings(true)}>
            <Settings className="h-3.5 w-3.5" /> Settings
          </Button>
          {!inSetup && (
            <Button variant="glass" size="sm" className="rounded-xl" onClick={() => setInSetup(true)}>
              <RefreshCw className="h-3.5 w-3.5" /> New Match
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1528]/50 backdrop-blur-sm p-4" onClick={() => setShowSettings(false)}>
          <GlassCard className="p-6 max-w-lg w-full space-y-5 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#368AE4]" />
                <h2 className="text-base font-extrabold text-[#0B1528]">Board Settings</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className="h-8 w-8 rounded-lg text-[#64748B] hover:bg-white/60 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Board Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {CHESS_THEMES.map((t) => (
                  <button key={t.id} onClick={() => saveTheme(t.id)} className={cn("rounded-xl overflow-hidden border-2 transition text-left", themeId === t.id ? "border-[#368AE4] shadow-md" : "border-white/70 hover:border-[#368AE4]/50")}>
                    <div className="aspect-video" style={{ background: t.preview }} />
                    <div className="p-2 bg-white/70"><p className="text-[10px] font-extrabold text-[#0B1528]">{t.name}</p></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-white/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-[#0B1528]">Move Sound Effects</p>
                <p className="text-[10px] text-[#64748B] font-medium">Play a click when pieces move</p>
              </div>
              <Button variant={soundEnabled ? "primary" : "outline"} size="sm" className="rounded-xl" onClick={toggleSound}>
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                {soundEnabled ? "ON" : "OFF"}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* SETUP SCREEN */}
      {inSetup ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B1528] mb-3">1. Choose Your Opponent</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {COACHES.map((coach) => (
                <div
                  key={coach.id}
                  className={cn(
                    "relative overflow-hidden rounded-[20px] cursor-pointer transition-all duration-300",
                    selectedCoach.id === coach.id
                      ? "ring-2 ring-[#368AE4] shadow-[0_8px_30px_rgba(54,138,228,0.15)] scale-[1.02] bg-white/95"
                      : "border border-white/70 hover:bg-white/60 shadow-sm bg-white/45"
                  )}
                  onClick={() => setSelectedCoach(coach)}
                >
                  {/* Color Banner */}
                  <div className={cn("h-20 w-full relative border-b border-white/50", coach.headerBg)}>
                    <div className="absolute top-3 right-3">
                      <Badge variant={coach.badge} className="shadow-sm">{coach.elo} ELO</Badge>
                    </div>
                  </div>
                  {/* Floating Avatar */}
                  <div className="absolute top-7 left-5 h-20 w-20 rounded-2xl bg-white p-1 shadow-md border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coach.avatarUrl} alt={coach.name} className="w-full h-full object-cover rounded-xl bg-slate-50" />
                  </div>
                  {/* Content */}
                  <div className="pt-9 pb-5 px-5 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-[#0B1528] text-lg leading-tight">{coach.name}</h3>
                      <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">{coach.title}</p>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed min-h-[40px]">{coach.description}</p>
                    <div className="pt-3 border-t border-slate-100/80">
                      <p className="text-[11px] italic text-[#64748B] font-medium leading-snug">
                        "{coach.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#0B1528] mb-3">2. Pick Your Color</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <Button variant={playerColor === "w" ? "primary" : "outline"} className="h-14 rounded-2xl text-sm font-extrabold" onClick={() => setPlayerColor("w")}>
                ⚪ Play as White
              </Button>
              <Button variant={playerColor === "b" ? "primary" : "outline"} className="h-14 rounded-2xl text-sm font-extrabold" onClick={() => setPlayerColor("b")}>
                ⚫ Play as Black
              </Button>
            </div>
          </div>
          <Button variant="primary" className="h-14 px-8 rounded-2xl text-base font-extrabold shadow-lg" onClick={startGame}>
            <Play className="h-5 w-5" /> Start Match vs {selectedCoach.name}
          </Button>
        </div>
      ) : (
        /* LIVE GAME SCREEN */
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3">
            {/* Opponent Card */}
            <GlassCard className="p-4 flex items-center justify-between border-white/80">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-white shadow-sm ring-2 ring-slate-100 p-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedCoach.avatarUrl} alt={selectedCoach.name} className="w-full h-full object-cover rounded-lg bg-slate-50" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-[#0B1528] text-sm">{selectedCoach.name}</p>
                    <Badge variant={selectedCoach.badge}>{selectedCoach.elo}</Badge>
                  </div>
                  <p className="text-[10px] font-bold text-[#64748B]">
                    {isBotThinking ? "🤔 Thinking..." : "Waiting for your move"}
                  </p>
                  {capturedByBot.length > 0 && (
                    <div className="flex gap-0.5 mt-1 text-sm">
                      {capturedByBot.map((p, i) => <span key={i} className="text-[#0B1528] drop-shadow-sm">{pieceSymbol(p)}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Board */}
            <GlassCard className="p-3 sm:p-4 border-white/80">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#0B1528]/10">
                <Chessboard
                  id="aca-vs-computer-board"
                  position={fen}
                  boardOrientation={orientation}
                  onPieceDrop={onDrop}
                  onSquareClick={onSquareClick}
                  arePiecesDraggable={!gameEnded && !isBotThinking}
                  customSquareStyles={customSquares}
                  customLightSquareStyle={{ backgroundColor: theme.lightSquare }}
                  customDarkSquareStyle={{ backgroundColor: theme.darkSquare }}
                  customBoardStyle={{ borderRadius: "14px" }}
                  animationDuration={150}
                />
              </div>
              <p className="text-[10px] font-bold text-[#64748B] text-center mt-3">
                💡 Click a piece to see legal moves, then click a highlighted square to move
              </p>
            </GlassCard>

            {/* Your Card */}
            <GlassCard className="p-4 flex items-center justify-between border-white/80">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white flex items-center justify-center font-extrabold text-sm shadow-sm ring-2 ring-slate-100">
                  YOU
                </div>
                <div>
                  <p className="font-extrabold text-[#0B1528] text-sm">Your Account</p>
                  <p className="text-[10px] font-bold text-[#64748B]">{userRating} ELO · {history.length} moves</p>
                  {capturedByUser.length > 0 && (
                    <div className="flex gap-0.5 mt-1 text-sm">
                      {capturedByUser.map((p, i) => <span key={i} className="text-[#0B1528] drop-shadow-sm">{pieceSymbol(p)}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {gameEnded && (
              <GlassCard className="p-6 text-center space-y-3 bg-gradient-to-br from-[#368AE4]/10 to-transparent border-[#368AE4]/40">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-[#368AE4] text-white flex items-center justify-center shadow-md">
                  <Crown className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0B1528]">{endMessage}</h3>
                {eloDelta !== null && (
                  <Badge variant={eloDelta >= 0 ? "success" : "danger"} className="text-xs px-3 py-1 shadow-sm">
                    Rating: {eloDelta >= 0 ? `+${eloDelta}` : eloDelta} ELO
                  </Badge>
                )}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="primary" className="rounded-xl" onClick={startGame}>
                    <RotateCcw className="h-4 w-4" /> Rematch
                  </Button>
                  <Link href={`/dashboard/editor?fen=${encodeURIComponent(fen)}`}>
                    <Button variant="glass" className="rounded-xl w-full">
                      <Edit3 className="h-4 w-4" /> Analyze
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            )}

            <GlassCard className="p-5 space-y-3 border-white/80">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Game Controls</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="glass" className="rounded-xl bg-white/50" onClick={requestHint} disabled={gameEnded || isBotThinking}>
                  <Lightbulb className="h-4 w-4 text-amber-500" /> Get Hint
                </Button>
                <Button variant="glass" className="rounded-xl bg-white/50" onClick={undoMove} disabled={gameEnded || history.length < 2 || isBotThinking}>
                  <RotateCcw className="h-4 w-4" /> Takeback
                </Button>
              </div>
              <Button variant="outline" className="w-full rounded-xl text-red-600 hover:bg-red-50 bg-white/50" onClick={resign} disabled={gameEnded}>
                <Flag className="h-4 w-4" /> Resign Game
              </Button>
            </GlassCard>

            <GlassCard className="p-5 space-y-3 border-white/80">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Move History</p>
                <Badge variant="outline" className="text-[10px] bg-white/50">{history.length} moves</Badge>
              </div>
              <div className="max-h-48 overflow-y-auto font-mono text-xs space-y-1 divide-y divide-white/60 pr-2">
                {history.length === 0 ? (
                  <p className="text-[#64748B] text-center py-4 italic">No moves made yet.</p>
                ) : (
                  history.reduce((acc: any[], move, idx) => {
                    if (idx % 2 === 0) acc.push({ num: Math.floor(idx / 2) + 1, white: move.san, black: "" });
                    else acc[acc.length - 1].black = move.san;
                    return acc;
                  }, []).map((pair: any) => (
                    <div key={pair.num} className="grid grid-cols-3 pt-1.5 text-center font-bold">
                      <span className="text-[#64748B]">{pair.num}.</span>
                      <span className="text-[#0B1528]">{pair.white}</span>
                      <span className="text-[#368AE4]">{pair.black || "..."}</span>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
