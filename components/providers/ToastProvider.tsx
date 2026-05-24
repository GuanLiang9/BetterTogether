"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  from?: string;
  type: "nudge" | "info" | "success";
}

interface ToastContextValue {
  showNudge: (message: string, from: string) => void;
  showToast: (message: string, type?: "info" | "success") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showNudge = useCallback((message: string, from: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, from, type: "nudge" }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const showToast = useCallback((message: string, type: "info" | "success" = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showNudge, showToast }}>
      {children}
      <div className="fixed top-4 right-4 left-4 z-[300] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl px-4 py-3 flex items-start gap-3 pointer-events-auto max-w-sm mx-auto w-full"
            >
              {toast.type === "nudge" && (
                <span className="text-lg shrink-0">💚</span>
              )}
              <div className="flex-1 min-w-0">
                {toast.from && (
                  <p className="text-xs text-slate-400 mb-0.5">{toast.from}</p>
                )}
                <p className="text-sm text-slate-100 font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 mt-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
