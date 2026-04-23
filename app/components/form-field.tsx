import type { PropsWithChildren } from "react";

const labelClass =
  "mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground";

const shellClass =
  "rounded-lg border border-border bg-background px-3 py-2.5 transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40 focus-within:ring-offset-2 focus-within:ring-offset-background";

export function FormFieldLabel({
  htmlFor,
  children,
}: PropsWithChildren<{ htmlFor: string }>) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
    </label>
  );
}

export function FormFieldShell({ className = "", children }: PropsWithChildren<{ className?: string }>) {
  return <div className={`${shellClass} ${className}`.trim()}>{children}</div>;
}
