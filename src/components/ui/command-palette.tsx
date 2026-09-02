"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Swords,
  BookOpen,
  Trophy,
  Calendar,
  Award,
  User,
  Settings,
  Edit3,
  Users,
  Puzzle,
  StickyNote,
  Gamepad2,
  X,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

type CommandItem = {
  id: string;
  label: string;
  category: "Play & Practice" | "Learning" | "Community" | "Account";
  icon: any;
  href: string;
  shortcut?: string;
};

const COMMANDS: CommandItem[] = [
  { id: "play-hub", label: "Play Center (Hub)", category: "Play & Practice", icon: Gamepad2, href: "/dashboard/play-hub" },
  { id: "play-computer", label: "Play vs Computer AI", category: "Play & Practice", icon: Swords, href: "/dashboard/play", shortcut: "P" },
  { id: "play-friends", label: "Play With Friends (Multiplayer)", category: "Play & Practice", icon: Users, href: "/dashboard/friends" },
  { id: "puzzles", label: "Puzzle Trainer", category: "Play & Practice", icon: Puzzle, href: "/dashboard/puzzles", shortcut: "Z" },
  { id: "board-editor", label: "Board Editor & Sandbox", category: "Play & Practice", icon: Edit3, href: "/dashboard/editor" },
  { id: "my-learning", label: "My Learning Hub", category: "Learning", icon: BookOpen, href: "/dashboard/learning", shortcut: "L" },
  { id: "my-notes", label: "My Study Notes", category: "Learning", icon: StickyNote, href: "/dashboard/notes" },
  { href: "/dashboard/tournaments", label: "Tournaments & Championships", category: "Community", icon: Trophy, id: "tournaments" },
  { href: "/dashboard/events", label: "Live Webinars & Events", category: "Community", icon: Calendar, id: "events" },
  { href: "/dashboard/certificates", label: "Certificates & Achievements", category: "Learning", icon: Award, id: "certs" },
  { href: "/dashboard/profile", label: "User Profile & ELO", category: "Account", icon: User, id: "profile" },
  { href: "/dashboard/settings", label: "Account Settings", category: "Account", icon: Settings, id: "settings" },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = useCallback(
    (href: string) => {
      onClose();
      setQuery("");
      router.push(href);
    },
    [router, onClose]
  );

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery("");
          // trigger open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Arrow key navigation inside palette
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen || filtered.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigateTo(filtered[selectedIndex].href);
        }
      }
    };
    window.addEventListener("keydown", handleNavigation);
    return () => window.removeEventListener("keydown", handleNavigation);
  }, [isOpen, filtered, selectedIndex, navigateTo]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0B1528]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="p-0 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.2)] border-white/80 rounded-2xl">
          {/* Input header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/60 bg-white/40">
            <Search className="h-5 w-5 text-[#368AE4] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search feature..."
              className="w-full bg-transparent text-sm font-bold text-[#0B1528] placeholder:text-[#64748B]/60 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0B1528] mr-2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white/60 border border-white/80 px-2 py-0.5 text-[10px] font-extrabold text-[#64748B]">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-[#64748B]">
                No matching features or tools found.
              </div>
            ) : (
              filtered.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => navigateTo(item.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#368AE4] text-white shadow-sm"
                        : "text-[#0B1528] hover:bg-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : "bg-[#EEF3FA] text-[#368AE4]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-extrabold truncate">{item.label}</p>
                        <p className={`text-[10px] font-semibold ${isSelected ? "text-white/80" : "text-[#64748B]"}`}>
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.shortcut && (
                        <kbd
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                            isSelected
                              ? "bg-white/20 border-white/30 text-white"
                              : "bg-white/60 border-white/80 text-[#64748B]"
                          }`}
                        >
                          ⌘{item.shortcut}
                        </kbd>
                      )}
                      <ArrowRight className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-[#64748B]"}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 bg-[#EEF3FA]/60 border-t border-white/50 flex items-center justify-between text-[10px] font-bold text-[#64748B]">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#368AE4]" /> Quick Navigation
            </span>
            <div className="flex gap-2">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
