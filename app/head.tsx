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
      <meta name="description" content={subtitle} />
      <meta name="theme-color" content="#000000" />
      <meta name="title" content={title} />
      <meta name="keywords" content="envshare, secure, secrets, share, environment, variables" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="robots" content="all" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property='og:image' content={url.toString()} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={subtitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={baseUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={subtitle} />
      <meta property="twitter:image" content={url.toString()} />
    </>
  );
}
