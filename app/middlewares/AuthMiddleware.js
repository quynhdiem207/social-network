const to = require('await-to-js').default;

const Auth = require('@libs/Auth')

module.exports = async (req, res, next) => {
    const token = req.get('x-auth-token')
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization dinied!' })
    }
    let [err, decoded] = await to(Auth.decodeJWT(token))
    if (err) return res.status(401).json({ msg: 'Token is invalid!' })
    req.user = decoded.user
    next()
}