import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionTitle({
  title,
  href,
  linkLabel = "View all",
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="flex items-center gap-3">
        <span className="h-5 w-1.5 rounded-full bg-[#368AE4]" />
        <h2 className="text-lg font-extrabold text-[#0B1528]">{title}</h2>
      </div>

      {href && (
        <Link
          href={href}
          className="text-xs font-bold text-[#368AE4] hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}