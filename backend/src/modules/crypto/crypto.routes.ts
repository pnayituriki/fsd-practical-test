import { Router } from "express";
import { CryptoController } from "./crypto.controller";

const controller = new CryptoController();
export const cryptoRouter = Router();

cryptoRouter.get("/public-key", controller.key);
