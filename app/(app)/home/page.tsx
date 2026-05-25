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
              Link with a partner and this becomes your shared home.
            </p>
          </div>
        </div>
      )}

      {/* Room — show skeleton while loading, then real room */}
      <Card className="p-3">
        {isLoading ? <RoomSkeleton /> : <HomeRoom />}
      </Card>

      {/* Background picker */}
      <Card className="p-4">
        {isLoading ? <div className="h-16 rounded-xl bg-white/5 animate-pulse" /> : <BackgroundPicker />}
      </Card>
    </div>
  );
}

function RoomSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <div className="w-6 h-6 rounded-full bg-white/8 animate-pulse" />
        <div className="w-8 h-3 rounded bg-white/8 animate-pulse" />
        <div className="flex-1 h-px bg-white/5" />
        <div className="w-16 h-3 rounded bg-white/8 animate-pulse" />
      </div>
      <div className="rounded-2xl bg-white/4 animate-pulse" style={{ minHeight: 280 }} />
      <div className="w-32 h-3 rounded bg-white/5 animate-pulse mx-auto" />
    </div>
  );
}
