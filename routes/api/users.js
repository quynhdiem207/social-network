const express = require('express');
const UserController = require('@app/controllers/UserController');

const router = express.Router();

router.post('/register', UserController.register);

module.exports = router;