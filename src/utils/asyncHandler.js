/**
 * asyncHandler — Wraps async route handlers to automatically catch errors
 * and pass them to Express error middleware. Eliminates try/catch boilerplate
 * in controllers.
 *
 * @param {Function} fn - Async express route handler
 * @returns {Function} Wrapped handler
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.getAll()
 *   res.json(users)
 * }))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
