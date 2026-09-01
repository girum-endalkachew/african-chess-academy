"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Chess, Square } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Users, Circle, Flag } from "lucide-react";

const Chessboard = dynamic(() => import("react-chessboard").then(m => m.Chessboard), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-white/40 animate-pulse" />
});

export default function FriendGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const router = useRouter();
  const supabase = createClient();

  const gameRef = useRef(new Chess());
  const [room, setRoom] = useState<any>(null);
  const [fen, setFen] = useState(gameRef.current.fen());
  const [myColor, setMyColor] = useState<"w" | "b" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load user + room
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUserId(user.id);

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setUserName(prof?.full_name || user.email?.split("@")[0] || "Player");

      const { data: roomData } = await supabase.from("friend_games").select("*").eq("id", gameId).single();
      if (!roomData) return router.push("/dashboard/friends");

      setRoom(roomData);
      gameRef.current.load(roomData.fen);
      setFen(roomData.fen);

      // Determine your color
      if (roomData.host_id === user.id) {
        setMyColor(roomData.host_color);
      } else if (roomData.guest_id === user.id) {
        setMyColor(roomData.host_color === "w" ? "b" : "w");
      } else if (roomData.status === "waiting") {
        // Join as guest
        const guestColor = roomData.host_color === "w" ? "b" : "w";
        await supabase.from("friend_games").update({
          guest_id: user.id,
          guest_name: prof?.full_name || "Player",
          status: "active"
        }).eq("id", gameId);
        setMyColor(guestColor);
      }
      setLoading(false);
    })();
  }, [gameId, router, supabase]);

  // Realtime sync
  useEffect(() => {
    if (!gameId) return;
    const channel = supabase
      .channel(`friend_game_${gameId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "friend_games", filter: `id=eq.${gameId}` }, (payload) => {
        const updated = payload.new as any;
        setRoom(updated);
        if (updated.fen !== gameRef.current.fen()) {
          gameRef.current.load(updated.fen);
          setFen(updated.fen);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [gameId, supabase]);

  const onDrop = useCallback((source: string, target: string) => {
    if (!myColor || !room) return false;
    if (gameRef.current.turn() !== myColor) return false;
    if (room.status !== "active") return false;

    const move = gameRef.current.move({ from: source as Square, to: target as Square, promotion: "q" });
    if (!move) return false;

    const newFen = gameRef.current.fen();
    setFen(newFen);

    let status = "active";
    if (gameRef.current.isCheckmate()) status = "checkmate";
    else if (gameRef.current.isDraw()) status = "draw";

    supabase.from("friend_games").update({
      fen: newFen,
      last_move: `${source}${target}`,
      status,
      updated_at: new Date().toISOString(),
    }).eq("id", gameId);

    return true;
  }, [myColor, room, gameId, supabase]);

  const copyCode = () => {
    navigator.clipboard.writeText(room?.room_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  const isMyTurn = myColor && gameRef.current.turn() === myColor && room?.status === "active";
  const opponent = myColor === room?.host_color ? room?.guest_name : room?.host_name;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/friends" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#64748B] hover:text-[#368AE4]">
          <ArrowLeft className="h-4 w-4" /> Back to Lobby
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">{room?.room_code}</Badge>
          <Button size="sm" variant="glass" onClick={copyCode}>
            <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-3">
          <GlassCard className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#0B1528] text-white font-extrabold flex items-center justify-center">
                {(opponent || "W").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#0B1528]">{opponent || "Waiting for opponent..."}</p>
                <p className="text-[11px] text-[#64748B]">{myColor === "w" ? "Black" : "White"}</p>
              </div>
            </div>
            <Circle className={`h-2.5 w-2.5 fill-current ${!isMyTurn && room?.status === "active" ? "text-emerald-500" : "text-[#64748B]/40"}`} />
          </GlassCard>

          <GlassCard className="p-3">
            <Chessboard
              id="friend-game"
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={myColor === "b" ? "black" : "white"}
              arePiecesDraggable={!!isMyTurn}
              customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
              customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
              customBoardStyle={{ borderRadius: "16px", overflow: "hidden" }}
            />
          </GlassCard>

          <GlassCard className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white font-extrabold flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#0B1528]">{userName}</p>
                <p className="text-[11px] text-[#64748B]">{myColor === "w" ? "White" : "Black"}</p>
              </div>
            </div>
            <Circle className={`h-2.5 w-2.5 fill-current ${isMyTurn ? "text-emerald-500" : "text-[#64748B]/40"}`} />
          </GlassCard>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2">Status</p>
            <p className="text-lg font-extrabold text-[#0B1528]">
              {room?.status === "waiting" ? "Waiting for opponent" :
               room?.status === "checkmate" ? `Checkmate! ${gameRef.current.turn() === myColor ? "You lost" : "You won"}` :
               room?.status === "draw" ? "Draw" :
               isMyTurn ? "Your move" : `${opponent}'s turn`}
            </p>
          </GlassCard>

          {room?.status === "waiting" && (
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#368AE4]" />
                <p className="text-sm font-extrabold text-[#0B1528]">Share Room</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/50 border border-white/70">
                <p className="font-mono text-2xl font-extrabold text-[#0B1528] tracking-widest">{room?.room_code}</p>
                <p className="text-[10px] text-[#64748B] mt-1">Share this code with a friend</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
