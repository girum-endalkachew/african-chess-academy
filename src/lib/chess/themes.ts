export type ChessTheme = {
  id: string;
  name: string;
  lightSquare: string;
  darkSquare: string;
  highlight: string;
  preview: string;
};

export const CHESS_THEMES: ChessTheme[] = [
  {
    id: "aca-blue",
    name: "ACA Blue",
    lightSquare: "#EAF2FB",
    darkSquare: "#368AE4",
    highlight: "rgba(251, 191, 36, 0.55)",
    preview: "linear-gradient(135deg, #EAF2FB 50%, #368AE4 50%)",
  },
  {
    id: "classic-green",
    name: "Classic Green",
    lightSquare: "#EEEED2",
    darkSquare: "#769656",
    highlight: "rgba(255, 255, 51, 0.5)",
    preview: "linear-gradient(135deg, #EEEED2 50%, #769656 50%)",
  },
  {
    id: "wood-warm",
    name: "Wood Warm",
    lightSquare: "#F0D9B5",
    darkSquare: "#B58863",
    highlight: "rgba(255, 200, 100, 0.5)",
    preview: "linear-gradient(135deg, #F0D9B5 50%, #B58863 50%)",
  },
  {
    id: "slate-dark",
    name: "Slate Dark",
    lightSquare: "#DEE3E6",
    darkSquare: "#8CA2AD",
    highlight: "rgba(0, 200, 255, 0.4)",
    preview: "linear-gradient(135deg, #DEE3E6 50%, #8CA2AD 50%)",
  },
  {
    id: "coral-pink",
    name: "Coral Pink",
    lightSquare: "#FFE0E0",
    darkSquare: "#FF7A85",
    highlight: "rgba(255, 100, 100, 0.4)",
    preview: "linear-gradient(135deg, #FFE0E0 50%, #FF7A85 50%)",
  },
  {
    id: "forest-emerald",
    name: "Forest Emerald",
    lightSquare: "#E8F5E8",
    darkSquare: "#2D6A4F",
    highlight: "rgba(255, 215, 0, 0.4)",
    preview: "linear-gradient(135deg, #E8F5E8 50%, #2D6A4F 50%)",
  },
];

export function getTheme(id: string): ChessTheme {
  return CHESS_THEMES.find((t) => t.id === id) || CHESS_THEMES[0];
}
