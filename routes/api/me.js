const express = require('express');

const ProfileController = require('@app/controllers/ProfileController')
const PostController = require('@app/controllers/PostController')

const router = express.Router();
const profileRouter = express.Router();

profileRouter.delete('/experience/:exp_id', ProfileController.deleteExperience)
profileRouter.delete('/education/:edu_id', ProfileController.deleteEducation)
profileRouter.patch('/experience', ProfileController.addExperience)
profileRouter.patch('/education', ProfileController.addEducation)
profileRouter.delete('/', ProfileController.delete)
profileRouter.post('/', ProfileController.store)
profileRouter.get('/', ProfileController.show)

// const passport = require('passport');
// const AuthPassportMiddleware = require('@root/app/middlewares/AuthPassportMiddleware');
// passport.use(AuthPassportMiddleware)
// router.use(passport.authenticate('jwt', { session: false }))

router.use('/profile', profileRouter)
router.use('/posts', PostController.getAll)

module.exports = router;