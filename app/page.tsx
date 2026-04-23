import Link from "next/link";
import { Stats } from "./components/stats";
import { Testimonials } from "./components/testimony";
import { LandingHero } from "@components/landing-hero";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <LandingHero />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-12">
        <p className="mb-12 text-center font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Used and trusted by a growing community
        </p>
        <Stats />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-12">
        <Testimonials />
      </section>

      <section className="relative z-10 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ready to run your own instance? One-click deploy includes Upstash Redis integration.
          </p>
          <Link
            href="/deploy"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-primary bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Deploy EnvShare
          </Link>
        </div>
      </section>
    </div>
  );
}
