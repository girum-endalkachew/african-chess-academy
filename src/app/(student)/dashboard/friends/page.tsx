"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ContentLoader } from "@/components/ui/content-loader";
import { cn } from "@/lib/utils";
import {
  Users, Plus, PlayCircle, Clock, Swords, Search, UserPlus,
  Check, X, UserCheck, UserX, Gamepad2
} from "lucide-react";

type Friendship = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: "pending" | "accepted";
  friend_id: string; // derived
  friend_name: string; // derived
  friend_elo: number; // derived
  is_requester: boolean; // derived
};

type ProfileHit = {
  id: string;
  full_name: string;
  chess_rating: number;
};

export default function PlayFriendsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"play" | "friends" | "search">("play");

  // Play Tab
  const [rooms, setRooms] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  // Social Tab
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const loadBase = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(prof || { id: user.id, full_name: user.email?.split("@")[0], chess_rating: 1200 });

    await Promise.all([loadRooms(), loadFriendships(user.id)]);
    setLoading(false);
  };

  const loadRooms = async () => {
    const { data } = await supabase
      .from("friend_games")
      .select("*")
      .eq("status", "waiting")
      .order("created_at", { ascending: false })
      .limit(20);
    setRooms(data || []);
  };

  const loadFriendships = async (myId: string) => {
    const { data: rels } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${myId},receiver_id.eq.${myId}`);
      
    if (!rels || rels.length === 0) {
      setFriendships([]);
      return;
    }

    // Fetch profiles for the other person
    const otherIds = rels.map(r => r.requester_id === myId ? r.receiver_id : r.requester_id);
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, chess_rating")
      .in("id", otherIds);

    const profMap = new Map((profs || []).map(p => [p.id, p]));

    const mapped: Friendship[] = rels.map(r => {
      const isReq = r.requester_id === myId;
      const fId = isReq ? r.receiver_id : r.requester_id;
      const fProf = profMap.get(fId);
      return {
        ...r,
        friend_id: fId,
        friend_name: fProf?.full_name || "Unknown",
        friend_elo: fProf?.chess_rating || 1200,
        is_requester: isReq
      };
    });

    setFriendships(mapped);
  };

  useEffect(() => { loadBase(); }, []);

  // Supabase Realtime (Rooms + Presence)
  useEffect(() => {
    if (!profile?.id) return;

    // 1. Rooms listener
    const roomChan = supabase
      .channel("friend_games_lobby")
      .on("postgres_changes", { event: "*", schema: "public", table: "friend_games" }, () => {
        loadRooms();
      })
      .subscribe();

    // 2. Presence listener (Online Status)
    const presenceChan = supabase.channel("aca_global_presence");
    
    presenceChan
      .on("presence", { event: "sync" }, () => {
        const state = presenceChan.presenceState();
        const onlineIds = new Set<string>();
        for (const key in state) {
          state[key].forEach((s: any) => { if (s.user_id) onlineIds.add(s.user_id); });
        }
        setOnlineUsers(onlineIds);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChan.track({ user_id: profile.id, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(roomChan);
      supabase.removeChannel(presenceChan);
    };
  }, [profile?.id]);

  // --- PLAY FUNCTIONS ---
  const createRoom = async () => {
    setCreating(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from("friend_games").insert({
      room_code: code,
      host_id: profile.id,
      host_name: profile.full_name,
      host_color: Math.random() > 0.5 ? "w" : "b",
      status: "waiting",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      host_time_ms: 10 * 60 * 1000,
      guest_time_ms: 10 * 60 * 1000,
    }).select().single();
    setCreating(false);
    if (data) router.push(`/dashboard/friends/${data.id}`);
  };

  const joinByCode = async () => {
    if (!joinCode) return;
    const { data } = await supabase.from("friend_games").select("id").eq("room_code", joinCode.toUpperCase()).eq("status", "waiting").maybeSingle();
    if (data) router.push(`/dashboard/friends/${data.id}`);
    else alert("Room not found or already active.");
  };

  const directChallenge = async (friendId: string) => {
    alert("Direct challenge notification system coming in Part 2! For now, create a room and send them the code.");
    setActiveTab("play");
  };

  // --- SOCIAL FUNCTIONS ---
  const searchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    
    // Search profiles (ignoring self)
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, chess_rating")
      .neq("id", profile.id)
      .ilike("full_name", `%${searchQuery}%`)
      .limit(10);
      
    setSearchResults(data || []);
    setSearching(false);
  };

  const sendRequest = async (receiverId: string) => {
    await supabase.from("friendships").insert({
      requester_id: profile.id,
      receiver_id: receiverId,
      status: "pending"
    });
    await loadFriendships(profile.id);
  };

  const acceptRequest = async (id: string) => {
    await supabase.from("friendships").update({ status: "accepted" }).eq("id", id);
    await loadFriendships(profile.id);
  };

  const deleteFriendship = async (id: string) => {
    await supabase.from("friendships").delete().eq("id", id);
    await loadFriendships(profile.id);
  };

  if (loading) return <ContentLoader label="Loading social hub..." />;

  const acceptedFriends = friendships.filter(f => f.status === "accepted");
  const pendingIncoming = friendships.filter(f => f.status === "pending" && !f.is_requester);
  const pendingOutgoing = friendships.filter(f => f.status === "pending" && f.is_requester);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge variant="blue" className="mb-2">Social Hub</Badge>
            <h1 className="text-2xl font-extrabold text-[#0B1528]">Friends & Multiplayer</h1>
            <p className="text-sm text-[#64748B] mt-1">Connect with academy students, see who is online, and play.</p>
          </div>
          <Users className="h-10 w-10 text-[#368AE4] opacity-50" />
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/60 pb-1">
        {[
          { id: "play", label: "Play Game", icon: Gamepad2 },
          { id: "friends", label: "My Friends", icon: Users },
          { id: "search", label: "Find Players", icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0",
                isActive ? "bg-[#368AE4] text-white shadow-md" : "bg-white/40 text-[#64748B] hover:bg-white/70"
              )}
            >
              <Icon className="h-4 w-4" /> {tab.label}
              {tab.id === "friends" && pendingIncoming.length > 0 && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
                  {pendingIncoming.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLAY */}
      {activeTab === "play" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid md:grid-cols-2 gap-5">
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                <h2 className="text-base font-extrabold text-[#0B1528]">Create Room</h2>
              </div>
              <p className="text-xs text-[#64748B]">You become the host. Share the 6-letter code or invite link.</p>
              <Button variant="primary" onClick={createRoom} disabled={creating} className="w-full h-12 rounded-2xl">
                <Plus className="h-4 w-4" /> {creating ? "Creating..." : "Create New Room"}
              </Button>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
                <h2 className="text-base font-extrabold text-[#0B1528]">Join Room</h2>
              </div>
              <p className="text-xs text-[#64748B]">Enter a room code from your friend.</p>
              <div className="flex gap-2">
                <Input placeholder="ROOM CODE" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} className="uppercase text-center font-mono font-bold" maxLength={6} />
                <Button variant="primary" onClick={joinByCode} className="rounded-2xl">Join</Button>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
              <h2 className="text-base font-extrabold text-[#0B1528]">Open Lobby Rooms</h2>
              <Badge variant="outline" className="normal-case tracking-normal ml-auto">{rooms.length} available</Badge>
            </div>
            {rooms.length === 0 ? (
              <p className="text-xs font-bold text-[#64748B] text-center py-6">No open rooms right now. Create one!</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {rooms.map((r) => (
                  <Link key={r.id} href={`/dashboard/friends/${r.id}`}>
                    <div className="rounded-2xl bg-white/50 border border-white/70 p-4 hover:bg-white/70 transition">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-extrabold text-[#0B1528] text-sm flex items-center gap-2">
                          <Swords className="h-3.5 w-3.5 text-[#368AE4]" /> {r.host_name}
                        </p>
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
      )}

      {/* TAB 2: MY FRIENDS */}
      {activeTab === "friends" && (
        <div className="grid lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-8 space-y-4">
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-[#368AE4]" />
                <h2 className="text-base font-extrabold text-[#0B1528]">My Friends</h2>
                <Badge variant="outline" className="ml-auto">{acceptedFriends.length}</Badge>
              </div>

              {acceptedFriends.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <UserPlus className="h-8 w-8 text-[#64748B] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#0B1528]">Your friends list is empty</p>
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setActiveTab("search")}>
                    Find Players
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {acceptedFriends.map(f => {
                    const isOnline = onlineUsers.has(f.friend_id);
                    return (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/70">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white flex items-center justify-center font-extrabold text-sm">
                              {f.friend_name.charAt(0).toUpperCase()}
                            </div>
                            {isOnline && <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Online" />}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-[#0B1528]">{f.friend_name}</p>
                            <p className="text-[10px] font-bold text-[#64748B]">{f.friend_elo} ELO</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant={isOnline ? "primary" : "outline"} size="sm" className="rounded-xl h-9 text-xs" onClick={() => directChallenge(f.friend_id)}>
                            <Swords className="h-3.5 w-3.5" /> Challenge
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-xl h-9 text-red-500 hover:bg-red-50" onClick={() => { if(confirm("Remove friend?")) deleteFriendship(f.id); }}>
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Incoming Requests Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <GlassCard className="p-5 space-y-3">
              <h3 className="text-sm font-extrabold text-[#0B1528] flex items-center gap-2">
                Friend Requests
                {pendingIncoming.length > 0 && <Badge variant="warning">{pendingIncoming.length}</Badge>}
              </h3>

              {pendingIncoming.length === 0 ? (
                <p className="text-xs text-[#64748B] italic">No pending requests.</p>
              ) : (
                <div className="space-y-2">
                  {pendingIncoming.map(f => (
                    <div key={f.id} className="p-3 rounded-xl bg-white/60 border border-white/80 space-y-2">
                      <div>
                        <p className="text-xs font-extrabold text-[#0B1528]">{f.friend_name}</p>
                        <p className="text-[10px] text-[#64748B]">{f.friend_elo} ELO</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" className="h-8 flex-1 rounded-lg text-[10px]" onClick={() => acceptRequest(f.id)}>Accept</Button>
                        <Button variant="ghost" size="sm" className="h-8 flex-1 rounded-lg text-[10px] text-red-600 bg-red-50 hover:bg-red-100" onClick={() => deleteFriendship(f.id)}>Decline</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
            
            {pendingOutgoing.length > 0 && (
              <GlassCard className="p-5 space-y-2">
                <h3 className="text-xs font-extrabold text-[#64748B] uppercase">Sent Requests</h3>
                <div className="space-y-1">
                  {pendingOutgoing.map(f => (
                    <div key={f.id} className="flex justify-between items-center text-[11px] font-bold text-[#64748B]">
                      <span>{f.friend_name}</span>
                      <button onClick={() => deleteFriendship(f.id)} className="text-red-400 hover:text-red-600">Cancel</button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FIND PLAYERS */}
      {activeTab === "search" && (
        <GlassCard className="p-6 max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-extrabold text-[#0B1528]">Find Academy Players</h2>
            <p className="text-xs text-[#64748B]">Search by name to send a friend request.</p>
          </div>

          <form onSubmit={searchUsers} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name..."
                className="pl-9 h-12 rounded-2xl text-sm"
              />
            </div>
            <Button type="submit" variant="primary" className="h-12 rounded-2xl px-6" disabled={searching}>
              Search
            </Button>
          </form>

          <div className="space-y-2 pt-2">
            {searchResults.map(user => {
              // Check existing status
              const existing = friendships.find(f => f.friend_id === user.id);
              return (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/70">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-extrabold text-sm">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#0B1528]">{user.full_name}</p>
                      <p className="text-[10px] font-bold text-[#64748B]">{user.chess_rating} ELO</p>
                    </div>
                  </div>
                  
                  {existing ? (
                    existing.status === "accepted" ? (
                      <Badge variant="success"><UserCheck className="h-3 w-3 mr-1" /> Friends</Badge>
                    ) : existing.is_requester ? (
                      <Badge variant="outline">Request Sent</Badge>
                    ) : (
                      <Button variant="primary" size="sm" className="rounded-xl h-8" onClick={() => acceptRequest(existing.id)}>Accept</Button>
                    )
                  ) : (
                    <Button variant="glass" size="sm" className="rounded-xl h-8 text-xs" onClick={() => sendRequest(user.id)}>
                      <UserPlus className="h-3.5 w-3.5" /> Add
                    </Button>
                  )}
                </div>
              );
            })}
            
            {searchResults.length === 0 && !searching && searchQuery && (
              <p className="text-xs font-bold text-[#64748B] text-center py-4">No students found matching "{searchQuery}"</p>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
