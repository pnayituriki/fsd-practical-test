import { Errors } from "./http-error";

const cleanString = (v: unknown): string => {
  if (typeof v !== "string") throw Errors.BadRequest("Expected string");
  const s = v.trim();
  if (!s) throw Errors.BadRequest("Value cannot be empty");
  return s;
};

const email = (value: unknown, field = "email"): string => {
  if (!value) throw Errors.BadRequest("User email is required");

  const s = cleanString(value).toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(s)) throw Errors.BadRequest(`Invalid ${field}`);
  return s;
};

function enumOf<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  field = "value"
): T[number] {
  const s = cleanString(value);
  if (!allowed.includes(s)) {
    throw Errors.BadRequest(
      `Invalid ${field}. Allowed: ${allowed.join(", ")}`
    );
  }
  return s as T[number];
}

function optional<T>(fn: (v: unknown, field?: string) => T) {
  return (value: unknown, field?: string): T | undefined => {
    if (value === undefined || value === null) return undefined;
    return fn(value, field);
  };
}

export const vld = {
  str: cleanString,
  email,
  enum: enumOf,
  opt: { email: optional(email), str: optional(cleanString) },
};
