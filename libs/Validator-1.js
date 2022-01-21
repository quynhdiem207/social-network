const { body, validationResult } = require('express-validator');
const _ = require('lodash');
const entities = require('entities');

const isEmpty = (value) => {
    return (
        _.isUndefined(value) || _.isNull(value)
        || (_.isString(value) && _.trim(value) === '')
        || (_.isNumber(value) && _.isNaN(value))
        || (_.isObject(value) && _.isEmpty(value))
    )
}

const validateError = (errorType, data) => {
    let message = "unknown";
    switch (errorType) {
        case "Invalid Type":
            message = `Datatype of ${data.field} must be ${data.type}.`;
            break;
        case "required":
            message = `${data.field} is required. But not found.`
            break;
        case "isValid":
            message = `${data.field} is invalid.`
            break;
        case "length":
            message = data.field
            message += data.min ? ' should be more than ' + data.min : ''
            if (data.max) {
                message += data.min ? ", " : " "
                message += `must less than ${data.max}`
            }
            data.type == "number" ? message += "." : message += " characters."
    }
    return message;
}


/**
 * @param {object} allowInputs 
 * @returns 
 */

const validateFields = async (req, allowInputs) => {
    let fieldValidate = []

    for (let field in allowInputs) {
        let validator = body(field)
        const { type, length, required, ...conditions } = allowInputs[field];

        if (required) {
            validator = validator.not().isEmpty()
                .withMessage(validateError("required", { field }))
        } else {
            if (isEmpty(req.body[field])) {
                delete req.body[field] // _.unset(req.body, field)
                continue
            }
        }

        switch (type) {
            case "string":
                validator = validator.isString()
                    .withMessage(validateError("Invalid Type", { field, type }))
                    .trim()
                if (!_.isEmpty(length)) {
                    validator = validator.isLength(length)
                        .withMessage(validateError("length", { field, min: length.min, max: length.max }))
                }
                validator = validator.escape()
                break
            case "number":
                if (!_.isEmpty(length))
                    validator = validator.isFloat(length).withMessage(
                        validateError("Invalid Type", { field, type }) + ' ' +
                        validateError('length', { field, type, min: length.min, max: length.max })
                    )
                else
                    validator = validator.isFloat()
                        .withMessage(validateError("Invalid Type", { field, type }))
                validator = validator.toFloat()
                break
            case "boolean":
                validator = validator.isBoolean()
                    .withMessage(validateError("Invalid Type", { field, type }))
                    .toBoolean()
                break;
            case "date":
            case "moment":
                validator = validator.isDate()
                    .withMessage(validateError("Invalid Type", { field, type }))
                    .toDate()
                break
            case "array":
                validator = validator.isArray()
                    .withMessage(validateError("Invalid Type", { field, type }))
                    .toArray()
                break
        }

        for (let condition in conditions) {
            if (conditions[condition] == true) {
                validator = validator.custom(
                    (v) => entities.decodeHTML(req.body[field])
                ).withMessage(validateError("isValid", { field }))
            }
        }

        fieldValidate.push(validator)
    }

    let error = false, errors = {}
    const errorFormatter = ({ msg, param }) => {
        return msg;
    };

    // for (const iterator of fieldValidate) {
    //     await iterator.run(req)
    // }
    await Promise.all(fieldValidate.map(validation => validation.run(req)));

    let result = validationResult(req).formatWith(errorFormatter)
    if (!result.isEmpty()) {
        error = true
        errors = result.array()
    }

    return { error, errors }
}

module.exports = validateFields