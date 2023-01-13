import { toBase58 } from "../util/base58";

// how many bytes are used for the id
export const idBytes = 8;

export function generateId(): string {
  const bytes = new Uint8Array(idBytes);
  crypto.getRandomValues(bytes);
  return toBase58(bytes);
}
