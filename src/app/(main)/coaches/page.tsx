import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default async function CoachesPage() {
  const supabase = await createClient();
  const { data: coaches } = await supabase
    .from("coaches")
    .select("*")
    .order("chess_rating", { ascending: false });

  return (
    <div className="bg-[#F8FAFC]">
      <section className="border-b border-[#DBE9F7] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="mb-4">Coaches</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">Meet our coaches</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">Experienced mentors dedicated to student growth.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(coaches || []).map((c) => (
            <div key={c.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#87CEEB] to-[#00A3E0] text-white font-bold text-lg flex items-center justify-center">
                  {c.full_name?.split(" ").pop()?.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-[#1E293B]">{c.full_name}</h2>
                  <p className="text-sm text-slate-500">{c.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 mb-3">{c.specialties || c.bio}</p>
              <Badge>ELO {c.chess_rating}</Badge>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/register">
            <Button className="rounded-xl">Train with ACA coaches</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}