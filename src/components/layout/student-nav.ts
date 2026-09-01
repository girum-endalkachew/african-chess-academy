import {
  LayoutDashboard, BookOpen, Trophy, Calendar, Award, User, Settings,
  Swords, Edit3, Users
} from "lucide-react";
import type { NavItem } from "@/components/layout/portal-shell";

export const studentNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "My Learning", icon: BookOpen },
  { href: "/dashboard/play", label: "Play Computer", icon: Swords },
  { href: "/dashboard/friends", label: "Play Friends", icon: Users },
  { href: "/dashboard/editor", label: "Board Editor", icon: Edit3 },
  { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
