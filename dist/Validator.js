import { isFunction } from 'lodash';
import { Options } from './typings';
import ValidatorResult from './ValidatorResult';
export default class Validator {
    constructor(options = {}) {
        this.options = { ...Options.defaults, ...options };
    }
    errors = [];
    options;
    coerce(raw, type, partial) {
        const result = new ValidatorResult(this);
        return type.coerce(raw, result, partial);
    }
    async validate(data, type, validateExtra) {
        const result = new ValidatorResult(this);
        if (type.validate) {
            type.validate(data, result);
        }
        if (validateExtra != null) {
            await validateExtra(result);
        }
        return result;
    }
    validateType(value, type, result) {
        result ??= new ValidatorResult(this);
        if (type == null) {
            if (!this.options.ignoreUnknown) {
                result.addError('unknown', `Unknown attribute: ${result.attribute}`);
            }
            return result;
        }
        if (value == null && type.options.required !== false && type.options.default == null) {
            result.addError('required', `This value is required`);
        }
        if (value != null && type.validate != null) {
            type.validate(value, result);
        }
        // Run any custom validator.
        if (type.options != null && value != null && isFunction(type.options.validate)) {
            type.options.validate(value, result);
        }
        return result;
    }
}
