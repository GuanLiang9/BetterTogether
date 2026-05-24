import { createClient } from "@/lib/supabase/server";
import { PartnerCard } from "@/features/couple/components/PartnerCard";
import { ReactionPanel } from "@/features/couple/components/ReactionPanel";
import { NudgeButton } from "@/features/couple/components/NudgeButton";
import { InviteCodeCard } from "@/features/couple/components/InviteCodeCard";
import { Card } from "@/components/ui/Card";
import { Heart } from "lucide-react";

export default async function PartnerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let coupleData: { invite_code: string | null; status: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("couple_id")
      .eq("id", user.id)
      .returns<{ couple_id: string | null }[]>()
      .single();

    if (profile?.couple_id) {
      const { data: couple } = await supabase
        .from("couple_links")
        .select("invite_code, status")
        .eq("id", profile.couple_id)
        .returns<{ invite_code: string | null; status: string }[]>()
        .single();
      coupleData = couple;
    }
  }

  const isLinked = coupleData?.status === "active";

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-pink-400" />
        <h1 className="text-2xl font-bold text-slate-100">Partner</h1>
      </div>

      {isLinked ? (
        <>
          <PartnerCard />
          <ReactionPanel />
          <NudgeButton />
        </>
      ) : (
        <>
          <Card className="p-4 text-center">
            <p className="text-sm text-slate-500 mb-1">No partner linked yet 🌱</p>
            <p className="text-xs text-slate-600">Share your code or enter your partner&apos;s code below.</p>
          </Card>
          <InviteCodeCard existingCode={coupleData?.invite_code} isLinked={false} />
        </>
      )}
    </div>
  );
}
