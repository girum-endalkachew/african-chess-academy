"use client";

import dynamic from "next/dynamic";

const Chessboard = dynamic(
  () => import("react-chessboard").then((m) => m.Chessboard),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square rounded-2xl bg-white/40 border border-white/60 animate-pulse" />
    ),
  }
);

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function LessonBoard({
  fen,
  note,
}: {
  fen?: string | null;
  note?: string | null;
}) {
  return (
    <div>
      <div className="rounded-[20px] overflow-hidden border border-white/70 bg-white/40 backdrop-blur-md p-2 sm:p-3 shadow-[0_12px_30px_rgba(50,70,100,0.08)]">
        <Chessboard
          id="aca-lesson-board"
          position={fen || START_FEN}
          arePiecesDraggable={false}
          animationDuration={250}
          customLightSquareStyle={{ backgroundColor: "#EAF2FB" }}
          customDarkSquareStyle={{ backgroundColor: "#368AE4" }}
          customBoardStyle={{ width: "100%", borderRadius: "14px" }}
        />
      </div>
      {note ? (
        <p className="mt-3 text-xs sm:text-sm text-[#64748B] bg-white/50 border border-white/70 rounded-xl px-3 py-2 backdrop-blur-sm">
          <span className="font-extrabold text-[#368AE4]">Board idea: </span>
          {note}
        </p>
      ) : null}
    </div>
  );
}