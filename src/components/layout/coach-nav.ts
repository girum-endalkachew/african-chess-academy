import {
  LayoutDashboard, Users, BookOpen, Calendar, MessageSquare, User, Settings, Swords
} from "lucide-react";
import type { NavItem } from "@/components/layout/portal-shell";

export const coachNavItems: NavItem[] = [
  { href: "/coach", label: "Dashboard", icon: LayoutDashboard },
  { href: "/coach/students", label: "My Students", icon: Users },
  { href: "/coach/courses", label: "My Courses", icon: BookOpen },
  { href: "/coach/play", label: "Play Computer", icon: Swords },
  { href: "/coach/sessions", label: "Sessions", icon: Calendar },
  { href: "/coach/messages", label: "Messages", icon: MessageSquare },
  { href: "/coach/profile", label: "Profile", icon: User },
  { href: "/coach/settings", label: "Settings", icon: Settings },
];
