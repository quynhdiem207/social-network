const Post = require('../models/Post');
const User = require('../models/User');
const BaseController = require('./BaseController')

class PostController extends BaseController {

    // @route   [GET] api/me/posts
    // @desc    Get all posts
    // @access  Private
    async getAll(req, res, next) {
        try {
            let posts = await Post.find().sort({ createdAt: -1 }).lean()
            if (!posts) {
                return res.status(400).json({ msg: 'No posts!' })
            }
            return res.json(posts)
        } catch (err) {
            next(err)
        }
    }

    // @route   [GET] api/me/posts/:id
    // @desc    Get post by id
    // @access  Private
    async getById(req, res, next) {
        try {
            let post = await Post.findById(req.params.id).lean()
            if (!post) {
                return res.status(404).json({
                    msg: 'Post not found!'
                })
            }
            return res.json(post)
        } catch (err) {
            if (err.kind == "ObjectId") {
                return res.status(404).json({ msg: 'Post not found!' })
            }
            next(err)
        }
    }

    // @route   [POST] api/me/posts
    // @desc    Create a post
    // @access  Private
    async store(req, res, next) {
        const allowedInputs = {
            text: { type: 'string', required: true }
        }
        let { error, errors } = await super.validate(req.body, allowedInputs)
        if (error) return res.status(400).json({ error, errors })

        try {
            let user = await User.findById(req.user._id).select('-password').lean()
            const newPost = new Post({
                user: req.user._id,
                text: req.body.text,
                name: user.name,
                avatar: user.avatar
            })
            const post = await newPost.save()
            return res.json(post)
        } catch (err) {
            next(err)
        }
    }

    // @route   [DELETE] api/me/posts/:id
    // @desc    delete a post
    // @access  Private
    async delete(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({
                    msg: 'Post not found!'
                })
            }
            // check author
            if (String(post.user) !== req.user._id) {
                return res.status(401).json({ msg: 'User not authorized!' })
            }
            await post.remove()
            return res.json({ msg: 'Post removed' })
        } catch (err) {
            if (err.kind == "ObjectId") {
                return res.status(404).json({ msg: 'Post not found!' })
            }
            next(err)
        }
    }

    // @route   [PATCH] api/me/posts/:id/like
    // @desc    Like a post
    // @access  Private
    async like(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({
                    msg: 'Post not found!'
                })
            }
            if (post.likes.find(like => String(like.user) === req.user._id)) {
                return res.status(400).json({ msg: 'Post already liked!' })
            }
            post.likes.unshift({ user: req.user._id })
            await post.save()
            return res.json(post.likes)
        } catch (err) {
            if (err.kind == "ObjectId") {
                return res.status(404).json({ msg: 'Post not found!' })
            }
            next(err)
        }
    }

    // @route   [PATCH] api/me/posts/:id/unlike
    // @desc    Unlike a post
    // @access  Private
    async unlike(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({
                    msg: 'Post not found!'
                })
            }
            const index = post.likes.map(like => like.user.toString())
                .indexOf(req.user._id)
            if (index < 0) {
                return res.status(400).json({ msg: 'Post has not yet been liked!' })
            }
            post.likes.splice(index, 1)
            await post.save()
            return res.json(post.likes)
        } catch (err) {
            if (err.kind == "ObjectId") {
                return res.status(404).json({ msg: 'Post not found!' })
            }
            next(err)
        }
    }

    // @route   [POST] api/me/posts/:id/comments
    // @desc    Create a comment
    // @access  Private
    async createComment(req, res, next) {
        const allowedInputs = {
            text: { type: 'string', required: true }
        }
        let { error, errors } = await super.validate(req.body, allowedInputs)
        if (error) return res.status(400).json({ error, errors })

        try {
            let user = await User.findById(req.user._id).select('-password').lean()
            let post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({
                    msg: 'Post not found!'
                })
            }
            const newComment = {
                user: req.user._id,
                text: req.body.text,
                name: user.name,
                avatar: user.avatar
            }
            post.comments.unshift(newComment)
            await post.save()
            return res.json(post.comments)
        } catch (err) {
            if (err.kind == "ObjectId") {
                return res.status(404).json({ msg: 'Post not found!' })
            }
            next(err)
        }
    }

    // @route   [DELETE] api/me/posts/:id/comments/:comment_id
    // @desc    Delete a post
    // @access  Private
    async deleteComment(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({
                    msg: 'Post not found!'
                })
            }
            const comment = post.comments.find(comment => String(comment._id) == req.params.comment_id)
            if (!comment) {
                return res.status(404).json({ msg: 'Comment not exist!' })
            }
            // check author
            if (comment.user.toString() !== req.user._id) {
                return res.status(404).json({ msg: 'User not authorized!' })
            }
            const index = post.comments.map(item => String(item._id))
                .indexOf(req.params.comment_id)
            post.comments.splice(index, 1)
            await post.save()
            return res.json(post.comments)
        } catch (err) {
            if (err.kind == "ObjectId") {
                return res.status(404).json({ msg: 'Post not found!' })
            }
            next(err)
        }
    }
}

module.exports = new PostController();