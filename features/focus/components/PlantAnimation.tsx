"use client";

import { AnimatePresence, motion } from "framer-motion";

const STAGES = ["🌰", "🌱", "🌿", "🪴", "🌳", "🌲"];
const STAGE_LABELS = ["Seed", "Sprout", "Growing", "Budding", "Thriving", "Complete"];

interface PlantAnimationProps {
  stage: number;
  size?: "sm" | "md" | "lg";
}

export function PlantAnimation({ stage, size = "md" }: PlantAnimationProps) {
  const clampedStage = Math.min(5, Math.max(0, stage));
  const sizeClass = size === "sm" ? "text-2xl" : size === "lg" ? "text-6xl" : "text-4xl";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${sizeClass}`}>
        <AnimatePresence mode="wait">
          <motion.span
            key={clampedStage}
            initial={{ scale: 0.5, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="block"
          >
            {STAGES[clampedStage]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs text-slate-500">{STAGE_LABELS[clampedStage]}</span>
    </div>
  );
}
