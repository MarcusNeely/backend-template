/**
 * AppError — Operational error with HTTP status code.
 * Always throw this instead of a raw Error in service/controller code.
 *
 * @param {string} message - User-facing error message
 * @param {number} statusCode - HTTP status code (4xx or 5xx)
 * @param {Object} [details] - Optional additional details (validation errors, etc.)
 *
 * @example
 * throw new AppError('User not found', 404)
 * throw new AppError('Validation failed', 400, { field: 'email' })
 */
export class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 500 ? 'error' : 'fail'
    this.isOperational = true
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}
