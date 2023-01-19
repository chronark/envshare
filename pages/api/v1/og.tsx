import { ImageResponse } from "@vercel/og";
import { NextRequest } from 'next/server';

export const config = {
    runtime: 'edge'
};

export default function handler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        // Redundant fallback alternate tagline
        const title = searchParams.get('title') ?? 'Share Environment Variables Securely';
        const subtitle = searchParams.get('subtitle') ?? 'EnvShare';
        
        return new ImageResponse(
            (<div tw='w-[1200px] h-[627px] flex flex-col items-center justify-center text-center'>
                <div tw="bg-black bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30 w-full h-full flex">
                    <div tw="flex flex-col text-3xl tracking-tight text-gray-300 w-full items-center h-full justify-center text-center">
                        <span tw="text-white bg-gradient-to-t bg-clip-text from-zinc-100/50 to-white text-7xl font-semibold whitespace-pre">{title}</span>
                        <span tw="mt-4 font-bold">{subtitle}</span>
                    </div>
                </div>
            </div>), 
            {
                height: 627,
                width: 1200,
                emoji: 'twemoji',
            }
        )
    } catch(e) {
        console.log(`${(e as Error).message}`);
        return new Response('Failed to generate the image', {
            status: 500,
        });
    }
}