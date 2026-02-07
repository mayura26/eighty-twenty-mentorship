"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const WHOP_URL = "https://whop.com/8020";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "1‑on‑1 Mentorship",
    desc: "Personalized coaching sessions tailored to your trading style, goals, and experience level.",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0",
  },
  {
    title: "Live Trading",
    desc: "Trade side‑by‑side in real time with screen sharing, live commentary, and instant feedback.",
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
  },
  {
    title: "Custom Strategy",
    desc: "A personalized trading plan built around your risk tolerance, capital, and schedule.",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75",
  },
  {
    title: "Exclusive Dinner",
    desc: "A private sit‑down dinner to connect, strategize, and build a lasting mentorship relationship.",
    icon: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-4.5a18.72 18.72 0 01-12 0",
  },
  {
    title: "Ongoing Support",
    desc: "Continued access to your mentor for Q&A, trade reviews, and guidance long after the program ends.",
    icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  },
  {
    title: "Limited to 5 Spots",
    desc: "Enrollment is intentionally capped to guarantee an elite, high‑touch experience.",
    icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
  },
];

const PDF_PERKS = [
  "Complete day trading strategy guide",
  "Core concepts & chart setups",
  "Risk management framework",
  "Entry & exit rules explained",
  "Self‑paced, lifetime access",
];

const MENTORSHIP_PERKS = [
  "Everything in the PDF",
  "Personal 1‑on‑1 mentorship sessions",
  "Live trading with real‑time screen share",
  "Custom strategy built for you",
  "Private dinner with your mentor",
  "Ongoing support & trade reviews",
];

