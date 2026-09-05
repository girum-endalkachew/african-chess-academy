"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Chess, Move, Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentLoader } from "@/components/ui/content-loader";
import { getBestMove, type Difficulty } from "@/lib/chess/engine";
import { computeElo, opponentRating, type GameResult } from "@/lib/chess/elo";
import { cn } from "@/lib/utils";
import {
  Swords, RotateCcw, Lightbulb, Flag, Handshake, Crown, Sparkles,
  ArrowRight, ShieldAlert, CheckCircle2, Play, Users, Bot, RefreshCw, Edit3
} from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-white/40 animate-pulse" />,
});

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

type BotProfile = {
  id: Difficulty;
  name: string;
  title: string;
  elo: number;
  avatar: string;
  description: string;
  colorBg: string;
  badge: "success" | "blue" | "warning";
};

const BOTS: BotProfile[] = [
  {
    id: "easy",
    name: "Kofi the Cub",
    title: "Beginner Bot",
    elo: 800,
    avatar: "🦁",
    description: "Forgiving AI that makes occasional tactical blunders. Great for practice!",
    colorBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    badge: "success",
  },
  {
    id: "medium",
    name: "Zara the Owl",
    title: "Club Player",
    elo: 1500,
    avatar: "🦉",
    description: "Solid, balanced play. Develops pieces well but misses deep combinations.",
    colorBg: "bg-[#EEF3FA] border-[#DBE9F7] text-[#368AE4]",
    badge: "blue",
  },
  {
    id: "hard",
    name: "Master Engine",
    title: "Grandmaster AI",
    elo: 2200,
    avatar: "👑",
    description: "Deep Stockfish calculation. Punishes every inaccuracy relentlessly.",
    colorBg: "bg-amber-50 border-amber-200 text-amber-800",
    badge: "warning",
  },
];

