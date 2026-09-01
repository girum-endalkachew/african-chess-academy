"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Plus, Copy, PlayCircle, Clock } from "lucide-react";

export default function PlayFriendsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { full_name: user.email?.split("@")[0], chess_rating: 1200 });

    // Fetch open rooms
    const { data: openRooms } = await supabase
      .from("friend_games")
      .select("*")
      .eq("status", "waiting")
      .order("created_at", { ascending: false })
      .limit(20);
    setRooms(openRooms || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("friend_games_lobby")
      .on("postgres_changes", { event: "*", schema: "public", table: "friend_games" }, () => {
        load();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createRoom = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setCreating(true);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from("friend_games").insert({
      room_code: code,
      host_id: user.id,
      host_name: profile?.full_name || "Player",
      host_color: Math.random() > 0.5 ? "w" : "b",
      status: "waiting",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    }).select().single();

    setCreating(false);
    if (data) router.push(`/dashboard/friends/${data.id}`);
  };

  const joinByCode = async () => {
    if (!joinCode) return;
    const { data } = await supabase
      .from("friend_games")
      .select("id")
      .eq("room_code", joinCode.toUpperCase())
      .eq("status", "waiting")
      .maybeSingle();

    if (data) router.push(`/dashboard/friends/${data.id}`);
    else alert("Room not found or already in progress");
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" /></div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <GlassCard className="p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge variant="blue" className="mb-2">Multiplayer</Badge>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Play With Friends</h1>
            <p className="text-sm text-[#64748B] mt-1">Real-time chess matches. Create a room or join with a code.</p>
          </div>
          <Users className="h-10 w-10 text-[#368AE4] opacity-50" />
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-5">
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Create Room</h2>
          </div>
          <p className="text-xs text-[#64748B]">Generate a private room code to share with a friend.</p>
          <Button variant="primary" onClick={createRoom} disabled={creating} className="w-full h-12 rounded-2xl">
            <Plus className="h-4 w-4" /> {creating ? "Creating..." : "Create New Room"}
          </Button>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
            <h2 className="text-base font-extrabold text-[#0B1528]">Join Room</h2>
          </div>
          <p className="text-xs text-[#64748B]">Enter a room code from your friend to join their game.</p>
          <div className="flex gap-2">
            <Input placeholder="ROOM CODE" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} className="uppercase text-center font-mono font-bold" maxLength={6} />
            <Button variant="primary" onClick={joinByCode} className="rounded-2xl">Join</Button>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
          <h2 className="text-base font-extrabold text-[#0B1528]">Open Rooms</h2>
          <Badge variant="outline" className="normal-case tracking-normal ml-auto">{rooms.length} available</Badge>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-10">
            <Clock className="h-8 w-8 text-[#64748B] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0B1528]">No open rooms right now</p>
            <p className="text-xs text-[#64748B]">Create a room to start playing</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {rooms.map(r => (
              <Link key={r.id} href={`/dashboard/friends/${r.id}`}>
                <div className="rounded-2xl bg-white/50 border border-white/70 p-4 hover:bg-white/70 hover:-translate-y-0.5 transition cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-extrabold text-[#0B1528] text-sm">{r.host_name}</p>
                    <Badge variant="blue" className="font-mono">{r.room_code}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                    <span>Waiting for opponent</span>
                    <PlayCircle className="h-4 w-4 text-[#368AE4]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
