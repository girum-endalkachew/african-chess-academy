export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-[#87CEEB] border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading ACA...</p>
      </div>
    </div>
  );
}