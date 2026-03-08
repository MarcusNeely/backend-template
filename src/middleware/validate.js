import { AppError } from '../utils/AppError.js'

/**
 * validate — Zod schema validation middleware factory.
 * Validates req.body against a Zod schema and returns 400 on failure.
 *
 * @param {ZodSchema} schema - Zod schema to validate against
 *
 * @example
 * import { z } from 'zod'
 * const createUserSchema = z.object({ email: z.string().email(), password: z.string().min(8) })
 * router.post('/users', validate(createUserSchema), createUser)
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const details = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return next(new AppError('Validation failed.', 400, details))
  }
  req.body = result.data
  next()
}
