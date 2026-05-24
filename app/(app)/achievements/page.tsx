"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AchievementCard } from "@/features/achievements/components/AchievementCard";
import { useAchievementsStore } from "@/stores/achievementsStore";
import { useAuthStore } from "@/stores/authStore";
import { getAchievements, getUserAchievements } from "@/features/achievements/actions/achievements.actions";
import { CATEGORY_LABELS } from "@/types/achievement.types";
import type { Achievement } from "@/types/achievement.types";

const CATEGORIES = ["habit", "streak", "focus", "couple", "special"] as const;

export default function AchievementsPage() {
  const profileId = useAuthStore((s) => s.profile?.id);

  // Selective selectors
  const achievements = useAchievementsStore((s) => s.achievements);
  const userAchievements = useAchievementsStore((s) => s.userAchievements);
  const hydratedForId = useAchievementsStore((s) => s.hydratedForId);
  const setAchievements = useAchievementsStore((s) => s.setAchievements);
  const setUserAchievements = useAchievementsStore((s) => s.setUserAchievements);
  const setHydratedForId = useAchievementsStore((s) => s.setHydratedForId);

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!profileId || hydratedForId === profileId) return;
    setLoading(true);
    Promise.all([getAchievements(), getUserAchievements(profileId)])
      .then(([all, user]) => {
        setAchievements(all as Achievement[]);
        setUserAchievements(user as unknown as Parameters<typeof setUserAchievements>[0]);
        setHydratedForId(profileId);
      })
      .finally(() => setLoading(false));
  }, [profileId, hydratedForId, setAchievements, setUserAchievements, setHydratedForId]);

  // Memoize expensive derived data — only recompute when source arrays change
  const { unlockedIds, userAchievementMap, unlockedCount } = useMemo(() => {
    const ids = new Set(userAchievements.map((u) => u.achievement_id));
    const map = new Map(userAchievements.map((u) => [u.achievement_id, u]));
    return { unlockedIds: ids, userAchievementMap: map, unlockedCount: ids.size };
  }, [userAchievements]);

  const sortedFiltered = useMemo(() => {
    const base = filter === "all" ? achievements : achievements.filter((a) => a.category === filter);
    return base.slice().sort((a, b) => {
      const aU = unlockedIds.has(a.id) ? 0 : 1;
      const bU = unlockedIds.has(b.id) ? 0 : 1;
      return aU - bU || a.condition_value - b.condition_value;
    });
  }, [achievements, filter, unlockedIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h1 className="text-xl font-bold text-slate-100">Achievements</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {unlockedCount} / {achievements.length} unlocked
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text">{unlockedCount}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Earned</p>
        </div>
      </div>

      <Card className="p-3">
        <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
          <span>{unlockedCount} unlocked</span>
          <span>{achievements.length - unlockedCount} remaining</span>
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: achievements.length > 0 ? `${(unlockedCount / achievements.length) * 100}%` : "0%",
              background: "linear-gradient(to right, #f59e0b, #f97316)",
            }}
          />
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            label={CATEGORY_LABELS[cat] ?? cat}
            active={filter === cat}
            onClick={() => setFilter(cat)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {sortedFiltered.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            userAchievement={userAchievementMap.get(achievement.id)}
          />
        ))}
        {sortedFiltered.length === 0 && (
          <p className="text-center text-sm text-slate-600 py-8">No achievements in this category.</p>
        )}
      </div>
    </div>
  );
}

const FilterChip = memo(function FilterChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
});
