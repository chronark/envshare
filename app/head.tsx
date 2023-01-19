export default function Head({title}: {title: string}) {
  // Fallback tagline
  if (!title) title = 'Share Environment Variables Securely';

  // I'll have to use a different method to generate the image URL, because window can be undefined
  const url = new URL(`http://localhost:3000/api/v1/og?title=${encodeURIComponent(title)}`);

  const imgURL = `${url.toString()}`;
  return (
    <>
      <title>EnvShare</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={title} />
      <meta property='og:image' content={imgURL} />
    </>
  );
}
