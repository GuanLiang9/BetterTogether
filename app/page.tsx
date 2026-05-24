import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[#050a14] text-slate-100 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm">
            🌿
          </div>
          <span className="font-bold text-sm gradient-text">Tralancherhawk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-1.5 rounded-full gradient-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />
          <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-cyan-500/6 blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-violet-500/6 blur-[80px]" />
        </div>

        {/* Badge */}
        <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs text-emerald-400 animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          For couples who grow together
        </div>

        {/* Headline */}
        <h1 className="relative max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl animate-fade-up">
          Build your life together,{" "}
          <span className="gradient-text">one habit at a time</span>
        </h1>

        <p className="relative mt-4 max-w-md text-base text-slate-400 leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Shared habits, focus sessions, a couple calendar, and a virtual home you build together —
          all wrapped in a gamified loop that rewards consistency.
        </p>

        {/* CTAs */}
        <div className="relative mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Link
            href="/signup"
            className="px-7 py-3 rounded-full gradient-accent text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="px-7 py-3 rounded-full border border-white/12 bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Floating feature pills */}
        <div className="relative mt-12 flex flex-wrap justify-center gap-2 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: "🔥", label: "Habit Streaks" },
            { icon: "🍅", label: "Focus Timer" },
            { icon: "📅", label: "Shared Calendar" },
            { icon: "🏡", label: "Couple Home" },
            { icon: "🏆", label: "Achievements" },
            { icon: "👤", label: "Characters" },
            { icon: "💝", label: "Reactions" },
            { icon: "🎮", label: "XP & Levels" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-slate-400"
            >
              {icon} {label}
            </span>
          ))}
        </div>

        {/* Hero card mockup */}
        <div className="relative mt-14 w-full max-w-sm mx-auto animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="glass rounded-3xl border border-white/10 p-5 shadow-2xl shadow-black/40">
            {/* XP bar */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Habit Keeper</p>
                <p className="text-base font-bold gradient-text">Level 4</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-400 font-medium">⚡ 2,340 XP</p>
                <p className="text-[10px] text-orange-400">🔥 14d streak</p>
              </div>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-4">
              <div className="h-full w-[62%] rounded-full" style={{ background: "linear-gradient(to right,#10b981,#06b6d4)" }} />
            </div>
            {/* Habit rows */}
            {[
              { done: true,  label: "Morning Meditation",  xp: "+15 XP" },
              { done: true,  label: "Read 30 minutes",     xp: "+10 XP" },
              { done: false, label: "Evening Walk",        xp: "+12 XP" },
            ].map(({ done, label, xp }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] ${done ? "border-emerald-400 bg-emerald-400" : "border-white/20"}`}>
                  {done && "✓"}
                </div>
                <span className={`text-sm flex-1 ${done ? "text-slate-300 line-through decoration-slate-600" : "text-slate-200"}`}>{label}</span>
                {done && <span className="text-[10px] text-emerald-400 font-medium">{xp}</span>}
              </div>
            ))}
          </div>
          {/* Partner card */}
          <div className="absolute -bottom-4 -right-4 glass rounded-2xl border border-white/10 p-3 w-44 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-sm">A</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#050a14]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Alex</p>
                <p className="text-[10px] text-emerald-400">● Online</p>
              </div>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">Completed 2/3 habits today 🔥</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Everything you need</p>
          <h2 className="text-center text-3xl font-extrabold text-slate-100 mb-2">Built for two</h2>
          <p className="text-center text-slate-500 text-sm mb-12">
            Every feature is designed so you and your partner experience it together in real time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🔥",
                color: "from-orange-500/15 to-red-500/10 border-orange-500/20",
                iconBg: "bg-orange-500/15",
                title: "Shared Habit Tracking",
                body: "Create habits together or individually. See your partner's streaks, cheer them on with emoji reactions, and unlock streak bonuses when you both stay consistent.",
              },
              {
                icon: "🍅",
                color: "from-emerald-500/15 to-teal-500/10 border-emerald-500/20",
                iconBg: "bg-emerald-500/15",
                title: "Focus Timer",
                body: "Pomodoro and freeform modes. Start a couple focus session and grow your plant together — your partner's timer shows in real time so you lock in simultaneously.",
              },
              {
                icon: "📅",
                color: "from-cyan-500/15 to-blue-500/10 border-cyan-500/20",
                iconBg: "bg-cyan-500/15",
                title: "Couple Calendar",
                body: "Add shared events with reminders. A countdown banner shows your next event so neither of you forgets what's coming up.",
              },
              {
                icon: "🏡",
                color: "from-violet-500/15 to-purple-500/10 border-violet-500/20",
                iconBg: "bg-violet-500/15",
                title: "Shared Home",
                body: "Build and decorate your virtual home together on an 8×6 room grid. Buy furniture with coins earned from your habits and focus sessions.",
              },
              {
                icon: "🏆",
                color: "from-amber-500/15 to-yellow-500/10 border-amber-500/20",
                iconBg: "bg-amber-500/15",
                title: "Achievements & Rewards",
                body: "20 achievements across habits, focus, streaks, and couple milestones. Daily login rewards that grow with your streak. XP, coins, and levels keep things fresh.",
              },
              {
                icon: "👤",
                color: "from-pink-500/15 to-rose-500/10 border-pink-500/20",
                iconBg: "bg-pink-500/15",
                title: "Character Customisation",
                body: "Build your character with skin tones, hair styles, and outfits. Unlock special outfits from the shop. Your character shows up in your shared home.",
              },
            ].map(({ icon, color, iconBg, title, body }) => (
              <div
                key={title}
                className={`rounded-2xl border bg-gradient-to-br ${color} p-5 flex flex-col gap-3`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-xl`}>
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative px-6 py-20 border-t border-white/6">
        <div className="mx-auto max-w-lg">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">How it works</p>
          <h2 className="text-center text-3xl font-extrabold text-slate-100 mb-12">Up and running in minutes</h2>

          <div className="flex flex-col gap-8 relative">
            {/* Connector line */}
            <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-emerald-500/40 via-cyan-500/20 to-transparent" />

            {[
              {
                step: "01",
                title: "Create your account",
                body: "Sign up with email or Google. Set your display name, timezone, and avatar to get started.",
                detail: "Takes about 60 seconds",
              },
              {
                step: "02",
                title: "Link with your partner",
                body: "Share your unique 8-character invite code with your partner. Once they enter it, you're linked — your streaks, home, and calendar are now shared.",
                detail: "Instant sync via realtime",
              },
              {
                step: "03",
                title: "Build habits together",
                body: "Create shared or individual habits. Complete them daily to earn XP and coins. See your partner's progress in real time and send emoji reactions.",
                detail: "XP awarded automatically",
              },
              {
                step: "04",
                title: "Spend coins, grow together",
                body: "Use coins to unlock themes, plant skins, outfits, and furniture for your shared home. Level up to unlock premium items.",
                detail: "Rewards grow with streaks",
              },
            ].map(({ step, title, body, detail }) => (
              <div key={step} className="flex gap-5 relative">
                <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-emerald-400">{step}</span>
                </div>
                <div className="pt-1 pb-2">
                  <h3 className="text-sm font-bold text-slate-100 mb-1">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1.5">{body}</p>
                  <span className="inline-block text-[10px] text-emerald-500/70 bg-emerald-500/8 border border-emerald-500/15 rounded-full px-2 py-0.5">
                    {detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMIFICATION CALLOUT ── */}
      <section className="relative px-6 py-20 border-t border-white/6">
        <div className="mx-auto max-w-lg">
          <div className="glass rounded-3xl border border-white/10 p-8 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex justify-center gap-2 mb-4 text-2xl">
                <span className="animate-float" style={{ animationDelay: "0s" }}>⚡</span>
                <span className="animate-float" style={{ animationDelay: "0.3s" }}>🔥</span>
                <span className="animate-float" style={{ animationDelay: "0.6s" }}>🏆</span>
                <span className="animate-float" style={{ animationDelay: "0.9s" }}>💎</span>
                <span className="animate-float" style={{ animationDelay: "1.2s" }}>👑</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-100 mb-2">Earn as you grow</h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Every completed habit, every focus session, every shared moment earns XP and coins.
                Level up together through 10 levels — from Seedling to Legend.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: "🌱", label: "Level 1", sub: "Seedling" },
                  { icon: "🌿", label: "Level 5", sub: "Rising Star" },
                  { icon: "👑", label: "Level 10", sub: "Legend" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="rounded-xl bg-white/4 border border-white/8 py-3">
                    <div className="text-xl mb-1">{icon}</div>
                    <p className="text-xs font-bold text-slate-200">{label}</p>
                    <p className="text-[10px] text-slate-500">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUPLE HOME CALLOUT ── */}
      <section className="relative px-6 py-20 border-t border-white/6">
        <div className="mx-auto max-w-lg flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-2">Your shared space</p>
            <h2 className="text-3xl font-extrabold text-slate-100 mb-3">Build a home, one coin at a time</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Earn coins from your daily habits and focus sessions, then spend them in the Shop to furnish your
              virtual home. Your partner sees every change in real time — it&apos;s your shared creative space.
            </p>
          </div>
          {/* Mini room mockup */}
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 overflow-hidden">
            <div className="grid gap-0" style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(4, 44px)" }}>
              {Array.from({ length: 32 }, (_, i) => {
                const items: Record<number, string> = { 2:"🛋️", 3:"🛋️", 8:"📚", 16:"🪴", 22:"💡", 28:"☕", 30:"🐱" };
                return (
                  <div key={i} className="border border-white/4 flex items-center justify-center text-lg">
                    {items[i] ?? ""}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2 border-t border-white/6 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">6 items placed · 42 spots free</span>
              <span className="text-[10px] text-violet-400">Cozy Night theme</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative px-6 py-24 border-t border-white/6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-emerald-500/8 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-md text-center flex flex-col items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/25 animate-float">
            🌿
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-100 mb-2">Ready to grow together?</h2>
            <p className="text-slate-400 text-sm">Free to use. No credit card. Just you two.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Link
              href="/signup"
              className="flex-1 py-3 rounded-full gradient-accent text-white font-bold text-sm text-center hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="flex-1 py-3 rounded-full border border-white/12 bg-white/5 text-slate-300 font-semibold text-sm text-center hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/6 px-6 py-8">
        <div className="mx-auto max-w-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs">🌿</div>
            <span className="text-xs font-semibold gradient-text">Tralancherhawk</span>
          </div>
          <p className="text-xs text-slate-600">For couples who grow together 💚</p>
        </div>
      </footer>
    </div>
  );
}
