const express = require('express');
const PostController = require('@app/controllers/PostController')
const AuthMiddleware = require('@app/middlewares/AuthMiddleware')

const router = express.Router();

router.delete('/:id/comments/:comment_id', AuthMiddleware, PostController.deleteComment)
router.post('/:id/comments', AuthMiddleware, PostController.createComment)
router.patch('/:id/unlike', AuthMiddleware, PostController.unlike)
router.patch('/:id/like', AuthMiddleware, PostController.like)
router.delete('/:id', AuthMiddleware, PostController.delete)
router.post('/', AuthMiddleware, PostController.store)
router.get('/:id', PostController.getById)
router.get('/', PostController.getAll)

module.exports = router;