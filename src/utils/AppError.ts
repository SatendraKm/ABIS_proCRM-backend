// src/utils/AppError.ts
export class AppError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;

    // Capture the correct stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
