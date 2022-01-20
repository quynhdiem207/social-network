const gravatar = require('gravatar')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const to = require('await-to-js').default;

const BaseController = require('./BaseController')
const User = require('../models/User');
const Auth = require('@libs/Auth');

class UserController extends BaseController {

    // @route   [POST] api/users/register
    // @desc    Register user
    // @access  Public
    async register(req, res, next) {
        const inputSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8)
        })

        let [err] = await to(inputSchema.validateAsync(req.body))

        if (err) {
            const errDetail = err.details[0].message
            return res.status(400).json([errDetail])
        }

        // const allowedInputs = {
        //     name: { type: 'string', required: true },
        //     email: { type: 'string', required: true, isEmail: true },
        //     password: { type: 'string', required: true, length: { min: 8 } },
        // }
        // let { error, errors } = await super.validate_1(req, allowedInputs)
        // if (error) return res.status(400).json(errors)

        try {
            const { name, password, email } = req.body
            let user = await User.findOne({ email }).lean()

            if (user) {
                const msg = 'Email is already registered!'
                return res.status(400).json([msg])
            }

            const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const newUser = new User({ name, email, password: hash, avatar })
            user = await newUser.save()
            const token = await Auth.generateJWT({ user: { _id: user._id } }, { expiresIn: 360000 })
            return res.json({ token })
        } catch (err) {
            // console.log(err.message);
            next(err);
        }
    }

}

module.exports = new UserController();