import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div className="bg-[#F8FAFC]">
      <section className="border-b border-[#DBE9F7] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="mb-4">News</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">Academy updates & stories</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">Announcements, results, and community highlights.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-5">
          {(posts || []).map((p) => (
            <article key={p.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">{p.tag || "General"}</Badge>
                <Newspaper className="h-4 w-4 text-slate-400" />
              </div>
              <h2 className="font-bold text-lg text-[#1E293B] leading-snug">{p.title}</h2>
              <p className="text-xs text-slate-500 mt-2">{formatDate(p.published_at)}</p>
              <p className="text-sm text-slate-600 mt-3">{p.excerpt}</p>
              <Link href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-[#00A3E0] mt-4">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}