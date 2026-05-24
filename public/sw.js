self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Tralancherhawk", {
      body: data.body ?? "",
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      data: { url: data.url ?? "/" },
      tag: data.tag ?? "default",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const match = list.find((c) => c.url.includes(self.location.origin) && "focus" in c);
      if (match) return match.focus();
      return clients.openWindow(url);
    }),
  );
});
