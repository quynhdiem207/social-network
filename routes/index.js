const api = require('./api')

module.exports = function (app) {
    app.use('/api', api)
}