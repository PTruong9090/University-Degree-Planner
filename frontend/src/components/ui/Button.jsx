import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--text)] text-[var(--surface)] hover:bg-[#4b5161]",
        destructive: "bg-[#b56f67] text-white hover:bg-[#9f5f58]",
        outline: "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)]",
        secondary: "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)]",
        ghost: "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]",
        link: "text-[var(--accent-strong)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
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
