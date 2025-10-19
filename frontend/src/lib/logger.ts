const isDev = import.meta.env.MODE !== "production";

type LogLevel = "log" | "info" | "warn" | "error";

const print = (level: LogLevel, ...args: unknown[]) => {
  if (!isDev) return;
  const prefix = `[App:${level.toUpperCase()}]`;
  console[level](prefix, ...args);
};

export const logger = {
  log: (...args: unknown[]) => print("log", ...args),
  info: (...args: unknown[]) => print("info", ...args),
  warn: (...args: unknown[]) => print("warn", ...args),
  error: (...args: unknown[]) => print("error", ...args),
};
