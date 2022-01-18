const express = require('express');

const ProfileController = require('@app/controllers/ProfileController')

const router = express.Router();

router.get('/github/:username', ProfileController.getGithubRepos)
router.get('/user/:user_id', ProfileController.getByUserId)
router.get('/', ProfileController.index)

module.exports = router;