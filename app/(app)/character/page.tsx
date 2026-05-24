"use client";

import dynamic from "next/dynamic";
import { User, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { CharacterEditor } from "@/features/character/components/CharacterEditor";

// CharacterBuilder is heavy (skin/hair/outfit pickers + store reads) — code-split it
const CharacterBuilder = dynamic(
  () => import("@/features/character/components/CharacterBuilder").then((m) => m.CharacterBuilder),
  { loading: () => <CardSkeleton lines={5} />, ssr: false },
);

export default function CharacterPage() {
  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Identity card section */}
      <div>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          <h1 className="text-xl font-bold text-slate-100">Character</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">Customize your identity in the journey.</p>
      </div>

      <Card className="p-4">
        <CharacterEditor />
      </Card>

      {/* Appearance section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-emerald-400" />
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Appearance</p>
        </div>
        <Card className="p-4">
          <CharacterBuilder />
        </Card>
      </div>
    </div>
  );
}
