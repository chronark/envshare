import { fromBase58, toBase58 } from "util/base58";
import { idBytes } from "./id";

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function encodeCompositeKey(id: string, encryptionKey: string): string {
  const compositeKey = new TextEncoder().encode([id, encryptionKey].join("_"));

  return toBase58(compositeKey);
}

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function decodeCompositeKey(compositeKey: string): { id: string; encryptionKey: string } {
  const [id, encryptionKey] = new TextDecoder().decode(fromBase58(compositeKey)).split("_");

  return { id, encryptionKey };
}
