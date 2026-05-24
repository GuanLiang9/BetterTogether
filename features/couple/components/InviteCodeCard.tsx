"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check, Link2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createCoupleLink, acceptInvite } from "../actions/couple.actions";

interface InviteCodeCardProps {
  existingCode?: string | null;
  isLinked?: boolean;
}

const schema = z.object({ code: z.string().min(8, "Enter the 8-character code").max(8) });

export function InviteCodeCard({ existingCode, isLinked }: InviteCodeCardProps) {
  const [code, setCode] = useState(existingCode ?? null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  async function handleGenerate() {
    startTransition(async () => {
      try {
        const link = await createCoupleLink();
        setCode(link.invite_code);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create invite");
      }
    });
  }

  async function handleAccept(data: { code: string }) {
    setError(null);
    startTransition(async () => {
      try {
        await acceptInvite(data.code);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Invalid code");
      }
    });
  }

  function copyCode() {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLinked) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Your code */}
      <Card className="p-5">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Your invite code</p>
        {code ? (
          <div className="flex items-center gap-3">
            <span className="flex-1 text-center text-2xl font-bold tracking-[0.3em] gradient-text">
              {code}
            </span>
            <button
              onClick={copyCode}
              className="rounded-lg p-2 bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-emerald-400"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          <Button onClick={handleGenerate} loading={isPending} className="w-full" variant="glass">
            <Link2 className="h-4 w-4" />
            Generate my code
          </Button>
        )}
        {code && (
          <p className="text-xs text-slate-600 text-center mt-2">
            Share this with your partner
          </p>
        )}
      </Card>

      {/* Enter partner code */}
      <Card className="p-5">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Have a code?</p>
        <form onSubmit={handleSubmit(handleAccept)} className="flex flex-col gap-3">
          <Input
            placeholder="XXXXXXXX"
            className="text-center uppercase tracking-widest text-lg font-bold"
            maxLength={8}
            {...register("code", { onChange: (e) => { e.target.value = e.target.value.toUpperCase(); } })}
            error={errors.code?.message}
          />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <Button type="submit" loading={isPending} className="w-full">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link with partner 💚"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
