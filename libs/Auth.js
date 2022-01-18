const jwt = require("jsonwebtoken");
const authConfig = require("@config/auth");

class Auth {
    static async generateJWT(data, options = {}) {
        let { key, ...otherOptions } = options
        key = key || authConfig.SECRET_KEY
        otherOptions.expiresIn = otherOptions.expiresIn || authConfig.JWT_EXPIRE_USER
        return await jwt.sign(data, key, otherOptions)
    }
    static async decodeJWT(token, options = {}) {
        let { key, ...otherOptions } = options
        key = key || authConfig.SECRET_KEY
        return await jwt.verify(token, key, otherOptions);
    }
}

module.exports = Auth
