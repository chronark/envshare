export const headerChrome = {
  ghost:
    "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent px-3 text-sm font-medium text-muted-foreground transition hover:border-border hover:bg-muted/60 hover:text-foreground",
  ghostActive:
    "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted px-3 text-sm font-medium text-foreground transition",
  /** Primary app routes — matches ENVSHARE wordmark (mono, caps, tracking). */
  navGhost:
    "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent px-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition hover:border-border hover:bg-muted/60 hover:text-foreground",
  navGhostActive:
    "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted px-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-foreground transition",
  surface:
    "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/60",
  surfaceIcon:
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-sm transition hover:bg-muted/60",
  primary:
    "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-primary bg-primary px-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-sm transition hover:opacity-90",
} as const;
