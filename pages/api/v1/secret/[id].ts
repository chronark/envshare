import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { z } from "zod";

const responseValidation = z.union([
  z.object({
    data: z.object({
      remainingReads: z.number().int().optional(),
      secret: z.string(),
    }),
  }),
  z.object({
    error: z.string(),
  }),
]);

const redis = Redis.fromEnv();
export default async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing `id` parameter" }, { status: 400 });
    }

    const redisKey = ["envshare", id].join(":");

    const [data, _] = await Promise.all([
      await redis.hgetall<{ secret: string; remainingReads: number | null }>(redisKey),
      await redis.incr("envshare:metrics:reads"),
    ]);

    if (!data) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    if (data.remainingReads !== null && data.remainingReads < 1) {
      await redis.del(redisKey);
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    let remainingReads: number | null = null;
    if (data.remainingReads !== null) {
      // Decrement the number of reads and return the remaining reads
      remainingReads = await redis.hincrby(redisKey, "remainingReads", -1);
    }

    return NextResponse.json({ data: { secret: data.secret, remainingReads: remainingReads ?? undefined } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};
