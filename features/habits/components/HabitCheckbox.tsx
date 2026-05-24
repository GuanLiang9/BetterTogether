"use client";

import { AnimatePresence, motion } from "framer-motion";

interface HabitCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  color?: string;
}

export function HabitCheckbox({ checked, onChange, disabled, color = "#10b981" }: HabitCheckboxProps) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90"
      style={{
        borderColor: checked ? color : "rgba(255,255,255,0.2)",
        backgroundColor: checked ? color : "transparent",
      }}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 28 }}
            className="h-4 w-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
