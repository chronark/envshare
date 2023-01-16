"use client";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Title } from "@components/title";
import React from "react";
const steps: {
  name: string;
  description: string | React.ReactNode;
  cta?: React.ReactNode;
}[] = [
  {
    name: "Create a new Redis database on Upstash",
    description: (
      <>
        Upstash offers a serverless Redis database with a generous free tier of up to 10,000 requests per day. That's
        more than enough.
        <br />
        Click the button below to sign up and create a new Redis database on Upstash.
      </>
    ),
    cta: (
      <Link
        href="https://console.upstash.com/redis"
        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-center transition-all duration-150 rounded text-zinc-800 hover:text-zinc-100 bg-zinc-200 hover:bg-transparent ring-1 ring-zinc-100"
      >
        <span>Create Database</span>
        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
      </Link>
    ),
  },
  {
    name: "Copy the REST connection credentials",
    description: (
      <p>
        After creating the database, scroll to the bottom and make a note of <code>UPSTASH_REDIS_REST_URL</code> and{" "}
        <code>UPSTASH_REDIS_REST_TOKEN</code>, you need them in the next step
      </p>
    ),
  },
  {
    name: "Deploy to Vercel",
    description: "Deploy the app to Vercel and paste the connection credentials into the environment variables.",
    cta: (
      <Link
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchronark%2Fenvshare&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN&demo-title=Share%20Environment%20Variables%20Securely&demo-url=https%3A%2F%2Fcryptic.vercel.app"
        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-center transition-all duration-150 rounded text-zinc-800 hover:text-zinc-100 bg-zinc-200 hover:bg-transparent ring-1 ring-zinc-100"
      >
        <span>Deploy</span>
        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
      </Link>
    ),
  },
];

export default function Deploy() {
  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32 ">
      <Title>Deploy EnvShare for Free</Title>
      <p className="mt-4 text-sm text-center text-zinc-600">
        You can deploy your own hosted version of EnvShare, you just need an Upstash and Vercel account.
      </p>
      <ol className="flex flex-col items-center justify-center mt-8 md:mt-16 xl:mt-24">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative flex flex-col items-center gap-4 pb-16 group md:gap-8 md:pb-24">
            <span
              className="absolute top-4  h-full w-0.5 bg-gradient-to-b from-blue-500/60  via-blue-500/10 to-transparent"
              aria-hidden="true"
            />
            <span className="flex items-center h-9" aria-hidden="true">
              <span className="relative z-10 flex items-center justify-center w-8 h-8 text-sm text-blue-400 duration-150 border border-blue-400 rounded-full bg-zinc-900 group-hover:border-blue-500 drop-shadow-blue">
                {stepIdx + 1}
              </span>
            </span>
            <div className="z-10 flex flex-col items-center">
              <h2 className="text-xl font-medium duration-150 lg:text-2xl text-zinc-200 group-hover:text-white">
                {step.name}
              </h2>

              <div className="mt-4 text-sm text-center duration-1000 text-zinc-500 group-hover:text-zinc-400">
                {step.description}
              </div>
              <div className="w-full mt-8 md:w-auto">{step.cta}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
