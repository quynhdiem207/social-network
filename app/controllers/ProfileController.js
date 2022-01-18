const request = require('request');
const moment = require('moment');

const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');
const BaseController = require('./BaseController')

class ProfileController extends BaseController {

    // @route   [GET] api/profiles
    // @desc    Get all profiles
    // @access  Public
    async index(req, res, next) {
        try {
            const profiles = await Profile.find().populate('user', ['name', 'avatar']).lean()
            return res.json(profiles)
        } catch (err) {
            next(err)
        }
    }

    // @route   [GET] api/me/profile
    // @desc    Get current user profile
    // @access  Private
    async show(req, res, next) {
        try {
            const profile = await Profile.findOne({ user: req.user._id })
                .populate('user', ['name', 'avatar']).lean()
            if (!profile) {
                return res.status(404).json({
                    msg: 'There is no profile for this user!'
                })
            }
            res.json(profile)
        } catch (err) {
            next(err)
        }
    }

    // @route   [GET] api/profiles/user/:user_id
    // @desc    Get profile by user ID
    // @access  Public
    async getByUserId(req, res, next) {
        try {
            const profile = await Profile.findOne({ user: req.params.user_id })
                .populate('user', ['name', 'avatar']).lean()
            if (!profile) {
                return res.status(404).json({
                    msg: 'There is no profile for this user!'
                })
            }
            return res.json(profile)
        } catch (err) {
            if (err.kind == "ObjectId") {
                return res.status(404).json({ msg: 'Profile not found!' })
            }
            next(err)
        }
    }

