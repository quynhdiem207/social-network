const Env = require('@libs/Env')

module.exports = {
    MAIL_HOST: Env.get('MAIL_HOST'),
    MAIL_PORT: Env.get('MAIL_PORT'),
    USER_EMAIL: Env.get('USER_EMAIL'),
    USER_PASSWORD: Env.get('USER_PASSWORD'),
    ADMIN_EMAIL: Env.get('ADMIN_EMAIL'),
}