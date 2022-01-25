const Post = require('../models/Post');
const User = require('../models/User');
const Report = require('../models/Report');
const BaseController = require('./BaseController');
const Mailer = require('@libs/Mailer')

class PostController extends BaseController {

    // @route   [GET] api/posts
    // @desc    Get all posts
    // @access  Public
    async getAll(req, res, next) {
        try {
            let posts = await Post.find().sort({ createdAt: -1 }).lean()
            return res.json(posts)
        } catch (err) {
            next(err)
        }
    }

    // @route   [GET] api/posts/:id
    // @desc    Get post by id
    // @access  Public
    async getById(req, res, next) {
        try {
            let post = await Post.findById(req.params.id).lean()
            if (!post) {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            return res.json(post)
        } catch (err) {
            if (err.kind == "ObjectId") {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            next(err)
        }
    }

    // @route   [POST] api/posts
    // @desc    Create a post
    // @access  Private
    async store(req, res, next) {
        const allowedInputs = {
            text: { type: 'string', required: true }
        }
        let { error, errors } = await super.validate_1(req, allowedInputs)
        if (error) return res.status(400).json(errors)

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

    // @route   [DELETE] api/posts/:id
    // @desc    delete a post
    // @access  Private
    async delete(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            // check author
            if (String(post.user) !== req.user._id) {
                const msg = 'User not authorized!'
                return res.status(400).json([msg])
            }
            await post.remove()
            return res.json('Post removed')
        } catch (err) {
            if (err.kind == "ObjectId") {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            next(err)
        }
    }

    // @route   [PATCH] api/posts/:id/like
    // @desc    Like a post
    // @access  Private
    async like(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            if (post.likes.find(like => String(like.user) === req.user._id)) {
                const msg = 'Post already liked!'
                return res.status(400).json([msg])
            }
            post.likes.unshift({ user: req.user._id })
            await post.save()
            return res.json(post.likes)
        } catch (err) {
            if (err.kind == "ObjectId") {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            next(err)
        }
    }

    // @route   [PATCH] api/posts/:id/unlike
    // @desc    Unlike a post
    // @access  Private
    async unlike(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            const index = post.likes.map(like => like.user.toString())
                .indexOf(req.user._id)
            if (index < 0) {
                const msg = 'Post has not yet been liked!'
                return res.status(400).json([msg])
            }
            post.likes.splice(index, 1)
            await post.save()
            return res.json(post.likes)
        } catch (err) {
            if (err.kind == "ObjectId") {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            next(err)
        }
    }

    // @route   [POST] api/posts/:id/comments
    // @desc    Create a comment
    // @access  Private
    async createComment(req, res, next) {
        const allowedInputs = {
            text: { type: 'string', required: true }
        }
        let { error, errors } = await super.validate_1(req, allowedInputs)
        if (error) return res.status(400).json(errors)

        try {
            let user = await User.findById(req.user._id).select('-password').lean()
            let post = await Post.findById(req.params.id)
            if (!post) {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
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
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            next(err)
        }
    }

    // @route   [DELETE] api/posts/:id/comments/:comment_id
    // @desc    Delete a comment
    // @access  Private
    async deleteComment(req, res, next) {
        try {
            let post = await Post.findById(req.params.id)
            if (!post) {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            const comment = post.comments.find(comment => String(comment._id) == req.params.comment_id)
            if (!comment) {
                const msg = 'Comment not exist!'
                return res.status(404).json([msg])
            }
            // check author
            if (comment.user.toString() !== req.user._id) {
                const msg = 'User not authorized!'
                return res.status(400).json([msg])
            }
            const index = post.comments.map(item => String(item._id))
                .indexOf(req.params.comment_id)
            post.comments.splice(index, 1)
            await post.save()
            return res.json(post.comments)
        } catch (err) {
            if (err.kind == "ObjectId") {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            next(err)
        }
    }

    // @route   [POST] api/posts/report
    // @desc    Report a post
    // @access  Public
    async report(req, res, next) {
        const allowedInputs = {
            _id: { type: 'string', required: true, isMongoId: true },
            author: { type: 'string', required: true, isMongoId: true },
            name: { type: 'string', required: true },
            avatar: { type: 'string' },
            text: { type: 'string' },
            subject: { type: 'string', required: true },
            detail: { type: 'string' }
        }
        let { error, errors } = await super.validate_1(req, allowedInputs)
        if (error) return res.status(400).json(errors)

        const { _id, subject, detail, ...other } = req.body

        try {
            const reportedPost = await Report.findOne({ post: _id })

            if (reportedPost) {
                const reported = reportedPost.reports.find(
                    report => report.user == req.user._id
                )

                if (reported) {
                    const msg = 'You have reported this post!'
                    return res.status(404).json([msg])
                }

                reportedPost.reports.unshift({
                    user: req.user._id,
                    subject,
                    detail,
                    date: Date()
                })

                await reportedPost.save()
            } else {
                const newReport = new Report({
                    post: _id,
                    ...other,
                    reports: [{
                        user: req.user._id,
                        subject,
                        detail,
                        date: Date()
                    }]
                })

                await newReport.save()
            }

            const html = `
                <h2>${subject}</h2>
                <div>
                    Post ID: <strong>${_id}</strong> of <strong>${other.name}</strong> 
                    (user ID: <strong>${other.author}</strong>) is reported 
                    <strong>
                        ${reportedPost ? reportedPost.reports.length : 1} times.
                    </strong>
                </div>
                <div style='margin: 20px 0'>Post's Detail:</div>
                <ul>
                    <li>Post ID: ${_id}</li>
                    <li>
                        <div>Author:</div>
                        <ul>
                            <li>ID: ${other.author}</li>
                            <li>Name: ${other.name}</li>
                            <li>Avatar: <img src='${other.avatar}' style='width: 100px' /></li>
                        </ul>
                    </li>
                    <li>Content: ${other.text}</li>
                </ul>
            `

            Mailer.sendMail('REPORT', html);

            return res.json('Report Success')
        } catch (err) {
            if (err.kind == "ObjectId") {
                const msg = 'Post not found!'
                return res.status(404).json([msg])
            }
            next(err)
        }
    }
}

module.exports = new PostController();