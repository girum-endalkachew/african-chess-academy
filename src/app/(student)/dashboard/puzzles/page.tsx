"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Chess, Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentLoader } from "@/components/ui/content-loader";
import { PUZZLE_BANK, getPuzzleForRating, type Puzzle } from "@/lib/puzzles/bank";
import { cn } from "@/lib/utils";
import { Puzzle as PuzzleIcon, Lightbulb, SkipForward, Trophy, Flame, Target, CheckCircle2, XCircle, Share2 } from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-white/40 animate-pulse" />,
});

export default function PuzzlesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Player");
  const [rating, setRating] = useState(1200);
  const [totalSolved, setTotalSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [game, setGame] = useState<Chess | null>(null);
  const [fen, setFen] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [sharing, setSharing] = useState(false);
  const [sessionSolved, setSessionSolved] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: prof } = await supabase.from("profiles").select("full_name, puzzle_rating, puzzles_solved").eq("id", user.id).maybeSingle();
      if (prof) {
        setUserName(prof.full_name || "Player");
        setRating(prof.puzzle_rating || 1200);
        setTotalSolved(prof.puzzles_solved || 0);
      }
      loadNextPuzzle(prof?.puzzle_rating || 1200, []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextPuzzle = (r: number, exclude: string[]) => {
    const next = getPuzzleForRating(r, exclude);
    if (!next) return;
    setPuzzle(next);
    setGame(new Chess(next.fen));
    setFen(next.fen);
    setFeedback(null);
    setShowHint(false);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const skipPuzzle = () => {
    if (!puzzle) return;
    const newSeen = [...seenIds, puzzle.id];
    setSeenIds(newSeen);
    loadNextPuzzle(rating, newSeen);
  };

  const handleWrong = async () => {
    setFeedback("wrong");
    setStreak(0);
    const newRating = Math.max(600, rating - 15);
    setRating(newRating);
    if (userId && puzzle) {
      await supabase.from("puzzle_attempts").insert({ user_id: userId, puzzle_id: puzzle.id, solved: false, rating_after: newRating });
      await supabase.from("profiles").update({ puzzle_rating: newRating }).eq("id", userId);
    }
  };

  const handleCorrect = async () => {
    if (!puzzle || !userId) return;
    setFeedback("correct");
    const newStreak = streak + 1;
    const newSolved = totalSolved + 1;
    const newRating = rating + 20;
    setStreak(newStreak);
    setTotalSolved(newSolved);
    setSessionSolved((s) => s + 1);
    setRating(newRating);
    await supabase.from("puzzle_attempts").insert({ user_id: userId, puzzle_id: puzzle.id, solved: true, rating_after: newRating });
    await supabase.from("profiles").update({ puzzle_rating: newRating, puzzles_solved: newSolved }).eq("id", userId);
  };

  const onSquareClick = (square: Square) => {
    if (!game || !puzzle || feedback) return;
    if (game.turn() !== puzzle.playerColor) return;

    if (selectedSquare && legalMoves.includes(square)) {
      tryMove(selectedSquare, square);
      return;
    }
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map((m: any) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const tryMove = (from: Square, to: Square): boolean => {
    if (!game || !puzzle) return false;
    try {
      const move = game.move({ from, to, promotion: "q" });
      if (!move) return false;
      const uci = `${from}${to}`;
      setFen(game.fen());
      setSelectedSquare(null);
      setLegalMoves([]);
      if (uci === puzzle.solution) handleCorrect();
      else handleWrong();
      return true;
    } catch { return false; }
  };

  const onDrop = (source: string, target: string) => {
    if (!game || !puzzle || feedback) return false;
    if (game.turn() !== puzzle.playerColor) return false;
    return tryMove(source as Square, target as Square);
  };

  const shareToFeed = async () => {
    if (!userId || sessionSolved === 0) return;
    setSharing(true);
    await supabase.from("community_posts").insert({
      user_id: userId,
      user_name: userName,
      content: `Just solved ${sessionSolved} puzzle${sessionSolved > 1 ? "s" : ""} in a row! My Puzzle Rating: ${rating} 🧩`,
      post_type: "puzzle",
      metadata: { rating, solved: sessionSolved, streak },
    });
    setSharing(false);
    alert("Shared to Community Feed!");
  };

  if (loading) return <ContentLoader label="Loading puzzles..." />;
  if (!puzzle) return <div className="text-center py-20 text-[#64748B]">No puzzles available.</div>;

  const customSquares: Record<string, React.CSSProperties> = {};
  if (selectedSquare) customSquares[selectedSquare] = { backgroundColor: "rgba(54,138,228,0.5)" };
  legalMoves.forEach((sq) => {
    customSquares[sq] = { background: "radial-gradient(circle, rgba(54,138,228,0.5) 22%, transparent 25%)" };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge variant="blue" className="mb-2">Puzzle Trainer</Badge>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Tactical Puzzles</h1>
            <p className="text-sm text-[#64748B] mt-1">Solve to raise your Puzzle Rating and improve tactics.</p>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 rounded-2xl bg-white/60 border border-white/80">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Rating</p>
              <p className="text-xl font-extrabold text-[#368AE4]">{rating}</p>
            </div>
            <div className="text-center px-4 py-2 rounded-2xl bg-white/60 border border-white/80">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Streak</p>
              <p className="text-xl font-extrabold text-amber-500 flex items-center gap-1"><Flame className="h-4 w-4" />{streak}</p>
            </div>
            <div className="text-center px-4 py-2 rounded-2xl bg-white/60 border border-white/80">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Solved</p>
              <p className="text-xl font-extrabold text-emerald-600">{totalSolved}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <GlassCard className="p-3 sm:p-4 space-y-3">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <Chessboard
                id="puzzle-board"
                position={fen}
                boardOrientation={puzzle.playerColor === "w" ? "white" : "black"}
                onPieceDrop={onDrop}
                onSquareClick={onSquareClick}
                arePiecesDraggable={!feedback}
                customSquareStyles={customSquares}
                customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
                customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
                customBoardStyle={{ borderRadius: "14px" }}
                animationDuration={150}
              />
            </div>
            <p className="text-[11px] font-bold text-[#64748B] text-center">
              {puzzle.playerColor === "w" ? "⚪ White to move" : "⚫ Black to move"} · Click a piece to see legal moves
            </p>
          </GlassCard>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="accent">{puzzle.theme}</Badge>
              <Badge variant="outline">Rating: {puzzle.rating}</Badge>
            </div>
            <h2 className="text-lg font-extrabold text-[#0B1528]">Find the best move</h2>
            <p className="text-xs text-[#64748B]">Analyze the position and make the winning move.</p>

            {showHint && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs font-bold text-amber-800 flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" /> {puzzle.hint}
                </p>
              </div>
            )}

            {feedback === "correct" && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <p className="text-sm font-extrabold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Correct! +20 rating
                </p>
                <Button variant="primary" className="w-full rounded-xl" onClick={skipPuzzle}>
                  <SkipForward className="h-4 w-4" /> Next Puzzle
                </Button>
              </div>
            )}

            {feedback === "wrong" && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <p className="text-sm font-extrabold text-red-700 flex items-center gap-2">
                  <XCircle className="h-4 w-4" /> Wrong move! -15 rating
                </p>
                <Button variant="outline" className="w-full rounded-xl" onClick={skipPuzzle}>
                  <SkipForward className="h-4 w-4" /> Try Next Puzzle
                </Button>
              </div>
            )}

            {!feedback && (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="glass" className="rounded-xl" onClick={() => setShowHint(true)} disabled={showHint}>
                  <Lightbulb className="h-4 w-4" /> Hint
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={skipPuzzle}>
                  <SkipForward className="h-4 w-4" /> Skip
                </Button>
              </div>
            )}
          </GlassCard>

          {sessionSolved > 0 && (
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-extrabold text-[#0B1528]">Session Progress</p>
              </div>
              <p className="text-xs text-[#64748B]">Solved <b className="text-[#0B1528]">{sessionSolved}</b> puzzles this session!</p>
              <Button variant="primary" className="w-full rounded-xl" onClick={shareToFeed} disabled={sharing}>
                <Share2 className="h-4 w-4" /> {sharing ? "Sharing..." : "Share to Community Feed"}
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
