"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#F8FAFC]">
      <section className="border-b border-[#DBE9F7] bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="mb-4">Contact</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B]">Get in touch</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">Questions about programs, tournaments, or partnerships? Send us a message.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#DBE9F7] rounded-2xl p-5 flex gap-3">
              <Mail className="h-5 w-5 text-[#00A3E0] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1E293B] text-sm">Email</p>
                <p className="text-sm text-slate-600">info@africanchessacademy.org</p>
              </div>
            </div>
            <div className="bg-white border border-[#DBE9F7] rounded-2xl p-5 flex gap-3">
              <Phone className="h-5 w-5 text-[#00A3E0] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1E293B] text-sm">Phone</p>
                <p className="text-sm text-slate-600">+251 900 000 000</p>
              </div>
            </div>
            <div className="bg-white border border-[#DBE9F7] rounded-2xl p-5 flex gap-3">
              <MapPin className="h-5 w-5 text-[#00A3E0] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1E293B] text-sm">Location</p>
                <p className="text-sm text-slate-600">Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white border border-[#DBE9F7] rounded-2xl p-6 sm:p-8">
            {sent ? (
              <div className="py-10 text-center">
                <p className="text-lg font-bold text-[#1E293B]">Message sent</p>
                <p className="text-sm text-slate-600 mt-2">Thanks for reaching out. We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1E293B]">Name</label>
                    <Input className="h-11 rounded-xl" placeholder="Your name" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1E293B]">Email</label>
                    <Input type="email" className="h-11 rounded-xl" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1E293B]">Subject</label>
                  <Input className="h-11 rounded-xl" placeholder="How can we help?" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1E293B]">Message</label>
                  <textarea
                    className="w-full min-h-[140px] rounded-xl border border-[#DBE9F7] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#87CEEB]"
                    placeholder="Write your message..."
                    required
                  />
                </div>
                <Button type="submit" className="rounded-xl gap-2">
                  Send message <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}