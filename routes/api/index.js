const router = require('express').Router()

const authRouter = require('./auth')
const meRouter = require('./me')
const profileRouter = require('./profiles')
const usersRouter = require('./users')
const postsRouter = require('./posts')
const AuthMiddleware = require('@app/middlewares/AuthMiddleware')

router.use('/auth', authRouter)
router.use('/me', AuthMiddleware, meRouter)
router.use('/profiles', profileRouter)
router.use('/users', usersRouter)
router.use('/posts', postsRouter)

module.exports = router