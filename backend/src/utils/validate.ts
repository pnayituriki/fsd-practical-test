import { Errors } from "./http-error";

export const isUUID = (value?: string, field: string = "id") => {
  if (!value) throw Errors.BadRequest(`${field} is required!`);
  const isValid = /^[0-9a-fA-F-]{36}$/.test(value);
  if (!isValid) throw Errors.BadRequest(`Invalid ${field}.`);
  return value;
};

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
    throw Errors.BadRequest(`Invalid ${field}. Allowed: ${allowed.join(", ")}`);
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
  isUUID,
  str: cleanString,
  email,
  enum: enumOf,
  opt: { email: optional(email), str: optional(cleanString) },
};
