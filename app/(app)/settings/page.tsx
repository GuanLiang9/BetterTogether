import { Bell, ChevronRight, User, ShoppingBag, Sparkles, Trophy, Home } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <h1 className="text-2xl font-bold text-slate-100">Settings</h1>

      <Card className="p-0 overflow-hidden divide-y divide-white/5">
        <Link
          href="/settings/profile"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
        >
          <User className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-slate-200 flex-1">Profile</span>
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </Link>
        <Link
          href="/character"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-slate-200 flex-1">My Character</span>
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </Link>
        <Link
          href="/home"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
        >
          <Home className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-slate-200 flex-1">Our Home</span>
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </Link>
        <Link
          href="/achievements"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
        >
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-slate-200 flex-1">Achievements</span>
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </Link>
        <Link
          href="/shop"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
        >
          <ShoppingBag className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-slate-200 flex-1">Shop</span>
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </Link>
        <Link
          href="/settings/notifications"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
        >
          <Bell className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-slate-200 flex-1">Notifications</span>
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </Link>
      </Card>
    </div>
  );
}
