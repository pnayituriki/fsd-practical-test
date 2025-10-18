import { Router } from "express";
import { getPublicKeyPem } from "../utils/crypto";

export const cryptoRouter = Router();

cryptoRouter.get("/public-key", (_req, res) => res.send(getPublicKeyPem()));
