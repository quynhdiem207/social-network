const env = require('dotenv').config().parsed;

module.exports = {
    get: function (name, defaultValue = null) {
        return env[name] || defaultValue
    },

    all: function () {
        return env
    }
}