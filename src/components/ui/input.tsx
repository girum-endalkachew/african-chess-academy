import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/70 bg-white/50 px-4 py-2 text-sm font-medium text-[#0B1528]",
          "placeholder:text-[#64748B]/70 backdrop-blur-md shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#368AE4]/30 focus-visible:border-[#368AE4]/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };