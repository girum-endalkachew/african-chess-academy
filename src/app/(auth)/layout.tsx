import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen canvas-bg">
      {/* top bar like dashboard header */}
      <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-white/80">
            <Image src="/aca-logo.jpg" alt="ACA" fill className="object-cover" />
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="text-[12px] font-extrabold text-[#0B1528] tracking-wide">AFRICAN CHESS</p>
            <p className="text-[10px] font-bold text-[#64748B] tracking-wider">ACADEMY</p>
          </div>
        </Link>
        <Link href="/" className="text-xs font-bold text-[#64748B] hover:text-[#368AE4] transition">
          ← Back to site
        </Link>
      </header>

      <main className="px-4 sm:px-6 pb-12 flex items-start justify-center">
        <div className="w-full max-w-5xl pt-2 sm:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
