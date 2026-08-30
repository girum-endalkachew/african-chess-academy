"use client";

import dynamic from "next/dynamic";

const Chessboard = dynamic(
  () => import("react-chessboard").then((m) => m.Chessboard),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square rounded-2xl bg-slate-100 border border-[#DBE9F7] animate-pulse" />
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
      <div className="rounded-2xl overflow-hidden border border-[#DBE9F7] bg-white p-2 sm:p-3 shadow-sm">
        <Chessboard
          id="aca-lesson-board"
          position={fen || START_FEN}
          arePiecesDraggable={false}
          animationDuration={250}
          customLightSquareStyle={{ backgroundColor: "#E6F5FF" }}
          customDarkSquareStyle={{ backgroundColor: "#53B4E0" }}
          customBoardStyle={{ width: "100%", borderRadius: "12px" }}
        />
      </div>
      {note ? (
        <p className="mt-3 text-xs sm:text-sm text-slate-600 bg-[#E6F5FF]/70 border border-[#DBE9F7] rounded-xl px-3 py-2">
          <span className="font-semibold text-[#00A3E0]">Board idea: </span>
          {note}
        </p>
      ) : null}
    </div>
  );
}