import { Stats } from "./components/stats";
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
    </div>
  );
}
