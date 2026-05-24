"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCouple } from "../hooks/useCouple";

const NUDGES = [
  "You got this! 💪",
  "Don't forget your habits! 🌿",
  "Let's study together! 📚",
  "Thinking of you 💚",
  "Time to focus! 🍅",
];

export function NudgeButton() {
  const { sendNudgeMessage } = useCouple();
  const [sent, setSent] = useState(false);

  async function handleNudge() {
    const msg = NUDGES[Math.floor(Math.random() * NUDGES.length)];
    await sendNudgeMessage(msg);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <Button
      variant="glass"
      onClick={handleNudge}
      disabled={sent}
      className="w-full gap-2"
    >
      <Bell className="h-4 w-4" />
      {sent ? "Nudge sent! 💚" : "Send a nudge"}
    </Button>
  );
}
