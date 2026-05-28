"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ── DATA ──────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Demo", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
];

// FOCUSED: Only 3 core features
const features = [
  {
    emoji: "💬",
    title: "AI Reply Generator",
    tag: "Core feature",
    description:
      "Paste any message. Pick your vibe. Get a reply that sounds exactly like you — not cringe, not robotic, just confident.",
    detail: "Funny · Flirty · Confident · Soft romantic",
  },
  {
    emoji: "📱",
    title: "Dating Profile Review",
    tag: "Core feature",
    description:
      "We analyze your photos, bio, and first impression. You get a ranked photo order, a rewritten bio, and one clear action to take today.",
    detail: "Photo ranking · Bio rewrite · Red flag scan",
  },
  {
    emoji: "🧠",
    title: "Confidence Coach",
    tag: "Core feature",
    description:
      "Daily micro missions that turn overthinking into action. It's not therapy — it's just a patient friend who's really good at this.",
    detail: "Daily missions · Pep prompts · Progress tracking",
  },
];

// Realistic demo scenarios
const demoScenarios = [
  {
    id: "seen",
    label: "😬 Left on seen",
    them: "Seen ✓✓",
    context: "She's been online but hasn't replied for 2 days.",
    replies: {
      funny: "ok i'll just talk to myself then, i'm also great company",
      confident: "hey — still want to grab that coffee or should i take the hint?",
      soft: "no pressure at all, just wanted to check if you were still up for it 💙",
      savage: "noted 💀 moving on",
    },
  },
  {
    id: "k",
    label: "🥶 Sent 'k.'",
    them: "k.",
    context: "You sent a paragraph. She sent one letter.",
    replies: {
      funny: '"k." is wild — that\'s 1 letter and a period. that\'s a hostage note 😭',
      confident: "short replies don't scare me. when are you free this week?",
      soft: "you good? feel free to talk when you're ready 🤍",
      savage: "crazy how you typed that with the same fingers you use to swipe right on me 💀",
    },
  },
  {
    id: "double",
    label: "💭 Double text?",
    them: "…(no reply in 6 hours)",
    context: "You want to follow up but don't want to seem desperate.",
    replies: {
      funny: "ok update: i ate lunch without you and it was fine but barely",
      confident: "following up — worth a second thought?",
      soft: "hope your day is going well, no rush 🌿",
      savage: "lmk if you lost your phone or just your interest",
    },
  },
  {
    id: "dry",
    label: "😐 Dry texter",
    them: "haha yeah",
    context: "Every reply is 2 words. You don't know if they're bored or just like this.",
    replies: {
      funny: "ok but are you dry texting me or is this just your love language",
      confident: "you're a texter-light person. i respect it. voice note instead?",
      soft: "you don't have to perform, i like talking to you as you are",
      savage: "genuinely cannot tell if we're vibing or you're replying out of guilt",
    },
  },
];

const beforeAfters = [
  { before: "ok cool", after: "nah you can't just disappear after saying that 😭", context: "After she cancelled plans" },
  { before: "haha yeah same", after: "wait okay but actually — what's the most embarrassing thing that ever happened to you", context: "Dead conversation" },
  { before: "sounds good", after: "i'm in. you're buying the first round though, that's my non-negotiable", context: "Making plans" },
  { before: "lol true", after: "you're actually kind of chaotic and i'm here for all of it", context: "When she's funny" },
];

const pricingPlans = [
  {
    tier: "Starter",
    price: "$0",
    period: "forever",
    items: [
      "3 profile scans / month",
      "10 AI replies / day",
      "Basic photo ranking",
      "Confidence Coach (limited)",
    ],
    primary: false,
    button: "Start free →",
    note: "No card needed",
  },
  {
    tier: "Pro",
    price: "$12",
    period: "/mo",
    items: [
      "Unlimited profile scans",
      "Unlimited AI replies",
      "Photo + bio rewrites",
      "All personality modes",
      "Green / red flag radar",
      "Full Confidence Coach",
    ],
    primary: true,
    accent: "Most popular",
    button: "Get Pro →",
    note: "Cancel any time",
  },
  {
    tier: "Wingman+",
    price: "$29",
    period: "/mo",
    items: [
      "Everything in Pro",
      "Custom personality model",
      "Date planning scripts",
      "AI voice coach",
      "Priority support",
    ],
    primary: false,
    button: "Go Wingman+ →",
    note: "For serious daters",
  },
];

