const Env = require('@libs/Env');

module.exports = {
    HOST: Env.get("HOST"),
    PORT: Env.get("PORT"),
    DEV_FRONTEND_PORT: Env.get("DEV_FRONTEND_PORT"),
    CORS_ORIGIN: Env.get("CORS_ORIGIN")
};
