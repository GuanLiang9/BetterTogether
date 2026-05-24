import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @deno-types="https://esm.sh/web-push@3/index.d.ts"
import webPush from "https://esm.sh/web-push@3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

webPush.setVapidDetails(
  `mailto:${Deno.env.get("VAPID_CONTACT_EMAIL")}`,
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

Deno.serve(async () => {
  const now = new Date().toISOString();

  // Fetch unsent reminders due now
  const { data: reminders, error } = await supabase
    .from("reminders")
    .select("id, event_id, target_user_ids, events(title, emoji, starts_at)")
    .lte("remind_at", now)
    .eq("sent", false)
    .limit(50);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!reminders?.length) return new Response(JSON.stringify({ processed: 0 }));

  let sent = 0;

  for (const reminder of reminders) {
    const event = (reminder as unknown as { events: { title: string; emoji: string; starts_at: string } }).events;
    if (!event) continue;

    const startsAt = new Date(event.starts_at);
    const diffMs = startsAt.getTime() - Date.now();
    const diffMins = Math.round(diffMs / 60000);
    const timeStr = diffMins <= 0
      ? "now"
      : diffMins < 60
      ? `in ${diffMins} min`
      : diffMins < 1440
      ? `in ${Math.round(diffMins / 60)}h`
      : `in ${Math.round(diffMins / 1440)}d`;

    const payload = JSON.stringify({
      title: `${event.emoji ?? "📅"} ${event.title}`,
      body: `Starts ${timeStr}`,
      url: "/calendar",
      tag: `reminder-${reminder.id}`,
    });

    const userIds: string[] = reminder.target_user_ids ?? [];

    for (const userId of userIds) {
      const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", userId);

      for (const sub of subs ?? []) {
        try {
          await webPush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          );
          sent++;
        } catch {
          // Stale subscription — remove it
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        }
      }
    }

    await supabase.from("reminders").update({ sent: true }).eq("id", reminder.id);
  }

  return new Response(JSON.stringify({ processed: reminders.length, sent }));
});
