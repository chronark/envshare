import { toBase58 } from "../util/base58";
import { ID_LENGTH } from "./constants";

export function generateId(): string {
  const bytes = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(bytes);
  return toBase58(bytes);
}
