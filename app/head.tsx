import { headers } from 'next/headers';

export default function Head({title, subtitle}: {title: string, subtitle: string}) {
  const headersInstance = headers();
  // Fallback tagline
  if (!title) title = 'Share Environment Variables Securely';
  if (!subtitle) subtitle = 'EnvShare';

  // Hacky way to resolve the scheme for locally running EnvShare
  const scheme = headersInstance.get('host').includes('localhost') ? 'http' : 'https';

  // Either host or referer?
  const url = new URL(`${scheme}://${headersInstance.get('host')}/api/v1/og?title=${encodeURIComponent(title)}&=subtitle=${encodeURIComponent(subtitle)}`);

  const imgURL = `${url.toString()}`;
  return (
    <>
      <title>EnvShare</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={title} />
      <meta property='og:image' content={imgURL} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={title} />
      <meta property="og:image:width" content="1200"/>
      <meta property="og:image:height" content="630"/>
    </>
  );
}
