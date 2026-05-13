"use client";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Title } from "@components/title";
import React from "react";

const steps: {
  name: string;
  description: React.ReactNode;
  cta?: { href: string; label: string };
}[] = [
  {
    name: "Create a new Redis database on Upstash",
    description: (
      <>
        Upstash offers a serverless Redis database with a generous free tier of up to 10,000 requests per day.
        {"That's"} more than enough.
        <br />
        <br />
        Click the button below to sign up and create a new Redis database on Upstash.
      </>
    ),
    cta: { href: "https://console.upstash.com/redis", label: "Create database" },
  },
  {
    name: "Copy the REST connection credentials",
    description: (
      <p>
        After creating the database, scroll to the bottom and make a note of{" "}
        <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> — you need them in the next
        step.
      </p>
    ),
  },
  {
    name: "Deploy to Vercel",
    description:
      "Deploy the app to Vercel and paste the connection credentials into the environment variables for your project.",
    cta: {
      href: "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchronark%2Fenvshare&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN&demo-title=Share%20Environment%20Variables%20Securely&demo-url=https%3A%2F%2Fcryptic.vercel.app",
      label: "Deploy to Vercel",
    },
  },
];

const descriptionCode =
  "[&_code]:rounded-md [&_code]:border [&_code]:border-border [&_code]:bg-muted/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:font-medium [&_code]:text-foreground";

const ctaClass =
  "inline-flex h-10 w-full max-w-sm items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-foreground shadow-sm transition hover:bg-muted/60";

export default function Deploy() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-12 md:px-12 md:pt-16 lg:pt-20">
      <Title>Deploy EnvShare for Free</Title>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
        You can deploy your own hosted version of EnvShare — you only need Upstash and Vercel accounts.
      </p>

      <ol className="mx-auto mt-14 max-w-2xl md:mt-20" role="list">
        {steps.map((step, idx) => (
          <li key={step.name} className="relative flex gap-5 pb-14 last:pb-0 md:gap-8 md:pb-20">
            <div className="flex w-11 shrink-0 flex-col items-center md:w-12">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted font-mono text-xs font-semibold tabular-nums text-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              {idx < steps.length - 1 ? (
                <span className="mt-3 min-h-[2.5rem] w-px flex-1 bg-border" aria-hidden />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h2 className="text-lg font-medium leading-snug tracking-tight text-foreground md:text-xl">{step.name}</h2>
              <div className={`mt-3 text-sm leading-relaxed text-muted-foreground ${descriptionCode}`}>
                {step.description}
              </div>
              {step.cta ? (
                <div className="mt-8">
                  <Link
                    href={step.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ctaClass}
                  >
                    <span>{step.cta.label}</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  </Link>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
