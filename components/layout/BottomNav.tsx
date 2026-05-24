"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Flame, Timer, CalendarDays, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/home", icon: House, label: "Home" },
  { href: "/habits", icon: Flame, label: "Habits" },
  { href: "/focus", icon: Timer, label: "Focus" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/8 pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/home" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                active
                  ? "text-emerald-400"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  active && "scale-110",
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={cn("transition-colors", active && "text-emerald-400")}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 h-0.5 w-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
});
