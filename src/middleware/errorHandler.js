import { AppError } from '../utils/AppError.js'
import logger from '../utils/logger.js'

/**
 * Global Express error handling middleware.
 * Must be registered last in app.js.
 */
export function errorHandler(err, req, res, next) {
  let error = err

  // Wrap non-operational errors
  if (!(error instanceof AppError)) {
    // Prisma known request errors
    if (error.code === 'P2002') {
      error = new AppError('A record with that value already exists.', 409)
    } else if (error.code === 'P2025') {
      error = new AppError('Record not found.', 404)
    } else {
      // Unknown/programming errors — log full details, hide from client
      logger.error('Unhandled error', { error: err.message, stack: err.stack, url: req.url })
      error = new AppError('Something went wrong. Please try again later.', 500)
    }
  }

  // Log operational errors at warn level
  if (error.isOperational) {
    logger.warn('Operational error', { statusCode: error.statusCode, message: error.message, url: req.url })
  }

  const response = {
    status: error.status,
    message: error.message,
  }

  if (error.details) response.details = error.details

  // Include stack trace in development only
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(error.statusCode ?? 500).json(response)
}
