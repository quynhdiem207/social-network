const express = require('express');

const ProfileController = require('@app/controllers/ProfileController')
const PostController = require('@app/controllers/PostController')

const router = express.Router();
const profileRouter = express.Router();
const postRouter = express.Router();

profileRouter.delete('/experience/:exp_id', ProfileController.deleteExperience)
profileRouter.delete('/education/:edu_id', ProfileController.deleteEducation)
profileRouter.patch('/experience', ProfileController.addExperience)
profileRouter.patch('/education', ProfileController.addEducation)
profileRouter.delete('/', ProfileController.delete)
profileRouter.post('/', ProfileController.store)
profileRouter.get('/', ProfileController.show)

postRouter.delete('/:id/comments/:comment_id', PostController.deleteComment)
postRouter.post('/:id/comments', PostController.createComment)
postRouter.patch('/:id/unlike', PostController.unlike)
postRouter.patch('/:id/like', PostController.like)
postRouter.delete('/:id', PostController.delete)
postRouter.get('/:id', PostController.getById)
postRouter.post('/', PostController.store)
postRouter.get('/', PostController.getAll)

// const passport = require('passport');
// const AuthPassportMiddleware = require('@root/app/middlewares/AuthPassportMiddleware');
// passport.use(AuthPassportMiddleware)
// router.use(passport.authenticate('jwt', { session: false }))

router.use('/profile', profileRouter)
router.use('/posts', postRouter)

module.exports = router;