import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "pkg/id";
import { z } from "zod";

export const requestValidation = z.object({
  // ttl in seconds
  // defaults to 30 days
  // not more than 1 year
  // 0 means no expiration
  ttl: z
    .string()
    .nullable()
    .transform((v) => (v ? parseInt(v, 10) : 43260))
    .refine((v) => v >= 0 && v <= 30758400, "ttl must be between 0 and 30758400 seconds"),

  // number of reads before deletion
  // defaults to null (no limit)
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
      ttl: z.number().optional(),
      reads: z.number().optional(),
      expiresAt: z.string(),
      url: z.string().url(),
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
    if (ttl > 0) {
      tx.expire(rediskey, ttl);
    }

    await tx.exec();
    const url = new URL(req.url);
    url.pathname = `/api/v1/secret/${id}`;

    return NextResponse.json(
      responseValidation.parse({
        data: {
          id,
          ttl: ttl > 0 ? ttl : undefined,
          reads: reads ?? undefined,
          expiresAt: ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : undefined,
          url: url.toString(),
        },
      }),
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};
