import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  return (
    <div className="bg-[#F8FAFC]">
      <section className="border-b border-[#DBE9F7] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="mb-4">Events & Webinars</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">Learn live with ACA</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">Upcoming webinars, clinics, and community sessions.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-5">
          {(events || []).map((e) => (
            <div key={e.id} className="bg-white border border-[#DBE9F7] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-[#E6F5FF] text-[#00A3E0] flex items-center justify-center">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1E293B]">{e.title}</h2>
                  <p className="text-sm text-slate-500">{e.event_type}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">{e.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(e.event_date)}
                </Badge>
                <Badge>{e.max_seats} seats</Badge>
              </div>
              <Link href="/login">
                <Button variant="outline" className="rounded-xl">Register for event</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}