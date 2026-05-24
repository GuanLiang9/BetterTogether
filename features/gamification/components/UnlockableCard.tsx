"use client";

import { Lock, CheckCircle2, Zap, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import type { Unlockable, UserUnlockable } from "@/types/app.types";

const CATEGORY_EMOJI: Record<string, string> = {
  theme: "🎨",
  plant_skin: "🌱",
  badge: "🏆",
  reaction: "💬",
  couple_frame: "💑",
  sound: "🔔",
};

interface UnlockableCardProps {
  item: Unlockable;
  userItem: UserUnlockable | undefined;
  userLevel: number;
  userXp: number;
  userCoins: number;
  isLinked: boolean;
  onPurchase: (id: string) => Promise<{ ok?: boolean; error?: string }>;
  onEquip: (item: Unlockable) => Promise<{ ok?: boolean; error?: string }>;
  isPurchasing: boolean;
  isEquipping: boolean;
}

export function UnlockableCard({
  item,
  userItem,
  userLevel,
  userXp,
  userCoins,
  isLinked,
  onPurchase,
  onEquip,
  isPurchasing,
  isEquipping,
}: UnlockableCardProps) {
  const owned = !!userItem;
  const equipped = userItem?.equipped ?? false;
  const coinCost = item.coin_cost ?? 0;

  const meetsLevel = userLevel >= item.level_required;
  const meetsXp = userXp >= item.xp_required;
  const meetsCouple = !item.couple_only || isLinked;
  const meetsRequirements = meetsLevel && meetsXp && meetsCouple;
  const canAfford = coinCost === 0 || userCoins >= coinCost;
  const isFree = coinCost === 0;
  const canBuy = !isFree && meetsRequirements && canAfford && !owned;
  const isLocked = !owned && (!meetsRequirements || (!isFree && !canAfford));

  let lockReason = "";
  if (!meetsLevel) lockReason = `Level ${item.level_required} required`;
  else if (!meetsXp) lockReason = `${item.xp_required.toLocaleString("en-SG")} XP required`;
  else if (!meetsCouple) lockReason = "Link with a partner first";
  else if (!isFree && !canAfford) lockReason = `Need ${coinCost.toLocaleString("en-SG")} more coins`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass rounded-2xl p-4 flex flex-col gap-3 border transition-colors",
        equipped
          ? "border-emerald-500/40 bg-emerald-500/5"
          : isLocked
          ? "border-white/5 opacity-70"
          : "border-white/8",
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0",
          equipped ? "bg-emerald-500/20" : "bg-white/8",
        )}>
          {isLocked
            ? <Lock className="h-4 w-4 text-slate-500" />
            : CATEGORY_EMOJI[item.category] ?? "✨"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-slate-200 truncate">{item.name}</span>
            {equipped && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/15 rounded-full px-1.5 py-0.5 shrink-0">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Equipped
              </span>
            )}
            {owned && !equipped && (
              <span className="text-[10px] font-medium text-cyan-400 bg-cyan-500/15 rounded-full px-1.5 py-0.5 shrink-0">
                Owned
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
          )}
        </div>
      </div>

      {/* Requirements */}
      <div className="flex flex-wrap items-center gap-1.5">
        {item.level_required > 1 && (
          <span className={cn(
            "text-[10px] rounded-full px-2 py-0.5 font-medium",
            meetsLevel ? "text-slate-500 bg-white/5" : "text-amber-400 bg-amber-500/10",
          )}>
            Lv.{item.level_required}
          </span>
        )}
        {item.xp_required > 0 && (
          <span className={cn(
            "inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 font-medium",
            meetsXp ? "text-slate-500 bg-white/5" : "text-amber-400 bg-amber-500/10",
          )}>
            <Zap className="h-2.5 w-2.5" />
            {item.xp_required.toLocaleString("en-SG")} XP
          </span>
        )}
        {coinCost > 0 && (
          <span className={cn(
            "text-[10px] rounded-full px-2 py-0.5 font-medium",
            canAfford ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10",
          )}>
            🪙 {coinCost.toLocaleString("en-SG")}
          </span>
        )}
        {item.couple_only && (
          <span className={cn(
            "inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 font-medium",
            meetsCouple ? "text-pink-400 bg-pink-500/10" : "text-slate-500 bg-white/5",
          )}>
            <Heart className="h-2.5 w-2.5" />
            Couple
          </span>
        )}
        {isFree && !owned && meetsRequirements && (
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5 font-medium">
            Auto-unlock
          </span>
        )}
      </div>

      {/* Lock reason */}
      {isLocked && lockReason && (
        <p className="text-[11px] text-slate-500 flex items-center gap-1">
          <Lock className="h-3 w-3 shrink-0" />
          {lockReason}
        </p>
      )}

      {/* Action */}
      {canBuy && (
        <Button
          size="sm"
          onClick={() => onPurchase(item.id)}
          loading={isPurchasing}
          className="w-full gap-1.5"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Buy · 🪙 {coinCost.toLocaleString("en-SG")}
        </Button>
      )}
      {owned && !equipped && (
        <Button
          size="sm"
          variant="glass"
          onClick={() => onEquip(item)}
          loading={isEquipping}
          className="w-full"
        >
          Equip
        </Button>
      )}
    </motion.div>
  );
}
