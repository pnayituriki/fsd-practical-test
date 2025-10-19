export const importPublicKey = async (pem: string): Promise<CryptoKey> => {
  const keyData = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");

  const binary = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "spki",
    binary.buffer,
    { name: "Ed25519" },
    true,
    ["verify"]
  );
};

export const verifySignature = async (
  email: string,
  signatureB64: string,
  key: CryptoKey
): Promise<boolean> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const digest = await crypto.subtle.digest("SHA-384", data);

  const sig = Uint8Array.from(atob(signatureB64), (c) => c.charCodeAt(0));

  return crypto.subtle.verify("Ed25519", key, sig, digest);
};
