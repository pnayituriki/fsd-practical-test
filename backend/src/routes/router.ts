import { Router } from "express";
import { usersRouter } from "../modules/users/users.routes";
import { cryptoRouter } from "../modules/crypto/crypto.routes";

export const router = Router();

router.use("/users", usersRouter);
router.use("/crypto", cryptoRouter);
