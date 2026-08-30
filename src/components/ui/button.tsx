import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#87CEEB] text-[#1E293B] font-semibold hover:bg-[#53B4E0] shadow-sm",
        primary: "bg-[#00A3E0] text-white font-semibold hover:bg-[#0284C7] shadow-sm",
        secondary: "bg-[#E6F5FF] text-[#00A3E0] font-semibold hover:bg-[#d0ecff]",
        outline: "border border-[#DBE9F7] bg-white text-[#1E293B] hover:bg-[#F8FAFC]",
        ghost: "text-[#1E293B] hover:bg-[#E6F5FF] hover:text-[#00A3E0]",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
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
