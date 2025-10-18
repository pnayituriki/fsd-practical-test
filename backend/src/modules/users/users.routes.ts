import { Router } from "express";
import { UsersController } from "./users.controller";

const controller = new UsersController();
export const usersRouter = Router();

usersRouter.get("/", controller.all);
usersRouter.post("/", controller.create);
usersRouter.patch("/:id", controller.update);
usersRouter.delete("/:id", controller.remove);

usersRouter.get("/graph/last7d", controller.graph7d);
usersRouter.get("/export", controller.export);
