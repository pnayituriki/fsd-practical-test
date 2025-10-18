import express from "express";
import { router } from "./routes/router";
import { sendError } from "./utils/response";
import { env } from "./config/env";
import { logger } from "./utils/logger";

export const app = express();
app.use(express.json());

app.use("/api", router);

app.get("/", (_req, res) => res.send("OK"));

app.use((err: any, req: any, res: any, _next: any) => {
  const code = err?.statusCode ?? 500;
  const message =
    code === 500 ? "Internal Server Error" : err.message ?? "Unexpected error";
  sendError(req, res, code, message, err.details);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => logger.info(`API on :${env.PORT}`));
}
