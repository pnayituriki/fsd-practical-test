import express from "express";
import cors from "cors";
import path from "path";
import { router } from "./routes/router";
import { sendError } from "./utils/response";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import "../src/db/migration";

export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use(express.static(path.join(process.cwd(), "public")));

app.get(/^(?!\/api).*/, (_req, res) => {
  const filePath = path.join(process.cwd(), "public", "index.html");
  res.sendFile(filePath);
});

app.use((err: any, req: any, res: any, _next: any) => {
  const code = err?.statusCode ?? 500;
  const message =
    code === 500 ? "Internal Server Error" : err.message ?? "Unexpected error";
  sendError(req, res, code, message, err.details);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => logger.info(`API on :${env.PORT}`));
}