export default function PlayvsComputerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customFen = searchParams.get("fen");
  const supabase = createClient();

  // Setup state
  const [selectedBot, setSelectedBot] = useState<BotProfile>(BOTS[0]);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [inSetup, setInSetup] = useState(!customFen);

  // Game state
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

  // Load User ELO
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: prof } = await supabase.from("profiles").select("chess_rating").eq("id", user.id).maybeSingle();
        if (prof?.chess_rating) setUserRating(prof.chess_rating);
      }
    })();
  }, [supabase]);

  // Bot move trigger
  const makeBotMove = useCallback((currentFen: string, currentGame: Chess) => {
    if (currentGame.isGameOver() || gameEnded) return;

    setIsBotThinking(true);
    setTimeout(() => {
      const best = getBestMove(currentFen, selectedBot.id);
      if (best) {
        try {
          const move = currentGame.move({ from: best.from, to: best.to, promotion: best.promotion || "q" });
          if (move) {
            const nextFen = currentGame.fen();
            setGame(new Chess(nextFen));
            setFen(nextFen);
            setHistory((h) => [...h, move]);
            setHintSquare(null);
          }
        } catch {}
      }
      setIsBotThinking(false);
    }, 400);
  }, [gameEnded, selectedBot.id]);

  // Handle game end & ELO computation
  const handleGameEnd = useCallback(async (result: GameResult, reason: string) => {
    if (gameEnded) return;
    setGameEnded(true);

    const { newRating, delta } = computeElo(userRating, selectedBot.elo, result);
    setEloDelta(delta);
    setEndMessage(reason);

    if (userId) {
      // Update user ELO
      await supabase.from("profiles").update({ chess_rating: newRating }).eq("id", userId);
      // Save game to history
      await supabase.from("chess_games").insert({
        user_id: userId,
        opponent_type: "computer",
        bot_level: selectedBot.id,
        result: result === "win" ? "win" : result === "draw" ? "draw" : "loss",
        user_color: playerColor,
        fen: game.fen(),
        rating_after: newRating,
      });
    }
  }, [gameEnded, userRating, selectedBot.elo, selectedBot.id, userId, playerColor, game, supabase]);

  // Check checkmate / draw after every move
  useEffect(() => {
    if (gameEnded || inSetup) return;

    if (game.isCheckmate()) {
      const winner = game.turn() === "w" ? "Black" : "White";
      const isUserWinner = (winner === "White" && playerColor === "w") || (winner === "Black" && playerColor === "b");
      handleGameEnd(isUserWinner ? "win" : "loss", `Checkmate! ${winner} wins.`);
    } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
      handleGameEnd("draw", "Game drawn by rules.");
    } else {
      // If it's bot's turn, trigger bot move
      const currentTurn = game.turn();
      const isBotTurn = (currentTurn === "w" && playerColor === "b") || (currentTurn === "b" && playerColor === "w");
      if (isBotTurn && !isBotThinking) {
        makeBotMove(fen, game);
      }
    }
  }, [fen, game, playerColor, isBotThinking, gameEnded, inSetup, makeBotMove, handleGameEnd]);

  // Start match
  const startGame = () => {
    const fresh = new Chess(START_FEN);
    setGame(fresh);
    setFen(START_FEN);
    setHistory([]);
    setGameEnded(false);
    setEndMessage(null);
    setEloDelta(null);
    setHintSquare(null);
    setInSetup(false);

    // If player chose Black, bot moves first
    if (playerColor === "b") {
      makeBotMove(START_FEN, fresh);
    }
  };

  // Player piece drop
  const onDrop = (source: string, target: string) => {
    if (inSetup || gameEnded || isBotThinking) return false;

    const currentTurn = game.turn();
    const isUserTurn = (currentTurn === "w" && playerColor === "w") || (currentTurn === "b" && playerColor === "b");
    if (!isUserTurn) return false;

    try {
      const move = game.move({ from: source, to: target, promotion: "q" });
      if (!move) return false;

      const nextFen = game.fen();
      setGame(new Chess(nextFen));
      setFen(nextFen);
      setHistory((h) => [...h, move]);
      setHintSquare(null);
      return true;
    } catch {
      return false;
    }
  };

  // Undo move
  const undoMove = () => {
    if (inSetup || history.length < 2 || isBotThinking) return;
    const g = new Chess(START_FEN);
    const newHist = history.slice(0, history.length - 2);
    newHist.forEach((m) => g.move(m));
    setGame(g);
    setFen(g.fen());
    setHistory(newHist);
    setHintSquare(null);
    setGameEnded(false);
  };

  // Hint
  const requestHint = () => {
    if (inSetup || gameEnded || isBotThinking) return;
    const best = getBestMove(fen, "hard");
    if (best) {
      setHintSquare({ from: best.from as Square, to: best.to as Square });
    }
  };

  // Resign
  const resign = () => {
    if (inSetup || gameEnded) return;
    if (confirm("Are you sure you want to resign?")) {
      handleGameEnd("loss", "You resigned the match.");
    }
  };

  // Custom square styles for hints and last moves
  const customSquares: Record<string, React.CSSProperties> = {};
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
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Play vs Computer</h1>
            <Badge variant="blue">AI Match</Badge>
          </div>
          <p className="text-xs text-[#64748B] font-medium">
            Train against custom bot personalities, get hints, and improve your ELO rating.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-extrabold">
            Your Rating: <span className="text-[#368AE4] ml-1">{userRating} ELO</span>
          </Badge>
          {!inSetup && (
            <Button variant="glass" size="sm" className="rounded-xl" onClick={() => setInSetup(true)}>
              <RefreshCw className="h-3.5 w-3.5" /> Change Bot
            </Button>
          )}
        </div>
      </GlassCard>

      {/* SETUP SCREEN */}
      {inSetup ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#0B1528] mb-3">1. Select Opponent Bot</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {BOTS.map((bot) => (
                <GlassCard
                  key={bot.id}
                  className={cn(
                    "p-6 space-y-3 cursor-pointer transition-all border-2",
                    selectedBot.id === bot.id
                      ? "border-[#368AE4] bg-white/90 shadow-md scale-[1.02]"
                      : "border-white/70 hover:bg-white/60"
                  )}
                  onClick={() => setSelectedBot(bot)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{bot.avatar}</div>
                    <Badge variant={bot.badge}>{bot.elo} ELO</Badge>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0B1528] text-base">{bot.name}</h3>
                    <p className="text-[10px] font-bold text-[#64748B] uppercase">{bot.title}</p>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">{bot.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#0B1528] mb-3">2. Choose Your Color</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <Button
                variant={playerColor === "w" ? "primary" : "outline"}
                className="h-14 rounded-2xl text-sm font-extrabold"
                onClick={() => setPlayerColor("w")}
              >
                ⚪ Play as White (First move)
              </Button>
              <Button
                variant={playerColor === "b" ? "primary" : "outline"}
                className="h-14 rounded-2xl text-sm font-extrabold"
                onClick={() => setPlayerColor("b")}
              >
                ⚫ Play as Black (Second move)
              </Button>
            </div>
          </div>

          <Button variant="primary" className="h-14 px-8 rounded-2xl text-base font-extrabold shadow-lg" onClick={startGame}>
            <Play className="h-5 w-5" /> Start Match vs {selectedBot.name}
          </Button>
        </div>
      ) : (
        /* LIVE GAME SCREEN */
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Board Column */}
          <div className="lg:col-span-7 space-y-3">
            {/* Top Bot Card */}
            <GlassCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedBot.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-[#0B1528] text-sm">{selectedBot.name}</p>
                    <Badge variant={selectedBot.badge}>{selectedBot.elo} ELO</Badge>
                  </div>
                  <p className="text-[10px] font-bold text-[#64748B]">
                    {isBotThinking ? "🤔 Thinking..." : "Waiting for turn"}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Chessboard */}
            <GlassCard className="p-3 sm:p-4">
              <div className="rounded-2xl overflow-hidden shadow-md">
                <Chessboard
                  id="aca-vs-computer-board"
                  position={fen}
                  boardOrientation={orientation}
                  onPieceDrop={onDrop}
                  arePiecesDraggable={!gameEnded && !isBotThinking}
                  customSquareStyles={customSquares}
                  customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
                  customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
                  customBoardStyle={{ borderRadius: "14px" }}
                  animationDuration={150}
                />
              </div>
            </GlassCard>

            {/* Bottom Player Card */}
            <GlassCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#368AE4] text-white flex items-center justify-center font-extrabold text-sm">
                  YOU
                </div>
                <div>
                  <p className="font-extrabold text-[#0B1528] text-sm">Your Account</p>
                  <p className="text-[10px] font-bold text-[#64748B]">{userRating} ELO</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Side Panel Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Game Result Banner */}
            {gameEnded && (
              <GlassCard className="p-6 text-center space-y-3 bg-gradient-to-br from-[#368AE4]/10 to-transparent border-[#368AE4]/40">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-[#368AE4] text-white flex items-center justify-center">
                  <Crown className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0B1528]">{endMessage}</h3>
                {eloDelta !== null && (
                  <Badge variant={eloDelta >= 0 ? "success" : "danger"} className="text-xs px-3 py-1">
                    Rating Change: {eloDelta >= 0 ? `+${eloDelta}` : eloDelta} ELO
                  </Badge>
                )}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="primary" className="rounded-xl" onClick={startGame}>
                    <RotateCcw className="h-4 w-4" /> Rematch
                  </Button>
                  <Link href={`/dashboard/editor?fen=${encodeURIComponent(fen)}`}>
                    <Button variant="glass" className="rounded-xl w-full">
                      <Edit3 className="h-4 w-4" /> Analyze Position
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            )}

            {/* In-Game Actions */}
            <GlassCard className="p-5 space-y-3">
              <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Game Controls</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="glass" className="rounded-xl" onClick={requestHint} disabled={gameEnded || isBotThinking}>
                  <Lightbulb className="h-4 w-4 text-amber-500" /> Get Hint
                </Button>
                <Button variant="glass" className="rounded-xl" onClick={undoMove} disabled={gameEnded || history.length < 2 || isBotThinking}>
                  <RotateCcw className="h-4 w-4" /> Takeback Move
                </Button>
              </div>
              <Button variant="outline" className="w-full rounded-xl text-red-600 hover:bg-red-50" onClick={resign} disabled={gameEnded}>
                <Flag className="h-4 w-4" /> Resign Game
              </Button>
            </GlassCard>

            {/* Move History */}
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Move History</p>
                <Badge variant="outline" className="text-[10px]">{history.length} moves</Badge>
              </div>
              <div className="max-h-48 overflow-y-auto font-mono text-xs space-y-1 divide-y divide-white/60">
                {history.length === 0 ? (
                  <p className="text-[#64748B] text-center py-4 italic">No moves made yet.</p>
                ) : (
                  history.reduce((acc: any[], move, idx) => {
                    if (idx % 2 === 0) {
                      acc.push({ num: Math.floor(idx / 2) + 1, white: move.san, black: "" });
                    } else {
                      acc[acc.length - 1].black = move.san;
                    }
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