    // @route   [GET] api/profiles/github/:username
    // @desc    Get user repos from github
    // @access  Public
    async getGithubRepos(req, res, next) {
        const { GITHUB_CLIENT_ID, GITHUB_SECRET_KEY } = require('@config/github')
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_SECRET_KEY}`,
            method: "GET",
            headers: { 'user-agent': 'node.js' }
        }
        request(options, (err, response, body) => {
            if (err) return next(err)
            if (response.statusCode !== 200) {
                let error = true, errors = { msg: 'No Github profile found!' }
                return res.status(404).json({ error, errors })
            }
            return res.json(JSON.parse(body))
        })
    }

    // Get profile fields
    static profileFieldsInfo(data) {
        let profileFields = { ...data }

        if (data.skills) {
            profileFields.skills = data.skills.split(',')
        }

        // social
        profileFields.social = {}

        data.youtube && (profileFields.social.youtube = data.youtube)
        data.twitter && (profileFields.social.twitter = data.twitter)
        data.facebook && (profileFields.social.facebook = data.facebook)
        data.linkedin && (profileFields.social.linkedin = data.linkedin)
        data.instagram && (profileFields.social.instagram = data.instagram)

        return profileFields
    }

    // @route   [POST] api/me/profile
    // @desc    Create  or update user profile
    // @access  Private
    async store(req, res, next) {
        const allowedFields = {
            company: { type: 'string' },
            website: { type: 'string', isURL: true },
            location: { type: 'string' },
            status: { type: 'string', required: true },
            skills: { type: 'string', required: true },
            bio: { type: 'string' },
            githubusername: { type: 'string' },
            youtube: { type: "string", isURL: true },
            twitter: { type: "string", isURL: true },
            facebook: { type: "string", isURL: true },
            linkedin: { type: "string", isURL: true },
            instagram: { type: "string", isURL: true },
        }

        let { error, errors } = await super.validate_1(req, allowedFields)
        if (error) return res.status(400).json(errors)

        const profileFields = ProfileController.profileFieldsInfo(req.body);

        try {
            profileFields.user = req.user._id
            const profile = await Profile.findOne({ user: profileFields.user }).lean()
            if (profile) {
                // Update
                const newProfile = await Profile.findOneAndUpdate(
                    { user: profileFields.user },
                    { $set: profileFields },
                    { new: true }
                )
                return res.json(newProfile)
            } else {
                // Create
                const _profile = new Profile(profileFields)
                const newProfile = await _profile.save()
                return res.json(newProfile)
            }
        } catch (err) {
            next(err)
        }
    }

    // @route   [DELETE] api/me/profile
    // @desc    Delete user and profile
    // @access  Private
    async delete(req, res, next) {
        try {
            // Remove user posts
            await Post.deleteMany({ user: req.user._id })

            // Remove user comments & likes
            await Post.updateMany(
                {
                    $or: [
                        { "likes.user": req.user._id },
                        { "comments.user": req.user._id }
                    ]
                },
                {
                    $pull: {
                        likes: { user: req.user._id },
                        comments: { user: req.user._id }
                    }
                }
            )

            // Remove profile
            await Profile.findOneAndRemove({ user: req.user._id })

            // Remove user
            await User.findOneAndRemove({ _id: req.user._id })

            return res.json({ msg: 'User deleted!' })
        } catch (err) {
            next(err)
        }
    }

    // Check date from - to
    static checkDate(from, to) {
        if (from && moment(from) > moment() || to && moment(to) > moment()) {
            return 'Date greater than now';
        }
        if (from && to && moment(from) > moment(to)) {
            return 'Date from - to Invalid'
        }
        return '';
    }

    // @route   [PATCH] api/me/profile/experience
    // @desc    Add experience to profile
    // @access  Private
    async addExperience(req, res, next) {
        const conditions = {
            title: { type: "string", required: true },
            company: { type: "string", required: true },
            location: { type: "string" },
            from: { type: "date", required: true },
            to: { type: "date" },
            current: { type: "boolean" },
            description: { type: "string" }
        }
        let { error, errors } = await super.validate_1(req, conditions)
        if (error) return res.status(400).json(errors);

        const msgDate = ProfileController.checkDate(req.body.from, req.body.to);

        if (msgDate) {
            return res.status(400).json([msgDate]);
        }

        try {
            const profile = await Profile.findOne({ user: req.user._id })
            if (!profile) {
                const msg = 'There is no profile!'
                return res.status(404).json([msg])
            }
            profile.experience.unshift(req.body)
            await profile.save()
            return res.json(profile)
        } catch (err) {
            next(err)
        }
    }

    // @route   [PATCH] api/me/profile/education
    // @desc    Add education to profile
    // @access  Private
    async addEducation(req, res, next) {
        const conditions = {
            school: { type: "string", required: true },
            degree: { type: "string", required: true },
            fieldofstudy: { type: "string", required: true },
            from: { type: "date", required: true },
            to: { type: "date" },
            current: { type: "boolean" },
            description: { type: "string" }
        }
        let { error, errors } = await super.validate_1(req, conditions)
        if (error) return res.status(400).json(errors)

        const msgDate = ProfileController.checkDate(req.body.from, req.body.to);

        if (msgDate) {
            return res.status(400).json([msgDate]);
        }

        try {
            const profile = await Profile.findOne({ user: req.user._id })
            if (!profile) {
                const msg = 'There is no profile!'
                return res.status(404).json([msg])
            }
            profile.education.unshift(req.body)
            await profile.save()
            return res.json(profile)
        } catch (err) {
            next(err)
        }
    }

    // @route   [DELETE] api/me/profile/education/:edu_id
    // @desc    Delete education from profile
    // @access  Private
    async deleteEducation(req, res, next) {
        let error = false, errors = {}
        try {
            const profile = await Profile.findOne({ user: req.user._id })
            if (!profile) {
                error = true
                errors.msg = 'There is no profile!'
                return res.status(404).json({ error, errors })
            }
            const index = profile.education.map(item => String(item._id))
                .indexOf(req.params.edu_id)
            if (index > -1) {
                profile.education.splice(index, 1)
                await profile.save()
                return res.json(profile)
            } else {
                error = true
                errors.msg = "No find education matched"
                return res.status(400).json({ error, errors })
            }
        } catch (err) {
            next(err)
        }
    }

    // @route   [DELETE] api/me/profile/experience/:exp_id
    // @desc    Delete experience from profile
    // @access  Private
    async deleteExperience(req, res, next) {
        let error = false, errors = {}
        try {
            const profile = await Profile.findOne({ user: req.user._id })
            if (!profile) {
                error = true
                errors.msg = 'There is no profile!'
                return res.status(404).json({ error, errors })
            }
            const index = profile.experience.map(item => String(item._id))
                .indexOf(req.params.exp_id)
            if (index > -1) {
                profile.experience.splice(index, 1)
                await profile.save()
                return res.json(profile)
            } else {
                error = true
                errors.msg = "No find experience matched"
                return res.status(400).json({ error, errors })
            }
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ProfileController();