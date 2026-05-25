import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";
import { EmojiReactionLayer } from "@/components/shared/EmojiReaction";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { XpToastLayer } from "@/components/shared/XpToast";
import { LevelUpModal } from "@/components/shared/LevelUpModal";
import { AchievementToastLayer } from "@/features/achievements/components/AchievementToast";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <RealtimeProvider>
        <div className="min-h-dvh flex flex-col">
          <TopBar />
          <EmojiReactionLayer />
          <XpToastLayer />
          <AchievementToastLayer />
          <LevelUpModal />
          <main className="flex-1 pb-24 px-4 py-4 mx-auto w-full max-w-lg">
            {children}
          </main>
          <BottomNav />
        </div>
      </RealtimeProvider>
    </ToastProvider>
  );
}
