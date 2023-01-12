import { fromBase58, toBase58 } from "util/base58";

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function encodeCompositeKey(id: string, encryptionKey: string): string {
  return [id, encryptionKey].join("_");
}

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function decodeCompositeKey(compositeKey: string): { id: string; encryptionKey: string } {
  const [id, encryptionKey] = compositeKey.split("_");

  return { id, encryptionKey };
}
