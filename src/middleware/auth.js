import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import prisma from '../utils/prisma.js'

/**
 * protect — Verifies JWT from Authorization header or httpOnly cookie.
 * Attaches the authenticated user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  if (!token) throw new AppError('Authentication required.', 401)

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } })
  if (!user) throw new AppError('User no longer exists.', 401)

  req.user = user
  next()
})

/**
 * restrictTo — Restricts access to specified roles.
 * Must be used after `protect`.
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'editor')
 *
 * @example
 * router.delete('/users/:id', protect, restrictTo('admin'), deleteUser)
 */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403))
  }
  next()
}
