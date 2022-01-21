const to = require('await-to-js').default;

const Auth = require('@libs/Auth')

module.exports = async (req, res, next) => {
    const token = req.get('x-auth-token')
    if (!token) {
        const msg = 'No token, authorization dinied!'
        return res.status(401).json([msg])
    }
    let [err, decoded] = await to(Auth.decodeJWT(token))
    if (err) {
        const msg = 'Token is invalid!'
        return res.status(401).json([msg])
    }
    req.user = decoded.user
    next()
}