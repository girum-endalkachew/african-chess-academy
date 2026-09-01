import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#368AE4]/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#368AE4] text-white shadow-[0_8px_20px_-4px_rgba(54,138,228,0.4)] hover:bg-[#2B7AD4] hover:-translate-y-0.5",
        secondary:
          "bg-[#EEF3FA] text-[#368AE4] hover:bg-[#E0EAF8]",
        outline:
          "border border-white/80 bg-white/50 text-[#0B1528] shadow-sm backdrop-blur hover:bg-white/70 hover:-translate-y-0.5",
        ghost:
          "text-[#64748B] hover:bg-white/40 hover:text-[#0B1528]",
        danger:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        glass:
          "bg-[rgba(255,255,255,0.35)] border border-[rgba(255,255,255,0.65)] text-[#0B1528] backdrop-blur-[14px] shadow-[0_12px_30px_rgba(50,70,100,0.08)] hover:bg-white/50",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };