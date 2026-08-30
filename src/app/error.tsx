"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md w-full bg-white border border-[#DBE9F7] rounded-2xl p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#1E293B]">Something went wrong</h1>
        <p className="text-sm text-slate-500">Please try again. If it continues, refresh the page.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={reset} className="rounded-xl">Try again</Button>
          <Link href="/"><Button variant="outline" className="rounded-xl w-full">Go home</Button></Link>
        </div>
      </div>
    </div>
  );
}