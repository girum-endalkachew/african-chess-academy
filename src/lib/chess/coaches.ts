export type CoachProfile = {
  id: "easy" | "medium" | "hard";
  name: string;
  title: string;
  elo: number;
  avatarUrl: string;
  description: string;
  quote: string;
  badge: "success" | "blue" | "warning";
};

// DiceBear avatars: free, no signup, generates unique human portraits
export const COACHES: CoachProfile[] = [
  {
    id: "easy",
    name: "Coach Amara",
    title: "Beginner Mentor",
    elo: 800,
    avatarUrl: "https://api.dicebear.com/9.x/personas/svg?seed=Amara&backgroundColor=b6e3f4&hair=curly,long&mood=happy",
    description: "Patient and encouraging. Makes tactical mistakes so you can learn.",
    quote: "Every grandmaster was once a beginner!",
    badge: "success",
  },
  {
    id: "medium",
    name: "Coach Kwame",
    title: "Club Analyst",
    elo: 1500,
    avatarUrl: "https://api.dicebear.com/9.x/personas/svg?seed=Kwame&backgroundColor=c0aede&hair=short&mood=serious",
    description: "Solid positional play. Punishes obvious blunders but respects development.",
    quote: "Chess is 99% tactics. Stay sharp.",
    badge: "blue",
  },
  {
    id: "hard",
    name: "Coach Nia",
    title: "Grandmaster Champion",
    elo: 2200,
    avatarUrl: "https://api.dicebear.com/9.x/personas/svg?seed=Nia&backgroundColor=ffd5dc&hair=short&mood=confident",
    description: "Deep calculation with zero mercy. Ready to challenge your best?",
    quote: "The board doesn't lie. Prove yourself.",
    badge: "warning",
  },
];

export function getCoach(id: string): CoachProfile {
  return COACHES.find((c) => c.id === id) || COACHES[0];
}