const overthinkerReasons = [
  "You re-read a message 12 times before sending.",
  "You write a reply, delete it, write it again.",
  "You ask 3 friends what to say.",
  "You still don't send it.",
];

const heroAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face",
];

const testimonials = [
  {
    handle: "@noahcodes",
    meta: "20 · Austin",
    quote: "I used to spend 20 mins on every reply. Now I just tap and send. The 'sounds like you' part is real — it doesn't sound like a bot.",
    color: "from-pink-400 to-purple-600",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
  },
  {
    handle: "@itsmaria.exe",
    meta: "23 · NYC",
    quote: "I'm an introvert and writing first messages made me spiral. Winger literally fixed that. It still sounds like me, just… braver.",
    color: "from-cyan-400 to-blue-600",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
  },
  {
    handle: "@kai_xx",
    meta: "19 · London",
    quote: "the confidence coach is underrated. daily missions actually made me stop freezing when someone matches me.",
    color: "from-fuchsia-500 to-rose-600",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=96&h=96&fit=crop&crop=face",
  },
];

// Believable launch numbers
const stats = [
  { value: "AI", label: "replies generated" },
  { value: "Better", label: "profiles improved" },
  { value: "Trust", label: "App Store rating" },
  { value: "Result", label: "felt more confident" },
];

