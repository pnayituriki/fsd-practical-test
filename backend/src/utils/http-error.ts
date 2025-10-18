//  Base HTTP Error class
export class HttpError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * 400 – Bad Request
 * For invalid user input or missing required fields
 */
export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", details?: unknown) {
    super(400, message, details);
  }
}

/**
 * 404 – Not Found
 * For missing resources
 */
export class NotFoundError extends HttpError {
  constructor(message = "Resource not found", details?: unknown) {
    super(404, message, details);
  }
}

/**
 * 409 – Conflict
 * For duplicate or conflicting operations
 */
export class ConflictError extends HttpError {
  constructor(message = "Conflict", details?: unknown) {
    super(409, message, details);
  }
}

/**
 * 500 – Internal Server Error
 * For unexpected system failures
 */
export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error", details?: unknown) {
    super(500, message, details);
  }
}

export const Errors = {
  BadRequest: (msg?: string, details?: unknown) =>
    new BadRequestError(msg, details),
  NotFound: (msg?: string, details?: unknown) =>
    new NotFoundError(msg, details),
  Conflict: (msg?: string, details?: unknown) =>
    new ConflictError(msg, details),
  Internal: (msg?: string, details?: unknown) =>
    new InternalServerError(msg, details),
};
