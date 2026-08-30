import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

export default async function TournamentsPage() {
  const supabase = await createClient();
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .order("tournament_date", { ascending: true });

  return (
    <div className="bg-[#F8FAFC]">
      <section className="border-b border-[#DBE9F7] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="mb-4">Tournaments</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">Compete with purpose</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">View upcoming events, register, and follow results.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-5">
          {(tournaments || []).map((t) => (
            <div key={t.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1E293B]">{t.title}</h2>
                    <p className="text-sm text-slate-500">{t.format}</p>
                  </div>
                </div>
                <Badge variant="success">{t.status}</Badge>
              </div>
              <p className="text-sm text-slate-600 mb-4">{t.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-5">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#00A3E0]" />
                  {formatDate(t.tournament_date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#00A3E0]" />
                  {t.current_participants}/{t.max_participants}
                </span>
              </div>
              <Link href="/login">
                <Button className="rounded-xl w-full sm:w-auto">Register / View details</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}