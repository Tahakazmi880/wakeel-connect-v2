/** Application error with an HTTP status. The global handler turns these into
 *  { error: { code, message } } without leaking stack traces in production. */
export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const badRequest = (code: string, message: string) => new AppError(400, code, message);
export const unauthorized = (message = "Please log in again.") => new AppError(401, "UNAUTHORIZED", message);
export const forbidden = (message = "You don't have permission for this.") => new AppError(403, "FORBIDDEN", message);
export const notFound = (message = "Not found.") => new AppError(404, "NOT_FOUND", message);
export const conflict = (code: string, message: string) => new AppError(409, code, message);
export const tooMany = (message = "Too many attempts. Please try again later.") => new AppError(429, "RATE_LIMITED", message);
