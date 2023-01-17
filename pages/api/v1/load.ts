import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export default async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new NextResponse("id param is missing", { status: 400 });
  }
  const key = ["envshare", id].join(":");

  const [data, _] = await Promise.all([
    await redis.hgetall<{ encrypted: string; remainingReads: number | null; iv: string }>(key),
    await redis.incr("envshare:metrics:reads"),
  ]);
  if (!data) {
    return new NextResponse("Not Found", { status: 404 });
  }
  if (data.remainingReads !== null && data.remainingReads < 1) {
    await redis.del(key);
    return new NextResponse("Not Found", { status: 404 });
  }

  let remainingReads: number | null = null;
  if (data.remainingReads !== null) {
    // Decrement the number of reads and return the remaining reads
    remainingReads = await redis.hincrby(key, "remainingReads", -1);
  }

  return NextResponse.json({ iv: data.iv, encrypted: data.encrypted, remainingReads });
}

export const config = {
  runtime: "edge",
};
