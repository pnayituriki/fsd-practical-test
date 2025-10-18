import { createHash, generateKeyPairSync, sign, verify } from "crypto";
import fs from "fs";
import path from "path";
import { env } from "../config/env";
import { logger } from "./logger";

class CryptoManager {
  private readonly keyDir: string;
  private readonly privateKeyPath: string;
  private readonly publicKeyPath: string;
  private privateKeyPem: string | null = null;
  private publicKeyPem: string | null = null;

  constructor(customDir?: string) {
    this.keyDir =
      customDir && customDir.trim().length > 0
        ? path.resolve(customDir)
        : env.CRYPTO_KEY_DIR && env.CRYPTO_KEY_DIR.trim().length > 0
        ? path.resolve(env.CRYPTO_KEY_DIR)
        : path.resolve(process.cwd(), "keys");

    this.privateKeyPath = path.join(this.keyDir, "ed25519-private.pem");
    this.publicKeyPath = path.join(this.keyDir, "ed25519-public.pem");

    this.initKeysOnce();
  }

  private ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadKeyPairFromDisk(): {
    privateKeyPem: string;
    publicKeyPem: string;
  } | null {
    try {
      if (
        fs.existsSync(this.privateKeyPath) &&
        fs.existsSync(this.publicKeyPath)
      ) {
        const privateKeyPem = fs.readFileSync(this.privateKeyPath, "utf8");
        const publicKeyPem = fs.readFileSync(this.publicKeyPath, "utf8");
        return { privateKeyPem, publicKeyPem };
      }
      return null;
    } catch (err) {
      logger.error({ msg: "[CryptoManager] Failed to load keypair:", err });
      return null;
    }
  }

  private saveKeyPairToDisk(privateKeyPem: string, publicKeyPem: string): void {
    this.ensureDir(this.keyDir);
    fs.writeFileSync(this.privateKeyPath, privateKeyPem, { mode: 0o600 });
    fs.writeFileSync(this.publicKeyPath, publicKeyPem, { mode: 0o644 });
  }

  private createKeyPair(): { privateKeyPem: string; publicKeyPem: string } {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const privateKeyPem = privateKey
      .export({ format: "pem", type: "pkcs8" })
      .toString();
    const publicKeyPem = publicKey
      .export({ format: "pem", type: "spki" })
      .toString();
    return { privateKeyPem, publicKeyPem };
  }

  private initKeysOnce(): void {
    if (this.privateKeyPem && this.publicKeyPem) return;
    const loaded = this.loadKeyPairFromDisk();
    if (loaded) {
      this.privateKeyPem = loaded.privateKeyPem;
      this.publicKeyPem = loaded.publicKeyPem;
      return;
    }
    const created = this.createKeyPair();
    this.saveKeyPairToDisk(created.privateKeyPem, created.publicKeyPem);
    this.privateKeyPem = created.privateKeyPem;
    this.publicKeyPem = created.publicKeyPem;
  }

  sha384(value: string): string {
    return createHash("sha384").update(value).digest("hex");
  }

  signHash(hexHash: string): string {
    if (!this.privateKeyPem) this.initKeysOnce();
    const sig = sign(
      null,
      Buffer.from(hexHash, "hex"),
      this.privateKeyPem as string
    );
    return sig.toString("base64");
  }

  verifyHash(
    hexHash: string,
    base64Signature: string,
    publicKeyPem?: string
  ): boolean {
    const pub = publicKeyPem ?? this.getPublicKeyPem();
    return verify(
      null,
      Buffer.from(hexHash, "hex"),
      pub,
      Buffer.from(base64Signature, "base64")
    );
  }

  getPublicKeyPem(): string {
    if (!this.publicKeyPem) this.initKeysOnce();
    return this.publicKeyPem as string;
  }

  get locations() {
    return {
      dir: this.keyDir,
      privateKey: this.privateKeyPath,
      publicKey: this.publicKeyPath,
    };
  }
}

export const cryptoManager = new CryptoManager();

export const sha384 = (v: string) => cryptoManager.sha384(v);
export const signHash = (h: string) => cryptoManager.signHash(h);
export const verifyHash = (h: string, s: string, p?: string) =>
  cryptoManager.verifyHash(h, s, p);
export const getPublicKeyPem = () => cryptoManager.getPublicKeyPem();
export const cryptoKeyLocations = cryptoManager.locations;