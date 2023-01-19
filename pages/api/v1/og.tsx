import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // Redundant fallback alternate tagline
    const title = searchParams.get("title") ?? "Share Environment Variables Securely";
    const subtitle = searchParams.get("subtitle") ?? "EnvShare";

    const inter = await fetch(new URL("../../../public/fonts/Inter-SemiBold.ttf", import.meta.url)).then((res) =>
      res.arrayBuffer(),
    );

    // TODO: Fix tailwind classes on this route
    return new ImageResponse(
      <div tw='w-[1200px] h-[630px] flex flex-col items-center justify-center text-center'>
        {/* backgroundImage: bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30 */}
        <div
          tw="bg-black w-full h-full flex"
          style={{ backgroundImage: "linear-gradient(to top right, rgba(24,24,27,.5), rgba(63,63,70,.3))" }}
        >
          <div tw="flex flex-col text-3xl tracking-tight text-gray-300 w-full items-center h-full justify-center text-center">
            {/* font-semibold bg-gradient-to-t bg-clip-text from-zinc-100/50 to-white whitespace-pre */}
            <h1
              tw="text-white text-7xl"
              style={{
                color: "transparent",
                paddingLeft: "12rem",
                paddingRight: "12rem",
                backgroundImage: "linear-gradient(to top, rgba(244, 244,  245, .5), rgba(255,255,255,1))",
                backgroundClip: "text",
              }}
            >
              {title}
            </h1>
            <p tw="mt-4 font-bold">{subtitle}</p>
          </div>
        </div>
      </div>,
      {
        height: 630,
        width: 1200,
        emoji: "twemoji",
        fonts: [
          {
            name: "Inter",
            data: inter,
            style: "normal",
          },
        ],
      },
    );
  } catch (e) {
    console.log(`${(e as Error).message}`);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
