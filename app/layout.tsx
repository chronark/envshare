import "./globals.css";
import { Inter } from "@next/font/google";
import Link from "next/link";
import { Header } from "./header";

import { Analytics } from "@components/analytics";
import { AmbientGrain } from "@components/ambient-grain";
import { ThemeProvider } from "@components/theme-provider";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <AmbientGrain />
        </div>
        <ThemeProvider>
          {process.env.ENABLE_VERCEL_ANALYTICS ? <Analytics /> : null}

          <Header />

          <main className="relative z-10 min-h-[80vh]">{children}</main>

          <footer className="relative z-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-12 text-center text-xs text-muted-foreground md:px-12">
              <p>
                Built by{" "}
                <Link
                  href="https://twitter.com/chronark_"
                  className="font-semibold text-foreground underline-offset-2 transition hover:underline"
                >
                  @chronark_
                </Link>
                {" and "}
                <Link
                  href="https://github.com/chronark/envshare/graphs/contributors"
                  className="underline underline-offset-2 transition hover:text-foreground"
                >
                  many others
                </Link>
              </p>
              <p>
                EnvShare is deployed on{" "}
                <Link
                  target="_blank"
                  href="https://vercel.com"
                  className="underline underline-offset-2 transition hover:text-foreground"
                >
                  Vercel
                </Link>{" "}
                and uses{" "}
                <Link
                  target="_blank"
                  href="https://upstash.com"
                  className="underline underline-offset-2 transition hover:text-foreground"
                >
                  Upstash
                </Link>{" "}
                for storing encrypted data.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
