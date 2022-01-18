const config = require('config');

const Env = require('@libs/Env')
const authConfig = config.get('auth')

module.exports = {
    SECRET_KEY: Env.get("SECRET_KEY"),
    JWT_EXPIRE_USER: Env.get("JWT_EXPIRE_USER", authConfig.JWT_EXPIRE_USER), //24h
    JWT_REFRESH_TIME: Env.get("JWT_EXPIRE_USER", authConfig.JWT_REFRESH_TIME), //24h
}