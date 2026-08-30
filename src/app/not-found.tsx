import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md w-full bg-white border border-[#DBE9F7] rounded-2xl p-8 text-center space-y-4">
        <p className="text-sm font-semibold text-[#00A3E0]">404</p>
        <h1 className="text-2xl font-bold text-[#1E293B]">Page not found</h1>
        <p className="text-sm text-slate-500">The page you are looking for does not exist.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/"><Button className="rounded-xl w-full">Back home</Button></Link>
          <Link href="/programs"><Button variant="outline" className="rounded-xl w-full">Browse programs</Button></Link>
        </div>
      </div>
    </div>
  );
}