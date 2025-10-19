import request from "supertest";
import fs from "fs";
import { app } from "../..";
import { cryptoManager } from "../../utils/crypto";

const BASE_URL = "/api/crypto/public-key";

describe("Crypto routes", () => {
  const publicKeyPath = cryptoManager.locations.publicKey;

  it("should return public key", async () => {
    const res = await request(app).get(BASE_URL);
    expect(res.status).toBe(200);
    expect(res.text).toContain("BEGIN PUBLIC KEY");
    expect(res.text).toContain("END PUBLIC KEY");
  });

  it("should persist the same public key across requests", async () => {
    const first = await request(app).get(BASE_URL);
    const second = await request(app).get(BASE_URL);

    expect(first.text).toEqual(second.text);
  });

  it("should store the public/private keys on disk", () => {
    expect(fs.existsSync(publicKeyPath)).toBe(true);
    expect(fs.existsSync(cryptoManager.locations.privateKey)).toBe(true);
  });

  it("should sign and verify correctly", () => {
    const testValue = "test@example.com";
    const hash = cryptoManager.sha384(testValue);
    const signature = cryptoManager.signHash(hash);
    const isValid = cryptoManager.verifyHash(hash, signature);

    expect(isValid).toBe(true);
  });

  it("should keep same public key after reload (simulating restart)", async () => {
    const beforeReloadKey = cryptoManager.getPublicKeyPem();

    const reloaded = new (cryptoManager.constructor as any)(
      cryptoManager.locations.dir
    );

    const afterReloadKey = reloaded.getPublicKeyPem();
    expect(afterReloadKey).toEqual(beforeReloadKey);
  });
});
