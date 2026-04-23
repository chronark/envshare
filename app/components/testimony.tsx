"use client";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

function twitterAvatarUrl(handle: string) {
  const h = handle.startsWith("@") ? handle.slice(1) : handle;
  return `https://unavatar.io/twitter/${encodeURIComponent(h)}`;
}

const TwitterHandle: React.FC<PropsWithChildren> = ({ children }) => {
  return <span className="text-blue-600 dark:text-blue-400">{children}</span>;
};

const Author: React.FC<PropsWithChildren<{ href: string }>> = ({ children, href }) => (
  <Link
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    className="font-medium text-foreground underline-offset-2 transition hover:underline"
  >
    {children}
  </Link>
);

const Title: React.FC<PropsWithChildren<{ href: string }>> = ({ children, href }) => (
  <Link
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    className="text-sm text-muted-foreground transition hover:text-foreground"
  >
    {children}
  </Link>
);

export const Testimonials = () => {
  const posts: {
    content: React.ReactNode;
    link: string;
    author: {
      name: React.ReactNode;
      title?: React.ReactNode;
      twitterUsername?: string;
      avatarUrl?: string;
    };
  }[] = [
    {
      content: (
        <div>
          <p>
            My cursory audit of <TwitterHandle>@chronark_</TwitterHandle>'s envshare:
          </p>
          <p>
            It is light, extremely functional, and does its symmetric block cipher correctly, unique initialization
            vectors, decryption keys derived securely.
          </p>
          <br />
          <p>Easily modified to remove minimal analytics. Superior to Privnote.</p>
          <br />
          <p>Self-hosting is easy. 👏</p>
        </div>
      ),
      link: "https://twitter.com/FrederikMarkor/status/1615299856205250560",
      author: {
        name: <Author href="https://twitter.com/FrederikMarkor">Frederik Markor</Author>,
        title: <Title href="https://discreet.net">CEO @discreet</Title>,
        twitterUsername: "FrederikMarkor",
      },
    },
    {
      content: (
        <div>
          <p>I'm particularly chuffed about this launch, for a couple of reasons:</p>
          <ul>
            <li>
              ◆ Built on <TwitterHandle>@nextjs</TwitterHandle> + <TwitterHandle>@upstash</TwitterHandle>, hosted on{" "}
              <TwitterHandle>@vercel</TwitterHandle>
            </li>
            <li>◆ 100% free to use & open source</li>
            <li>◆ One-click deploy via Vercel + Upstash integration</li>
          </ul>
          <p>Deploy your own → http://vercel.fyi/envshare</p>
        </div>
      ),
      link: "https://twitter.com/steventey/status/1615035241772482567?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1615035241772482567%7Ctwgr%5E1db44bb10c690189e24c980fcd787299961c34c6%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fpublish.twitter.com%2F%3Fquery%3Dhttps3A2F2Ftwitter.com2Fsteventey2Fstatus2F1615035241772482567widget%3DTweet",
      author: {
        name: <Author href="https://twitter.com/steventey">Steven Tey</Author>,
        title: <Title href="https://vercel.com">Senior Developer Advocate at Vercel</Title>,
        twitterUsername: "steventey",
      },
    },
    {
      content: (
        <div>
          <p>
            Congratulations on the launch <TwitterHandle>@chronark_</TwitterHandle>👏! This is such a valuable product
            for developers. Icing on the cake is that it's open source! ✨
          </p>
        </div>
      ),
      link: "https://twitter.com/DesignSiddharth/status/1615293209164546048",
      author: {
        name: <Author href="https://twitter.com/DesignSiddharth">@DesignSiddharth</Author>,
        twitterUsername: "DesignSiddharth",
      },
    },
  ];

  return (
    <section className="container mx-auto">
      <ul
        role="list"
        className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
      >
        {posts.map((post, i) => {
          const avatarSrc =
            post.author.avatarUrl ??
            (post.author.twitterUsername ? twitterAvatarUrl(post.author.twitterUsername) : null);
          return (
          <li
            key={i}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition hover:border-black/15 dark:hover:border-white/20"
          >
            <Link href={post.link} className="relative flex flex-1 flex-col p-6">
              <span
                className="mb-4 block font-serif text-5xl leading-none text-muted-foreground opacity-40"
                aria-hidden
              >
                “
              </span>
              <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {post.content}
              </div>
            </Link>
            <div className="flex items-center gap-3 border-t border-border bg-muted p-5">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-background">
                {avatarSrc ? (
                  <img
                    className="h-full w-full object-cover"
                    src={avatarSrc}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium text-muted-foreground">
                    ?
                  </div>
                )}
              </div>
              <div className="min-w-0 text-foreground">
                <div className="text-sm">{post.author.name}</div>
                {post.author.title ? (
                  <div className="mt-0.5 text-xs text-muted-foreground">{post.author.title}</div>
                ) : null}
              </div>
            </div>
          </li>
          );
        })}
      </ul>
    </section>
  );
};
