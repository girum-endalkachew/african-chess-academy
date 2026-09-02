"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadAccess } from "@/lib/access";

export default function PostLoginPage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const access = await loadAccess();
      if (!access) {
        router.replace("/login");
        return;
      }
      // No guest: always authenticated path
      // Registered only → explore
      if (!access.roles.includes("student") && !access.roles.includes("coach") && !access.roles.includes("admin")) {
        router.replace("/explore");
        return;
      }
      router.replace(access.homePath);
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF3FA]">
      <div className="h-8 w-8 rounded-full border-4 border-[#368AE4] border-t-transparent animate-spin" />
    </div>
  );
}
