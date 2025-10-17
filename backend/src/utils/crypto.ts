import { createHash, generateKeyPairSync, sign, verify } from "crypto";

const keyPair = generateKeyPairSync("ed25519");

export const sha384 = (value: string): string => {
  return createHash("sha384").update(value).digest("hex");
};

export const signHash = (hexHash: string): string => {
  const sig = sign(null, Buffer.from(hexHash, "hex"), keyPair.privateKey);
  return sig.toString("base64");
};

export const verifyHash = (
  hexHash: string,
  base64Signature: string,
  publicKeyPem: string
): boolean => {
  return verify(
    null,
    Buffer.from(hexHash, "hex"),
    publicKeyPem,
    Buffer.from(base64Signature, "base64")
  );
};

export const getPublicKeyPem = (): string => {
  return keyPair.publicKey.export({ format: "pem", type: "spki" }).toString();
};
