import { describe, it, expect, beforeAll } from "@jest/globals";
import { decrypt, encrypt } from "./encryption";
import crypto from "node:crypto";
import { toBase58 } from "../util/base58";

beforeAll(() => {
  global.crypto = crypto.webcrypto;
});
describe("aes", () => {
  it("encrypts and decrypts correctly", async () => {
    for (let i = 0; i < 500; i++) {
      const buf = new Uint8Array(Math.ceil(Math.random() * 10 * i));
      crypto.getRandomValues(buf);

      const text = toBase58(buf);

      const { encrypted, key, iv } = await encrypt(text);

      const decrypted = await decrypt(toBase58(encrypted), key, toBase58(iv), 2);

      expect(decrypted).toEqual(text);
    }
  }, 30_000);
});
