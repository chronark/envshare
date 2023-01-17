import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { generateId } from "pkg/id";
import { encrypt, decrypt} from "pkg/encryption";
import { encodeCompositeKey, decodeCompositeKey } from 'pkg/encoding';
import { toBase58 } from 'util/base58';
import { LATEST_KEY_VERSION } from "pkg/constants";

type PostApiRequest = {
    ttl?: number;
    reads?: number;
    ttlType?: "minutes" | "hours" | "days";
    secret: string;
}

type GetApiRequest = {
    id: string;
}

const redis = Redis.fromEnv();
export default async function handler(req: NextRequest): Promise<NextResponse> {
    if (req.method === "POST") {
        try {
            const { ttl = 7, reads = 999, ttlType = "days", secret } = (await req.json()) as PostApiRequest;

            if (!secret) {
                return new NextResponse("secret param is missing", { status: 400 });
            }
            
            const id = generateId();
            const { encrypted, iv, key } = await encrypt(secret);
    
            const compositeKey = encodeCompositeKey(LATEST_KEY_VERSION, id, key);
            
            const rediskey = ["envshare", id].join(":");
    
            const tx = redis.multi();
            
            tx.hset(rediskey, {
                remainingReads: reads > 0 ? reads : null,
                reads,
                encrypted: toBase58(encrypted),
                iv: toBase58(iv),
            });
            if (ttl) {
                const ttlMultiplier = ttlType === "minutes" ? 60 : ttlType === "hours" ? 60 * 60 : 60 * 60 * 24;
                tx.expire(rediskey, ttl * ttlMultiplier);
            }
            
            await tx.exec();
    
            const url = new URL(req.url);
            url.pathname= `/${compositeKey}`;
    
            return NextResponse.json({ data: url.href });
        } catch (e) {
            console.error(e);
            return NextResponse.json({error: 'Internal Server Error'}, { status: 500 });
        }
    }
    if (req.method === "GET") {
        try {
            const url = new URL(req.url);
            const apiId = url.searchParams.get("id");

            if (!apiId) {
                return new NextResponse("id param is missing", { status: 400 });
            }
    
            const { id, encryptionKey, version } = decodeCompositeKey(apiId);
    
            const redisKey = ["envshare", id].join(":");
    
            const data = await redis.hgetall<{ encrypted: string; remainingReads: number | null; iv: string }>(redisKey);
            if (!data) {
                return new NextResponse("Not Found", { status: 404 });
            }
            if (data.remainingReads !== null && data.remainingReads < 1) {
                await redis.del(redisKey);
                return new NextResponse("Not Found", { status: 404 });
            }
    
            let remainingReads: number | null = null;
            if (data.remainingReads !== null) {
                // Decrement the number of reads and return the remaining reads
                remainingReads = await redis.hincrby(redisKey, "remainingReads", -1);
            }

            const decrypted = await decrypt(data.encrypted, encryptionKey, data.iv, version);
    
            return NextResponse.json({ data: { decrypted, remainingReads } });
        } catch (e) {
            console.error(e);
            return NextResponse.json({error: 'Internal Server Error'}, { status: 500 });
        }
    }

    return new NextResponse("", {status: 501});
}

export const config = {
    runtime: "edge",
};