/* ------------------------------------------------------------------ */
/*  Tiny components                                                    */
/* ------------------------------------------------------------------ */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CtaButton({ onClick, children, size = "lg" }: { onClick: () => void; children: React.ReactNode; size?: "lg" | "md" }) {
  const sizing = size === "lg" ? "px-12 py-4 text-base sm:px-14 sm:py-5 sm:text-lg" : "px-8 py-3 text-sm";
  return (
    <button
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-blue-500 font-bold uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-105 ${sizing}`}
    >
      <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative">{children}</span>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-accent-glow/20 bg-accent-glow/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent-glow">
      {children}
    </span>
  );
}

function PaymentButton({ children, href = WHOP_URL, size = "lg", fullWidth }: { children: React.ReactNode; href?: string; size?: "lg" | "md"; fullWidth?: boolean }) {
  const sizing = size === "lg" ? "px-12 py-4 text-base sm:px-14 sm:py-5 sm:text-lg" : "px-8 py-3 text-sm";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-blue-500 font-bold uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-105 ${sizing} ${fullWidth ? "w-full" : ""}`}
    >
      <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <svg className="relative h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
      <span className="relative whitespace-nowrap">{children}</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* Scroll‑triggered animations */
  const setupObserver = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.12 },
    );
    node.querySelectorAll(".animate-on-scroll, .animate-scale-on-scroll, .stagger-children")
      .forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  /* Sticky nav shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPricing = () => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div ref={setupObserver} className="relative overflow-x-hidden">

      {/* =============== STICKY NAV =============== */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-lg shadow-lg shadow-black/20" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="8020Trading" width={44} height={44} className="h-10 w-10 sm:h-11 sm:w-11" />
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-accent-glow to-primary-blue bg-clip-text text-transparent">8020Trading</span>
          </a>
          <CtaButton onClick={scrollToPricing} size="md">Get Started</CtaButton>
        </div>
      </nav>

      {/* =============== HERO =============== */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24">
        {/* BG layers */}
        <Image src="/background.png" alt="" fill className="object-cover opacity-15" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-pulse absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary-purple/12 blur-[180px]" />
          <div className="glow-pulse absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary-blue/15 blur-[140px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <SectionLabel>Limited Enrollment — Only 5 Spots</SectionLabel>

          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[1.08] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            <span className="text-foreground">Master the Art of </span>
            <span className="bg-gradient-to-r from-primary-purple via-accent-glow to-primary-blue bg-clip-text text-transparent">Day Trading</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            An exclusive, hands‑on mentorship program designed to transform you into a confident, profitable trader.
          </p>

          {/* Headshot */}
          <div className="relative mt-12">
            <div className="absolute -inset-5 rounded-full bg-gradient-to-br from-primary-purple/50 to-primary-blue/50 blur-2xl" />
            <div className="relative h-48 w-48 overflow-hidden rounded-full ring-[3px] ring-white/10 sm:h-60 sm:w-60">
              <Image src="/headshot.png" alt="Your Mentor" fill className="object-cover" priority />
            </div>
          </div>

          {/* CTA — prices shown in pricing section */}
          <div className="mt-10">
            <CtaButton onClick={scrollToPricing}>Get Started</CtaButton>
          </div>
        </div>
      </section>

      <div className="glow-divider mx-auto max-w-4xl" />

      {/* =============== MENTOR BIO =============== */}
      <section className="relative px-6 py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-pulse absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-primary-purple/8 blur-[160px]" />
        </div>

        <div className="animate-on-scroll relative z-10 mx-auto grid max-w-5xl items-center gap-16 lg:grid-cols-[1fr_1.3fr]">
          {/* Photo side */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary-purple/20 to-primary-blue/20 blur-2xl" />
              <div className="relative h-72 w-72 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-80 sm:w-80">
                <Image src="/headshot.png" alt="Your Mentor" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Copy side */}
          <div>
            <SectionLabel>Meet Your Mentor</SectionLabel>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
              Learn Directly From a Proven Trader
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              With years of experience in the markets and a track record of consistent profitability, your mentor has helped traders go from beginners to full‑time professionals. This isn&apos;t theory — it&apos;s battle‑tested knowledge delivered one‑on‑one.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              You&apos;ll get direct access — no group calls, no pre‑recorded videos, no fluff. Just real mentorship built around your goals.
            </p>
            <div className="mt-8">
              <CtaButton onClick={scrollToPricing} size="md">Start Your Journey</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <div className="glow-divider mx-auto max-w-4xl" />

      {/* =============== WHAT'S INCLUDED =============== */}
      <section className="relative px-6 py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-pulse absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-blue/6 blur-[200px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="animate-on-scroll text-center">
            <SectionLabel>What&apos;s Included</SectionLabel>
            <h2 className="mt-5 text-3xl font-extrabold text-foreground sm:text-5xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              This isn&apos;t another cookie‑cutter course. Every element is designed for hands‑on, high‑impact learning.
            </p>
          </div>

          <div className="stagger-children mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="animate-on-scroll group rounded-2xl border border-card-border bg-card/50 p-7 backdrop-blur-sm transition-all duration-300 hover:border-accent-glow/20 hover:bg-card hover:shadow-[0_0_30px_rgba(124,58,237,0.08)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-purple/10 text-accent-glow transition-colors duration-300 group-hover:bg-primary-purple/20">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="glow-divider mx-auto max-w-4xl" />

      {/* =============== PRICING =============== */}
      <section id="pricing" className="relative px-6 py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-pulse absolute bottom-0 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary-purple/8 blur-[180px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="animate-on-scroll text-center">
            <SectionLabel>Your Investment</SectionLabel>
            <h2 className="mt-5 text-3xl font-extrabold text-foreground sm:text-5xl">
              Choose Your Path
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
              Start with the strategy guide or go all‑in with personal mentorship.
            </p>
          </div>

          <div className="stagger-children mt-14 grid gap-6 sm:grid-cols-2">

            {/* ---- PDF Tier ---- */}
            <div className="animate-on-scroll rounded-3xl border border-card-border bg-card/50 p-8 backdrop-blur-sm sm:p-10 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Strategy Guide</span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-black text-foreground">$149</span>
                <span className="text-sm font-medium text-muted">one‑time</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The complete 8020 day trading strategy — distilled into an actionable PDF you can study at your own pace.
              </p>

              <ul className="mt-8 flex flex-1 flex-col gap-3 text-left">
                {PDF_PERKS.map((v) => (
                  <li key={v} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-glow" />
                    {v}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <PaymentButton size="md" fullWidth>Get the PDF</PaymentButton>
              </div>
            </div>

            {/* ---- Mentorship Tier ---- */}
            <div className="animate-on-scroll relative rounded-3xl p-px bg-gradient-to-b from-accent-glow/30 via-card-border to-primary-blue/30 flex flex-col">
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>

              <div className="rounded-3xl bg-card/95 p-8 backdrop-blur-sm sm:p-10 flex flex-col h-full">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-glow">1‑on‑1 Mentorship</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black bg-gradient-to-r from-primary-purple via-accent-glow to-primary-blue bg-clip-text text-transparent">$8,020</span>
                  <span className="text-sm font-medium text-muted">/ month</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  The full experience — personal mentorship, live trading, custom strategy, dinner, and ongoing support.
                </p>

                <ul className="mt-8 flex flex-1 flex-col gap-3 text-left">
                  {MENTORSHIP_PERKS.map((v) => (
                    <li key={v} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-glow" />
                      {v}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  <PaymentButton fullWidth>Secure Your Spot</PaymentButton>
                </div>
              </div>
            </div>
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="max-w-md text-center text-sm leading-relaxed text-muted">
              Both options available at checkout — choose the PDF ($149) or 8020 mentorship (monthly).
            </p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <svg className="h-4 w-4 text-accent-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Secure checkout powered by Whop
            </div>
            <div className="flex items-center gap-4 text-muted/60">
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-wider">VISA</span>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-wider">MC</span>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-wider">AMEX</span>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold tracking-wider">APPLE PAY</span>
            </div>
          </div>
        </div>
      </section>

      {/* =============== FINAL CTA BANNER =============== */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/10 via-card to-primary-blue/10" />
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-pulse absolute left-1/4 top-0 h-[300px] w-[300px] rounded-full bg-primary-purple/15 blur-[120px]" />
          <div className="glow-pulse absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-primary-blue/15 blur-[120px]" />
        </div>

        <div className="animate-on-scroll relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Ready to Take Your Trading to the Next Level?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Spots are limited. Don&apos;t miss your chance to learn from a mentor who&apos;s been where you want to go.
          </p>
          <div className="mt-8">
            <PaymentButton>Secure Your Spot</PaymentButton>
          </div>
        </div>
      </section>

      {/* =============== FOOTER =============== */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-sm text-muted">
          <Image src="/logo.png" alt="8020" width={36} height={36} className="h-9 w-9 opacity-90" />
          <p>&copy; {new Date().getFullYear()} 8020 Day Trading Mentorship. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
