const validator = require('validator')
const _ = require('lodash')

const dataType = {
    boolean: ["isBoolean", "toBoolean"],
    number: ["isFloat", "toFloat"],
    date: ["isDate", "toDate"],
    moment: ["isDate", "toDate"]
}

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
            message = `Datatype of ${data.path} is incorrect. Expected: ${data.allowedType} but got: ${data.realType}`;
            break;
        case "required":
            message = `${data.path} is required. But not found.`
            break;
        case "isValid":
            message = `${data.path} is invalid.`
            break;
        case "length":
            message = `${data.path} is invalid`
            message += data.min ? '. Should be more than ' + data.min : ''
            message += data.max ? ', must less than ' + data.max : ''
            data.type == "number" ? message += "." : message += " characters."
    }
    return message;
}

class FieldValidator {
    constructor(input, conditions, path, newInput) {
        this.input = input
        this.conditions = conditions
        this.path = path
        this.newInput = newInput
        this.error = false
        this.errors = {}
    }

    type() {
        const realType = typeof this.input
        const allowedType = this.conditions.type
        let isValidType = allowedType === realType

        if (!isValidType) {
            if (allowedType == "any") {
                isValidType = true
            } else if (allowedType == "string") {
                isValidType = true;
                _.set(this.newInput, this.path, String(this.input))
            } else if (_.has(dataType, allowedType)) {
                let newValue = String(this.input).trim()
                if (allowedType == "boolean") {
                    newValue = _.lowerCase(newValue)
                }
                isValidType = validator[dataType[allowedType][0]](newValue) ? !isValidType : isValidType
                if (isValidType) {
                    _.set(this.newInput, this.path, validator[dataType[allowedType][1]](newValue))
                }
            }
        }

        if (!isValidType) {
            this.error = true
            this.errors.type = validateError("Invalid Type", { path: this.path, allowedType, realType })
        }
    }

    isEmail() {
        let input = String(this.input)
        let result = validator.isEmail(input)
        if (result) {
            _.set(this.newInput, this.path, validator.normalizeEmail(input))
        }
        return result
    }

    length() {
        let result = undefined,
            length = this.conditions.length,
            input = this.input,
            type = this.conditions.type || typeof input
        if (type == "number") {
            result = validator.isFloat(input.toString(), length)
        } else if (type == "string") {
            result = validator.isLength(input, length)
        }
        if (!result) {
            this.error = true
            this.errors.length = validateError("length", { path: this.path, type, min: length.min, max: length.max })
        }
    }

    notSpecialChar() {
        if (!isEmpty(this.input)) {
            let str = this.input
            if (!_.isString(str)) str = String(str)
            // str = _.deburr(str.trim())
            str = str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            return validator.matches(str, /^[a-zA-Z0-9 ]+$/g)
        }
    }
}


/**
 * 
 * @param {*} inputs 
 * @param {field: {*}} allowInputs 
 * @returns 
 */

const validateFields = (input, allowInputs, removeNotAllow = true, path = "", newInput = null) => {
    let isRoot = false, result = { error: false, errors: {} }
    const isObject = typeof input === 'object'
    let empty = isEmpty(input)

    if (newInput == null) {
        isRoot = true
        if (!isObject) {
            path = "input"
            newInput = removeNotAllow ? {} : { input }
        } else {
            newInput = removeNotAllow ? {} : input
        }
    }

    if (allowInputs instanceof Array) {
        let isArr = Array.isArray(input)
        if (!isArr) {
            if (_.isString(input) && validator.isJSON(input)) {
                let newValue = JSON.parse(input)
                if (_.isArray(newValue)) {
                    isArr = true
                    input = newValue
                    _.set(newInput, path, newValue)
                }
            }
        }
        if (!isArr) {
            const realType = typeof input
            const errDetail = validateError("Invalid Type", { path, allowedType: "array", realType })
            result.error = true
            _.set(result.errors, 'type', errDetail)
        } else if (empty && allowInputs[0].required) {
            result.error = true
            _.set(result.errors, path, validateError("required", { path }))
        } else {
            const { required, ...conditions } = allowInputs[0]
            input.forEach((fieldValue, index) => {
                let fieldResult = validateFields(fieldValue, conditions, removeNotAllow, `${path}[${index}]`, newInput)
                if (fieldResult.error) {
                    result.error = true
                    _.set(result.errors, index, fieldResult.errors)
                }
            })
        }
    } else {

        if (!isObject || validator.isMongoId(String(input))) {
            let { required, ...conditions } = allowInputs

            if (empty) {
                if (required) {
                    result.error = true
                    _.assign(result.errors, { required: validateError("required", { path }) })
                }
                if (!result.error && !removeNotAllow) _.unset(newInput, path)
            } else {
                let fieldValidate = new FieldValidator(input, conditions, path, newInput)

                for (let condition in conditions) {
                    if (condition == 'type' || condition == 'length') {
                        fieldValidate[condition]()
                    }
                    else if (conditions[condition] === true) {
                        const hasFunc = typeof fieldValidate[condition] == "function"
                        const isValid = hasFunc ? fieldValidate[condition]() : validator[condition](String(input))
                        if (!isValid) {
                            fieldValidate.error = true
                            fieldValidate.errors[condition] = validateError("isValid", { path: fieldValidate.path })
                        }
                    }
                }

                if (fieldValidate.error) {
                    result.error = true
                    _.assign(result.errors, fieldValidate.errors)
                } else if (removeNotAllow) {
                    _.set(newInput, path, input)
                }
            }

        } else {
            for (let field in allowInputs) {
                const typeOfField = allowInputs[field];
                const fieldValue = !empty ? input[field] : undefined;
                let fieldPath = path ? `${path}.${field}` : field
                let fieldResult = validateFields(fieldValue, typeOfField, removeNotAllow, fieldPath, newInput)
                if (fieldResult.error) {
                    result.error = true
                    _.set(result.errors, field, fieldResult.errors)
                }
            }
        }
    }

    if (isRoot) {
        return {
            ...result,
            newInput: isObject ? newInput : newInput.input
        }
    }

    return result
}

module.exports = validateFields