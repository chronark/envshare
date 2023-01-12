import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "pkg/id";

type Request = {
  encrypted: string;
  ttl?: number;
  reads: number;
  iv: string;
};

const redis = Redis.fromEnv();
export default async function handler(req: NextRequest) {
  const { encrypted, ttl, reads, iv } = (await req.json()) as Request;

  const id = generateId();
  const key = ["envshare", id].join(":");

  const tx = redis.multi();

  tx.hset(key, {
    remainingReads: reads > 0 ? reads : null,
    encrypted,
    iv,
  });
  if (ttl) {
    console.log("Adding ttl=", ttl);
    tx.expire(key, ttl);
  }
  await tx.exec();

  console.log("Created", { id, key });
  return NextResponse.json({ id });
}

export const config = {
  runtime: "edge",
};
