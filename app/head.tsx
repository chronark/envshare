import { headers } from "next/headers";

export default function Head({ title, subtitle }: { title: string; subtitle: string }) {
  // Fallback tagline
  title ??= "Share Environment Variables Securely";
  subtitle ??= "EnvShare";

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  const url = new URL("/api/v1/og", baseUrl);
  url.searchParams.set("title", title);
  url.searchParams.set("subtitle", subtitle);

  return (
    <>
      <title>EnvShare</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={title} />
      <meta property='og:image' content={url.toString()} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  );
}
