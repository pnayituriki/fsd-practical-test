import type { Request, Response } from "express";
import { getPublicKeyPem } from "../../utils/crypto";

export class CryptoController {
  private publicKey = getPublicKeyPem();

  key = (_req: Request, res: Response) => res.send(this.publicKey);
}