// ── COMPONENT ─────────────────────────────────────────────────────────
export default function Home() {
  const rootRef = useRef(null);
  const [selectedScenario, setSelectedScenario] = useState("k");
  const [selectedVibe, setSelectedVibe] = useState("funny");
  const [watchlistEmail, setWatchlistEmail] = useState("");
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState("");
  const [heroScore, setHeroScore] = useState(0);
  const [vibeScore] = useState(() => Math.floor(Math.random() * 20) + 70);

  const scenario = demoScenarios.find((s) => s.id === selectedScenario);
  const currentReply = scenario?.replies[selectedVibe] ?? "";

  const starFields = useMemo(
    () =>
      Array.from({ length: 100 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        scale: Math.random() * 1.1 + 0.3,
      })),
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleScroll = () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      const bar = document.getElementById("progress-bar");
      if (bar) bar.style.width = `${Math.min(Math.max(pct, 0), 100)}%`;
    };

    const handlePointerMove = (e) => {
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
      document.querySelectorAll(".spot").forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--cx", `${e.clientX - r.left}px`);
        el.style.setProperty("--cy", `${e.clientY - r.top}px`);
      });
    };

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    // Hero score animation
    const target = 8.7;
    let cur = 0;
    const step = () => {
      cur += 0.2;
      if (cur >= target) { setHeroScore(target.toFixed(1)); return; }
      setHeroScore(cur.toFixed(1));
      requestAnimationFrame(step);
    };
    setTimeout(() => requestAnimationFrame(step), 600);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      revealObserver.disconnect();
    };
  }, []);

  const handleWatchlistSubmit = async (e) => {
    e.preventDefault();
    setWatchlistLoading(true);
    setWatchlistMessage("");
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: watchlistEmail }),
      });
      const data = await response.json();
      if (!response.ok) { setWatchlistMessage(data.error || "Failed to join watchlist"); return; }
      setWatchlistMessage("✅ You're on the list! Check your email.");
      setWatchlistEmail("");
    } catch {
      setWatchlistMessage("Network error. Please try again.");
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <main ref={rootRef} className="page-root relative overflow-hidden bg-[#060011] text-white">

      {/* ── BACKGROUND ───────────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="blob" style={{ width: 500, height: 500, background: "#e11d7a", top: -140, left: -140 }} />
        <div className="blob" style={{ width: 580, height: 580, background: "#7c3aed", top: "28%", right: -180, animationDelay: "-5s" }} />
        <div className="blob" style={{ width: 440, height: 440, background: "#0e7490", bottom: -120, left: "25%", animationDelay: "-9s" }} />
        <div className="absolute inset-0">
          {starFields.map((s, i) => (
            <div key={i} className="star" style={{ top: s.top, left: s.left, animationDelay: s.delay, transform: `scale(${s.scale})` }} />
          ))}
        </div>
      </div>

      <div id="progress-bar" className="fixed top-0 left-0 z-50 h-[2px] bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-400" style={{ width: 0 }} />

      {/* ── CURSOR GLOW ──────────────────────────────────────────────── */}
      <div className="cursor-glow" />

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 px-5 py-4 md:px-8">
        <div className="glass-nav rounded-[28px] px-5 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl grad-bg grid place-items-center overflow-hidden">
          <img
            src="/logo.png"
            alt="winger.ai logo"
            className="w-full h-full object-contain"
          />
        </div>
            <span className="font-display text-lg font-bold tracking-tight">
              winger<span className="text-rose-400">.ai</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/60">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 justify-end">
            <a href="#pricing" className="hidden sm:inline-flex glass-pill px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
              Sign in
            </a>
            <a href="#pricing" className="grad-btn rounded-2xl px-4 py-2.5 text-sm font-semibold">
              Get Winger →
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-8 md:pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-[1fr_420px] gap-14 items-center">
          <div className="space-y-7">

            {/* Badge */}
            <div className="hero-el inline-flex items-center gap-2 glass-pill px-3 py-1.5 text-xs font-medium text-white/75" style={{ animationDelay: "0.05s" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Built for introverts, overthinkers &amp; dry texters
            </div>

            {/* Headline — emotional punch */}
            <h1 className="hero-el font-display text-5xl md:text-[68px] font-extrabold leading-[1.0] tracking-[-0.04em]" style={{ animationDelay: "0.15s" }}>
              <span className="block text-white">Never panic over</span>
              <span className="block grad-text">a text again.</span>
            </h1>

            <p className="hero-el max-w-[520px] text-lg text-white/65 leading-relaxed" style={{ animationDelay: "0.28s" }}>
              Winger is your anxiety-free AI wingman. It reads the situation, matches your personality, and gives you the exact reply to send — so you can stop spiraling and just talk.
            </p>

            {/* CTA */}
            <div className="hero-el flex flex-col sm:flex-row gap-3" style={{ animationDelay: "0.4s" }}>
              <a href="#demo" className="grad-btn rounded-[26px] px-7 py-4 text-base font-semibold inline-flex items-center gap-2 justify-center">
                💬 Generate a Reply Free
              </a>
              <a href="#how" className="glass-pill rounded-[26px] px-7 py-4 text-base font-semibold inline-flex items-center gap-2 justify-center text-white/80 hover:text-white transition-colors">
                See how it works
              </a>
            </div>

            {/* Social proof */}
            <div className="hero-el flex flex-wrap items-center gap-5" style={{ animationDelay: "0.5s" }}>
              <div className="flex -space-x-2.5">
                {heroAvatars.map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#060011] overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/60">
                <span className="text-yellow-300 mr-1">★★★★★</span>
                <span className="text-white font-medium">4.9</span> · loved by 12k+ overthinkers
              </div>
            </div>

            {/* Privacy note — builds trust early */}
            <div className="hero-el flex items-center gap-2 text-xs text-white/40" style={{ animationDelay: "0.58s" }}>
              <span>🔒</span>
              <span>Chats never stored · Private by default · Screenshots stay encrypted</span>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative flex justify-center">
            <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-br from-rose-600/30 via-violet-600/20 to-cyan-500/20 blur-3xl" />
            <div className="phone float">
              <div className="absolute inset-0 pt-14 px-4 pb-4 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between text-white/50 text-[11px]">
                  <span>9:41</span><span>winger.ai</span>
                </div>

                {/* Score card */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Your Vibe Score</div>
                  <div className="flex items-end gap-3">
                    <span className="font-display text-4xl font-bold grad-text leading-none">{heroScore}</span>
                    <span className="text-emerald-400 text-xs font-medium mb-1">+1.4 this week ↑</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-400" style={{ width: "87%" }} />
                  </div>
                </div>

                {/* Personality mode */}
                <div className="glass-card rounded-2xl p-3">
                  <div className="text-[10px] text-white/40 mb-2">Your texting mode</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["😂 Funny", "😏 Flirty", "💎 Confident", "🌸 Soft"].map((mode, i) => (
                      <span key={mode} className={`text-[10px] rounded-full px-2 py-0.5 border ${i === 0 ? "border-rose-400/50 text-rose-300 bg-rose-500/10" : "border-white/10 text-white/40"}`}>
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reply suggestion */}
                <div className="glass-card rounded-2xl p-3 flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-full grad-bg grid place-items-center text-[9px] font-bold">AI</div>
                    <span className="text-[10px] text-white/50">Suggested reply · funny mode</span>
                  </div>
                  <div className="text-[12px] leading-snug text-white/85">
                    "ok but are you dry texting me or is this just your love language"
                  </div>
                  <div className="mt-2 flex gap-1">
                    <div className="text-[9px] rounded-full bg-rose-500/15 text-rose-300 px-2 py-0.5 border border-rose-500/20">sounds like you</div>
                    <div className="text-[9px] rounded-full bg-white/5 text-white/40 px-2 py-0.5 border border-white/10">not cringe</div>
                  </div>
                </div>

                {/* Overthinker check */}
                <div className="glass-card rounded-xl p-3">
                  <div className="text-[10px] text-emerald-400 mb-1">✓ Overthinking prevented</div>
                  <div className="text-[11px] text-white/60">Reply sent in 4 seconds</div>
                </div>
              </div>
            </div>

            {/* Floating callouts */}
            <div className="absolute -left-4 md:-left-8 top-16 glass-strong rounded-2xl px-3 py-2.5 float-delay text-xs max-w-[190px]">
              <div className="flex items-center gap-2">
                <span className="text-base">😮‍💨</span>
                <div>
                  <div className="font-semibold text-white">Stop spiraling</div>
                  <div className="text-white/50 text-[10px]">reply in seconds, not hours</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 md:-right-4 top-28 glass-strong rounded-2xl px-3 py-2.5 float text-xs max-w-[200px]">
              <div className="flex items-center gap-2">
                <span className="text-base">🔒</span>
                <div>
                  <div className="font-semibold text-white">Private by default</div>
                  <div className="text-white/50 text-[10px]">nothing stored, ever</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-2 md:-left-10 bottom-28 glass-strong rounded-2xl px-3 py-2.5 float-slow text-xs max-w-[205px]">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <div>
                  <div className="font-semibold text-white">Sounds like you</div>
                  <div className="text-white/50 text-[10px]">not a bot, not cringe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section className="py-8 border-y border-white/5">
        <div className="mx-auto max-w-5xl px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center ${i < 3 ? "md:border-r border-white/10" : ""}`}>
              <div className="font-display text-3xl font-bold grad-text">{s.value}</div>
              <div className="mt-1 text-xs text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERTHINKER SECTION ──────────────────────────────────────── */}
      <section className="py-24 reveal">
        <div className="mx-auto max-w-5xl px-5 md:px-8 text-center">
          <div className="label-chip">🌙 For overthinkers</div>
          <h2 className="font-display mt-5 text-4xl md:text-6xl font-extrabold leading-[1.04] tracking-tight">
            You know this <span className="grad-text">feeling</span>.
          </h2>
          <p className="mt-5 text-xl text-white/60 max-w-xl mx-auto">
            You got a message. A normal, simple message. And somehow it turned into a 45-minute crisis.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overthinkerReasons.map((reason, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 text-left reveal spot">
                <div className="text-2xl mb-3">{"😰🔄💭😶�[i]"[i]}{"😰🔄💭😶".charAt(i)}</div>
                <p className="text-sm text-white/75 leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 glass-card rounded-2xl p-6 max-w-lg mx-auto border border-rose-500/20">
            <p className="text-lg font-semibold text-white/90">Winger fixes the loop.</p>
            <p className="mt-2 text-white/55 text-sm">
              Paste the message. Pick your vibe. Send in seconds. Built for people who feel too much and text too carefully.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES (3 only) ────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-xl reveal">
            <div className="label-chip">⚙️ What Winger does</div>
            <h2 className="font-display mt-5 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Three things. <span className="grad-text">Done right.</span>
            </h2>
            <p className="mt-4 text-white/55 text-lg">
              We didn't build 20 features. We built 3 really well.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className={`glass-card rounded-3xl p-7 lift reveal spot ${i === 0 ? "border border-rose-500/25" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-2xl grad-bg grid place-items-center text-2xl">{f.emoji}</div>
                <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-rose-400">{f.tag}</div>
                <h3 className="mt-3 font-display text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-white/55 text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 glass-pill inline-block px-3 py-1 text-xs text-white/50">{f.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOUNDS LIKE YOU ──────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-rose-900/10 via-violet-900/10 to-transparent border-y border-white/5">
        <div className="mx-auto max-w-5xl px-5 md:px-8 reveal">
          <div className="text-center mb-12">
            <div className="label-chip">🎙️ Personality modes</div>
            <h2 className="font-display mt-5 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Replies that sound like <span className="grad-text">you</span>.
            </h2>
            <p className="mt-4 text-white/55 text-lg max-w-xl mx-auto">
              Not a bot. Not a pickup line. Choose a mode, get a reply that actually matches who you are.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "😂", mode: "Funny", desc: "Playful, quick wit, keeps the vibe light.", color: "rose" },
              { icon: "😏", mode: "Flirty", desc: "Confident tension, leaves them wanting more.", color: "violet" },
              { icon: "💎", mode: "Confident", desc: "Direct, calm, unbothered energy.", color: "cyan" },
              { icon: "🌸", mode: "Soft romantic", desc: "Warm, genuine, emotionally intelligent.", color: "pink" },
            ].map((m) => (
              <div key={m.mode} className="glass-card rounded-2xl p-5 text-center lift spot">
                <div className="text-4xl">{m.icon}</div>
                <div className="mt-3 font-semibold text-white">{m.mode} mode</div>
                <p className="mt-2 text-xs text-white/50 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-white/40">
            Winger learns your personality over time — it gets more "you" with every reply.
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how" className="py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="text-center max-w-xl mx-auto reveal">
            <div className="label-chip">🧠 How it works</div>
            <h2 className="font-display mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
              From <span className="grad-text">"hey"</span> to <span className="grad-text">"when are you free?"</span>
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Paste the message", desc: "Drop any screenshot, text, or context. We read the vibe before you have to." },
              { n: "02", title: "Pick your mode", desc: "Choose funny, flirty, confident, or soft. Winger builds a reply around your personality." },
              { n: "03", title: "Send with confidence", desc: "One tap and you're done. No second-guessing. No deleted drafts. Just a response that works." },
            ].map((step) => (
              <div key={step.n} className="glass-card rounded-3xl p-8 reveal spot">
                <div className="font-display text-6xl font-extrabold grad-text leading-none">{step.n}</div>
                <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-white/55 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ─────────────────────────────────────────────────── */}
      <section id="demo" className="py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-start">
          <div className="reveal space-y-6">
            <div className="label-chip">🎯 Live demo</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Pick a situation.<br /><span className="grad-text">Get the reply.</span>
            </h2>
            <p className="text-white/60 text-lg">Real scenarios. Real anxiety. Real solutions.</p>

            {/* Scenario selector */}
            <div className="flex flex-wrap gap-2">
              {demoScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedScenario(s.id); setSelectedVibe("funny"); }}
                  className={`glass-pill px-4 py-2 text-sm transition-all ${selectedScenario === s.id ? "border-rose-500/50 bg-rose-500/10 text-white" : "text-white/60 hover:text-white"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Context */}
            <div className="glass-card rounded-xl px-4 py-3 text-sm text-white/60 border-l-2 border-rose-500/40">
              📋 {scenario?.context}
            </div>

            {/* Vibe selector */}
            <div className="flex flex-wrap gap-2">
              {["funny", "confident", "soft", "savage"].map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVibe(v)}
                  className={`glass-pill px-4 py-2 text-sm transition-all capitalize ${selectedVibe === v ? "border-violet-500/50 bg-violet-500/10 text-white" : "text-white/60 hover:text-white"}`}
                >
                  {v === "funny" && "😂 "}{v === "confident" && "💎 "}{v === "soft" && "🌸 "}{v === "savage" && "🔥 "}{v}
                </button>
              ))}
            </div>

            {/* Reply box */}
            <div className="glass-card rounded-2xl p-5 border border-violet-500/20">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/40 mb-2">AI suggested reply</div>
              <div className="text-base leading-relaxed text-white/90 min-h-[3rem]" key={`${selectedScenario}-${selectedVibe}`}>
                {currentReply}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="grad-btn rounded-xl px-4 py-2 text-sm font-semibold">Use this</button>
                <button className="glass-pill px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">Regenerate</button>
              </div>
            </div>
          </div>

          {/* Phone with demo */}
          <div className="reveal">
            <div className="phone mx-auto float-slow">
              <div className="absolute inset-0 pt-14 px-4 pb-4 flex flex-col text-sm">
                <div className="text-center pb-3 border-b border-white/8">
                  <div className="w-11 h-11 mx-auto rounded-full overflow-hidden border-2 border-rose-400/30">
                    <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=face" alt="Maya" className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-1 font-semibold text-sm">Maya</div>
                  <div className="text-[10px] text-white/40">matched 3 days ago</div>
                </div>

                <div className="flex-1 flex flex-col gap-2 py-4 overflow-hidden">
                  <div className="self-start max-w-[75%] glass-card rounded-2xl rounded-tl-md px-3 py-2 text-[12px]">
                    so wym you're a "professional yapper" 😭
                  </div>
                  <div className="self-end max-w-[75%] grad-bg rounded-2xl rounded-tr-md px-3 py-2 text-[12px]">
                    i talk for a living. literally.
                  </div>
                  <div className="self-start max-w-[75%] glass-card rounded-2xl rounded-tl-md px-3 py-2 text-[12px]">
                    {scenario?.them}
                  </div>
                  <div className="self-start max-w-[85%] glass-card rounded-2xl rounded-tl-md px-3 py-2 text-[12px] border border-violet-500/30">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-cyan-400 mb-1">✨ Winger</div>
                    <div className="text-white/85">{currentReply}</div>
                  </div>
                </div>

                <div className="glass-card rounded-full px-3 py-2 flex items-center gap-2 text-[11px] text-white/40">
                  <span>type a message…</span>
                  <div className="ml-auto flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-violet-900/10 to-transparent border-y border-white/5">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="text-center reveal">
            <div className="label-chip">✨ The glow-up</div>
            <h2 className="font-display mt-5 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Before Winger. <span className="grad-text">After Winger.</span>
            </h2>
            <p className="mt-4 text-white/55 text-lg">Same situation. Completely different energy.</p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 gap-5">
            {beforeAfters.map((item, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden reveal spot" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/30 border-b border-white/8">
                  {item.context}
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-4 border-r border-white/8">
                    <div className="text-[10px] text-white/30 mb-2">❌ Before</div>
                    <div className="text-sm text-white/50 leading-relaxed">"{item.before}"</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-rose-500/5 to-violet-500/5">
                    <div className="text-[10px] text-rose-400 mb-2">✓ After Winger</div>
                    <div className="text-sm text-white/90 leading-relaxed">"{item.after}"</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="text-center reveal">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold">Real <span className="grad-text">confidence boosts</span>.</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.handle} className="glass-card rounded-3xl p-6 lift reveal spot">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <img src={t.avatar} alt={t.handle} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.handle}</div>
                    <div className="text-xs text-white/40">{t.meta}</div>
                  </div>
                </div>
                <p className="mt-4 text-white/75 text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-3 text-yellow-300 text-xs">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY SECTION ──────────────────────────────────────────── */}
      <section className="py-20 border-y border-white/5">
        <div className="mx-auto max-w-5xl px-5 md:px-8 reveal">
          <div className="glass-card rounded-3xl p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center border border-white/8">
            <div>
              <div className="label-chip">🔒 Privacy first</div>
              <h2 className="font-display mt-4 text-3xl md:text-4xl font-extrabold">Your chats are yours. <span className="grad-text">Always.</span></h2>
              <p className="mt-3 text-white/55 leading-relaxed">
                We know you're pasting private messages. That's exactly why we built Winger to never store, log, or read your conversations after generating a reply.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Chats never stored", "Screenshots stay encrypted", "No data sold — ever", "Delete account instantly"].map((item) => (
                  <span key={item} className="glass-pill text-xs text-white/60 px-3 py-1.5">✓ {item}</span>
                ))}
              </div>
            </div>
            <div className="text-7xl text-center select-none">🛡️</div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="text-center max-w-xl mx-auto reveal">
            <div className="label-chip">💸 Pricing</div>
            <h2 className="font-display mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
              Pick your <span className="grad-text">plan</span>.
            </h2>
            <p className="mt-3 text-white/50">Cancel any time. Way cheaper than therapy after a ghost.</p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-3xl p-7 lift reveal ${plan.primary ? "neon-border" : "glass-card"}`}
                style={plan.primary ? { background: "linear-gradient(160deg, rgba(225,29,122,0.12), rgba(124,58,237,0.08))" } : {}}
              >
                {plan.accent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 grad-bg text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.accent}
                  </div>
                )}
                <div className={`text-sm font-medium ${plan.primary ? "text-rose-400" : "text-white/50"}`}>{plan.tier}</div>
                <div className="mt-2 font-display text-5xl font-extrabold">
                  {plan.price}<span className="text-base text-white/40 font-normal">{plan.period}</span>
                </div>
                <div className="text-xs text-white/35 mt-0.5">{plan.note}</div>
                <ul className="mt-6 space-y-2.5 text-sm text-white/75">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#" className={`${plan.primary ? "grad-btn" : "glass-pill hover:bg-white/8"} mt-8 block rounded-xl py-3 text-center font-semibold text-sm transition-colors`}>
                  {plan.button}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIRAL SHARE TEASER ────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center reveal">
          <div className="label-chip">📊 Coming soon</div>
          <h2 className="font-display mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
            What's your <span className="grad-text">texting archetype</span>?
          </h2>
          <p className="mt-3 text-white/50 text-base max-w-md mx-auto">
            Take the 60-second test. Get your texting vibe score, confidence level, and flirting archetype — and share it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { emoji: "🎯", label: "Vibe score", sub: "out of 10" },
              { emoji: "🛡️", label: "Texting style", sub: "your archetype" },
              { emoji: "📈", label: "Confidence level", sub: "this week" },
            ].map((card) => (
              <div key={card.label} className="glass-card rounded-2xl px-5 py-4 text-center min-w-[120px]">
                <div className="text-2xl">{card.emoji}</div>
                <div className="mt-2 font-semibold text-sm">{card.label}</div>
                <div className="text-xs text-white/40">{card.sub}</div>
              </div>
            ))}
          </div>
          <a href="#pricing" className="mt-8 inline-block grad-btn rounded-2xl px-7 py-3.5 font-semibold text-sm">
            Get my score →
          </a>
        </div>
      </section>

      {/* ── WATCHLIST ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-xl px-5 md:px-8 text-center reveal">
          <div className="label-chip">🚀 Early access</div>
          <h2 className="font-display mt-5 text-4xl font-extrabold tracking-tight">
            Join the <span className="grad-text">waitlist</span>.
          </h2>
          <p className="mt-3 text-white/55">Early access + lifetime bonuses. No spam — pinky promise.</p>
          <div className="mt-8">
            <form onSubmit={handleWatchlistSubmit} className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={watchlistEmail}
                  onChange={(e) => setWatchlistEmail(e.target.value)}
                  className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/35 focus:outline-none focus:border-rose-500/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={watchlistLoading}
                  className="grad-btn rounded-xl px-6 py-3 text-sm font-semibold whitespace-nowrap disabled:opacity-60"
                >
                  {watchlistLoading ? "Joining…" : "Join →"}
                </button>
              </div>
              {watchlistMessage && (
                <div className={`text-xs rounded-xl p-3 ${watchlistMessage.includes("✅") ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                  {watchlistMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl grad-bg grid place-items-center overflow-hidden">
          <img
            src="/logo.png"
            alt="winger.ai logo"
            className="w-full h-full object-contain"
          />
        </div>
            <span className="font-display font-bold">winger.ai</span>
            <span className="text-white/30 text-sm">© 2026 · made with Swaraj'dev</span>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-white/40 justify-center">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://www.instagram.com/frankyy_dev" className="hover:text-white transition-colors">Instagram</a>
             
          </div>
        </div>
      </footer>

      {/* ── STYLES ────────────────────────────────────────────────────── */}
      <style jsx global>{`
        :root { color-scheme: dark; }

        body {
          background: #060011;
          color: #fff;
          font-family: 'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif;
          scroll-behavior: smooth;
          overflow-x: hidden;
        }

        .font-display {
          font-family: 'Sora', 'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif;
        }

        /* Google Fonts import */
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .page-root { min-height: 100vh; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          position: absolute;
          inset: 0;
        }

        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(110px);
          opacity: 0.14;
          animation: drift 16s ease-in-out infinite;
        }

        .cursor-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 30;
          background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(225,29,122,0.07), transparent 42%);
        }

        /* Gradients */
        .grad-text {
          background: linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .grad-bg {
          background: linear-gradient(135deg, #e11d78, #7c3aed, #0891b2);
        }

        .grad-btn {
          background: linear-gradient(135deg, #e11d78 0%, #7c3aed 55%, #0891b2 100%);
          background-size: 200% 200%;
          color: white;
          box-shadow: 0 8px 32px -8px rgba(124,58,237,0.65);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: inline-block;
        }
        .grad-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px -10px rgba(225,29,122,0.65);
        }

        /* Glass surfaces */
        .glass-nav {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 80px -40px rgba(0,0,0,0.5);
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .glass-strong {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.14);
        }

        .glass-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          display: inline-block;
          cursor: pointer;
        }

        /* Label chip */
        .label-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(225,29,122,0.15), rgba(14,116,144,0.12));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.75);
        }

        /* Neon border for pricing */
        .neon-border {
          position: relative;
          overflow: hidden;
        }
        .neon-border::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, #e11d78, #7c3aed, #06b6d4, #e11d78);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: borderShift 6s linear infinite;
          pointer-events: none;
        }

        /* Phone */
        .phone {
          width: 296px;
          height: 610px;
          border-radius: 46px;
          background: linear-gradient(180deg, #0c0322, #120534);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 50px 100px -30px rgba(124,58,237,0.5), inset 0 0 0 5px #000;
          position: relative;
          overflow: hidden;
        }
        .phone::after {
          content: "";
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 26px;
          border-radius: 18px;
          background: #000;
          z-index: 10;
        }

        /* Reveal animation */
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.85s cubic-bezier(.2,.7,.2,1), transform 0.85s cubic-bezier(.2,.7,.2,1);
        }
        .reveal.in { opacity: 1; transform: none; }

        /* Hero entrance */
        .hero-el {
          opacity: 0;
          transform: translateY(24px);
          animation: heroFadeUp 0.7s cubic-bezier(.22,.85,.32,1) forwards;
        }
        @keyframes heroFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hover lift */
        .lift {
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .lift:hover {
          transform: translateY(-6px) scale(1.015);
          border-color: rgba(225,29,122,0.35);
          box-shadow: 0 24px 60px -20px rgba(225,29,122,0.5);
        }

        /* Spotlight on hover */
        .spot { position: relative; overflow: hidden; }
        .spot::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          background: radial-gradient(350px circle at var(--cx, 50%) var(--cy, 50%), rgba(225,29,122,0.15), transparent 40%);
        }
        .spot:hover::before { opacity: 1; }

        /* Floats */
        .float { animation: floatY 6s ease-in-out infinite; }
        .float-slow { animation: floatY 9s ease-in-out infinite; }
        .float-delay { animation: floatY 7s ease-in-out infinite; animation-delay: -3s; }

        /* Stars */
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: rgba(255,255,255,0.8);
          animation: twinkle 3s ease-in-out infinite;
        }

        /* Animations */
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-18px); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(25px, -18px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50%       { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes borderShift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        @media (max-width: 768px) {
          .phone { width: 260px; height: 540px; }
        }
      `}</style>
    </main>
  );
}