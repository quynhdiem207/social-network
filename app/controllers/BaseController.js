const validateFields = require('@libs/Validator')
const validateFields_1 = require('@libs/Validator-1')

class BaseController {
    // Validate-1: express-validator
    async validate_1(req, allowInputs) {
        return await validateFields_1(req, allowInputs);
    }

    // Validate: validator
    validate(inputs, allowInputs, options) {
        options = options || { removeNotAllow: false };
        return validateFields(inputs, allowInputs, options.removeNotAllow);
    }
}

module.exports = BaseController