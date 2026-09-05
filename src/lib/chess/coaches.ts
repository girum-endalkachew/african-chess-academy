export type CoachProfile = {
  id: "easy" | "medium" | "hard";
  name: string;
  title: string;
  elo: number;
  avatarUrl: string;
  description: string;
  quote: string;
  badge: "success" | "blue" | "warning";
  headerBg: string;
};

export const COACHES: CoachProfile[] = [
  {
    id: "easy",
    name: "Coach Amara",
    title: "Beginner Mentor",
    elo: 800,
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Amara&backgroundColor=b6e3f4",
    description: "Patient and encouraging. Makes tactical mistakes so you can learn.",
    quote: "Every grandmaster was once a beginner!",
    badge: "success",
    headerBg: "bg-gradient-to-br from-emerald-200 to-emerald-100",
  },
  {
    id: "medium",
    name: "Coach Kwame",
    title: "Club Analyst",
    elo: 1500,
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Kwame&backgroundColor=c0aede",
    description: "Solid positional play. Punishes obvious blunders but respects development.",
    quote: "Chess is 99% tactics. Stay sharp.",
    badge: "blue",
    headerBg: "bg-gradient-to-br from-blue-200 to-[#EEF3FA]",
  },
  {
    id: "hard",
    name: "Coach Nia",
    title: "Grandmaster Champion",
    elo: 2200,
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Nia&backgroundColor=ffd5dc",
    description: "Deep calculation with zero mercy. Ready to challenge your best?",
    quote: "The board doesn't lie. Prove yourself.",
    badge: "warning",
    headerBg: "bg-gradient-to-br from-amber-200 to-amber-100",
  },
];

export function getCoach(id: string): CoachProfile {
  return COACHES.find((c) => c.id === id) || COACHES[0];
}
