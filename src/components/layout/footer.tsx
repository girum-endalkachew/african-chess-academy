import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/40 pt-10 pb-8 px-8 sm:px-12 bg-white/20 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1528] text-white">
              <span className="font-serif text-xl leading-none">♙</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-extrabold tracking-wide text-[#0B1528]">AFRICAN</span>
              <span className="text-[13px] font-extrabold tracking-wide text-[#0B1528] mt-[2px]">CHESS ACADEMY</span>
            </div>
          </Link>
          <p className="text-[12px] font-medium text-[#64748B] max-w-sm leading-relaxed">
            A unified digital platform for African Chess Academy students, coaches, and chess enthusiasts to learn, play, and grow together.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[11px] font-extrabold text-[#0B1528] tracking-widest uppercase mb-4">Platform</h4>
          <ul className="space-y-3">
            <li><Link href="/programs" className="text-[12px] font-bold text-[#64748B] hover:text-[#368AE4] transition-colors">Courses & Programs</Link></li>
            <li><Link href="/tournaments" className="text-[12px] font-bold text-[#64748B] hover:text-[#368AE4] transition-colors">Tournaments</Link></li>
            <li><Link href="/coaches" className="text-[12px] font-bold text-[#64748B] hover:text-[#368AE4] transition-colors">Our Coaches</Link></li>
          </ul>
        </div>

        {/* Legal / Contact */}
        <div>
          <h4 className="text-[11px] font-extrabold text-[#0B1528] tracking-widest uppercase mb-4">Connect</h4>
          <ul className="space-y-3">
            <li><Link href="/contact" className="text-[12px] font-bold text-[#64748B] hover:text-[#368AE4] transition-colors">Contact Us</Link></li>
            <li><Link href="/login" className="text-[12px] font-bold text-[#64748B] hover:text-[#368AE4] transition-colors">Student Login</Link></li>
            <li><Link href="/register" className="text-[12px] font-bold text-[#368AE4] flex items-center gap-1 hover:opacity-80">Join Now <ArrowRight className="h-3 w-3"/></Link></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/40">
        <p className="text-[10px] font-bold text-[#64748B]">
          © {new Date().getFullYear()} African Chess Academy. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-[10px] font-bold text-[#64748B] hover:text-[#0B1528]">Privacy</Link>
          <Link href="/terms" className="text-[10px] font-bold text-[#64748B] hover:text-[#0B1528]">Terms</Link>
        </div>
      </div>
    </footer>
  );
}