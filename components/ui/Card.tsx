import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, hover, glow, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-4",
        hover && "glass-hover cursor-pointer transition-all duration-200",
        glow && "shadow-lg shadow-emerald-500/5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
