import { Router } from 'express'

const router = Router()

// Mount feature routes here as you build them:
// import userRoutes from './user.routes.js'
// router.use('/users', userRoutes)

// Placeholder route
router.get('/', (req, res) => {
  res.json({ message: 'API is running. Add your routes in src/routes/index.js' })
})

export default router
