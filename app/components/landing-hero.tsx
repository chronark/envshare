"use client";

import Link from "next/link";
import { ParticleField } from "@components/particle-field";

export function LandingHero() {
  return (
    <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-8 pb-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16 md:px-12 md:pt-16 md:pb-24">
      <div className="relative order-2 max-w-xl md:order-1">
        <Link
          href="https://github.com/chronark/envshare"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.2em] text-muted-foreground transition hover:bg-accent"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
          Open source on GitHub
        </Link>
        <h1 className="mt-6 font-sans text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-[56px]">
          Share environment variables{" "}
          <em className="not-italic text-muted-foreground">securely</em>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          Your document is encrypted in your browser before being stored for a limited period of time and read
          operations. Unencrypted data never leaves your browser.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/deploy"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-primary bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 md:h-11 md:px-6"
          >
            Deploy
          </Link>
          <Link
            href="/share"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-input bg-popover px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent md:h-11 md:px-6"
          >
            Share
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-10 font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
          Simple · Secure · Private by design
        </div>
      </div>

      <div className="relative order-1 h-[320px] md:order-2 md:h-[520px]">
        <div className="absolute inset-0">
          <ParticleField
            src="/particle-padlock.png"
            className="rounded-2xl"
            sampleStep={2}
            threshold={42}
            dotSize={1.05}
            mouseForce={75}
            mouseRadius={120}
            spring={0.032}
            damping={0.88}
            renderScale={0.92}
            denseParticles
            adaptToTheme
          />
        </div>
        {/* Vignette into page bg — in dark mode this layer sits on top of the canvas and would wash out light particles, so skip it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl dark:hidden"
          style={{
            background:
              "radial-gradient(65% 55% at 50% 50%, transparent 55%, hsl(var(--background) / 0.88) 100%)",
          }}
        />
      </div>
    </section>
  );
}
