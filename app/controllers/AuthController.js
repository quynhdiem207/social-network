const Joi = require('joi')
const bcrypt = require('bcryptjs')
const to = require('await-to-js').default;

const User = require('@app/models/User')
const Auth = require('@libs/Auth')

class AuthController {

    // @route   [GET] api/auth
    // @desc    Get auth user
    // @access  Private
    async index(req, res, next) {
        try {
            const user = await User.findById(req.user._id).select('-password').lean()
            res.json(user)
        } catch (err) {
            next(err)
        }
    }

    // @route   [POST] api/auth
    // @desc    Authenticate user & get JWT Token
    // @access  Public
    async login(req, res, next) {
        const inputSchema = Joi.object({
            email: Joi.string().exist().email(),
            password: Joi.string().exist()
        })
        let [err] = await to(inputSchema.validateAsync(req.body))
        if (err) {
            const errDetail = err.details[0].message
            return res.status(400).json([errDetail])
        }

        let { email, password } = req.body

        try {
            const user = await User.findOne({ email }).lean()
            if (!user) {
                const msg = "Invalid credentials!"
                return res.status(400).json([msg])
            }
            let isMatched = await bcrypt.compare(password, user.password);
            if (!isMatched) {
                const msg = "Invalid credentials!"
                return res.status(400).json([msg])
            }
            let token = await Auth.generateJWT({ user: { _id: user._id } })
            return res.json({ token })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AuthController()