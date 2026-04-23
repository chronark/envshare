"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitHubStarsBadge } from "@components/github-stars-badge";
import { ThemeToggle } from "@components/theme-toggle";
import { headerChrome } from "@components/header-chrome";

const navigation = [
  { name: "Share", href: "/share" },
  { name: "Unseal", href: "/unseal" },
  { name: "Deploy", href: "/deploy" },
] as const;

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="relative z-20 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:h-[4.25rem] sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:px-12">
        <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start sm:gap-4">
          <Link
            href="/"
            className="min-w-0 font-mono text-sm font-medium tracking-[0.2em] text-foreground uppercase transition hover:text-muted-foreground"
          >
            EnvShare
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:justify-center">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? headerChrome.navGhostActive : headerChrome.navGhost}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-2 sm:flex">
          <GitHubStarsBadge />
          <ThemeToggle />
          <Link href="/deploy" className={headerChrome.primary}>
            Get access
          </Link>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 sm:hidden">
          <GitHubStarsBadge />
          <Link href="/deploy" className={headerChrome.primary}>
            Get access
          </Link>
        </div>
      </div>
    </header>
  );
};
