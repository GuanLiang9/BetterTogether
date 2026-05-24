"use client";

import { Home as HomeIcon, ShoppingBag, BarChart2, UserPlus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { HomeRoom } from "@/features/home/components/HomeRoom";
import { BackgroundPicker } from "@/features/home/components/BackgroundPicker";
import { useHome } from "@/features/home/hooks/useHome";
import { useCoupleStore } from "@/stores/coupleStore";

export default function HomePage() {
  const { isLoading } = useHome();
  const couple = useCoupleStore((s) => s.couple);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  const isSolo = !couple;

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">
              {isSolo ? "My Home" : "Our Home"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSolo ? "Your personal space — link a partner to share it" : "Your shared space together"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSolo && (
            <Link href="/partner">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/15 transition-all">
                <UserPlus className="w-3.5 h-3.5" />
                Link partner
              </div>
            </Link>
          )}
          <Link href="/shop">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium hover:bg-amber-400/15 transition-all">
              <ShoppingBag className="w-3.5 h-3.5" />
              Shop
            </div>
          </Link>
        </div>
      </div>

      {/* Solo nudge banner */}
      {isSolo && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/3 border border-white/8">
          <span className="text-xl">🤝</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300">Decorate alone, or together</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Link with a partner and this becomes your shared home — furniture and all.
            </p>
          </div>
        </div>
      )}

      {/* Room */}
      <Card className="p-3">
        <HomeRoom />
      </Card>

      {/* Background picker */}
      <Card className="p-4">
        <BackgroundPicker />
      </Card>
    </div>
  );
}
