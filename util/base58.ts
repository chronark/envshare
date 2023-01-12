import baseX from "base-x";

const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const toBase58 = (b: Uint8Array) => baseX(alphabet).encode(b);

export const fromBase58 = (s: string) => baseX(alphabet).decode(s);
