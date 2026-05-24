"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/push/subscribe";

type PermissionStatus = "default" | "granted" | "denied" | "unsupported";

export default function NotificationsPage() {
  const [status, setStatus] = useState<PermissionStatus>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as PermissionStatus);
  }, []);

  async function handleEnable() {
    setIsLoading(true);
    setSaved(false);
    try {
      const sub = await subscribeToPush();
      if (!sub) {
        setStatus(Notification.permission as PermissionStatus);
        return;
      }
      const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      if (res.ok) {
        setStatus("granted");
        setSaved(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisable() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await unsubscribeFromPush();
      }
      setStatus("default");
      setSaved(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-cyan-400" />
        <h1 className="text-2xl font-bold text-slate-100">Notifications</h1>
      </div>

      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            {status === "granted" ? (
              <Bell className="h-5 w-5 text-emerald-400" />
            ) : (
              <BellOff className="h-5 w-5 text-slate-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Event reminders</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Get notified before calendar events — even when the app is closed.
            </p>
          </div>
        </div>

        {status === "unsupported" && (
          <p className="text-xs text-slate-500 bg-white/5 rounded-xl px-4 py-3">
            Push notifications are not supported in this browser.
          </p>
        )}

        {status === "denied" && (
          <p className="text-xs text-amber-400 bg-amber-500/10 rounded-xl px-4 py-3">
            Notifications blocked. Enable them in your browser settings, then return here.
          </p>
        )}

        {status === "granted" ? (
          <div className="flex flex-col gap-2">
            {saved && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>Notifications enabled</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleDisable} loading={isLoading}>
              Turn off notifications
            </Button>
          </div>
        ) : status !== "unsupported" && status !== "denied" ? (
          <Button onClick={handleEnable} loading={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            Enable notifications
          </Button>
        ) : null}
      </Card>

      <Card className="p-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3">How it works</p>
        <ul className="flex flex-col gap-2">
          {[
            "Create a calendar event with a reminder time",
            "We'll send a push notification at the right moment",
            "Works even when your device screen is off",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-xs text-slate-400">{step}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
