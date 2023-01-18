import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "pkg/id";
import { z } from "zod";

export const requestValidation = z.object({
  // ttl in seconds
  // defaults to 30 days
  // not more than 1 year
  ttl: z
    .string()
    .nullable()
    .transform((v) => (v ? parseInt(v, 10) : 43260))
    .refine((v) => v > 0 && v <= 30758400, "ttl must be between 1 and 30758400 seconds"),

  // number of reads before deletion
  reads: z
    .string()
    .nullable()
    .transform((v) => (v ? parseInt(v, 10) : null))
    .refine((v) => v === null || v > 0, "reads must be greater than 0"),
  secret: z.string().min(1),
});
export const responseValidation = z.union([
  z.object({
    data: z.object({
      id: z.string(),
    }),
  }),
  z.object({
    error: z.string(),
  }),
]);

const redis = Redis.fromEnv();

export default async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }

    const parsed = requestValidation.safeParse({
      ttl: req.headers.get("envshare-ttl"),
      reads: req.headers.get("envshare-reads"),
      secret: await req.text(),
    });
    if (!parsed.success) {
      return NextResponse.json({ error: JSON.parse(parsed.error.message) }, { status: 400 });
    }
    const { ttl, reads, secret } = parsed.data;

    const id = generateId();
    const rediskey = ["envshare", id].join(":");

    const tx = redis.multi();

    tx.hset(rediskey, {
      remainingReads: reads ?? null,
      secret,
    });
    tx.incr("envshare:metrics:writes");
    tx.expire(rediskey, ttl);

    await tx.exec();

    return NextResponse.json({ data: { id } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};
