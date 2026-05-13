import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export const revalidate = 60;

export const Stats = asyncComponent(async () => {
  const [reads, writes] = await redis
    .pipeline()
    .get("envshare:metrics:reads")
    .get("envshare:metrics:writes")
    .exec<[number | null, number | null]>();
  const stars = await fetch("https://api.github.com/repos/chronark/envshare")
    .then((res) => res.json())
    .then((json) => json.stargazers_count as number);

  const stats = [
    {
      label: "Documents Encrypted",
      value: writes ?? 0,
    },
    {
      label: "Documents Decrypted",
      value: reads ?? 0,
    },
  ] satisfies { label: string; value: number }[];

  if (stars) {
    stats.push({
      label: "GitHub Stars",
      value: stars,
    });
  }

  return (
    <section className="w-full">
      <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12">
        {stats.map(({ label, value }) => (
          <li key={label} className="flex flex-col items-center justify-center gap-2 px-6 py-8 sm:py-6">
            <dd className="text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-5xl">
              {Intl.NumberFormat("en-US", { notation: "compact" }).format(value)}
            </dd>
            <dt className="text-center text-sm text-muted-foreground">{label}</dt>
          </li>
        ))}
      </ul>
    </section>
  );
});

function asyncComponent<T, R>(fn: (arg: T) => Promise<R>): (arg: T) => R {
  return fn as (arg: T) => R;
}
