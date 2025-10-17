import type { Request, Response } from "express";
import { logger } from "./logger";
import { isDev } from "../config/env";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | undefined;
  code?: number;
  details?: unknown;
  meta?: {
    timestamp: string;
    path?: string;
  };
}

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  code = 200
) {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: { timestamp: new Date().toISOString() },
  };
  return res.status(code).json(body);
}

export function sendError(
  req: Request,
  res: Response,
  code: number,
  message: string,
  details?: unknown
) {
  const body: ApiResponse = {
    success: false,
    code,
    message,
    details: isDev ? details : undefined,
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  };
  logger.error(body);
  return res.status(code).json(body);
}
