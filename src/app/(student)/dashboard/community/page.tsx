"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentLoader } from "@/components/ui/content-loader";
import { cn } from "@/lib/utils";
import { Heart, Send, Flame, Target, Trophy, Puzzle, Sparkles, Trash2, TrendingUp } from "lucide-react";

type Post = {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  post_type: string;
  metadata: any;
  likes_count: number;
  created_at: string;
  liked_by_me?: boolean;
};

const POST_ICONS: Record<string, any> = {
  streak: { icon: Flame, color: "text-amber-500", bg: "bg-amber-50" },
  elo: { icon: TrendingUp, color: "text-[#368AE4]", bg: "bg-[#EEF3FA]" },
  puzzle: { icon: Puzzle, color: "text-purple-500", bg: "bg-purple-50" },
  win: { icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50" },
  achievement: { icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50" },
  general: { icon: Sparkles, color: "text-[#368AE4]", bg: "bg-[#EEF3FA]" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CommunityPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Player");
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [streak, setStreak] = useState(0);

  const loadFeed = async (myId: string) => {
    const { data: postsData } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    const postIds = (postsData || []).map((p) => p.id);
    const { data: likes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", myId)
      .in("post_id", postIds);

    const likedSet = new Set((likes || []).map((l) => l.post_id));
    const enriched = (postsData || []).map((p) => ({ ...p, liked_by_me: likedSet.has(p.id) }));
    setPosts(enriched);
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setProfile(prof);
      setUserName(prof?.full_name || "Player");

      // Get streak
      const { data: streakRow } = await supabase.from("user_streaks").select("current_streak").eq("user_id", user.id).maybeSingle();
      if (streakRow) setStreak(streakRow.current_streak || 0);

      await loadFeed(user.id);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel("community_feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => loadFeed(userId))
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => loadFeed(userId))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId]);

  const createPost = async (postContent: string, type: string = "general", metadata: any = null) => {
    if (!userId || !postContent.trim()) return;
    setPosting(true);
    await supabase.from("community_posts").insert({
      user_id: userId,
      user_name: userName,
      content: postContent.trim(),
      post_type: type,
      metadata,
    });
    setContent("");
    setPosting(false);
  };

  const shareStreak = () => createPost(`I'm on a ${streak}-day daily streak! 🔥 Consistency wins.`, "streak", { streak });
  const shareElo = () => createPost(`My current ELO Rating: ${profile?.chess_rating || 1200} ♟️ Grinding to the next tier!`, "elo", { elo: profile?.chess_rating });

  const toggleLike = async (post: Post) => {
    if (!userId) return;
    if (post.liked_by_me) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", userId);
      await supabase.from("community_posts").update({ likes_count: Math.max(0, post.likes_count - 1) }).eq("id", post.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: userId });
      await supabase.from("community_posts").update({ likes_count: post.likes_count + 1 }).eq("id", post.id);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("community_posts").delete().eq("id", id);
  };

  if (loading) return <ContentLoader label="Loading community feed..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#368AE4]/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <Badge variant="blue" className="mb-2">Community</Badge>
          <h1 className="text-2xl font-extrabold text-[#0B1528]">Academy Feed</h1>
          <p className="text-sm text-[#64748B] mt-1">Share your wins, streaks, and achievements with fellow students.</p>
        </div>
      </GlassCard>

      {/* Create Post */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#368AE4] to-[#60A5FA] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a chess insight, win, or achievement..."
            rows={3}
            maxLength={280}
            className="flex-1 rounded-xl border border-white/70 bg-white/50 px-3 py-2 text-sm text-[#0B1528] focus:outline-none focus:ring-2 focus:ring-[#368AE4]/30 resize-none"
          />
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-2 flex-wrap">
            <Button variant="glass" size="sm" className="rounded-xl text-[10px]" onClick={shareStreak}>
              <Flame className="h-3 w-3 text-amber-500" /> Share Streak
            </Button>
            <Button variant="glass" size="sm" className="rounded-xl text-[10px]" onClick={shareElo}>
              <TrendingUp className="h-3 w-3 text-[#368AE4]" /> Share ELO
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#64748B]">{content.length}/280</span>
            <Button variant="primary" size="sm" className="rounded-xl" onClick={() => createPost(content)} disabled={!content.trim() || posting}>
              <Send className="h-3.5 w-3.5" /> Post
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Feed */}
      {posts.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <Sparkles className="h-8 w-8 text-[#368AE4] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-bold text-[#0B1528]">No posts yet</p>
          <p className="text-xs text-[#64748B]">Be the first to share!</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const meta = POST_ICONS[post.post_type] || POST_ICONS.general;
            const Icon = meta.icon;
            const isMine = post.user_id === userId;
            return (
              <GlassCard key={post.id} className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                      {post.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-extrabold text-[#0B1528] truncate">{post.user_name}</p>
                        <span className={cn("h-6 w-6 rounded-lg flex items-center justify-center shrink-0", meta.bg)}>
                          <Icon className={cn("h-3 w-3", meta.color)} />
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-[#64748B]">{timeAgo(post.created_at)}</p>
                    </div>
                  </div>
                  {isMine && (
                    <button onClick={() => deletePost(post.id)} className="text-[#64748B] hover:text-red-500 p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-[#0B1528] leading-relaxed whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center gap-3 pt-2 border-t border-white/60">
                  <button
                    onClick={() => toggleLike(post)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-bold transition",
                      post.liked_by_me ? "text-red-500" : "text-[#64748B] hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", post.liked_by_me && "fill-red-500")} />
                    {post.likes_count}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
