const express = require('express');

const AuthMiddleware = require('@app/middlewares/AuthMiddleware')
const AuthController = require('@app/controllers/AuthController')

const router = express.Router();

router.get('/', AuthMiddleware, AuthController.index)
router.post('/', AuthController.login)

module.exports = router;