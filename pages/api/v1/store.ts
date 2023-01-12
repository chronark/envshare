import { NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { toBase58 } from "../../../util/base58"


type Request = {
  data: string
  ttl?: number
  reads: number
  iv: string
}


const redis = Redis.fromEnv()
export default async function handler(
  req: NextRequest,
) {

  const { data, ttl, reads, iv } = await req.json() as Request



  const b = new Uint8Array(4)
  crypto.getRandomValues(b)
  const id = toBase58(b)
  const key = ["envshare", id].join(":")

  const tx = redis.multi()

  tx.hset(key, {
    remainingReads: reads > 0 ? reads : null,
    data,
    iv
  })
  if (ttl) {
    console.log("Adding ttl=", ttl)
    tx.expire(key, ttl)
  }
  await tx.exec()

  console.log("Created", { id, key })
  return NextResponse.json({ id })





}



export const config = {
  runtime: "edge"
}