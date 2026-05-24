"use client";

import { Home as HomeIcon, ShoppingBag, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { HomeRoom } from "@/features/home/components/HomeRoom";
import { BackgroundPicker } from "@/features/home/components/BackgroundPicker";
import { useHome } from "@/features/home/hooks/useHome";
import { useCoupleStore } from "@/stores/coupleStore";

export default function HomePage() {
  const { isLoading } = useHome();
  const couple = useCoupleStore((s) => s.couple);

  if (!couple) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center animate-fade-in">
        <div className="text-5xl">🏡</div>
        <h2 className="text-lg font-bold text-slate-200">No home yet</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          Link with your partner first — then you can build and decorate your shared space together.
        </p>
        <Link
          href="/partner"
          className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
        >
          Find your partner
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-100">Our Home</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Build and decorate your shared space</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:bg-white/10 transition-all">
              <BarChart2 className="w-3.5 h-3.5" />
              Stats
            </div>
          </Link>
          <Link href="/shop">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium hover:bg-amber-400/15 transition-all">
              <ShoppingBag className="w-3.5 h-3.5" />
              Shop
            </div>
          </Link>
        </div>
      </div>

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
