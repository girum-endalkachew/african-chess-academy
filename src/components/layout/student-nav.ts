import {
  LayoutDashboard, BookOpen, Swords, Gamepad2, Users, Puzzle,
  Trophy, Calendar, Award, Edit3, StickyNote, User, Settings, Brain
} from "lucide-react";
import type { NavItem } from "@/components/layout/portal-shell";

export const studentNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/play-hub", label: "Play Center", icon: Gamepad2 },
  { href: "/dashboard/play", label: "vs Computer", icon: Swords },
  { href: "/dashboard/friends", label: "Social & Friends", icon: Users },
  { href: "/dashboard/puzzles", label: "Puzzles", icon: Puzzle },
  { href: "/dashboard/drills", label: "Drills", icon: Brain },
  { href: "/dashboard/editor", label: "Board Editor", icon: Edit3 },
  { href: "/dashboard/notes", label: "My Notes", icon: StickyNote },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
