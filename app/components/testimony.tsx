"use client";
import Image from "next/image";
import Link from "next/link";
import { Props } from "next/script";
import React, { PropsWithChildren } from "react";

const TwitterHandle: React.FC<PropsWithChildren> = ({ children }) => {
  return <span className="text-blue-500">{children}</span>;
};

const Author: React.FC<PropsWithChildren<{ href: string }>> = ({ children, href }) => (
  <Link target="_blank" rel="noopener noreferrer" href={href} className="duration-150 text-zinc-200 hover:text-zinc-50">
    {children}
  </Link>
);

const Title: React.FC<PropsWithChildren<{ href: string }>> = ({ children, href }) => (
  <Link
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    className="text-sm duration-150 text-zinc-500 hover:text-zinc-300"
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
      image: string;
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
        image: "https://pbs.twimg.com/profile_images/1438061314010664962/NecuMIGR_400x400.jpg",
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
        image: "https://pbs.twimg.com/profile_images/1506792347840888834/dS-r50Je_400x400.jpg",
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
        image: "https://pbs.twimg.com/profile_images/1613772710009765888/MbSblJYf_400x400.jpg",
      },
    },
  ];

  return (
    <section className="container mx-auto">
      <ul role="list" className="grid max-w-2xl grid-cols-1 gap-16 mx-auto sm:gap-8 lg:max-w-none lg:grid-cols-3">
        {posts.map((post, i) => (
          <div
            key={i}
            className="flex flex-col justify-between duration-150 border rounded border-zinc-500/30 hover:border-zinc-300/30 hover:bg-zinc-900/30 group"
          >
            <Link href={post.link} className="whitespace-pre-line text text-zinc-500 p-6">
              {post.content}
            </Link>
            <div className="relative flex items-start justify-between p-6 duration-150 border-t bg-zinc-900/40 border-zinc-500/30 group-hover:border-zinc-300/30">
              <div>
                <div className="text-base font-display text-zinc-200">{post.author.name}</div>
                <div className="mt-1 text-sm text-zinc-500">{post.author.title}</div>
              </div>
              <div className="overflow-hidden rounded-full bg-zinc-50">
                <Image className="object-cover h-14 w-14" src={post.author.image} alt="" width={56} height={56} />
              </div>
            </div>
          </div>
        ))}
      </ul>
    </section>
  );
};
