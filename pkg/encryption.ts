import { fromBase58 } from "../util/base58";

export async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 128,
    },
    true,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(text: string): Promise<{ encrypted: Uint8Array; iv: Uint8Array; key: Uint8Array }> {
  const key = await generateKey();

  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    new TextEncoder().encode(text),
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  return {
    encrypted: new Uint8Array(encryptedBuffer),
    key: new Uint8Array(exportedKey),
    iv,
  };
}

export async function decrypt(encrypted: string, keyData: Uint8Array, iv: string, keyVersion: number): Promise<string> {
  const algorithm = keyVersion === 1 ? "AES-CBC" : "AES-GCM";

  const key = await crypto.subtle.importKey("raw", keyData, { name: algorithm, length: 128 }, false, ["decrypt"]);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: algorithm,
      iv: fromBase58(iv),
    },
    key,
    fromBase58(encrypted),
  );

  return new TextDecoder().decode(decrypted);
}
