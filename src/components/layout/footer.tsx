import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#DBE9F7] bg-white text-[#1E293B]">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-white">
                <Image src="/aca-logo.jpg" alt="ACA Logo" width={40} height={40} className="object-cover" />
              </div>
              <span className="text-lg font-bold text-[#1E293B]">ACA ACADEMY</span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              A unified digital platform for African Chess Academy students, coaches, and chess enthusiasts to learn, play, compete, and grow together.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-[#00A3E0] transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-[#00A3E0] transition-colors">Courses & Programs</Link></li>
              <li><Link href="/coaches" className="hover:text-[#00A3E0] transition-colors">Our Coaches</Link></li>
              <li><Link href="/news" className="hover:text-[#00A3E0] transition-colors">Latest News</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wider mb-4">Competitions</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link href="/tournaments" className="hover:text-[#00A3E0] transition-colors">Upcoming Tournaments</Link></li>
              <li><Link href="/events" className="hover:text-[#00A3E0] transition-colors">Webinars & Events</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#00A3E0] transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00A3E0]" />
                info@africanchessacademy.org
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#00A3E0]" />
                +251 900 000 000
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#00A3E0] shrink-0 mt-0.5" />
                Addis Ababa, Ethiopia
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#DBE9F7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} African Chess Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-[#00A3E0]">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[#00A3E0]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}