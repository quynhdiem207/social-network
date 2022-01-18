const Env = require('@libs/Env')

module.exports = {
    GITHUB_CLIENT_ID: Env.get('GITHUB_CLIENT_ID'),
    GITHUB_SECRET_KEY: Env.get('GITHUB_SECRET_KEY')
}